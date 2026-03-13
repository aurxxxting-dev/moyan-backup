# PCEC 周度学习技能

> **P**eriodic **C**urated **E**xtraction **C**ycle — 周期性精选提取循环

从写作反馈中持续学习，提炼可复用的写作原则。

---

## 快速开始

### 1. 记录反馈
使用模板记录每次写作协作的反馈：

```bash
cp memory/writing-feedback/_template.md memory/writing-feedback/2026-03-11-大唐群像-ch1.md
```

填写：
- 原文片段
- 修改建议
- **提炼原则**（最关键）

### 2. 手动触发学习
```bash
cd /root/.openclaw/workspace
node scripts/pcec-weekly-learn.js
```

### 3. 查看学习成果
打开 `memory/capability/capability-tree.md` 查看更新。

---

## 配置

### 环境变量
```bash
# 可选：使用自己的 DashScope API Key
export DASHSCOPE_API_KEY=your-key-here
```

### 修改脚本配置
编辑 `scripts/pcec-weekly-learn.js`：

```javascript
const CONFIG = {
  dashscopeModel: 'qwen-max',        // 分析模型
  maxFeedbackFiles: 10,               // 最大处理文件数
  // ...
};
```

---

## 工作原理

```
每周日凌晨 3:00
    ↓
读取 writing-feedback/*.md（本周）
    ↓
调用 DashScope (qwen-max) 分析
    ↓
提取原则 → 按类别整理
    ↓
追加到 capability-tree.md
```

---

## 输出示例

### capability-tree.md 更新内容：

```markdown
## 周度更新 (2026-03-09)

### 文风原则
- [对话要短，信息密度高] - 适用：快节奏场景
- [避免形容词堆砌，用行动体现] - 适用：人物刻画

### 人物塑造
- [配角也要有明确动机] - 适用：群像写作

### 协作边界
- [节奏把控我主动，重大转折 aur 决定] - 适用：结构决策
```

---

## 集成到其他项目

### 作为 OpenClaw Skill 安装
```bash
# 复制到技能目录
cp -r skills/pcec-weekly-learn ~/.openclaw/skills/

# 创建 cron 任务
openclaw cron add \
  --name "my-project-weekly-learn" \
  --schedule "0 3 * * 0" \
  --script "~/.openclaw/skills/pcec-weekly-learn/scripts/pcec-weekly-learn.js"
```

### 独立使用（非 OpenClaw）
```javascript
const { analyzeFeedback } = require('./pcec-weekly-learn');

const feedbacks = [
  { filename: 'feedback1.md', content: '...' }
];

const result = await analyzeFeedback(feedbacks);
```

---

## 文件结构

```
workspace/
├── memory/
│   ├── writing-feedback/          # 反馈记录
│   │   ├── _template.md           # 记录模板
│   │   └── 2026-03-11-*.md        # 每周反馈文件
│   └── capability/
│       └── capability-tree.md     # 学习成果
├── scripts/
│   └── pcec-weekly-learn.js       # 主脚本
└── skills/pcec-weekly-learn/      # 技能封装
    ├── SKILL.md                   # 本文件
    └── scripts/
        └── pcec-weekly-learn.js   # 可复用脚本
```

---

## 进阶用法

### 手动分析特定文件
```bash
# 分析单个文件
node scripts/pcec-weekly-learn.js --file memory/writing-feedback/2026-03-11-ch1.md

# 分析最近 N 天
node scripts/pcec-weekly-learn.js --days 7
```

### 导出学习成果
```bash
# 导出为 JSON
node scripts/pcec-weekly-learn.js --format json --output learning.json
```

---

## 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-03-11 | 初始版本，基础分析功能 |

---

*由 墨言 创建 | 配合 aur 写作项目使用*
