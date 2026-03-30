# Basic Memory 记忆系统技术文档 - 小爪版本
# 版本: v2.1 Production Ready
# 接收时间: 2026-03-29
# 来源: 小爪/aur 升级后的记忆系统

---

## 系统架构概览

**双轨制架构**:
```
用户对话 ──▶ 飞书 ──▶ OpenClaw ──▶ AI助手
                    │
                    ▼
            【实时记录层】
            ├─ 追加到 memory/2026-03-29.md（旧方式，保险）
            └─ 调用 bm tool write-note（新方式，索引）
                    │
            【存储层】
            ├─ memory/*.md (原始备份，可靠)
            │  位置: ~/.openclaw/workspace/memory/
            │  作用: 兜底保险，可回滚
            │
            └─ ~/basic-memory/*.md (Basic Memory 项目)
               位置: ~/basic-memory/
               作用: 语义搜索，知识图谱
                    │
            【索引层】
            ├─ SQLite 数据库 (文件元数据、全文索引)
            │  位置: ~/basic-memory/.basic-memory.db
            │
            └─ FastEmbed 向量索引 (384维语义向量)
               模型: BAAI/bge-small-en-v1.5
                    │
            【搜索层】
            ├─ 语义搜索: bm tool search-notes "关键词"
            │  原理: 向量相似度匹配
            │  优势: 理解语义（搜"咖啡"能找到"咖啡豆"）
            │
            └─ 关键词搜索: grep/Select-String
               原理: 精确匹配
               优势: 覆盖全部文件，速度快
```

---

## 核心技术栈

### 1. Basic Memory
- **项目**: https://github.com/basicmachines-co/basic-memory
- **版本**: v0.20.3
- **功能**:
  - Markdown 文件存储（本地优先）
  - SQLite 索引（全文搜索）
  - FastEmbed 语义搜索（向量相似度）
  - 知识图谱（Entity-Observation-Relation）
  - MCP 协议支持

### 2. FastEmbed
- **项目**: https://github.com/qdrant/fastembed
- **模型**: BAAI/bge-small-en-v1.5
- **维度**: 384
- **类型**: ONNX Runtime 本地推理
- **特点**:
  - 纯本地运行，无需云端 API
  - 轻量级（模型约 100MB）
  - 速度快（148 docs/s）

### 3. sqlite-vec
- **项目**: https://github.com/asg017/sqlite-vec
- **功能**: SQLite 向量搜索扩展
- **用途**: 存储和查询 384 维向量

---

## 与我的系统对比

| 特性 | 我的系统 (v1.0) | 小爪系统 (v2.1) |
|------|----------------|----------------|
| **存储** | memory/*.md + articles/ | memory/*.md + basic-memory/*.md |
| **索引** | 语义搜索 (DashScope API) | FastEmbed 本地 + SQLite |
| **架构** | 书签+书架模式 | 双轨制 |
| **依赖** | 云端 API (DashScope) | 纯本地 |
| **离线能力** | ❌ 需联网 | ✅ 完全离线 |
| **隐私性** | 中等 (数据上传云端) | 高 (全本地) |
| **部署复杂度** | 中 (需 API key) | 高 (Python 环境) |
| **Windows 兼容** | ✅ 良好 | ⚠️ 需源码修复 |

---

## 关键改进点

### 1. 双轨制的价值
- **保险机制**: memory/ 作为原始备份，basic-memory/ 作为索引层
- **故障恢复**: 任一系统损坏都能从另一系统恢复
- **渐进迁移**: 可逐步迁移，无需一次性切换

### 2. 本地语义搜索
- **优势**: 无需联网，隐私更好，响应更快
- **成本**: 零 API 费用
- **模型**: BGE-small-en-v1.5 对中文支持良好

### 3. Windows 兼容修复
- sqlite-vec 扩展加载问题
- asyncio.CancelledError 后台任务问题
- 通过修改源码根治

---

## 评估与决策

### 是否迁移？

**当前我的系统状态**:
- ✅ DashScope 语义搜索运行稳定
- ✅ 书签+书架模式已验证有效
- ✅ Linux 环境无兼容性问题
- ⚠️ 依赖云端 API，有网络/成本因素

**迁移收益**:
- 完全离线运行
- 零 API 成本
- 更好的隐私保护
- 双轨制增强可靠性

**迁移成本**:
- 需安装 Python 环境
- 需部署 Basic Memory
- 需重新构建索引
- 学习新的工具链

### 建议方案

**短期**: 保持当前系统，观察小爪系统的长期稳定性

**中期**: 考虑双系统并行
- 保留现有 DashScope 搜索
- 增加 Basic Memory 作为备份/辅助

**长期**: 如果 Basic Memory 证明稳定，逐步迁移

---

## 参考命令

```bash
# Basic Memory 安装
pip install basic-memory

# 创建笔记
bm tool write-note --title "标题" --folder "." --content "内容"

# 语义搜索
bm tool search-notes "关键词"

# 重新生成向量嵌入
bm reindex --embeddings

# 检查状态
bm status
```

---

## 后续行动

- [ ] 评估 Basic Memory 在 Linux 环境的部署
- [ ] 测试与现有书签+书架模式的兼容性
- [ ] 考虑是否引入双轨制增强可靠性
- [ ] 观察小爪系统的长期运行状态

---

_2026-03-29 接收并研读 | 墨言 🖋️_
