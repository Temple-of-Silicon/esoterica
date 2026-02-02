#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Parse command line arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const isUninstall = args.includes('--uninstall');

// Target flags
const useOpenClaw = args.includes('--openclaw');
const useClaudeCode = args.includes('--claude-code') || args.includes('--claude');

// OpenClaw agent flag: --agent <name> or --agent=<name>
let agentName = null;
const agentFlagIndex = args.findIndex(arg => arg === '--agent' || arg.startsWith('--agent='));
if (agentFlagIndex !== -1) {
  const arg = args[agentFlagIndex];
  if (arg.startsWith('--agent=')) {
    agentName = arg.split('=')[1];
  } else if (args[agentFlagIndex + 1] && !args[agentFlagIndex + 1].startsWith('--')) {
    agentName = args[agentFlagIndex + 1];
  }
}

// Show help
if (showHelp) {
  console.log(`
Esoterica - Tarot reading skill for Claude Code & OpenClaw

Usage:
  npx @templeofsilicon/esoterica              Auto-detect and install
  npx @templeofsilicon/esoterica --openclaw   Install to OpenClaw (global)
  npx @templeofsilicon/esoterica --openclaw --agent <name>
                                              Install to specific OpenClaw agent
  npx @templeofsilicon/esoterica --claude-code
                                              Install to Claude Code
  npx @templeofsilicon/esoterica --uninstall  Remove installed skill

Options:
  --openclaw          Install to OpenClaw (~/.openclaw/skills/tarot)
  --agent <name>      Install to specific agent (~/.openclaw/agents/<name>/skills/tarot)
  --claude-code       Install to Claude Code (~/.claude/skills/tarot)
  --uninstall         Remove installed skill (uses same targeting flags)
  --help, -h          Show this help message

Auto-detection priority:
  1. If --openclaw or --agent specified: OpenClaw
  2. If --claude-code specified: Claude Code
  3. If ~/.openclaw exists: OpenClaw (global)
  4. Otherwise: Claude Code

After installation:
  Claude Code: Type /tarot to begin your reading
  OpenClaw:    The skill is available to agents automatically

More info: https://github.com/Temple-of-Silicon/esoterica
  `);
  process.exit(0);
}

// Resolve paths
const packageRoot = path.join(__dirname, '..');
const skillSource = path.join(packageRoot, 'skills', 'tarot');
const homeDir = os.homedir();

// Determine installation target
function getInstallTarget() {
  const openClawDir = path.join(homeDir, '.openclaw');
  const claudeDir = path.join(homeDir, '.claude');
  
  // Explicit OpenClaw targeting
  if (useOpenClaw || agentName) {
    if (agentName) {
      // Per-agent installation
      const agentDir = path.join(openClawDir, 'agents', agentName);
      if (!fs.existsSync(agentDir)) {
        console.error(`Error: Agent directory not found: ${agentDir}`);
        console.error(`Available agents:`);
        const agentsDir = path.join(openClawDir, 'agents');
        if (fs.existsSync(agentsDir)) {
          const agents = fs.readdirSync(agentsDir).filter(f => 
            fs.statSync(path.join(agentsDir, f)).isDirectory()
          );
          agents.forEach(a => console.error(`  - ${a}`));
        } else {
          console.error('  (no agents directory found)');
        }
        process.exit(1);
      }
      return {
        type: 'openclaw-agent',
        dest: path.join(agentDir, 'skills', 'tarot'),
        label: `OpenClaw agent "${agentName}"`
      };
    }
    // Global OpenClaw installation
    return {
      type: 'openclaw-global',
      dest: path.join(openClawDir, 'skills', 'tarot'),
      label: 'OpenClaw (global)'
    };
  }
  
  // Explicit Claude Code targeting
  if (useClaudeCode) {
    return {
      type: 'claude-code',
      dest: path.join(claudeDir, 'skills', 'tarot'),
      label: 'Claude Code'
    };
  }
  
  // Auto-detection: prefer OpenClaw if it exists
  if (fs.existsSync(openClawDir)) {
    return {
      type: 'openclaw-global',
      dest: path.join(openClawDir, 'skills', 'tarot'),
      label: 'OpenClaw (global, auto-detected)'
    };
  }
  
  // Default to Claude Code
  return {
    type: 'claude-code',
    dest: path.join(claudeDir, 'skills', 'tarot'),
    label: 'Claude Code'
  };
}

const target = getInstallTarget();

/**
 * Recursively copy directory from source to destination
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error('Error: Source directory not found:', src);
    process.exit(1);
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Uninstall logic
if (isUninstall) {
  if (fs.existsSync(target.dest)) {
    fs.rmSync(target.dest, { recursive: true, force: true });
    console.log(`✓ Esoterica tarot skill uninstalled from ${target.label}`);
    console.log('Removed:', target.dest);
  } else {
    console.log(`⚠️  Esoterica tarot skill not found at: ${target.dest}`);
    console.log('Nothing to uninstall.');
  }
  process.exit(0);
}

// Main installation logic
try {
  console.log(`Installing Esoterica tarot skill to ${target.label}...`);
  console.log('');

  // Check if already installed
  if (fs.existsSync(target.dest)) {
    console.log('⚠️  Tarot skill already exists at:', target.dest);
    console.log('Overwriting with latest version...');
    console.log('');
  }

  // Copy skill directory
  copyDir(skillSource, target.dest);

  // Verify installation
  const skillFile = path.join(target.dest, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    throw new Error('Installation verification failed - SKILL.md not found');
  }

  console.log('✓ Esoterica installed successfully!');
  console.log('');
  console.log('Location:', target.dest);
  console.log('');
  
  // Platform-specific next steps
  if (target.type === 'claude-code') {
    console.log('Next steps:');
    console.log('1. Restart Claude Code (if currently running)');
    console.log('2. Type /tarot to begin your reading');
  } else if (target.type === 'openclaw-global') {
    console.log('Next steps:');
    console.log('1. The skill is now available to all OpenClaw agents');
    console.log('2. Agents can invoke tarot readings via the skill');
    console.log('');
    console.log('To install for a specific agent instead:');
    console.log('  npx @templeofsilicon/esoterica --agent <agent-name>');
  } else if (target.type === 'openclaw-agent') {
    console.log('Next steps:');
    console.log(`1. The skill is now available to the "${agentName}" agent`);
    console.log('2. The agent can invoke tarot readings via the skill');
  }
  
  console.log('');
  console.log('The cards are shuffled. The threshold awaits.');

  process.exit(0);
} catch (error) {
  console.error('✗ Installation failed:', error.message);
  console.error('');
  console.error('Please report issues at: https://github.com/Temple-of-Silicon/esoterica/issues');
  process.exit(1);
}
