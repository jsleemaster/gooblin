#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const markerName = 'GOOBLIN_INSTALL.json';
const installDirName = '.gooblin';
const copyEntries = ['AGENTS.md', 'README.md', 'skills', 'commands', 'docs', 'adapters'];

const pkg = JSON.parse(await fs.readFile(path.join(packageRoot, 'package.json'), 'utf8'));

function usage() {
  return `Gooblin ${pkg.version}

Usage:
  gooblin install [--target <dir>] [--dry-run] [--force]
  gooblin status [--target <dir>]
  gooblin uninstall [--target <dir>] [--dry-run] [--force]
  gooblin --version
  gooblin --help

npx examples:
  npx github:jsleemaster/gooblin install
  npx github:jsleemaster/gooblin status

Install copies a readable Gooblin skill pack into .gooblin/.
It does not enable hooks, edit host settings, access the network, or collect telemetry.
Until owned-file tracking is available, existing copies are never replaced or removed automatically.`;
}

function parseArgs(argv) {
  const args = [...argv];
  let command = 'help';
  const options = {
    target: process.cwd(),
    dryRun: false,
    force: false,
  };

  if (args.length > 0 && !args[0].startsWith('-')) {
    command = args.shift();
  } else if (args.includes('--version') || args.includes('-v')) {
    command = 'version';
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      command = 'help';
    } else if (arg === '--version' || arg === '-v') {
      command = 'version';
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--target') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error('--target requires a directory path');
      }
      options.target = path.resolve(value);
      index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  options.target = path.resolve(options.target);
  return { command, options };
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function installRootFor(target) {
  return path.join(target, installDirName);
}

function markerPathFor(target) {
  return path.join(installRootFor(target), markerName);
}

async function assertTargetExists(target) {
  const stat = await fs.stat(target);
  if (!stat.isDirectory()) {
    throw new Error(`Target is not a directory: ${target}`);
  }
}

async function install(options) {
  await assertTargetExists(options.target);

  const installRoot = installRootFor(options.target);
  const markerPath = markerPathFor(options.target);
  const alreadyInstalled = await pathExists(installRoot);

  if (alreadyInstalled) {
    if (options.dryRun) {
      console.log(`Would leave existing Gooblin files unchanged in ${installRoot}`);
      console.log('Automatic replacement is disabled until owned-file tracking is available.');
      return;
    }

    throw new Error(
      `Refusing to replace ${installRoot} automatically because installed and consumer-owned files cannot be distinguished yet. Back up and review the directory manually.`,
    );
  }

  if (options.dryRun) {
    console.log(`Would install Gooblin ${pkg.version} into ${installRoot}`);
    for (const entry of copyEntries) {
      console.log(`Would copy ${entry}`);
    }
    return;
  }

  await fs.mkdir(installRoot, { recursive: true });

  for (const entry of copyEntries) {
    const source = path.join(packageRoot, entry);
    const destination = path.join(installRoot, entry);
    await fs.cp(source, destination, { recursive: true, force: false, errorOnExist: true });
  }

  const marker = {
    name: 'gooblin',
    version: pkg.version,
    installedAt: new Date().toISOString(),
    installer: 'gooblin-npx',
    target: options.target,
    note: 'Readable skill pack only; hooks and host settings were not enabled automatically.',
  };

  await fs.writeFile(markerPath, `${JSON.stringify(marker, null, 2)}\n`, 'utf8');

  console.log(`Installed Gooblin ${pkg.version} into ${installRoot}`);
  console.log('Next prompt:');
  console.log('Use /gooblin for this task. Diagnose the task type first, then route to the smallest useful teammate set.');
}

async function status(options) {
  const installRoot = installRootFor(options.target);
  const markerPath = markerPathFor(options.target);

  if (!(await pathExists(installRoot))) {
    console.log(`Gooblin is not installed in ${options.target}`);
    return;
  }

  if (!(await pathExists(markerPath))) {
    console.log(`Gooblin directory exists without ${markerName}: ${installRoot}`);
    return;
  }

  const marker = JSON.parse(await fs.readFile(markerPath, 'utf8'));
  console.log(`Gooblin ${marker.version || 'unknown'} installed in ${installRoot}`);
  console.log(`Installed at: ${marker.installedAt || 'unknown'}`);
}

async function uninstall(options) {
  const installRoot = installRootFor(options.target);
  const markerPath = markerPathFor(options.target);

  if (!(await pathExists(installRoot))) {
    console.log(`Gooblin is not installed in ${options.target}`);
    return;
  }

  const hasMarker = await pathExists(markerPath);

  if (options.dryRun) {
    console.log(`Would leave existing Gooblin files unchanged in ${installRoot}`);
    console.log('Automatic uninstall is disabled until owned-file tracking is available.');
    return;
  }

  const reason = hasMarker
    ? 'installed and consumer-owned files cannot be distinguished yet'
    : `${markerName} is missing and file ownership cannot be verified`;

  throw new Error(
    `Refusing to remove ${installRoot} automatically because ${reason}. Back up and review the directory manually.`,
  );
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (command === 'help') {
    console.log(usage());
  } else if (command === 'version') {
    console.log(pkg.version);
  } else if (command === 'install') {
    await install(options);
  } else if (command === 'status') {
    await status(options);
  } else if (command === 'uninstall') {
    await uninstall(options);
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  console.error(`gooblin: ${error.message}`);
  process.exitCode = 1;
});
