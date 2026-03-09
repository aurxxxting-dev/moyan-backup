# 从旧记忆系统迁移指南

## 场景

你已经有存量文章散落在 memory/ 目录，需要迁移到新的"书签+书架"机制。

## 迁移步骤

### 1. 识别项目

列出所有需要迁移的项目：

```bash
ls memory/project-*.md | grep -v "大纲\|人物卡\|世界观"
```

### 2. 为每个项目创建目录结构

```bash
mkdir -p memory/articles/项目名称
```

### 3. 创建项目快照

从现有材料中提取关键信息：
- 项目类型、进度
- 主要人物和当前状态
- 已完成的章节
- 待填的伏笔

写入 `memory/project-index/项目名称-summary.md`

### 4. 迁移章节正文（可选）

将存量章节移动到 articles/ 目录：

```bash
# 示例
mv "memory/project-富可敌国的我-第十四章.md" \
   "memory/articles/富可敌国的我/2026-03-08-第十四章.md"
```

如果不知道确切日期，可用大致日期或留空。

### 5. 在主记忆中添加书签

在当天的 daily note 中记录：

```markdown
## [项目] 《富可敌国的我》迁移完成

- 已创建项目快照
- 已迁移 X 章正文
- 当前进度：第X章待续写
```

## 快速迁移脚本示例

```bash
#!/bin/bash
# migrate_project.sh

PROJECT="富可敌国的我"

# 1. 创建目录
mkdir -p "memory/articles/${PROJECT}"

# 2. 迁移章节（根据实际文件名调整）
for file in memory/project-${PROJECT}-第*.md; do
    if [ -f "$file" ]; then
        # 提取章节名
        chapter=$(echo "$file" | grep -oE "第[一二三四五六七八九十]+章")
        date="2026-02-25"  # 根据实际日期调整
        mv "$file" "memory/articles/${PROJECT}/${date}-${chapter}.md"
        echo "已迁移: ${chapter}"
    fi
done

# 3. 创建快照（手动编辑）
touch "memory/project-index/${PROJECT}-summary.md"
echo "请手动编辑快照文件: memory/project-index/${PROJECT}-summary.md"
```

## 迁移后验证

1. 检查目录结构：
   ```bash
   tree memory/articles/项目名称/
   ```

2. 检查快照文件是否包含关键信息

3. 测试续写流程：
   - 读取 summary
   - 读取最近章节
   - 确认设定连贯

## 不迁移的替代方案

如果存量文章太多，可以：
- 只为活跃项目（正在写的）创建快照
- 存量文章留在原地，以后续写时按需读取
- 新写的文章一律使用新机制
