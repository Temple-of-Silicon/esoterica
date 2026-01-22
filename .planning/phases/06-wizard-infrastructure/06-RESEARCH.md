# Phase 6: Wizard Infrastructure - Research

**Researched:** 2026-01-22
**Domain:** Claude Code AskUserQuestion tool, skill prompt patterns
**Confidence:** HIGH

## Summary

This research investigates how to modify the `/tarot` skill to launch an interactive wizard instead of accepting inline arguments. The key finding is that Claude Code's `AskUserQuestion` tool provides a tabbed, multi-question interface that can collect user input through multiple-choice options.

The current skill uses `context: fork` which spawns a subagent. **Critical constraint discovered:** AskUserQuestion cannot be used by subagents - only the main Claude can ask questions. This means the wizard must run BEFORE the context fork, in the main conversation, then pass collected answers to the forked subagent.

**Primary recommendation:** Restructure the skill to separate concerns - the main skill collects wizard input using AskUserQuestion, then delegates to a forked reading subagent with the collected parameters.

## Standard Stack

The established tools for this domain:

### Core
| Tool | Purpose | Why Standard |
|------|---------|--------------|
| AskUserQuestion | Multi-question wizard interface | Built-in Claude Code tool, renders tabbed TUI |
| SKILL.md | Skill definition and prompt | Standard Agent Skills format |
| $ARGUMENTS | Pass collected input to forked context | Standard skill argument passing |

### Supporting
| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| Prompt instructions | Tell Claude to use AskUserQuestion | For wizard skills |
| Multi-round questioning | Iterate until complete | When exploration needed |
| Foreground subagent | Pass interactive prompts through | When subagent needs user input |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| AskUserQuestion wizard | Conversational Q&A | Less structured, no tabs/options UI |
| Forked context | Main context | Reading would pollute conversation history |
| Multi-question | Single question at a time | Less efficient, more round-trips |

## Architecture Patterns

### Critical Constraint: AskUserQuestion and Subagents

**AskUserQuestion CANNOT be used by subagents (context: fork).** This is a hard limitation:

- Main Claude has access to AskUserQuestion
- Forked subagents auto-deny interactive tools
- If subagent calls AskUserQuestion, the tool call fails silently

**Implication for Tarot Skill:** The current skill has `context: fork`. The wizard MUST run in the main conversation BEFORE forking.

### Recommended Architecture Pattern

```
User invokes /tarot
       |
       v
Main Claude executes skill
       |
       v
Skill prompts Claude to use AskUserQuestion
       |
       v
Wizard collects: question, spread, mode
       |
       v
Claude passes collected params to reading logic
       |
       v  (if we keep fork)
Forked subagent receives params and performs reading
       |
       OR (if we remove fork)
       |
Main Claude performs reading with collected params
```

### Option A: Two-Phase Skill (Recommended)

Create a wizard skill that collects input, then invokes the reading:

```markdown
---
name: tarot
description: Interactive tarot reading wizard
---

# Tarot Wizard

## Phase 1: Collect Input

Use AskUserQuestion to gather:
1. User's question/context
2. Spread selection
3. Mode selection (digital/physical)

## Phase 2: Perform Reading

After collecting all inputs, perform the reading...
```

**Tradeoff:** Reading stays in main conversation (no isolation).

### Option B: Wrapper + Forked Reader

Keep the forked reader separate, have main skill call it:

```markdown
---
name: tarot
description: Interactive tarot reading wizard
---

# Tarot Wizard

Use AskUserQuestion to collect inputs, then delegate to tarot-reader skill.
```

```markdown
---
name: tarot-reader
context: fork
agent: general-purpose
user-invocable: false
---

# Tarot Reader

Perform reading with provided parameters...
```

**Tradeoff:** More complex (two skills), but preserves context isolation.

### Option C: Remove Fork, Keep Isolation via Instructions

Remove `context: fork`, rely on prompt instructions to maintain reading isolation:

```markdown
---
name: tarot
description: Interactive tarot reading wizard
---

# Tarot Reading

Collect inputs with AskUserQuestion, then provide reading.
Keep reading self-contained - do not reference conversation history.
```

**Tradeoff:** Simpler, but depends on Claude following instructions.

### AskUserQuestion Schema

```json
{
  "questions": [
    {
      "question": "Complete question ending with ?",
      "header": "Max12Chars",
      "multiSelect": false,
      "options": [
        {
          "label": "1-5 words",
          "description": "Explains choice and implications"
        }
      ]
    }
  ]
}
```

**Constraints:**
- 1-4 questions per invocation
- 2-4 options per question
- Header max 12 characters
- User always has "Other" option for custom text
- First option with "(Recommended)" for suggestions

### Recommended Project Structure

```
skills/tarot/
├── SKILL.md           # Main skill with wizard logic
└── (existing content) # Card meanings, voice system, etc.
```

If using Option B:
```
skills/tarot/
├── SKILL.md           # Wizard wrapper
└── READER.md          # Forked reader (or separate skill)
```

## Don't Hand-Roll

Problems that have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-step input collection | Custom conversation loop | AskUserQuestion with multiple questions | Built-in TUI, consistent UX |
| Options UI | Text parsing of user choices | AskUserQuestion options array | Structured input, "Other" fallback |
| Wizard tabs | Fake headers in text | AskUserQuestion header field | Native tab interface |
| Argument validation | Manual regex/parsing | Options with descriptions | Pre-validated choices |

**Key insight:** AskUserQuestion was specifically designed for this use case. The tabbed interface, option descriptions, and "Other" fallback handle edge cases that would be tedious to implement manually.

## Common Pitfalls

### Pitfall 1: AskUserQuestion in Forked Context
**What goes wrong:** Wizard questions never appear, tool fails silently
**Why it happens:** Subagents cannot use interactive tools
**How to avoid:** Run wizard BEFORE fork, or remove fork
**Warning signs:** Skill invokes but jumps straight to reading without collecting input

### Pitfall 2: Too Many Questions Per Call
**What goes wrong:** Schema validation fails
**Why it happens:** AskUserQuestion allows max 4 questions per invocation
**How to avoid:** Limit to 3 questions (question, spread, mode), or use multiple calls
**Warning signs:** Tool invocation errors

### Pitfall 3: Options Without "Other" Context
**What goes wrong:** User feels trapped by limited choices
**Why it happens:** Forgetting users can always select "Other" for free text
**How to avoid:** Design options as common cases, not exhaustive list
**Warning signs:** User complaints about missing options

### Pitfall 4: Header Too Long
**What goes wrong:** UI truncation or validation error
**Why it happens:** Header max is 12 characters
**How to avoid:** Use abbreviations: "Question", "Spread", "Mode"
**Warning signs:** Headers cut off in TUI

### Pitfall 5: Not Instructing Claude Explicitly
**What goes wrong:** Claude treats wizard as optional or skips it
**Why it happens:** Skill instructions too vague
**How to avoid:** Use explicit language: "ALWAYS use AskUserQuestion to collect..." or "Before performing reading, you MUST gather..."
**Warning signs:** Inconsistent behavior, sometimes wizard, sometimes inline

## Code Examples

### Example 1: Skill Prompting AskUserQuestion

From the prompt-improver skill (verified working pattern):

```markdown
### Phase 3: Get Clarification

Use the AskUserQuestion tool to present your research-grounded questions.

**AskUserQuestion Format:**
- question: Clear, specific question ending with ?
- header: Short label (max 12 chars) for UI display
- multiSelect: false (unless choices aren't mutually exclusive)
- options: Array of 2-4 specific choices from research
  - label: Concise choice text (1-5 words)
  - description: Context about this option (trade-offs, implications)

**Important:** Always include multiSelect field (true/false).
```

Source: [severity1/claude-code-prompt-improver](https://github.com/severity1/claude-code-prompt-improver)

### Example 2: Multi-Round Interview Pattern

From the feature-interview skill:

```markdown
### Phase 2: Deep Interview

Use AskUserQuestion repeatedly to explore the feature from multiple angles.
**Do not ask obvious questions.** Instead, ask questions that:

- Reveal hidden assumptions
- Expose edge cases the user hasn't considered
- Uncover tradeoffs they'll need to make

...

After gathering enough information (typically 5-10 rounds of questions), summarize...
```

Source: [neonwatty/claude-skills](https://github.com/neonwatty/claude-skills)

### Example 3: Proposed Tarot Wizard Questions

```markdown
Use AskUserQuestion to collect reading parameters:

Question 1:
- question: "What question or situation would you like insight on?"
- header: "Question"
- multiSelect: false
- options:
  - label: "General guidance"
    description: "No specific question - seeking general insight for today"
  - label: "Decision I'm facing"
    description: "Help thinking through a choice or crossroads"
  - label: "Situation I'm processing"
    description: "Understanding something that happened or is happening"

Question 2:
- question: "Which spread would you like for this reading?"
- header: "Spread"
- multiSelect: false
- options:
  - label: "Single card (Recommended)"
    description: "One card focus - quick insight, clear message"
  - label: "Three card"
    description: "Past/Present/Future or Situation/Action/Outcome"
  - label: "Celtic Cross"
    description: "Full 10-card spread for deep exploration"

Question 3:
- question: "How should cards be drawn?"
- header: "Mode"
- multiSelect: false
- options:
  - label: "Digital (Recommended)"
    description: "Random card selection - immediate reading"
  - label: "Physical deck"
    description: "You'll draw and enter the card(s) yourself"
```

### Example 4: Capturing User Selections

After AskUserQuestion returns, Claude has access to user selections. The skill should instruct:

```markdown
After collecting all three inputs from the wizard:
- **Question context**: Use for interpreting card meaning
- **Spread**: Determines how many cards to draw and positions
- **Mode**: Digital triggers random draw, Physical prompts for card input

Proceed to perform the reading with these parameters.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline args (`/tarot "question"`) | Wizard with AskUserQuestion | v2.0.21+ | Guided input, better UX |
| Conversation Q&A | Structured tabs/options | v2.0.21+ | Consistent UI, validated input |
| Always fork context | Conditional fork | Ongoing | Wizard must run pre-fork |

**Current best practice:** Skills that need structured input should use AskUserQuestion for collection, then process with collected parameters.

## Open Questions

Things that couldn't be fully resolved:

1. **Multiple AskUserQuestion calls vs. single call with 3 questions**
   - What we know: Single call supports up to 4 questions
   - What's unclear: Whether 3 questions in one call is better UX than sequential
   - Recommendation: Try single call first (fewer interactions)

2. **$ARGUMENTS handling after wizard**
   - What we know: $ARGUMENTS captures inline args on invocation
   - What's unclear: How to cleanly pass wizard outputs to reading logic
   - Recommendation: Wizard collects, reading logic uses captured values directly (no $ARGUMENTS needed for wizard flow)

3. **Fallback for inline args**
   - What we know: Current skill accepts `/tarot "question" --voice grounded`
   - What's unclear: Whether to preserve backward compatibility
   - Recommendation: Wizard replaces inline args per requirements. Consider deprecation notice if inline args detected.

## Sources

### Primary (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) - Official skill structure
- [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents) - Subagent limitations
- [Piebald-AI system prompts](https://github.com/Piebald-AI/claude-code-system-prompts) - AskUserQuestion tool description

### Secondary (MEDIUM confidence)
- [neonwatty/claude-skills feature-interview](https://github.com/neonwatty/claude-skills) - Working multi-round pattern
- [severity1/claude-code-prompt-improver](https://github.com/severity1/claude-code-prompt-improver) - AskUserQuestion format example
- [GitHub Issue #12890](https://github.com/anthropics/claude-code/issues/12890) - AskUserQuestion subagent limitation confirmed

### Tertiary (LOW confidence)
- Community blog posts on AskUserQuestion - General patterns
- WebSearch results - Ecosystem understanding

## Metadata

**Confidence breakdown:**
- AskUserQuestion schema: HIGH - Official tool description verified
- Subagent limitations: HIGH - Official docs + GitHub issues confirm
- Skill prompt patterns: HIGH - Working examples from active repos
- Architecture recommendations: MEDIUM - Based on constraints analysis

**Research date:** 2026-01-22
**Valid until:** 60 days (stable Claude Code features)
