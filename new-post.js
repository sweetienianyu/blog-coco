#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "source", "_posts");

function createPost(title) {
  if (!title) {
    console.error("[BlogCoco] Usage: node new-post.js \"Article Title\"");
    process.exit(1);
  }

  const date = new Date().toISOString().slice(0, 10);
  const filename = title.toLowerCase().replace(/\s+/g, "-") + ".md";
  const filepath = path.join(POSTS_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.error(`[BlogCoco] File already exists: ${filename}`);
    process.exit(1);
  }

  const content = `---
title: ${title}
date: ${date}
tags:
categories:
---

`;

  fs.writeFileSync(filepath, content);
  console.log(`[BlogCoco] Created: source/_posts/${filename}`);
  console.log("[BlogCoco] Edit the file, then run: node auto-push.js");
}

const title = process.argv.slice(2).join(" ");
createPost(title);
