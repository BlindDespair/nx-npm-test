/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import {execSync} from 'child_process';
import chalk from 'chalk';

import devkit from '@nx/devkit';
import {join} from 'path';
const {readCachedProjectGraph} = devkit;

function invariant(condition, message) {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  }
}

// Executing publish script: node path/to/publish.mjs {name} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, tagArg = 'next'] = process.argv;
// when tag not passed via cli to nx, nx writes a stringified undefined there
const tag = tagArg === 'undefined' ? 'next' : tagArg;

const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`,
);

const outputPath = join('dist', name);

process.chdir(outputPath);

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${tag}`);
