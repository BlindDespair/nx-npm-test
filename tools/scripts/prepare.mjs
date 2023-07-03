import chalk from 'chalk';
import {cp, rm, stat, rename, readdir} from 'fs/promises';
import {join, basename} from 'path';

import devkit from '@nx/devkit';
const {readCachedProjectGraph} = devkit;

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}

// Executing prepare script: node path/to/prepare.mjs {name}
const [, , name] = process.argv;

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`,
);

const projectRootPath = project.data?.root;
invariant(
  projectRootPath,
  `Could not find "root" of project "${name}". Is project.json configured  correctly?`,
);

const projectSourceRootPath = project.data?.sourceRoot;
invariant(
  projectSourceRootPath,
  `Could not find "sourceRoot" of project "${name}". Is project.json configured  correctly?`,
);

const projectBuildPath = project.data?.targets?.build?.options?.outputPath;
invariant(
  projectBuildPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`,
);

const outputPath = join('dist', name);
const outputBuildPath = join(outputPath, basename(projectBuildPath));
const outputSourcePath = join(outputPath, basename(projectSourceRootPath));

await rm(outputPath, {recursive: true, force: true});

await cp(projectBuildPath, outputBuildPath, {
  recursive: true,
});
await cp(projectSourceRootPath, outputSourcePath, {
  recursive: true,
  filter: async (source) => {
    const stats = await stat(source);
    return stats.isDirectory() || /\.m?ts$/.test(source);
  },
});
for (const file of await readdir(projectRootPath)) {
  if (/^((LICENSE|license)(\.txt)?|.*\.md)$/.test(file)) {
    await cp(join(projectRootPath, file), join(outputPath, file));
  }
}

await rename(
  join(outputBuildPath, 'package.json'),
  join(outputPath, 'package.json'),
);
