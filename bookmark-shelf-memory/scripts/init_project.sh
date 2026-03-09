#!/bin/bash
# 初始化新写作项目
# 用法: ./init_project.sh "项目名称"

PROJECT_NAME="$1"

if [ -z "$PROJECT_NAME" ]; then
    echo "用法: ./init_project.sh \"项目名称\""
    exit 1
fi

# 创建目录
mkdir -p "memory/articles/${PROJECT_NAME}"

# 创建项目快照模板
cat > "memory/project-index/${PROJECT_NAME}-summary.md" << EOF
# ${PROJECT_NAME} - 项目快照

**项目类型**: 待填写  
**当前进度**: 待开始  
**更新时间**: $(date +%Y-%m-%d)

---

## 核心设定

**主角**: 姓名
- 身份：
- 性格：
- 当前状态：

**关键人物**:
- 人物A：
- 人物B：

**世界观**: 

---

## 剧情节点

| 章节 | 核心事件 | 状态 |
|------|----------|------|
| 第1章 | 待开始 | ⏳ |

---

## 待填伏笔

- [ ] 

---

## 写作要求

> 

---

## 文件位置

- 大纲: \`memory/project-${PROJECT_NAME}-大纲.md\`
- 人物卡: \`memory/project-${PROJECT_NAME}-人物卡.md\`
- 各章节正文: \`memory/articles/${PROJECT_NAME}/\`
EOF

echo "项目 '${PROJECT_NAME}' 初始化完成"
echo "- 目录: memory/articles/${PROJECT_NAME}/"
echo "- 快照: memory/project-index/${PROJECT_NAME}-summary.md"
