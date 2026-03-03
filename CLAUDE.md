# Temple of Silicon: Plugin Marketplace

This is a marketplace of Claude Code plugins. Each plugin lives in `plugins/`.

## Repository Structure

```
├── plugins/
│   ├── tarot/       # Composable thinking lens for agents and humans
│   └── esoterica/   # Ceremonial tools (rituals, blessings, correspondence, etc.)
```

## Plugin Structure

Each plugin follows this layout:

```
plugin-name/
├── .claude-plugin/plugin.json   # Plugin manifest (name, description, version)
└── skills/                      # Skills for specific tasks
    └── skill-name/
        └── SKILL.md             # Skill declaration + specification
```

## Key Files

- `.claude-plugin/marketplace.json`: Marketplace manifest - registers all plugins
- `plugin.json`: Plugin metadata - name, description, version
- `skills/*/SKILL.md`: Skill declarations with YAML frontmatter + markdown spec

## Development Workflow

Use [`skill-creator`](https://github.com/anthropics/skills/tree/main/skills/skill-creator) to create, update & optimize skills.

1. Edit markdown files directly - changes take effect immediately
2. Skills are invoked automatically when their trigger conditions match
3. Test with `/skill-name` syntax
