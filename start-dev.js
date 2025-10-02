#!/usr/bin/env node

/**
 * SafeSip Development Server Starter
 * Handles graceful startup and shutdown of all development services
 */

const { spawn } = require('child_process');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (color, prefix, message) => {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
};

// Service configurations
const services = [
  {
    name: 'SERVER',
    command: 'npm',
    args: ['run', 'server'],
    color: colors.green,
    cwd: process.cwd()
  },
  {
    name: 'CLIENT',
    command: 'npm',
    args: ['run', 'client'],
    color: colors.blue,
    cwd: process.cwd()
  },
  {
    name: 'ML-MODELS',
    command: 'npm',
    args: ['run', 'ml-models'],
    color: colors.yellow,
    cwd: process.cwd()
  }
];

let processes = [];

// Start all services
function startServices() {
  log(colors.cyan, 'MAIN', '🚀 Starting SafeSip Development Environment...');
  
  services.forEach((service, index) => {
    setTimeout(() => {
      const proc = spawn(service.command, service.args, {
        cwd: service.cwd,
        stdio: 'pipe',
        shell: true
      });

      processes.push(proc);

      proc.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          log(service.color, service.name, line);
        });
      });

      proc.stderr.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          log(colors.red, `${service.name}-ERR`, line);
        });
      });

      proc.on('close', (code) => {
        log(colors.magenta, service.name, `Process exited with code ${code}`);
      });

      proc.on('error', (err) => {
        log(colors.red, service.name, `Error: ${err.message}`);
      });

      log(service.color, service.name, `Started (PID: ${proc.pid})`);
    }, index * 1000); // Stagger starts by 1 second
  });
}

// Graceful shutdown
function shutdown() {
  log(colors.cyan, 'MAIN', '🛑 Shutting down SafeSip Development Environment...');
  
  processes.forEach((proc, index) => {
    if (proc && !proc.killed) {
      log(colors.yellow, 'MAIN', `Terminating ${services[index].name}...`);
      proc.kill('SIGTERM');
      
      // Force kill after 5 seconds
      setTimeout(() => {
        if (!proc.killed) {
          log(colors.red, 'MAIN', `Force killing ${services[index].name}...`);
          proc.kill('SIGKILL');
        }
      }, 5000);
    }
  });
  
  setTimeout(() => {
    log(colors.cyan, 'MAIN', '✅ SafeSip Development Environment stopped');
    process.exit(0);
  }, 6000);
}

// Handle process termination
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

// Start the services
startServices();

// Keep the main process alive
process.stdin.resume();