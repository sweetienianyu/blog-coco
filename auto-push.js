#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "source", "_posts");
const SNAPSHOT_FILE = path.join(__dirname, ".post-snapshot.json");

function getGitStatus() {
  try {
    return execSync("git status --porcelain", { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function getCurrentPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function getSavedPosts() {
  if (!fs.existsSync(SNAPSHOT_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT_FILE, "utf-8"));
  } catch {
    return null;
  }
}

function savePosts(posts) {
  fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(posts, null, 2));
}

function hasNewPosts(current, saved) {
  if (!saved) return current.length > 0;
  return current.length > saved.length || current.some((f, i) => f !== saved[i]);
}

function autoPush() {
  const status = getGitStatus();
  if (!status) {
    console.log("[BlogCoco] No changes detected.");
    return;
  }

  const currentPosts = getCurrentPosts();
  const savedPosts = getSavedPosts();

  if (!hasNewPosts(currentPosts, savedPosts) && !status.includes("source/_posts")) {
    console.log("[BlogCoco] Changes detected but no new articles. Skipping auto-push.");
    console.log("[BlogCoco] Run 'git add . && git commit && git push' manually if needed.");
    return;
  }

  const newPosts = savedPosts
    ? currentPosts.filter((p) => !savedPosts.includes(p))
    : currentPosts;

  console.log(`[BlogCoco] New article(s) detected: ${newPosts.join(", ")}`);

  try {
    execSync("git add -A", { stdio: "inherit" });

    const timestamp = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    const message = newPosts.length > 0
      ? `publish: ${newPosts.join(", ")} [${timestamp}]`
      : `update blog [${timestamp}]`;

    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });

    savePosts(currentPosts);
    console.log("[BlogCoco] Successfully pushed to GitHub!");
  } catch (error) {
    console.error("[BlogCoco] Push failed:", error.message);
    process.exit(1);
  }
}

autoPush();
