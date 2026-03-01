# OpenClaw Windows 环境自排查指南

> 给小爪的诊断脚本 - 复制到 PowerShell 逐行执行

---

## 第一步：环境基础检查

```powershell
# 1. 检查系统编码
chcp
# 预期输出：65001 (UTF-8)
# 如果是 936 (GBK)，需要改注册表永久设置 UTF-8

# 2. 检查 Node 版本
node --version
# 需要 v20+，最好用 v22 LTS

# 3. 检查 OpenClaw 版本
openclaw --version

# 4. 检查安装路径（不能有中文/空格）
Get-Command openclaw | Select-Object Source
```

---

## 第二步：网关深度诊断

```powershell
# 1. 检查网关状态（详细模式）
openclaw gateway status --verbose

# 2. 检查任务计划程序冲突
schtasks /query /tn "OpenClaw Gateway" 2>$null
# 如果存在且状态异常，删除重建：
# schtasks /delete /tn "OpenClaw Gateway" /f

# 3. 检查端口占用
netstat -ano | findstr "18789"
# 如果有占用，杀掉进程或改端口

# 4. 检查服务配置
Get-Content ~/.openclaw/openclaw.json | ConvertFrom-Json | 
    Select-Object -ExpandProperty gateway
```

---

## 第三步：编码问题永久修复

```powershell
# 以管理员运行 PowerShell，设置系统默认 UTF-8
[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 永久设置（需要重启）
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Nls\CodePage" `
    -Name "ACP" -Value "65001" -PropertyType String -Force

# 或者在当前会话修复
$env:PYTHONIOENCODING = "utf-8"
$OutputEncoding = [System.Text.Encoding]::UTF8
```

---

## 第四步：网关修复流程

```powershell
# 标准修复流程
openclaw gateway stop
Start-Sleep 2
openclaw gateway start --foreground
# 观察输出，确认无报错后再 Ctrl+C 停止

# 如果 foreground 正常，再启动服务
openclaw gateway start

# 如果还有问题，重置配置
openclaw gateway config reset
openclaw gateway start
```

---

## 第五步：权限检查

```powershell
# 检查用户权限（需要管理员权限安装服务）
whoami /groups | findstr "S-1-16-12288"
# 如果有输出，说明是管理员

# 检查 OpenClaw 配置目录权限
Get-Acl ~/.openclaw | Format-List
```

---

## 快速修复命令（一键执行）

```powershell
# 如果懒得排查，直接跑这个：
chcp 65001
$OutputEncoding = [System.Text.Encoding]::UTF8
openclaw gateway stop
schtasks /delete /tn "OpenClaw Gateway" /f 2>$null
Remove-Item -Recurse -Force ~/.openclaw/logs/* 2>$null
openclaw gateway start
Start-Sleep 3
openclaw gateway status
```

---

## 常见错误对照表

| 乱码/错误 | 可能原因 | 修复 |
|-----------|----------|------|
| `����` | 编码不匹配 | `chcp 65001` |
| `schtasks run failed` | 任务计划冲突 | 删除重建任务 |
| `EADDRINUSE` | 端口被占用 | 改端口或杀进程 |
| `Access denied` | 权限不足 | 管理员权限运行 |
| `Node not found` | Node 路径问题 | 检查 nvm/npm 安装 |

---

如果以上都试过还不行，输出这个给我：
```powershell
openclaw doctor --verbose 2>&1 | Out-File ~/openclaw-debug.log
Get-Content ~/openclaw-debug.log
```
