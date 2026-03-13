#!/usr/bin/env node
/**
 * PCEC 周度学习系统 - 写作反馈分析
 * 
 * 功能：
 * 1. 读取本周 writing-feedback/*.md 文件
 * 2. 调用 DashScope API 分析提炼原则
 * 3. 输出学习总结到 capability-tree.md
 * 
 * 运行：node scripts/pcec-weekly-learn.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG = {
  // DashScope 配置（从环境变量或硬编码）
  dashscopeApiKey: process.env.DASHSCOPE_API_KEY || 'sk-4558e14903924cdbaccae57059f969ed',
  dashscopeModel: 'qwen-max',
  
  // 路径配置
  workspacePath: '/root/.openclaw/workspace',
  feedbackDir: path.join('/root/.openclaw/workspace', 'memory', 'writing-feedback'),
  capabilityPath: path.join('/root/.openclaw/workspace', 'memory', 'capability', 'capability-tree.md'),
  
  // 分析配置
  maxFeedbackFiles: 10,  // 最多处理10个文件
  minEntriesPerFile: 1   // 每个文件至少1条反馈
};

// 颜色输出
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  section: (msg) => console.log(`\n📋 ${msg}\n${'='.repeat(50)}`)
};

/**
 * 调用 DashScope API
 */
async function callDashScope(messages) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: CONFIG.dashscopeModel,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.3  // 低温度，更稳定的输出
    });

    const options = {
      hostname: 'dashscope.aliyuncs.com',
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.dashscopeApiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.error) {
            reject(new Error(`API Error: ${result.error.message}`));
          } else if (result.choices && result.choices[0]) {
            resolve(result.choices[0].message.content);
          } else {
            reject(new Error('Unexpected API response format'));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

/**
 * 读取本周反馈文件
 */
function readWeeklyFeedback() {
  if (!fs.existsSync(CONFIG.feedbackDir)) {
    log.error(`反馈目录不存在: ${CONFIG.feedbackDir}`);
    return [];
  }

  const files = fs.readdirSync(CONFIG.feedbackDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .slice(-CONFIG.maxFeedbackFiles);

  const feedbacks = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(CONFIG.feedbackDir, file), 'utf8');
    // 提取有实质内容的反馈条目（至少包含"提炼原则"部分）
    if (content.includes('提炼原则') && content.length > 500) {
      feedbacks.push({
        filename: file,
        content: content
      });
    }
  }

  return feedbacks;
}

/**
 * 分析反馈内容
 */
async function analyzeFeedback(feedbacks) {
  if (feedbacks.length === 0) {
    return null;
  }

  const combinedContent = feedbacks.map(f => 
    `【文件: ${f.filename}】\n${f.content}\n---`
  ).join('\n\n');

  const messages = [
    {
      role: "system",
      content: `你是写作能力分析助手。请分析以下写作反馈记录，提炼出可复用的写作原则。

分析要求：
1. 只提取"提炼原则"部分的内容
2. 按类别整理：文风原则、人物塑造、结构方法、协作边界
3. 去除重复，合并相似原则
4. 输出简洁的 bullet points，每条原则控制在50字以内
5. 标注每条原则的"适用场景"

输出格式：
## 本周学习总结

### 文风原则
- [原则] - 适用：XXX

### 人物塑造  
- [原则] - 适用：XXX

### 结构方法
- [原则] - 适用：XXX

### 协作边界
- [原则] - 适用：XXX

### 待验证假设
- [观察到的模式，需更多反馈验证]`
    },
    {
      role: "user",
      content: `请分析以下 ${feedbacks.length} 个反馈文件：\n\n${combinedContent}`
    }
  ];

  return await callDashScope(messages);
}

/**
 * 更新能力树文件
 */
function updateCapabilityTree(analysis) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  // 读取现有内容
  let existingContent = '';
  if (fs.existsSync(CONFIG.capabilityPath)) {
    existingContent = fs.readFileSync(CONFIG.capabilityPath, 'utf8');
  }

  // 构建更新内容
  const weeklyUpdate = `\n\n---\n\n## 周度更新 (${timestamp})\n\n${analysis}\n`;

  // 检查是否已存在本周更新
  if (existingContent.includes(`周度更新 (${timestamp})`)) {
    log.info('本周已存在更新，跳过');
    return false;
  }

  // 追加到文件末尾
  fs.writeFileSync(CONFIG.capabilityPath, existingContent + weeklyUpdate);
  return true;
}

/**
 * 主函数
 */
async function main() {
  log.section('PCEC 周度学习系统启动');
  log.info(`模型: ${CONFIG.dashscopeModel}`);
  log.info(`反馈目录: ${CONFIG.feedbackDir}`);

  // 读取反馈
  log.info('读取反馈文件...');
  const feedbacks = readWeeklyFeedback();
  
  if (feedbacks.length === 0) {
    log.info('本周暂无有效反馈，跳过分析');
    console.log('\n💡 提示：使用 memory/writing-feedback/_template.md 模板记录反馈');
    return;
  }
  
  log.success(`找到 ${feedbacks.length} 个有效反馈文件`);

  // 分析反馈
  log.info('调用 DashScope 分析...');
  try {
    const analysis = await analyzeFeedback(feedbacks);
    
    if (!analysis) {
      log.error('分析结果为空');
      return;
    }

    log.success('分析完成');
    console.log('\n📊 分析结果预览:\n');
    console.log(analysis.slice(0, 500) + '...\n');

    // 更新能力树
    log.info('更新能力树文件...');
    const updated = updateCapabilityTree(analysis);
    
    if (updated) {
      log.success(`已更新: ${CONFIG.capabilityPath}`);
    }

    // 统计信息
    log.section('执行完成');
    console.log(`处理文件: ${feedbacks.length}`);
    console.log(`输出路径: ${CONFIG.capabilityPath}`);
    
  } catch (err) {
    log.error(`分析失败: ${err.message}`);
    process.exit(1);
  }
}

// 执行
main().catch(console.error);
