---
title: CI/CD 与博客自动化
date: 2026-05-02 10:00:00
tags:
  - CI/CD
  - GitHub Actions
  - 自动化
categories:
  - 技术
---

## 什么是 CI/CD？

CI/CD 是持续集成（Continuous Integration）和持续部署（Continuous Deployment）的缩写。

- **持续集成（CI）**：代码变更后自动运行测试和构建
- **持续部署（CD）**：构建通过后自动部署到线上环境

## 本博客的自动化流程

```
本地写文章 → 自动推送到 GitHub → GitHub Actions 自动构建 → 部署到 GitHub Pages
```

### 第一步：本地写作

在 `source/_posts/` 目录下创建 Markdown 文件即可。

### 第二步：自动推送

使用自动化脚本检测新文章并推送到 GitHub。

### 第三步：自动部署

GitHub Actions 监听 push 事件，自动执行 `hexo generate` 并部署。

## 为什么选择自动化？

- 不再需要手动执行构建命令
- 不再需要手动上传文件
- 每次写完文章只需保存，其余全部自动完成
