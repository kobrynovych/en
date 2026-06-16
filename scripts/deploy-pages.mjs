import { spawnSync } from "node:child_process";

function run(command) {
  const result = spawnSync(command, {
    shell: true,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npm run verify");
run("npm run build:pages");
run("git push origin HEAD");

console.log("Pushed current branch. GitHub Pages deployment will run in GitHub Actions.");
