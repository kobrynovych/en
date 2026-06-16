import { spawn } from "node:child_process";

const child = spawn("npm run build", {
  env: {
    ...process.env,
    GITHUB_ACTIONS: "true",
  },
  shell: true,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
