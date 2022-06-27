#!/usr/bin/env node
const { execSync } = require("child_process");

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`Failed to execute command ${command}`, err);
    return false;
  }

  return true;
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/Beygs/HTML-Canvas-Boilerplate.git ${repoName}`;
const gitResetCommand =  `cd ${repoName} && rm -rf .git && git init && git add -A && git commit -m "🚀 Project created with 'npx @boris-gilles/html-canvas-boilerplate ${repoName}'"`
const installDepsCommand = `cd ${repoName} && rm yarn.lock && npm install`;

console.log(`Creating a new HTML Canvas project with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log(`Creating a new HTML Canvas project with name ${repoName}`);
const gitReset = runCommand(gitResetCommand);
if (!gitReset) process.exit(-1);

console.log("Installing dependencies");
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) process.exit(-1);

console.log("Congratulations! You are ready. Follow the following commands to start.");
console.log(`cd ${repoName} && npm run dev`);
