#!/bin/bash
# 墨言备份脚本 - Linux/macOS

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="$HOME/XiaozhuaBackup"
SOURCE_DIR="$HOME/.openclaw/workspace"

echo "Starting backup - $TIMESTAMP"

# 创建目录结构
mkdir -p "$BACKUP_DIR/CoreIdentity"
mkdir -p "$BACKUP_DIR/System"
mkdir -p "$BACKUP_DIR/DailyMemory"
mkdir -p "$BACKUP_DIR/skills"

# 备份核心身份文件
echo "Backing up core identity files..."
cp "$SOURCE_DIR/SOUL.md" "$BACKUP_DIR/CoreIdentity/" 2>/dev/null || echo "SOUL.md not found"
cp "$SOURCE_DIR/USER.md" "$BACKUP_DIR/CoreIdentity/" 2>/dev/null || echo "USER.md not found"
cp "$SOURCE_DIR/MEMORY.md" "$BACKUP_DIR/CoreIdentity/" 2>/dev/null || echo "MEMORY.md not found"
cp "$SOURCE_DIR/IDENTITY.md" "$BACKUP_DIR/CoreIdentity/" 2>/dev/null || echo "IDENTITY.md not found"

# 备份系统文件
echo "Backing up system files..."
cp "$SOURCE_DIR/AGENTS.md" "$BACKUP_DIR/System/" 2>/dev/null || echo "AGENTS.md not found"
cp "$SOURCE_DIR/TOOLS.md" "$BACKUP_DIR/System/" 2>/dev/null || echo "TOOLS.md not found"
cp "$SOURCE_DIR/HEARTBEAT.md" "$BACKUP_DIR/System/" 2>/dev/null || echo "HEARTBEAT.md not found"

# 备份每日记忆
echo "Backing up daily memory..."
cp "$SOURCE_DIR/memory/"*.md "$BACKUP_DIR/DailyMemory/" 2>/dev/null || echo "No daily memory files"

# 备份技能
echo "Backing up skills..."
cp -r "$SOURCE_DIR/skills/"* "$BACKUP_DIR/skills/" 2>/dev/null || echo "No skills to backup"

echo "Backup complete! Location: $BACKUP_DIR"
echo "Backup timestamp: $TIMESTAMP"

# 可选：同步到云盘（需要用户配置）
# 例如阿里云盘、百度网盘等
