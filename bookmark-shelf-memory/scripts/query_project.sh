#!/bin/bash
# 查询项目状态
# 用法: ./query_project.sh "项目名称"

PROJECT_NAME="$1"
SUMMARY_FILE="memory/project-index/${PROJECT_NAME}-summary.md"

if [ -z "$PROJECT_NAME" ]; then
    echo "用法: ./query_project.sh \"项目名称\""
    echo ""
    echo "可用项目:"
    ls memory/project-index/*-summary.md 2>/dev/null | xargs -n1 basename | sed 's/-summary.md//' | sed 's/^/  - /'
    exit 1
fi

if [ ! -f "$SUMMARY_FILE" ]; then
    echo "未找到项目 '${PROJECT_NAME}'"
    echo "可用项目:"
    ls memory/project-index/*-summary.md 2>/dev/null | xargs -n1 basename | sed 's/-summary.md//' | sed 's/^/  - /'
    exit 1
fi

echo "=== ${PROJECT_NAME} 项目状态 ==="
echo ""

# 提取关键信息
echo "【基本信息】"
grep -E "^\*\*项目类型\*\*|^\*\*当前进度\*\*|^\*\*更新时间\*\*" "$SUMMARY_FILE"
echo ""

echo "【章节列表】"
ls -1 "memory/articles/${PROJECT_NAME}/" 2>/dev/null | sed 's/^/  /' || echo "  （暂无章节）"
echo ""

echo "【待填伏笔】"
grep -A 20 "^## 待填伏笔" "$SUMMARY_FILE" | grep "^\- \[ \]" | sed 's/^/  /'
