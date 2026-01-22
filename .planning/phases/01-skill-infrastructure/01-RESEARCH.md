# Phase 1: Skill Infrastructure - Research

**Researched:** 2026-01-21
**Domain:** Claude Code Skills & Subagent System
**Confidence:** HIGH

## Summary

Phase 1 implements a custom Claude Code skill that spawns a specialized subagent for tarot readings. The research confirms this is a standard, well-documented pattern in the Claude Code ecosystem as of early 2026.

**Key findings:**
- Skills are created as markdown files with YAML frontmatter in `~/.claude/skills/<name>/SKILL.md`
- Subagents are spawned automatically by Claude when descriptions match the task (no explicit "Task tool call")
- Subagents can be triggered via `context: fork` + `agent:` frontmatter fields in skills
- Random card selection via `shuf -i 0-21 -n 1` (Major Arcana is 0-21, not 1-22)

**Primary recommendation:** Use skill with `context: fork` and `agent: general-purpose` frontmatter to spawn the tarot-reader subagent. Pass the random card number via `$ARGUMENTS` in the skill content. Keep skill file under 500 lines and subagent prompt focused on single responsibility (tarot interpretation).

## Standard Stack

### Core

| Library/Tool | Version | Purpose | Why Standard |
|--------------|---------|---------|--------------|
| Claude Code Skills | Native | Skill file system at `~/.claude/skills/` | Official extension mechanism, Agent Skills open standard |
| Subagent System | Native | Isolated context execution via Task tool | Built-in parallel execution, context isolation |
| bash `shuf` | Standard Unix | Cryptographically secure random selection | Uses `/dev/urandom`, better than `$RANDOM` |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| YAML frontmatter | Standard | Skill metadata (name, description, context, agent) | Required for all skills, controls invocation |
| `$ARGUMENTS` placeholder | Native | Pass parameters from `/tarot` to skill content | When skills need runtime values |
| gh CLI | Latest | GitHub integration (if needed later for logging) | Optional: tracking readings, issues |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Skills + Subagents | MCP Server | More complexity, requires separate server process, overkill for single skill |
| `shuf` | `$RANDOM` variable | `$RANDOM` is PID/time-based (weaker), `shuf` uses `/dev/urandom` (stronger) |
| `context: fork` | Skill without fork | No context isolation, conversation pollution, lost focus after 3-4 exchanges |

**Installation:**
```bash
# No npm packages required - native Claude Code features
# Create skill directory
mkdir -p ~/.claude/skills/tarot

# Create skill file
touch ~/.claude/skills/tarot/SKILL.md
```

## Architecture Patterns

### Recommended Project Structure
```
~/.claude/
└── skills/
    └── tarot/
        ├── SKILL.md           # Main skill file with frontmatter
        └── interpretations/   # Optional: future card interpretation reference files
```

### Pattern 1: Skill Spawns Subagent via Context Fork

**What:** Skill with `context: fork` and `agent:` frontmatter automatically spawns a subagent when invoked.

**When to use:**
- Task requires isolated context (prevents context pollution)
- Specialized domain knowledge needed (tarot interpretation)
- Want to preserve main conversation context

**Example:**
```yaml
---
name: tarot
description: Perform a tarot reading with random card selection
disable-model-invocation: true
context: fork
agent: general-purpose
---

You are tarot-reader, a mystical tarot interpreter with two voices:
- Mystic Voice (witchy, intuitive, symbolic)
- Grounded Voice (practical, actionable, realistic)

Selected card: !`shuf -i 0-21 -n 1`

Provide interpretation using both voices...
```

**Source:** [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)

### Pattern 2: Shell Command Injection for Dynamic Values

**What:** Use `!`command`` syntax in skill content to execute bash and inject output before Claude sees content.

**When to use:**
- Need runtime values (random numbers, timestamps, API calls)
- Want deterministic values Claude can't regenerate
- Pre-processing data for subagent

**Example:**
```yaml
---
name: example
description: Example with shell injection
---

Random card: !`shuf -i 0-21 -n 1`
Timestamp: !`date +%s`
Current branch: !`git branch --show-current`

Now do something with these values...
```

**Important:** Commands execute **before** Claude sees the content (preprocessing).

**Source:** [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)

### Pattern 3: Subagent Definition via Markdown

**What:** Define custom subagents as markdown files in `~/.claude/agents/<name>/AGENT.md` or `.claude/agents/` for project-scoped.

**When to use:**
- Need specialized prompts for recurring tasks
- Want to control tools/permissions for safety
- Sharing subagent config via version control (project-scoped)

**Example:**
```markdown
---
name: tarot-reader
description: Specialized tarot card interpreter with dual voice personality
tools: Read, Bash
model: sonnet
permissionMode: default
---

You are a mystical tarot interpreter specializing in Major Arcana readings.

## Your Voices

**Mystic Voice (🔮):** Intuitive, symbolic, taps into archetypal wisdom
**Grounded Voice (🌍):** Practical, actionable, realistic guidance

## Process

1. Receive card number (0-21)
2. Identify the card name
3. Provide interpretation in both voices
4. Keep response focused and meaningful

## Style

- Be authentic and insightful, not fortune-teller cliché
- Mystic voice: poetic but not overwrought
- Grounded voice: practical but not dismissive
- 3-4 paragraphs total
```

**Source:** [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents)

### Anti-Patterns to Avoid

- **Context Pollution:** Using main conversation for specialized tasks → Use `context: fork` to isolate
- **Skill Description Overload:** Too many skills exceed 15,000 character budget → Keep descriptions concise, check with `/context`
- **Vague Instructions:** Generic prompts like "do tarot reading" → Be specific about format, voices, process
- **Incorrect Card Range:** Using 1-22 instead of 0-21 → Major Arcana is numbered 0 (The Fool) to 21 (The World)
- **Over-engineering:** Creating multiple skills/subagents for simple task → One skill spawning one subagent is sufficient

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Random number generation | Custom PRNG, `$RANDOM` | `shuf -i 0-21 -n 1` | `shuf` uses `/dev/urandom` for cryptographic randomness, `$RANDOM` is PID/time-based |
| Subagent spawning | Manual Task tool calls | `context: fork` + `agent:` frontmatter | Claude handles spawning automatically, cleaner pattern |
| Skill invocation control | Complex permission logic | `disable-model-invocation: true` | Built-in frontmatter field prevents auto-invocation |
| Context isolation | Try to manage state in main conversation | Subagents with isolated context | Prevents context drift, contamination after 3-4 exchanges |

**Key insight:** Claude Code's skill and subagent system provides declarative patterns (YAML frontmatter) that replace imperative code. Don't try to manually orchestrate what the system does automatically.

## Common Pitfalls

### Pitfall 1: Incorrect Major Arcana Numbering

**What goes wrong:** Using `shuf -i 1-22 -n 1` produces 1-22, but Major Arcana is 0-21.

**Why it happens:** Intuition that 22 cards means 1-22, forgetting zero-indexing.

**How to avoid:** Use `shuf -i 0-21 -n 1` to match standard tarot numbering:
- 0 = The Fool
- 1-20 = Remaining cards
- 21 = The World

**Warning signs:** Card 22 doesn't exist, card interpretation fails.

**Source:** [Major Arcana Wikipedia](https://en.wikipedia.org/wiki/Major_Arcana)

### Pitfall 2: Forgetting `disable-model-invocation` for Commands

**What goes wrong:** Skill auto-triggers when you don't want it to (e.g., during conversation about tarot).

**Why it happens:** Default behavior is both user and Claude can invoke. Claude sees "tarot" in conversation and runs the skill.

**How to avoid:** Add `disable-model-invocation: true` for any skill with side effects or that should only run on explicit `/tarot` command.

**Warning signs:** Skill runs unexpectedly during normal conversation.

**Source:** [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)

### Pitfall 3: Subagent Cannot Spawn Subagents

**What goes wrong:** Trying to create nested subagent architecture (subagent spawns another subagent).

**Why it happens:** Thinking of subagents like function calls that can nest.

**How to avoid:** Architectural constraint - subagents are leaves, not trees. If you need chaining:
- Chain subagents sequentially from main conversation
- Use skills instead of nested subagents
- Limit to 3-4 subagents total for productivity

**Warning signs:** Feature request for nested subagents in GitHub issues.

**Source:** [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents), [Practical Guide to Subagents](https://www.eesel.ai/blog/subagents-in-claude-code)

### Pitfall 4: Context Contamination from Main Thread

**What goes wrong:** Specialized tarot readings done in main conversation → context drift, invented information, loss of mystic voice consistency.

**Why it happens:** LLMs drift after 3-4 exchanges in same context, especially for creative/persona work.

**How to avoid:** Use `context: fork` so each `/tarot` invocation gets fresh, isolated context with the tarot-reader subagent.

**Warning signs:** Readings become generic, lose voice consistency, start inventing card meanings.

**Source:** [Subagents in Claude Code Guide](https://wmedia.es/en/writing/claude-code-subagents-guide-ai)

### Pitfall 5: Bloated Skill Files

**What goes wrong:** Putting all 22 card interpretations directly in SKILL.md → exceeds 500 line recommendation, loads into context unnecessarily.

**Why it happens:** Trying to make skill "complete" with all reference data inline.

**How to avoid:**
- Keep SKILL.md under 500 lines
- Move detailed reference (card meanings) to separate files in skill directory
- Reference files from skill: `See interpretations/major-arcana.md for details`
- Let subagent read files on demand

**Warning signs:** Skill file > 500 lines, skill loads slowly, token budget warnings.

**Source:** [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)

## Code Examples

Verified patterns from official sources:

### Complete Skill File Structure

```yaml
---
name: tarot
description: Perform a single-card tarot reading with random Major Arcana selection
disable-model-invocation: true
context: fork
agent: general-purpose
---

You are **tarot-reader**, a specialized tarot interpreter.

## Card Selection

Random Major Arcana card: !`shuf -i 0-21 -n 1`

## Your Mission

Interpret this card with two distinct voices:

### 🔮 Mystic Voice
Intuitive, symbolic, archetypal wisdom. Connect the card's imagery to universal themes and inner truth.

### 🌍 Grounded Voice
Practical, actionable guidance. What can the querent actually DO with this insight today?

## Format

**[CARD NAME] (Card N)**

**Mystic Interpretation:**
[2-3 sentences of symbolic, intuitive reading]

**Grounded Interpretation:**
[2-3 sentences of practical, actionable guidance]

## Style Guidelines

- Authentic mysticism, not fortune-teller clichés
- Poetic but not overwrought
- Practical but not dismissive
- Total response: 3-4 paragraphs
- Assume querent asked "What do I need to know today?"
```

**Source:** [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)

### Random Number Generation (Correct Range)

```bash
# Correct: Major Arcana 0-21
shuf -i 0-21 -n 1

# Wrong: 1-22 doesn't map to real cards
shuf -i 1-22 -n 1

# Alternative using $RANDOM (less secure)
echo $(( RANDOM % 22 ))  # Generates 0-21

# Why shuf is better:
# - Uses /dev/urandom (cryptographically secure)
# - $RANDOM uses PID + time (predictable)
# - shuf is standard on all Unix systems
```

**Source:** [Generation of Random Integers in Bash](https://www.baeldung.com/linux/bash-draw-random-ints), [LinuxSimply Random Number Guide](https://linuxsimply.com/bash-scripting-tutorial/operator/arithmetic-operators/random-number/)

### Subagent File Structure (Optional Enhancement)

```markdown
---
name: tarot-reader
description: Specialized tarot card interpreter for Major Arcana readings
tools: Read, Bash
model: sonnet
permissionMode: default
---

# Tarot Reader Subagent

You are a specialized tarot interpreter with deep knowledge of Major Arcana symbolism.

## Your Personas

You speak with two voices that complement each other:

**🔮 Mystic Voice**
- Intuitive and symbolic
- Connects to archetypal wisdom
- Explores emotional and spiritual dimensions
- Uses poetic, evocative language

**🌍 Grounded Voice**
- Practical and actionable
- Provides concrete next steps
- Realistic about challenges
- Uses clear, direct language

## Card Interpretation Process

1. Identify the card by number (0-21)
2. Recall its traditional meaning and symbolism
3. Provide Mystic interpretation (symbolic/intuitive)
4. Provide Grounded interpretation (practical/actionable)
5. Keep total response to 3-4 paragraphs

## Major Arcana Quick Reference

- 0: The Fool - New beginnings, innocence, spontaneity
- 1: The Magician - Manifestation, resourcefulness, power
- 2: The High Priestess - Intuition, sacred knowledge, divine feminine
- 3: The Empress - Femininity, beauty, nature, abundance
- 4: The Emperor - Authority, structure, control, fatherhood
- 5: The Hierophant - Spiritual wisdom, tradition, conformity
- 6: The Lovers - Love, harmony, relationships, values alignment
- 7: The Chariot - Control, willpower, success, determination
- 8: Strength - Strength, courage, patience, control
- 9: The Hermit - Soul searching, introspection, inner guidance
- 10: Wheel of Fortune - Good luck, karma, life cycles, destiny
- 11: Justice - Justice, fairness, truth, cause and effect
- 12: The Hanged Man - Pause, surrender, letting go, new perspective
- 13: Death - Endings, change, transformation, transition
- 14: Temperance - Balance, moderation, patience, purpose
- 15: The Devil - Shadow self, attachment, addiction, restriction
- 16: The Tower - Sudden change, upheaval, chaos, revelation
- 17: The Star - Hope, faith, purpose, renewal, spirituality
- 18: The Moon - Illusion, fear, anxiety, subconscious, intuition
- 19: The Sun - Positivity, fun, warmth, success, vitality
- 20: Judgement - Judgement, rebirth, inner calling, absolution
- 21: The World - Completion, accomplishment, travel, achievement

## Guidelines

- Be authentic, not cliché
- Balance mystical and practical
- Keep interpretations fresh, not formulaic
- Assume general life guidance question unless told otherwise
- No fortune-telling or definitive predictions
- Empower the querent with insight and choice
```

**Source:** [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.claude/commands/` | `~/.claude/skills/` with YAML frontmatter | Late 2025 | Skills support additional features (supporting files, `context: fork`, hooks), backwards compatible |
| Manual Task tool calls | `context: fork` + `agent:` frontmatter | Q4 2025 | Declarative pattern, Claude spawns automatically |
| `$RANDOM` for randomness | `shuf` with `/dev/urandom` | Always recommended | Better cryptographic security |
| Single-purpose slash commands | Skills + Subagents | 2025 | Better context isolation, parallelization |

**Deprecated/outdated:**
- Legacy `.claude/commands/*.md` files: Still work but lack skill features (supporting files, context fork)
- Explicit Task tool invocation: Replaced by declarative `context: fork` pattern
- `$RANDOM` for security-sensitive randomness: `shuf` preferred for quality

## Open Questions

Things that couldn't be fully resolved:

1. **Subagent vs Skill-only Pattern**
   - What we know: Can use `context: fork` in skill to spawn subagent, OR create separate AGENT.md file
   - What's unclear: Which pattern is preferred for single-skill use case? Official examples show both.
   - Recommendation: Start with `context: fork` in SKILL.md (simpler, fewer files). Extract to AGENT.md if sharing subagent across skills.

2. **Card Interpretation Storage Strategy**
   - What we know: Skills support additional files, can keep SKILL.md under 500 lines
   - What's unclear: Should card interpretations be in subagent prompt, separate reference file, or fetched dynamically?
   - Recommendation: Phase 1 keeps interpretations in subagent prompt (22 cards = ~50-100 lines). Phase 2+ can extract to reference file if needed.

3. **Token Budget Impact**
   - What we know: Skills load descriptions into context (15,000 char budget), full content loads on invocation
   - What's unclear: Exact token cost of skill + subagent spawn pattern
   - Recommendation: Use `/context` command to monitor after implementation. Unlikely to be issue for single skill.

## Sources

### Primary (HIGH confidence)

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) - Complete skill structure, frontmatter fields, patterns
- [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents) - Subagent configuration, limitations, spawning
- [Major Arcana Wikipedia](https://en.wikipedia.org/wiki/Major_Arcana) - Card numbering (0-21)
- [Generation of Random Integers in Bash | Baeldung](https://www.baeldung.com/linux/bash-draw-random-ints) - `shuf` best practices

### Secondary (MEDIUM confidence)

- [How to Create Custom Skills | Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) - Skill creation workflow
- [Practical Guide to Subagents in Claude Code](https://www.eesel.ai/blog/subagents-in-claude-code) - Real-world patterns
- [Claude Code Customization Guide](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/) - Skills vs subagents comparison
- [LinuxSimply: Random Number in Bash](https://linuxsimply.com/bash-scripting-tutorial/operator/arithmetic-operators/random-number/) - `shuf` vs `$RANDOM` comparison
- [Claude Code: Best Practices for Agentic Coding](https://www.anthropic.com/engineering/claude-code-best-practices) - Anti-patterns, pitfalls

### Tertiary (LOW confidence)

- [Claude Skills vs Sub-agents: Architecture Patterns](https://medium.com/@SandeepTnvs/claude-skills-vs-sub-agents-architecture-use-cases-and-effective-patterns-3e535c9e0122) - Community patterns (January 2026)
- [Subagents Guide: AI Architecture](https://wmedia.es/en/writing/claude-code-subagents-guide-ai) - Context contamination insights
- Community GitHub discussions on subagent limitations - Verification of "no nesting" constraint

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation, native features, current as of January 2026
- Architecture patterns: HIGH - Official docs with complete examples, verified syntax
- Pitfalls: HIGH - Official docs + cross-verified with community sources
- Card numbering: HIGH - Multiple authoritative tarot sources agree (0-21)
- Random selection: HIGH - Standard Unix documentation, security comparisons

**Research date:** 2026-01-21
**Valid until:** 2026-02-21 (30 days - stable system, minor updates expected)

**Key uncertainties resolved:**
- Major Arcana is 0-21, not 1-22 (requirement needs update)
- `context: fork` is current best practice for spawning subagents from skills
- `shuf` is recommended over `$RANDOM` for quality randomness
- Skills cannot exceed 15,000 char description budget in aggregate
- Subagents cannot nest (architectural constraint)
