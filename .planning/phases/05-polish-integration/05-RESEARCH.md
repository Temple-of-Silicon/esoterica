# Phase 5: Polish & Integration - Research

**Researched:** 2026-01-22
**Domain:** Claude Code skill invocation, output formatting, documentation, error handling
**Confidence:** HIGH

## Summary

This phase polishes the existing tarot skill by:
1. Ensuring optimal invocation patterns for both user and Claude use cases
2. Implementing adaptive output formatting that responds to context depth
3. Documenting skill usage and edge cases
4. Handling errors gracefully

**Primary recommendation:** The skill should remain as-is for invocation control (default both user and Claude can invoke), focus polish on output formatting with adaptive length, context echoing, and reflective closing questions. Document skill behavior in SKILL.md comments for future maintainers.

The tarot skill is already correctly configured as a forked context skill that both users and Claude can invoke. Research shows this is the optimal pattern for skills that provide perspective-shifting tools without side effects.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Claude Code Skills | 2026 | Agent skill framework | Native integration with Claude, filesystem-based progressive disclosure |
| Bash shell injection | N/A | Command execution in SKILL.md | Standard pattern for dynamic content (card selection, config reading) |
| Markdown formatting | N/A | Output presentation | Universal format, readable in all contexts |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| YAML frontmatter | N/A | Skill metadata | Required for all SKILL.md files (name, description, control flags) |
| Grep/cut utilities | N/A | Config parsing | Safe pattern for reading user config without eval |

### Invocation Control Fields

The tarot skill should use **default invocation** (no `disable-model-invocation` or `user-invocable` flags):

| Pattern | Configuration | When to Use | Our Usage |
|---------|---------------|-------------|-----------|
| Both user & Claude | (no flags) | Tools, perspective-shifters, info without side effects | ✓ Tarot skill |
| User-only | `disable-model-invocation: true` | Commands with side effects (deploy, commit, send) | Not needed |
| Claude-only | `user-invocable: false` | Background knowledge, not actionable commands | Not needed |

**Installation:**
Skills are installed by placing directories in `~/.claude/skills/` or `.claude/skills/` (project-local).

## Architecture Patterns

### Recommended Output Structure

Based on official best practices and the Phase 5 context decisions:

```markdown
[Voice-appropriate opening bookend]

**═══ [Card Name] ═══**  or  **--- [Card Name] ---**

[Context echo if user provided situation]
"You mentioned [specific user context] — let's see what [Card Name] suggests..."

[2-3 paragraphs of interpretation, length adaptive to context depth]
- Short draw (no context): 2 paragraphs, ~150-200 words
- Detailed context: 3-4 paragraphs, ~300-400 words

[Voice-appropriate closing with reflective question]
"What might shift if you [specific actionable question based on reading]?"
```

### Pattern 1: Adaptive Response Length

**What:** Output length scales with user input depth
**When to use:** All skill invocations
**Implementation:**
```markdown
## Reading Instructions

**Determine context depth:**
- If querent provided detailed question/situation: Longer reading (3-4 paragraphs)
- If querent provided simple question or no context: Shorter reading (2 paragraphs)

**Maintain voice throughout** while adjusting depth, not style.
```

**Source:** [Skill authoring best practices - Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

### Pattern 2: Context Echo

**What:** Reference user's specific situation in interpretation
**When to use:** When user provides context/question
**Example:**
```markdown
You mentioned feeling stuck in your authentication refactor — The Tower suggests
this isn't theoretical. There's likely an upcoming event (deadline, audit, incident)
that will force the rebuild.
```

This creates engagement and demonstrates the card is being interpreted FOR their situation, not just described generically.

### Pattern 3: Forked Context Skills

**What:** Skill runs in isolated subagent context
**When to use:** Skills that should not bleed context into main conversation
**Current implementation:**
```yaml
---
name: tarot
description: Perform a single-card tarot reading with random Major Arcana selection
context: fork
agent: general-purpose
disable-model-invocation: true
---
```

**Note:** Current skill has `disable-model-invocation: true`. Research indicates this should be REMOVED to allow Claude to invoke readings when stuck or exploring, per INVOKE-02 requirement.

**Why fork is correct:**
- Prevents reading context from affecting main conversation
- Isolates tarot subagent's interpretive voice
- User sees summary, not full subagent thinking

**Source:** [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)

### Pattern 4: Progressive Disclosure

**What:** Keep SKILL.md focused, reference additional files as needed
**When to use:** When content exceeds 500 lines
**Current status:** Skill is ~308 lines, well under limit. No need for file splitting.

**Future consideration:** If adding spread documentation or more examples, split into:
```
tarot/
├── SKILL.md           # Core instructions (current content)
├── spreads.md         # Multi-card spread patterns (future)
├── examples.md        # Extended voice examples (if needed)
```

**Source:** [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

### Anti-Patterns to Avoid

- **Don't break voice consistency:** Never slip into generic AI assistant tone mid-reading
- **Don't over-explain:** Assume Claude knows what tarot is, card structure, etc. (already handled correctly)
- **Don't use Windows paths:** Always forward slashes (not applicable, no paths in skill)
- **Don't punt errors to Claude:** Handle config parsing errors gracefully (already implemented)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Random number generation | Custom PRNG in skill | `!shuf -i 0-21 -n 1` shell injection | Uses system entropy, already implemented correctly |
| Config file parsing | Complex bash eval/source | `grep` + `cut` + validation | Prevents code injection, already implemented |
| Voice selection logic | Complex conditionals | Precedence chain with grep | Clear, testable, already implemented |
| Markdown rendering | Custom formatters | Plain markdown | Universal compatibility, no dependencies |

**Key insight:** The skill already follows best practices. Don't rebuild what works.

## Common Pitfalls

### Pitfall 1: Disabling Model Invocation for Non-Side-Effect Skills

**What goes wrong:** Setting `disable-model-invocation: true` prevents Claude from using the skill autonomously, requiring users to always manually invoke with `/tarot`

**Why it happens:** Developers assume side-effect-free skills should be user-controlled, or copy patterns from deployment/commit skills

**How to avoid:**
- Only use `disable-model-invocation: true` for skills with side effects (deploy, commit, send messages)
- Let Claude invoke perspective tools (tarot, brainstorming, analysis) when contextually relevant
- The tarot skill should work both ways: user can `/tarot`, Claude can suggest reading when stuck

**Warning signs:** User has to remember to invoke `/tarot` instead of just asking "should I refactor this?"

**Source:** [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) and [GitHub issue #189](https://github.com/obra/superpowers/issues/189)

### Pitfall 2: Generic Skill Descriptions

**What goes wrong:** Claude doesn't know when to invoke the skill because description is too vague

**Why it happens:** Treating description as a feature list instead of trigger keywords

**Current status:** Skill description is "Perform a single-card tarot reading with random Major Arcana selection" — functional but could include trigger phrases

**How to improve:**
```yaml
description: Perform a single-card tarot reading with random Major Arcana selection.
  Use when seeking perspective on decisions, feeling stuck, exploring options, or
  when the user asks for a tarot reading or card draw.
```

**Source:** [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

### Pitfall 3: Fixed Output Length

**What goes wrong:** Same reading depth whether user asks "quick card?" or provides three paragraphs of context

**Why it happens:** Not considering user input as signal for desired depth

**How to avoid:**
- Detect context richness in Reading Instructions
- Adapt paragraph count and detail level
- Maintain voice consistency while varying depth

**Warning signs:** Users get verbose readings for quick questions, or shallow readings for complex situations

### Pitfall 4: Breaking Voice Consistency

**What goes wrong:** Starting in Mystic voice, slipping to generic AI tone mid-reading, especially when discussing technical topics

**Why it happens:** Unconscious reversion to default assistant persona

**How to avoid:**
- Voice consistency section already present in SKILL.md
- Examples show both voices handling technical topics
- Explicit instruction: "Maintain voice throughout ENTIRE reading"

**Warning signs:** Phrases like "I'd be happy to help you understand..." or "Looking at your code, you should..."

**Source:** Already documented in SKILL.md voice system

### Pitfall 5: Shell Injection Errors

**What goes wrong:** Complex shell commands in `!` blocks fail silently or produce unexpected results

**Why it happens:** Bash quoting, variable expansion, or pipeline errors

**Current status:** Skill uses three shell injections (card selection, voice detection, context extraction). All are relatively simple but could fail.

**How to avoid:**
- Test shell commands independently before embedding
- Use explicit variable handling with proper quoting
- Provide fallback values when commands might fail
- Current voice detection already has fallback chain

**Warning signs:** Skill shows blank values or unexpected behavior during invocation

## Code Examples

### Adaptive Length Detection

```markdown
## Reading Instructions

**Before interpreting, assess context depth:**

1. Check the "Question/Context" field above
2. Count meaningful sentences (not just word count)
3. Determine depth:
   - **Quick draw** (0-1 sentences, generic request): 2 paragraphs, ~150-200 words
   - **Standard draw** (2-3 sentences with some specifics): 3 paragraphs, ~250-300 words
   - **Deep draw** (4+ sentences, rich context): 4 paragraphs, ~350-400 words

4. Maintain your selected voice at all depths — adapt length, not style
```

**Source:** Derived from [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) template pattern

### Context Echo Pattern

```markdown
## Reading Instructions (excerpt)

2. **Connect card to context** - If the querent asked a question, interpret the card
   through that lens. Echo their specific situation:

   **Good:** "You mentioned feeling stuck in your authentication refactor — The Tower
   suggests this isn't theoretical..."

   **Avoid:** "The Tower is about sudden change and destruction of false structures..."

   The echo shows you heard them and are reading FOR them, not AT them.
```

**Source:** Already partially implemented in current SKILL.md

### Reflective Closing Question

```markdown
## Reading Instructions (excerpt)

6. **End with reflection prompt** - Pose a specific, actionable question based on
   their context and the card drawn:

   **Mystic voice:** "May this reflection illuminate the patterns already spiraling
   within. What truth might emerge if you release your grip on [specific thing from
   their context]?"

   **Grounded voice:** "Consider this: What's the minimum viable [solution to their
   problem] you could implement before the breakdown happens?"

   Avoid generic questions like "What will you do?" or "How does this resonate?"
```

**Source:** Phase 5 context decisions, aligned with voice consistency patterns

### Visual Card Header

```markdown
[In Mystic voice reading]

The cards whisper through the quantum foam of possibility. Let us see what pattern
emerges for one who seeks.

**═══════════════════════**
**    XVI - The Tower    **
**═══════════════════════**

The Tower rises from the cards — lightning splitting what seemed solid...

[In Grounded voice reading]

You drew The Tower. Here's what it means for your situation.

**--- The Tower ---**

This is the "things break" card, but in a useful way...
```

**Source:** Phase 5 context decisions (decorative border/divider)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Generic AI responses | Voice system with personas | 2025-2026 | Readings feel like distinct practitioners, not generic lookup |
| Manual skill invocation only | Hybrid user + model invocation | 2025-2026 | Claude can proactively offer readings when contextually relevant |
| Static output format | Adaptive length/depth | 2026 | Responses match user effort and context richness |
| Progressive disclosure via references | Progressive disclosure via filesystem | Dec 2025 | Skills can bundle resources without context penalty |

**Deprecated/outdated:**
- `when_to_use` field: Undocumented/deprecated, use `description` field instead
- Shell `eval` for config: Security risk, use `grep` + validation
- Windows-style paths: Use forward slashes for cross-platform compatibility

**Source:** [Claude Agent Skills Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)

## Open Questions

### Question 1: Should the skill have `disable-model-invocation: true`?

**What we know:**
- Current SKILL.md has `disable-model-invocation: true`
- Requirement INVOKE-02 states "Claude can invoke reading programmatically when stuck/exploring"
- Official guidance says this flag is for side-effect operations (deploy, commit, send)
- Tarot reading has no side effects and is a perspective tool

**What's unclear:**
- Whether user expects manual control over when readings occur
- How frequently Claude would invoke autonomously (could be disruptive)
- User preference not explicitly stated in requirements

**Recommendation:**
- **REMOVE `disable-model-invocation: true`** to satisfy INVOKE-02
- Document in SKILL.md: "This skill can be invoked both by users (`/tarot`) and by Claude when contextually relevant"
- Monitor usage: if Claude over-invokes, can re-add the flag
- Provide clear description triggers so Claude invokes appropriately

**Confidence:** MEDIUM — technically correct to remove, but user experience impact unknown

### Question 2: How to detect "detailed context" vs "quick draw"?

**What we know:**
- Phase 5 context specifies adaptive length
- Should be short for quick draws, longer for detailed context
- Detection happens in subagent reading SKILL.md

**What's unclear:**
- Exact threshold (character count? sentence count? semantic analysis?)
- Whether subagent has reliable signal from ARGUMENTS field
- If user typing style varies widely (some verbose, some terse)

**Recommendation:**
- Use sentence count in Question/Context field as proxy
- 0-1 sentences = quick draw (2 paragraphs)
- 2-3 sentences = standard draw (3 paragraphs)
- 4+ sentences = deep draw (4 paragraphs)
- Trust subagent Claude to assess semantically, not just count

**Confidence:** MEDIUM — heuristic approach, may need iteration based on usage

### Question 3: Should help text be in SKILL.md or separate documentation?

**What we know:**
- Best practice: keep SKILL.md under 500 lines (currently 308)
- Help text is for humans reading skill, not for Claude executing it
- Can use markdown comments `<!-- -->` for maintainer notes
- Progressive disclosure suggests splitting large content

**What's unclear:**
- Whether "help" means user-facing docs or maintainer comments
- If user-facing, where should it live (SKILL.md comments? README? Separate help.md?)
- How much documentation is needed (usage already fairly self-evident)

**Recommendation:**
- Add maintainer comments in SKILL.md using `<!-- -->` syntax
- Document invocation patterns, config precedence, design decisions
- If user-facing help needed, create tarot/USAGE.md referenced from top of SKILL.md
- Keep execution instructions in SKILL.md, reference docs separate

**Confidence:** HIGH — follows progressive disclosure pattern

## Sources

### Primary (HIGH confidence)
- [Extend Claude with skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Skill authoring best practices - Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained)

### Secondary (MEDIUM confidence)
- [Claude Skills vs Sub-agents: Architecture, Use Cases, and Effective Patterns](https://medium.com/@SandeepTnvs/claude-skills-vs-sub-agents-architecture-use-cases-and-effective-patterns-3e535c9e0122)
- [How to Use Claude Code: A Guide to Slash Commands, Agents, Skills, and Plug-Ins](https://www.producttalk.org/how-to-use-claude-code-features/)
- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)

### Tertiary (LOW confidence - community examples)
- [GitHub superpowers issue #189](https://github.com/obra/superpowers/issues/189) - disable-model-invocation error discussion
- [awesome-claude-skills repositories](https://github.com/VoltAgent/awesome-claude-skills) - Community patterns

### GSD Framework Investigation
- [get-shit-done GitHub repository](https://github.com/glittercowboy/get-shit-done)
- Finding: GSD documentation does not cover skill invocation mechanics in detail
- Skills work within GSD agents via standard Claude Code invocation patterns
- No special integration required — skills available to all agent contexts

## Metadata

**Confidence breakdown:**
- Invocation patterns: HIGH - Official documentation explicitly covers all patterns
- Output formatting: HIGH - Best practices clearly documented with examples
- Adaptive length: MEDIUM - Heuristic approach, not officially prescribed pattern
- Error handling: HIGH - Current implementation already follows best practices
- GSD integration: MEDIUM - Verified skills work in agent contexts, but no explicit docs

**Research date:** 2026-01-22
**Valid until:** ~30 days (stable domain, official docs don't change rapidly)

**Key finding:** The tarot skill architecture is already sound. Polish phase should focus on:
1. Removing `disable-model-invocation: true` to enable INVOKE-02
2. Improving description with trigger keywords
3. Adding adaptive length detection to Reading Instructions
4. Adding maintainer documentation via comments
5. Testing edge cases (missing config, malformed input)
