#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { input } = require("@inquirer/prompts");

// Constants
const TEMPLATE_REPO = "https://github.com/mylovepp/admintools-template.git";

async function main() {
    // Prompt user for input
    const projectName = await input({ message: "Enter your project name:", validate: (input) => input ? true : "Project name cannot be empty." });
    
    // Clone the template
    console.log("Cloning the template repository...");
    execSync(`git clone ${TEMPLATE_REPO} ${projectName}`, { stdio: "inherit" });

    // Update files
    const packageJsonPath = path.join(projectName, "package.json");
    const viteConfigPath = path.join(projectName, "vite.config.ts");

    console.log("Updating project files...");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.name = projectName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    let viteConfig = fs.readFileSync(viteConfigPath, "utf8");
    viteConfig = viteConfig.replace(/{{app-name}}/g, projectName);
    fs.writeFileSync(viteConfigPath, viteConfig);

    console.log("Project setup complete!");
}

main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
});
