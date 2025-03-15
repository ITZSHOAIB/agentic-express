import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import * as prompt from "@clack/prompts";
import fs from "fs-extra";

const execPromise = promisify(exec);

const TEMPLATE_URL =
  "https://github.com/ITZSHOAIB/agentic-express-template.git";

const spinner = prompt.spinner();

export const initProject = async () => {
  try {
    prompt.intro("Initializing a new Agentic Express project ☄️");

    const choices = await prompt.group(
      {
        projectDir: () =>
          prompt.text({
            message: "Where would you like to create the project?",
            placeholder: "./my-agentic-express-app",
            defaultValue: "./my-agentic-express-app",
          }),
      },
      {
        onCancel: () => {
          prompt.cancel("😟 Initialization cancelled.");
          process.exit(0);
        },
      },
    );

    const { projectDir } = choices;

    await cloneTemplate(projectDir);

    const shouldInstall = await prompt.confirm({
      message: "Do you want to install dependencies now?",
      active: "Yes",
      inactive: "No",
      initialValue: true,
    });

    if (shouldInstall) {
      await installDependencies(projectDir);
    }

    prompt.outro("✅ Project initialized successfully! Happy Coding :)");
  } catch (error) {
    spinner.stop("😟 Initialization failed.");
    prompt.cancel();
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

const cloneTemplate = async (projectDir: string) => {
  spinner.start("📂 Initializing template...");
  const targetPath = path.resolve(process.cwd(), projectDir);

  if (fs.existsSync(targetPath)) {
    const dirEmpty = fs.readdirSync(targetPath).length === 0;
    if (!dirEmpty) {
      spinner.stop("🚨 Directory is not empty.");
      const overwrite = await prompt.confirm({
        message: `Directory ${projectDir} already exists and is not empty. Do you want to overwrite it?`,
        initialValue: false,
      });

      if (prompt.isCancel(overwrite) || !overwrite) {
        spinner.stop("😟 Initialization cancelled.");
        prompt.cancel();
        process.exit(0);
      }
      spinner.start("🔄 Cleaning up directory...");
      fs.emptyDirSync(targetPath);
      spinner.stop("🧹 Directory cleaned up successfully!");
      spinner.start("📂 Initializing template...");
    }
  }

  fs.ensureDirSync(targetPath);

  await execPromise(
    `git clone --depth 1 ${TEMPLATE_URL} "${targetPath}" --quiet`,
  );
  fs.removeSync(path.join(targetPath, ".git"));
  spinner.stop("🎉 Project initialized successfully!");
};

const installDependencies = async (projectDir: string) => {
  const packageManager = await prompt.select({
    message: "Select a package manager you would like to use",
    options: [
      {
        value: "npm",
        label: "npm",
      },
      {
        value: "yarn",
        label: "yarn",
      },
      {
        value: "pnpm",
        label: "pnpm",
      },
    ],
  });

  // remote pnpm-lock.yaml if package manager is not pnpm
  if (packageManager !== "pnpm") {
    fs.removeSync(path.join(projectDir, "pnpm-lock.yaml"));
  }

  spinner.start(
    `📦 Installing dependencies using ${packageManager.toString()}...`,
  );
  await execPromise(`${packageManager.toString()} install`, {
    cwd: projectDir,
    windowsHide: true,
  });
  spinner.stop("🎉 Dependencies installed successfully!");
};
