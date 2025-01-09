#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { input, number } = require("@inquirer/prompts");

// Constants
const TEMPLATE_REPO = "https://github.com/mylovepp/admintools-template.git";

async function main() {
    // Prompt user for input
    const projectName = await input({ message: "Enter your project name:", validate: (input) => input ? true : "Project name cannot be empty." });    
    // Prompt user for input: default route
    const defaultRoute = await input({ message: "Enter your default route:", default: "main" });
    // Prompt user for number: port default 3001, validate port should more than 1000
    const port = await number({ message: "Enter your port:", default: 3001, validate: (input) => input >= 1000 ? true : "Port should more than 1000." });

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
    viteConfig = viteConfig.replace(/{{default-route}}/g, defaultRoute);
    viteConfig = viteConfig.replace(/{{port}}/g, port);
    fs.writeFileSync(viteConfigPath, viteConfig);

    console.log("Project setup complete!");
}

main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
});
