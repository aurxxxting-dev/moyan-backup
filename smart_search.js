#!/usr/bin/env node
/**
 * Smart Search - 分层检索系统 (V2)
 * 使用 DashScope OpenAI 兼容格式
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置
const DASHSCOPE_API_KEY = 'sk-b0dfcc9dbce34c159dd78d2a5fc1b3de';
const EMBEDDING_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings';
const MEMORY_DIR = path.join(__dirname, 'memory');
const MEMORY_FILE = path.join(__dirname, 'MEMORY.md');
const CACHE_FILE = path.join(__dirname, '.embedding_cache.json');

// L1 关键词触发器
const L1_KEYWORDS = {
  high: ['之前', '昨天', '怎么样了', '记得', '上次', '以前', '说过', '提到', '如何', '进展'],
  medium: ['项目', '方案', '决策', 'aur', '墨言', '大纲', '人物', '设定', '写作', '小说']
};

/**
 * L1: 快速关键词匹配
 */
function shouldTriggerL2(query) {
  const q = query.toLowerCase();
  for (const kw of L1_KEYWORDS.high) {
    if (q.includes(kw)) return { trigger: true, priority: 'high', keyword: kw };
  }
  for (const kw of L1_KEYWORDS.medium) {
    if (q.includes(kw)) return { trigger: true, priority: 'medium', keyword: kw };
  }
  return { trigger: false };
}

/**
 * 调用 DashScope Embedding API (OpenAI兼容格式)
 */
async function getEmbedding(text) {
  const data = JSON.stringify({
    model: 'text-embedding-v3',
    input: text,
    encoding_format: 'float'
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'dashscope.aliyuncs.com',
      path: '/compatible-mode/v1/embeddings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          return;
        }
        try {
          const json = JSON.parse(responseData);
          if (json.data?.[0]?.embedding) {
            resolve(json.data[0].embedding);
          } else {
            reject(new Error(`Unexpected response: ${responseData}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

/**
 * 计算余弦相似度
 */
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 加载缓存的 embeddings
 */
function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    } catch { }
  }
  return {};
}

/**
 * 保存缓存
 */
function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * 将文档分块
 */
function chunkDocument(content, source, maxChunkSize = 800) {
  const chunks = [];
  const lines = content.split('\n');
  let currentChunk = '';
  let lineNum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (currentChunk.length + line.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.trim(),
        source: source,
        startLine: lineNum + 1
      });
      lineNum = i;
      currentChunk = '';
    }
    currentChunk += line + '\n';
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      source: source,
      startLine: lineNum + 1
    });
  }

  return chunks;
}

/**
 * 加载所有文档并分块
 */
function loadChunks() {
  const chunks = [];

  // MEMORY.md
  if (fs.existsSync(MEMORY_FILE)) {
    const stats = fs.statSync(MEMORY_FILE);
    const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
    chunkDocument(content, 'MEMORY.md').forEach(c => {
      c.mtime = stats.mtimeMs;
      chunks.push(c);
    });
  }

  // memory/ 目录
  if (fs.existsSync(MEMORY_DIR)) {
    const files = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filepath = path.join(MEMORY_DIR, file);
      const stats = fs.statSync(filepath);
      const content = fs.readFileSync(filepath, 'utf-8');
      chunkDocument(content, `memory/${file}`).forEach(c => {
        c.mtime = stats.mtimeMs;
        chunks.push(c);
      });
    }
  }

  return chunks;
}

/**
 * 为所有 chunks 获取 embeddings（带缓存）
 */
async function indexDocuments(chunks, cache) {
  const now = Date.now();
  let indexed = 0;
  let fromCache = 0;

  for (const chunk of chunks) {
    const key = `${chunk.source}:${chunk.startLine}:${Buffer.from(chunk.content).toString('base64').substring(0, 16)}`;

    if (cache[key] && cache[key].content === chunk.content) {
      chunk.embedding = cache[key].embedding;
      fromCache++;
      continue;
    }

    try {
      chunk.embedding = await getEmbedding(chunk.content);
      cache[key] = { content: chunk.content, embedding: chunk.embedding, time: now };
      indexed++;

      // 每10个保存一次缓存
      if (indexed % 10 === 0) {
        saveCache(cache);
        console.error(`  Indexed ${indexed} chunks (${fromCache} from cache)...`);
      }

      // 避免 rate limit
      await new Promise(r => setTimeout(r, 100));
    } catch (e) {
      console.error(`  Error indexing ${chunk.source}:${e.message}`);
    }
  }

  saveCache(cache);
  console.error(`  Done: ${indexed} indexed, ${fromCache} from cache`);
  return chunks.filter(c => c.embedding);
}

/**
 * 计算时效性权重
 */
function getTimeWeight(mtime) {
  if (!mtime) return 1.0;
  const age = Date.now() - mtime;
  const days = age / (24 * 60 * 60 * 1000);
  if (days < 7) return 1.5;
  if (days < 30) return 1.2;
  return 1.0;
}

/**
 * 主搜索流程
 */
async function smartSearch(query, options = {}) {
  const startTime = Date.now();

  // Step 1: L1 检查
  const l1Result = shouldTriggerL2(query);
  if (!l1Result.trigger && !options.force) {
    return {
      triggered: false,
      reason: 'L1 keywords not matched',
      l1Result
    };
  }

  console.error(`[L1] Matched "${l1Result.keyword}" (${l1Result.priority})`);

  // Step 2: 加载文档
  const chunks = loadChunks();
  console.error(`[L2] Loaded ${chunks.length} chunks from ${[...new Set(chunks.map(c => c.source))].length} files`);

  // Step 3: 索引（带缓存）
  const cache = loadCache();
  const indexedChunks = await indexDocuments(chunks, cache);

  // Step 4: 获取查询向量
  console.error('[L2] Getting query embedding...');
  const queryEmbedding = await getEmbedding(query);

  // Step 5: 相似度计算
  const results = indexedChunks.map(chunk => {
    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
    const timeWeight = getTimeWeight(chunk.mtime);
    return {
      ...chunk,
      similarity,
      weightedScore: similarity * timeWeight
    };
  });

  // Step 6: 排序并返回
  results.sort((a, b) => b.weightedScore - a.weightedScore);
  const topResults = results.slice(0, options.limit || 5);

  const duration = Date.now() - startTime;

  return {
    triggered: true,
    l1Result,
    query,
    duration,
    totalChunks: indexedChunks.length,
    results: topResults.map(r => ({
      source: r.source,
      startLine: r.startLine,
      similarity: Math.round(r.similarity * 1000) / 1000,
      weightedScore: Math.round(r.weightedScore * 1000) / 1000,
      excerpt: r.content.substring(0, 300).replace(/\n/g, ' ')
    }))
  };
}

// CLI 入口
if (require.main === module) {
  const query = process.argv[2];

  if (!query) {
    console.log('Usage: node smart_search.js "your query"');
    console.log('       node smart_search.js --index   # 强制重建索引');
    process.exit(1);
  }

  if (query === '--index') {
    console.log('Force reindexing...');
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
    const chunks = loadChunks();
    indexDocuments(chunks, {}).then(() => {
      console.log('Indexing complete');
    });
    return;
  }

  smartSearch(query, { limit: 5 })
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}

module.exports = { smartSearch, shouldTriggerL2, getEmbedding, indexDocuments };
