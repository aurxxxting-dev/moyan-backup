#!/usr/bin/env python3
"""
GitHub CDN Uploader - 上传图片到 GitHub 并生成 jsDelivr CDN 链接
"""

import os
import sys
import subprocess
import urllib.parse
import tempfile
import shutil

def run_cmd(cmd, cwd=None):
    """运行命令并返回输出"""
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    return result.returncode, result.stdout, result.stderr

def upload_to_github(local_path, repo_url, token, branch="main"):
    """
    上传本地文件夹到 GitHub 仓库
    
    Args:
        local_path: 本地文件夹路径
        repo_url: GitHub 仓库 URL (https://github.com/user/repo.git)
        token: GitHub Personal Access Token
        branch: 分支名，默认 main
    
    Returns:
        (success: bool, message: str)
    """
    # 解析仓库信息
    repo_parts = repo_url.replace("https://github.com/", "").replace(".git", "").split("/")
    if len(repo_parts) != 2:
        return False, "Invalid repo URL format"
    
    user, repo = repo_parts
    
    # 创建临时目录
    with tempfile.TemporaryDirectory() as tmpdir:
        clone_url = f"https://{user}:{token}@github.com/{user}/{repo}.git"
        
        # 克隆仓库
        ret, out, err = run_cmd(f"git clone {clone_url} {tmpdir}")
        if ret != 0:
            return False, f"Clone failed: {err}"
        
        # 获取文件夹名称
        folder_name = os.path.basename(local_path.rstrip("/"))
        target_path = os.path.join(tmpdir, folder_name)
        
        # 复制文件
        if os.path.exists(target_path):
            shutil.rmtree(target_path)
        shutil.copytree(local_path, target_path)
        
        # Git 提交
        run_cmd(f'git config user.email "moyan@openclaw.ai"', cwd=tmpdir)
        run_cmd(f'git config user.name "墨言"', cwd=tmpdir)
        run_cmd(f"git add {folder_name}/", cwd=tmpdir)
        run_cmd(f'git commit -m "Add {folder_name} via github-cdn-uploader"', cwd=tmpdir)
        
        # 推送
        ret, out, err = run_cmd(f"git push origin {branch}", cwd=tmpdir)
        if ret != 0:
            return False, f"Push failed: {err}"
        
        return True, f"Uploaded to {repo_url}"

def generate_cdn_html(local_path, repo_user, repo_name, output_file):
    """
    生成 CDN 版 HTML 索引文件
    
    Args:
        local_path: 本地文件夹路径
        repo_user: GitHub 用户名
        repo_name: 仓库名
        output_file: 输出 HTML 文件路径
    """
    base_url = f"https://cdn.jsdelivr.net/gh/{repo_user}/{repo_name}/{os.path.basename(local_path.rstrip('/'))}"
    folder_name = os.path.basename(local_path.rstrip('/'))
    
    html_content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{folder_name}索引 - CDN版</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }}
        .container {{ max-width: 900px; margin: 0 auto; }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }}
        .header h1 {{ font-size: 28px; margin-bottom: 10px; }}
        .header p {{ opacity: 0.9; font-size: 14px; }}
        .project {{
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }}
        .project h2 {{
            color: #333;
            font-size: 20px;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }}
        .project-desc {{
            color: #666;
            font-style: italic;
            margin-bottom: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
        }}
        .file-list {{ list-style: none; }}
        .file-list li {{
            margin-bottom: 8px;
            padding: 8px 12px;
            background: #f8f9fa;
            border-radius: 6px;
            display: flex;
            align-items: center;
            transition: background 0.2s;
        }}
        .file-list li:hover {{ background: #e9ecef; }}
        .file-list a {{
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            word-break: break-all;
        }}
        .file-list a:hover {{ text-decoration: underline; }}
        .file-icon {{ margin-right: 10px; font-size: 16px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{folder_name}索引</h1>
            <p>生成时间: {os.popen('date +%Y-%m-%d').read().strip()} | CDN: jsDelivr | 永久有效</p>
        </div>
"""
    
    projects = sorted([d for d in os.listdir(local_path) if os.path.isdir(os.path.join(local_path, d))])
    
    for project in projects:
        html_content += f'        <div class="project">\n'
        html_content += f'            <h2>{project}</h2>\n'
        html_content += f'            <div class="project-desc">项目简介: （请填写描述）</div>\n'
        html_content += f'            <ul class="file-list">\n'
        
        project_path = os.path.join(local_path, project)
        files = sorted(os.listdir(project_path))
        for f in files:
            file_path = os.path.join(project_path, f)
            if os.path.isfile(file_path):
                safe_project = urllib.parse.quote(project)
                safe_f = urllib.parse.quote(f)
                url = f"{base_url}/{safe_project}/{safe_f}"
                ext = os.path.splitext(f)[1].lower()
                icon = '🎬' if ext in ['.mp4', '.mov', '.avi'] else '🖼️'
                html_content += f'                <li><span class="file-icon">{icon}</span><a href="{url}" target="_blank">{f}</a></li>\n'
        
        html_content += f'            </ul>\n'
        html_content += f'        </div>\n'
    
    html_content += """    </div>
</body>
</html>
"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return True

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python upload_cdn.py <local_path> <repo_url> <token> <output_html>")
        sys.exit(1)
    
    local_path = sys.argv[1]
    repo_url = sys.argv[2]
    token = sys.argv[3]
    output_html = sys.argv[4]
    
    # 上传
    success, msg = upload_to_github(local_path, repo_url, token)
    print(msg)
    
    if success:
        # 解析用户信息生成 HTML
        repo_parts = repo_url.replace("https://github.com/", "").replace(".git", "").split("/")
        generate_cdn_html(local_path, repo_parts[0], repo_parts[1], output_html)
        print(f"HTML index generated: {output_html}")
