# Phase 16: Architecture Refactor - Research

**Researched:** 2026-01-25
**Domain:** Claude Code Skills / Progressive Disclosure / Lazy Loading
**Confidence:** HIGH

## Summary

This phase refactors the monolithic 842-line SKILL.md into a lean orchestration layer plus separate card data files. The research investigates how Claude Code skills support progressive disclosure (lazy loading) of external data files, and the cleanest pattern for instructing Claude to Read specific card files after cards are drawn.

The established pattern is clear: skills can reference external markdown files via relative links in SKILL.md, and Claude loads these files on-demand using the Read tool. This "index + fetch" architecture is explicitly supported and recommended by Anthropic's skill design guidelines. The pattern naturally fits our requirements: SKILL.md contains a card index (name, suit, keywords), and full card meanings live in suit-based files that Claude reads after card selection.

The key insight is that Claude decides when to read referenced files based on instructions in SKILL.md. We can instruct Claude to "Read the appropriate card file after drawing cards" and it will use the Read tool to fetch `major-arcana.md`, `wands.md`, etc. as needed.

**Primary recommendation:** Use markdown links in SKILL.md to reference card data files (e.g., `[Major Arcana cards](cards/major-arcana.md)`), with explicit instructions telling Claude when and how to read these files after card selection.

## Standard Stack

This phase doesn't require external libraries - it's a refactoring of markdown files within the existing Claude Code skills framework.

### Core Components

| Component | Format | Purpose | Why This Way |
|-----------|--------|---------|--------------|
| SKILL.md | Markdown | Orchestration layer (wizard, logic, card index) | Required entry point for skills |
| Card data files | Markdown | Full card meanings (themes, situations, shadows, symbols) | Progressive disclosure pattern |
| Card index | Table in SKILL.md | Lookup for name, suit, keywords | Enables Claude to identify cards without loading full meanings |

### File Structure

| File | Purpose | Estimated Size |
|------|---------|----------------|
| SKILL.md | Wizard flow, voice system, interpretation logic, card index | ~500 lines |
| cards/major-arcana.md | 22 Major Arcana full meanings | ~130 lines |
| cards/wands.md | 14 Wands full meanings | ~100 lines |
| cards/cups.md | 14 Cups full meanings | ~100 lines |
| cards/swords.md | 14 Swords full meanings | ~100 lines |
| cards/pentacles.md | 14 Pentacles full meanings | ~100 lines |

## Architecture Patterns

### Recommended Project Structure

```
skills/tarot/
├── SKILL.md                    # Orchestration (wizard, logic, index)
└── cards/                      # Card data (loaded on-demand)
    ├── major-arcana.md         # 22 Major Arcana cards
    ├── wands.md                # 14 Wands cards (future)
    ├── cups.md                 # 14 Cups cards (future)
    ├── swords.md               # 14 Swords cards (future)
    └── pentacles.md            # 14 Pentacles cards (future)
```

### Pattern 1: Card Index in SKILL.md

**What:** A compact table mapping card numbers to names, suits, and keywords. Claude uses this to identify drawn cards without loading full meanings.

**When to use:** After cards are drawn (digital or physical mode), before interpretation.

**Example:**

```markdown
## Card Index

| # | Name | Suit | Keywords |
|---|------|------|----------|
| 0 | The Fool | Major | New beginnings, leap of faith, innocence |
| 1 | The Magician | Major | Manifestation, skill, channeling power |
| 2 | The High Priestess | Major | Intuition, mystery, hidden knowledge |
...
| 21 | The World | Major | Completion, integration, wholeness |
```

**Source:** Claude Code Skills documentation - skills can have any content structure that helps Claude accomplish tasks.

### Pattern 2: Explicit File Reference with Read Instructions

**What:** Markdown links to card files with clear instructions on when Claude should read them.

**When to use:** In the Reading Instructions section, after card drawing completes.

**Example:**

```markdown
## Card Data Files

Card meanings are stored in separate files by suit:
- [Major Arcana cards](cards/major-arcana.md) - The Fool through The World (0-21)
- [Wands cards](cards/wands.md) - Ace through King of Wands
- [Cups cards](cards/cups.md) - Ace through King of Cups
- [Swords cards](cards/swords.md) - Ace through King of Swords
- [Pentacles cards](cards/pentacles.md) - Ace through King of Pentacles

**Loading pattern:** After drawing cards, read ONLY the relevant card file(s) using the Read tool. For a single Major Arcana card, read only `cards/major-arcana.md`. For a three-card spread with cards from different suits, read only the files containing those specific suits.
```

**Source:** [Anthropic Skills Documentation](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) - progressive disclosure pattern.

### Pattern 3: Conditional Loading Instructions

**What:** Explicit prose instructing Claude on when and how to load card data.

**When to use:** In the Reading Instructions section.

**Example:**

```markdown
## After Card Selection

Once cards are drawn (via shuf or physical entry):

1. **Identify drawn cards** using the Card Index table above
2. **Determine which suit file(s)** contain the drawn cards
3. **Read the relevant file(s)** using the Read tool:
   - For Major Arcana cards: `Read cards/major-arcana.md`
   - For Wands: `Read cards/wands.md`
   - (etc.)
4. **Locate the specific card section** in the loaded file
5. **Proceed with interpretation** using the full card meaning
```

**Source:** [Claude Code Skills Docs](https://code.claude.com/docs/en/skills) - explicit instructions for Claude to follow.

### Anti-Patterns to Avoid

- **Loading all card files upfront:** Defeats the purpose of lazy loading. Only load files needed for drawn cards.
- **Embedding full meanings in index:** The index should be compact (keywords only), not duplicate the full card data.
- **Hardcoded absolute paths:** Use relative paths from SKILL.md location for portability.
- **Deep nesting:** Keep card files one level deep (cards/) for simplicity.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dynamic file loading | Custom shell scripts | Claude's built-in Read tool | Read tool is the standard way skills load external files |
| Card lookup | Complex parsing logic | Simple markdown table | Claude can read tables and extract data naturally |
| Suit detection | Regex/pattern matching | Explicit suit field in index | Clear data > clever parsing |

**Key insight:** Claude Code skills are designed for Claude to read markdown files. Don't over-engineer what the Read tool already does well.

## Common Pitfalls

### Pitfall 1: Forgetting to Update Index When Adding Cards

**What goes wrong:** New Minor Arcana cards get added to suit files but not to the card index in SKILL.md.
**Why it happens:** Index and data are in separate files, easy to update one without the other.
**How to avoid:** Create task explicitly: "Update card index in SKILL.md" after adding cards to suit files.
**Warning signs:** Physical mode can't match a card name, or Claude doesn't recognize a card number.

### Pitfall 2: Loading Wrong Suit File

**What goes wrong:** Claude reads wrong card file (e.g., reads wands.md when card is from Cups).
**Why it happens:** Instructions unclear about mapping cards to files.
**How to avoid:** Card index includes explicit suit column; instructions reference suit for file selection.
**Warning signs:** Interpretation uses wrong card meaning.

### Pitfall 3: Index Too Verbose

**What goes wrong:** Card index becomes bloated, defeating lazy loading benefit.
**Why it happens:** Temptation to add more data to index for "convenience."
**How to avoid:** Index has ONLY: number, name, suit, keywords (max 10 words). Full meanings stay in card files.
**Warning signs:** SKILL.md line count doesn't decrease significantly after refactor.

### Pitfall 4: Breaking Existing Card Matching

**What goes wrong:** Physical mode fuzzy matching stops working after refactor.
**Why it happens:** Card Matching Functions section references card data that moved.
**How to avoid:** Card matching uses card index (which stays in SKILL.md), not full meanings.
**Warning signs:** "I don't recognize that card" for valid card names.

### Pitfall 5: Relative Path Errors

**What goes wrong:** Read tool can't find card files.
**Why it happens:** Relative paths resolve from working directory, not SKILL.md location.
**How to avoid:** Skills documentation confirms relative paths work from skill directory. Test thoroughly.
**Warning signs:** "File not found" errors during reading.

## Code Examples

### Card Index Table Format

```markdown
## Card Index

Use this index to identify drawn cards. After drawing, read the appropriate card file for full meanings.

| # | Name | Suit | Keywords |
|---|------|------|----------|
| 0 | The Fool | Major | New beginnings, leap of faith, innocence, potential |
| 1 | The Magician | Major | Manifestation, skill, tools, channeling power |
| 2 | The High Priestess | Major | Intuition, mystery, hidden knowledge, receptivity |
| 3 | The Empress | Major | Abundance, nurturing, creativity, growth |
| 4 | The Emperor | Major | Structure, authority, leadership, boundaries |
| 5 | The Hierophant | Major | Tradition, teaching, spiritual authority, mentorship |
| 6 | The Lovers | Major | Choice, union, values, relationship |
| 7 | The Chariot | Major | Willpower, determination, victory, control |
| 8 | Strength | Major | Inner strength, compassion, gentle mastery, courage |
| 9 | The Hermit | Major | Solitude, inner guidance, wisdom, introspection |
| 10 | Wheel of Fortune | Major | Cycles, fate, change, turning points |
| 11 | Justice | Major | Fairness, truth, consequence, balance |
| 12 | The Hanged Man | Major | Surrender, new perspective, pause, sacrifice |
| 13 | Death | Major | Transformation, endings, release, transition |
| 14 | Temperance | Major | Balance, moderation, alchemy, patience |
| 15 | The Devil | Major | Bondage, materialism, shadow work, attachment |
| 16 | The Tower | Major | Sudden upheaval, revelation, liberation, crisis |
| 17 | The Star | Major | Hope, inspiration, healing, renewal |
| 18 | The Moon | Major | Illusion, intuition, fear, unconscious |
| 19 | The Sun | Major | Joy, clarity, vitality, success |
| 20 | Judgement | Major | Awakening, reckoning, resurrection, calling |
| 21 | The World | Major | Completion, integration, accomplishment, wholeness |
```

### Card Data File Format (major-arcana.md)

```markdown
# Major Arcana

Full card meanings for interpretation. Load this file after drawing Major Arcana cards.

## Card 0: The Fool

**Themes:** New beginnings, innocent faith, the leap into the unknown, pure potential

**Situations:** Starting something new, stepping into uncertainty, trusting the journey, embracing beginner's mind, taking a risk without all the answers

**Shadows:** Recklessness, naivety, ignoring practical concerns, foolishness disguised as faith, lack of preparation

**Symbols:** Cliff edge (threshold moment), white rose (purity of intention), small dog (instinct and loyal companionship), bundle on stick (carrying only what you need), mountains ahead (journey to come)

---

## Card 1: The Magician

**Themes:** Manifestation, skill, having all the tools you need, conscious creation, channeling power

...
```

### Read Instruction Pattern

```markdown
## Reading Instructions: Card Data Loading

After cards are drawn (digital mode) or entered (physical mode):

1. **Identify the drawn card(s)** by matching to the Card Index above
2. **Determine suit file(s) needed:**
   - Major Arcana (0-21): `cards/major-arcana.md`
   - Wands (future): `cards/wands.md`
   - Cups (future): `cards/cups.md`
   - Swords (future): `cards/swords.md`
   - Pentacles (future): `cards/pentacles.md`
3. **Read only the needed file(s)** - do not load all card files
4. **Find the specific card section** (e.g., "## Card 16: The Tower")
5. **Extract themes, situations, shadows, symbols** for interpretation
6. **Proceed with interpretation** using the full card meaning and voice system

Example: For a single card draw of The Tower (16), read `cards/major-arcana.md` and locate the "## Card 16: The Tower" section.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| All card data embedded in SKILL.md | Progressive disclosure via separate files | Claude Code skills system (2025) | Enables unbounded content without context bloat |
| Load everything at skill start | Lazy loading with Read tool | Agent Skills standard (2025) | Reduces initial context, faster skill loading |
| Monolithic skill files | Structured skill directories | Skills v2 release (2025) | Better organization, maintainability |

**Deprecated/outdated:**
- Single-file skills with embedded data: Still works but not recommended for large data sets
- Hardcoded paths: Always use relative paths from skill directory

## Open Questions

### 1. Working Directory for Relative Paths

**What we know:** Claude Code skills documentation shows relative paths in examples (e.g., `[FORMS.md](FORMS.md)`).

**What's unclear:** Whether Read tool resolves paths relative to SKILL.md location or current working directory.

**Recommendation:** Test with explicit instruction: "Read the file at `cards/major-arcana.md` relative to this skill's directory." If issues arise, use absolute path construction via shell command to find skill directory.

### 2. Card File Format for Efficient Lookup

**What we know:** Claude can read entire markdown files and locate sections by heading.

**What's unclear:** Whether there's a more efficient format (e.g., anchored links, line numbers) for jumping directly to specific cards.

**Recommendation:** Use standard markdown with clear headings (`## Card N: Name`). Claude handles section lookup naturally. Premature optimization not needed.

## Sources

### Primary (HIGH confidence)

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) - Official Anthropic docs on skill structure, supporting files, progressive disclosure
- [Agent Skills Engineering Blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) - Anthropic engineering post on skills architecture
- Existing SKILL.md in codebase - Current structure, card format, voice system

### Secondary (MEDIUM confidence)

- [SKILL.md Structure Deep Dive](https://skywork.ai/blog/ai-agent/claude-skills-skill-md-resources-runtime-loading/) - Third-party analysis of skill patterns
- [Claude Agent Skills Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/) - Community analysis of progressive disclosure

### Tertiary (LOW confidence)

- WebSearch results on lazy loading patterns - Various community discussions, marked for validation

## Metadata

**Confidence breakdown:**
- Architecture patterns: HIGH - Based on official Anthropic documentation and established skill design patterns
- File structure: HIGH - Follows documented skill directory conventions
- Pitfalls: MEDIUM - Based on general skill development patterns, some specific to this use case
- Read tool behavior: MEDIUM - Documented but path resolution specifics need testing

**Research date:** 2026-01-25
**Valid until:** 60 days (stable skill framework, unlikely to change)
