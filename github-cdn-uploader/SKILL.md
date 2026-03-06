---
name: github-cdn-uploader
description: Upload images/files to GitHub and generate jsDelivr CDN links. Use when user wants to (1) host images/files on GitHub as a CDN, (2) generate permanent CDN URLs for images, (3) create an HTML index of files with CDN links, or (4) any task involving "GitHub 图床", "CDN 链接", "永久外链" for images. Works with GitHub repository + jsDelivr CDN for global acceleration.
---

# GitHub CDN Uploader

Upload images or files to GitHub repository and generate jsDelivr CDN links for permanent hosting.

## What This Skill Does

1. Uploads a local folder (containing images/files) to a GitHub repository
2. Generates jsDelivr CDN links for all files (format: `https://cdn.jsdelivr.net/gh/user/repo/path`)
3. Creates an HTML index file with clickable links to all CDN URLs

## Prerequisites

- GitHub Personal Access Token with `repo` scope
- Target GitHub repository (will be cloned and pushed to)

## How to Use

### Step 1: Get GitHub Token

If user doesn't have a token:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: ✅ **repo** (full control of private repositories)
4. Generate and copy the token (shown only once)

### Step 2: Run the Upload

Use the script:

```bash
python scripts/upload_cdn.py <local_folder> <repo_url> <token> <output_html>
```

Parameters:
- `local_folder`: Path to folder containing images (e.g., `/path/to/作品集`)
- `repo_url`: GitHub repo URL (e.g., `https://github.com/username/repo.git`)
- `token`: GitHub Personal Access Token
- `output_html`: Output HTML file path (e.g., `portfolio-index.html`)

### Step 3: Use the Results

After successful upload:
- Files are in GitHub repository
- CDN links work immediately: `https://cdn.jsdelivr.net/gh/user/repo/folder/file.jpg`
- Open the HTML file to see all links

## CDN URL Format

```
https://cdn.jsdelivr.net/gh/{username}/{repo}/{folder}/{file}
```

Example:
```
https://cdn.jsdelivr.net/gh/aurxxxting-dev/moyan-backup/朱雅兰作品集/AI/千行百业.jpg
```

## Features

- ✅ Permanent hosting (as long as GitHub repo exists)
- ✅ Global CDN acceleration via jsDelivr
- ✅ Works in China
- ✅ Auto-generates HTML index with clickable links
- ✅ Supports images and videos
- ✅ URL-encoded paths for special characters

## Notes

- jsDelivr caches files; updates may take a few minutes to propagate
- Large files (>20MB) may be rejected by GitHub
- Token needs `repo` scope for private repos, `public_repo` for public repos
