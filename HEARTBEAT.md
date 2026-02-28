# HEARTBEAT.md - 定期检查任务

## 每小时检查项（按需执行）
- [ ] 检查网关状态: `openclaw gateway status`
- [ ] 检查文件是否有未提交变更: `git status --porcelain`
- [ ] 如有异常，发送提醒给 aur

## 简化流程
Heartbeat 只负责**识别异常并通知**，不执行复杂修复。
修复操作由 aur 确认后人工执行。

---

_2026-02-28 简化：移除冗余规则，聚焦核心检查。_
