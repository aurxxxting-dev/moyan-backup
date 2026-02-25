#!/bin/bash

# 墨言工作区自动备份脚本
# 每天执行一次，自动提交并推送到 GitHub
# 包含：人格文件、记忆、项目、技能、配置

WORKSPACE="/root/.openclaw/workspace"
LOG_FILE="/tmp/moyan-backup.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

cd "$WORKSPACE" || exit 1

# 确保所有重要文件都被跟踪
git add -A

# 检查是否有变更
if git diff --quiet && git diff --cached --quiet; then
    echo "[$DATE] 没有变更，跳过备份" >> "$LOG_FILE"
    exit 0
fi

# 提交（包含所有变更）
git commit -m "auto backup: $DATE - 墨言全量备份"

# 推送到 GitHub
if git push origin main; then
    echo "[$DATE] 备份成功 - 包含人格/记忆/项目/技能" >> "$LOG_FILE"
else
    echo "[$DATE] 备份失败" >> "$LOG_FILE"
fi
