# Phase 18: Wizard Enhancement - Research

**Researched:** 2026-01-26
**Domain:** Wizard UX / Fuzzy String Matching / Configuration State
**Confidence:** HIGH

## Summary

This phase extends the tarot skill wizard to support both Major Arcana (22 cards) and Full 78-card deck selection, with enhanced fuzzy matching for physical mode to handle all Minor Arcana input variations. The research investigates three core domains: (1) wizard flow patterns for adding steps while maintaining backwards compatibility, (2) fuzzy string matching algorithms for robust card name parsing, and (3) card pool management for random draw with different deck sizes.

The standard approach for wizard enhancement is to insert the new deck selection step after spread selection but before mode selection, as this creates a logical flow where structural choices (question → spread → deck) precede execution choices (mode). For fuzzy matching, the established pattern is normalization-first matching with progressive fallback: exact match → common variants → Levenshtein distance for typos. Card pool management uses conditional range selection in the shuf command based on deck choice.

The key architectural insight is that this phase builds on the existing lazy loading pattern from Phase 16: the card index must expand to 78 cards, but full card meanings remain in separate suit files loaded on-demand. The deck selection acts as a filter on the draw range, not on what card files exist.

**Primary recommendation:** Add deck selection as Question 2.5 (between spread and mode), implement normalization-based fuzzy matching with bash parameter expansion for case-insensitivity, and use deck choice to set shuf range (0-21 for Major, 0-77 for Full).

## Standard Stack

This phase extends existing skill architecture - no external libraries required.

### Core Components

| Component | Format | Purpose | Why Standard |
|-----------|--------|---------|--------------|
| Wizard flow (AskUserQuestion) | Skill instruction | Interactive parameter collection | Built-in Claude Code pattern for user input |
| Bash parameter expansion | Shell built-in | Case-insensitive string normalization | Native bash feature, zero dependencies |
| shuf command | GNU coreutils | Random card selection with range | Already used in skill (Phase 1-16) |
| Card index table | Markdown table in SKILL.md | 78-card lookup (expanded from 22) | Established pattern from Phase 16 |

### Supporting Patterns

| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| Progressive fallback matching | Handle input variations and typos | Physical mode card entry validation |
| State passing through wizard | Deck choice affects downstream steps | Between wizard questions and draw execution |
| Conditional command construction | Different shuf ranges per deck | Mode dispatch section |

### Implementation Approach

**No new dependencies:** All functionality uses existing bash built-ins and skill patterns.

**Backwards compatibility:** Major-only as default selection preserves existing behavior for users who don't change settings.

## Architecture Patterns

### Recommended Wizard Flow

```
Question 1: What question/situation? (existing)
Question 2: Which spread? (existing)
Question 2.5: Which deck? (NEW)
  - "Major Arcana only (22 cards)" [DEFAULT]
  - "Full deck (78 cards)"
Question 3: Digital or physical mode? (existing)
```

**Why this order:** Deck selection affects card pool for both digital (shuf range) and physical (validation rules), so it must come before mode selection. Placing after spread selection creates logical flow: what you're asking → how many positions → which cards are available → how to draw them.

### Pattern 1: Deck Selection State Management

**What:** Store deck choice from wizard, pass to draw logic to set card pool.

**When to use:** After Question 2.5 completes, before Mode Dispatch section.

**Example:**

```markdown
After collecting wizard responses:
- User's question/context: Use for interpretation
- Spread selection: Determines position count
- Deck selection: Determines card pool (0-21 or 0-77)
- Mode selection: Digital random vs physical entry

Proceed to perform the reading using collected parameters.
```

**Source:** Wizard design pattern - state flows forward through steps.

### Pattern 2: Fuzzy String Matching with Normalization

**What:** Progressive matching strategy that handles variations, abbreviations, and typos.

**Implementation stages (apply in order):**

1. **Normalize input:** Convert to lowercase, strip "the " prefix, trim whitespace
2. **Exact match:** Match against normalized canonical names
3. **Common variants:** Handle abbreviations and alternative forms
4. **Typo tolerance:** Levenshtein distance <= 2 for suggestion with confirmation

**Example for Minor Arcana:**

```bash
# Normalization (bash parameter expansion)
input_lower="${user_input,,}"  # Convert to lowercase
input_clean="${input_lower#the }"  # Strip "the " prefix

# Match patterns (conceptual - actual implementation in SKILL.md prose)
Match "3 of cups" OR "three of cups" OR "III cups" OR "3 cups" → "Three of Cups"
Match "queen cups" OR "Q cups" OR "queen of cups" → "Queen of Cups"
Match "ace wands" OR "A wands" OR "ace of wands" → "Ace of Wands"
```

**Source:** User decisions in CONTEXT.md specify required variations.

### Pattern 3: Conditional Card Pool Selection

**What:** Use deck choice to determine shuf command range.

**When to use:** Mode Dispatch section, digital mode path.

**Example:**

```markdown
**Digital Mode - Card Selection:**

Based on deck choice from wizard:

- **Major Arcana only:** `!shuf -i 0-21 -n [count]`
- **Full deck (78 cards):** `!shuf -i 0-77 -n [count]`

Where [count] is determined by spread selection (1 for single card, 3 for three-card spread, etc.).
```

**Source:** Existing digital mode pattern, extended with conditional range.

### Pattern 4: Expanded Card Index Structure

**What:** 78-card index table with Major (0-21) + Wands (22-35) + Cups (36-49) + Swords (50-63) + Pentacles (64-77).

**Format:**

```markdown
| # | Name | Suit | Keywords |
|---|------|------|----------|
| 0 | The Fool | Major | New beginnings, leap of faith... |
| 1 | The Magician | Major | Manifestation, skill... |
...
| 21 | The World | Major | Completion, integration... |
| 22 | Ace of Wands | Wands | Creative spark, raw potential... |
| 23 | Two of Wands | Wands | Planning, bold vision... |
...
| 35 | King of Wands | Wands | Visionary leader, bold... |
| 36 | Ace of Cups | Cups | New emotional beginning... |
...
| 77 | King of Pentacles | Pentacles | Mastery of material world... |
```

**Source:** Standard 78-card tarot structure + Phase 16 index pattern.

### Pattern 5: Suit-Based File Mapping

**What:** Map card numbers to suit files for lazy loading.

**Logic:**

- Cards 0-21 → `cards/major-arcana.md`
- Cards 22-35 → `cards/wands.md`
- Cards 36-49 → `cards/cups.md`
- Cards 50-63 → `cards/swords.md`
- Cards 64-77 → `cards/pentacles.md`

**When to use:** After card draw/entry, before reading card files.

**Example instruction:**

```markdown
**Determine suit file(s) needed:**
- If card number 0-21: Read cards/major-arcana.md
- If card number 22-35: Read cards/wands.md
- If card number 36-49: Read cards/cups.md
- If card number 50-63: Read cards/swords.md
- If card number 64-77: Read cards/pentacles.md
```

**Source:** Phase 16 architecture + standard tarot suit structure.

### Anti-Patterns to Avoid

- **Loading all 78 card meanings upfront:** Violates lazy loading principle. Only read files for drawn cards.
- **Separate matching logic per suit:** Unified matching strategy applies to all cards, just with suit-specific patterns.
- **Hardcoding card count in multiple places:** Use deck choice as single source of truth for range.
- **Skipping normalization:** Case and whitespace variations will break matching without consistent normalization.
- **Changing default to Full deck:** Breaking change for existing users - Major-only must remain default.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Levenshtein distance calculation | Custom bash implementation | Conceptual description + prose matching | Bash is not suited for complex algorithms; instruction-based matching is clearer for Claude |
| Complex regex for card parsing | Multi-pattern regex | Normalized progressive fallback | Easier to maintain, debug, and extend |
| State management between wizard steps | Global variables in shell | Prose instruction for state passing | Skill instructions describe flow; Claude manages state naturally |
| Card number validation | Range checking logic | Lookup table + prose validation | Card index serves as authoritative source |

**Key insight:** SKILL.md is instructions for Claude, not executable code. Write clear prose describing matching logic rather than attempting to implement algorithms in bash.

## Common Pitfalls

### Pitfall 1: Case-Sensitivity in Card Matching

**What goes wrong:** User enters "three of cups" but matching fails because code expects "Three of Cups".

**Why it happens:** String comparison without normalization treats different cases as different strings.

**How to avoid:** Use bash parameter expansion `${input,,}` to convert all input to lowercase before matching. Normalize both user input AND canonical names to lowercase for comparison.

**Warning signs:** Physical mode rejects valid card names with different capitalization.

### Pitfall 2: Ambiguous Abbreviations

**What goes wrong:** User enters "3 cups" which could mean "Three of Cups" but parser can't determine this.

**Why it happens:** Matching logic doesn't handle "of" being optional.

**How to avoid:** User's CONTEXT.md decisions specify: accept "3 cups" as valid for "Three of Cups". Implement patterns that handle both "3 of cups" and "3 cups" forms. For numbered pip cards (1-10), both forms are valid.

**Warning signs:** Users forced to type full "X of [Suit]" form when abbreviation is clear.

### Pitfall 3: Wizard Flow Breaks Existing Behavior

**What goes wrong:** Adding new deck selection step changes default behavior, breaking backwards compatibility.

**Why it happens:** New question defaults to Full deck, changing existing Major-only behavior.

**How to avoid:** Default selection MUST be "Major Arcana only (22 cards)" with label showing it as default/recommended. Existing behavior (Major only) should be preserved unless user explicitly changes.

**Warning signs:** Unexpected Minor Arcana cards appear in readings when users don't change settings.

### Pitfall 4: Inconsistent Card Index Numbering

**What goes wrong:** Card files use one numbering scheme, but index table uses different numbers.

**Why it happens:** Mismatch between suit file card numbers and index table entries.

**How to avoid:** Use single authoritative numbering: 0-21 Major, 22-35 Wands, 36-49 Cups, 50-63 Swords, 64-77 Pentacles. Each suit file should reference these numbers consistently. Card file headers should match: "## Ace of Wands" corresponds to index entry "22 | Ace of Wands | Wands".

**Warning signs:** Reading wrong card after draw, or "card not found" errors.

### Pitfall 5: Over-Engineering Fuzzy Matching

**What goes wrong:** Complex Levenshtein implementation in bash becomes unmaintainable.

**Why it happens:** Treating SKILL.md as code to execute rather than instructions for Claude.

**How to avoid:** Write clear prose describing matching strategy. Claude understands "match with minor typo tolerance" without implementing Levenshtein algorithm. For typos: describe behavior as "if no exact match, suggest closest match with 'Did you mean X?' confirmation."

**Warning signs:** Dozens of lines of bash string manipulation in matching logic.

### Pitfall 6: Forgetting Court Card Variations

**What goes wrong:** User enters "Q cups" but matching fails because only "Queen of Cups" is recognized.

**Why it happens:** Court card abbreviations not included in matching patterns.

**How to avoid:** User's CONTEXT.md specifies: court cards accept shortened forms. Implement patterns: "queen cups", "Q cups", "queen of cups" all map to "Queen of Cups". Apply to all court cards (Page/P, Knight/Kn, Queen/Q, King/K).

**Warning signs:** Physical mode requires full court card names, rejecting natural abbreviations.

## Code Examples

### Bash String Normalization Pattern

```bash
# Case-insensitive comparison using parameter expansion
user_input="THREE OF CUPS"
normalized="${user_input,,}"  # Convert to lowercase: "three of cups"

# Strip "the " prefix for Major Arcana
user_input="the fool"
cleaned="${user_input#the }"  # Result: "fool"

# Combined normalization
normalize_card_input() {
  local input="$1"
  input="${input,,}"           # Lowercase
  input="${input#the }"        # Strip "the " prefix
  echo "$input" | xargs        # Trim whitespace
}
```

**Source:** [Bash parameter expansion](https://bashcommands.com/bash-case-insensitive-compare) - standard shell feature for string manipulation.

### Conceptual Matching Strategy (Prose for SKILL.md)

```markdown
**match_card function logic:**

Input: User-typed card name or number
Output: Card number (0-77) or "no match"

Matching strategy (apply in order):

1. **Normalize input:**
   - Convert to lowercase
   - Strip leading "the " prefix (e.g., "the fool" → "fool")
   - Trim whitespace

2. **Exact match against card names:**
   - Major Arcana: Match normalized input against "fool", "magician", "high priestess", etc.
   - Minor Arcana: Match normalized input against full card names

3. **Common variants:**
   - Numbered cards: "3 of cups", "three of cups", "III cups", "3 cups", "three cups" all match "Three of Cups"
   - Court cards: "queen cups", "Q cups", "queen of cups" all match "Queen of Cups"
   - Major Arcana: "wheel" matches "Wheel of Fortune", "hanged" matches "Hanged Man"

4. **Numeric input:**
   - If input is a number, validate it's in range:
     * Major-only mode: 0-21
     * Full deck mode: 0-77
   - Convert directly to card number

5. **Typo handling (no exact match):**
   - If no match found, suggest closest match: "Did you mean 'Three of Cups'?"
   - Wait for user confirmation (yes/no)
   - If yes: use suggested card
   - If no: re-prompt for input

6. **No match:**
   - Gentle retry: "I don't recognize that card. Try the card's name or number."
```

**Source:** User decisions in CONTEXT.md + Phase 16 card matching pattern extended to 78 cards.

### Conditional Draw Command Pattern

```markdown
## Mode Dispatch

**Digital Mode (user selected "Digital (Recommended)"):**

Based on deck choice from wizard Question 2.5:

- **If deck is "Major Arcana only":**
  - Single card: `!shuf -i 0-21 -n 1`
  - Multi-card: `!shuf -i 0-21 -n [position_count]`

- **If deck is "Full deck (78 cards)":**
  - Single card: `!shuf -i 0-77 -n 1`
  - Multi-card: `!shuf -i 0-77 -n [position_count]`

Proceed directly to card identification and file loading.
```

**Source:** Existing digital mode pattern (Phase 1-16) + conditional execution based on state.

### Card Index Entry Format (Minor Arcana)

```markdown
| # | Name | Suit | Keywords |
|---|------|------|----------|
| 22 | Ace of Wands | Wands | Creative spark, raw potential, inspired beginning |
| 23 | Two of Wands | Wands | Planning, bold vision, choosing direction |
| 24 | Three of Wands | Wands | Expansion, early success, waiting for ships |
| 25 | Four of Wands | Wands | Celebration, stability, joyful milestone |
| 26 | Five of Wands | Wands | Competition, creative conflict, testing |
| 27 | Six of Wands | Wands | Victory, public recognition, triumph |
| 28 | Seven of Wands | Wands | Defending position, standing ground |
| 29 | Eight of Wands | Wands | Swift action, momentum, rapid progress |
| 30 | Nine of Wands | Wands | Resilience, battle-weariness, persistence |
| 31 | Ten of Wands | Wands | Burden, responsibility, overwhelming success |
| 32 | Page of Wands | Wands | Enthusiastic exploration, creative curiosity |
| 33 | Knight of Wands | Wands | Passionate pursuit, bold action, adventure |
| 34 | Queen of Wands | Wands | Confident creativity, magnetic presence |
| 35 | King of Wands | Wands | Visionary leadership, bold enterprise |
```

**Source:** Standard tarot structure + existing keyword pattern from Phase 16 Major Arcana index.

### Physical Mode Validation with Suggestions

```markdown
**Input Validation Loop:**

For each card entry:

1. **Normalize and match:**
   - Apply normalization (lowercase, strip "the ", trim)
   - Try exact match against card names
   - Try common variants (see match_card logic)
   - Try numeric input (validate range)

2. **If match found:**
   - Confirm: "[Card Name] - continuing..."
   - Check for duplicate (multi-card spreads only)
   - If duplicate: "The [Card Name] is already in your spread. Please draw another card."

3. **If no exact match but close match found:**
   - Suggest: "Did you mean '[Closest Match Card Name]'? (yes/no)"
   - If yes: Use suggested card (go to step 2)
   - If no: Re-prompt for input

4. **If no match at all:**
   - Gentle retry: "I don't recognize that card. Try the card's name (like 'Three of Cups' or 'Queen of Wands') or its number (0-77 for full deck, 0-21 for Major Arcana only)"
   - Accept next input and re-validate
```

**Source:** Phase 16 physical mode validation + user decisions on typo handling.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Major Arcana only (22 cards) | Optional Full 78-card deck | Phase 18 (2026-01) | Supports full tarot experience |
| Exact name matching required | Fuzzy matching with variations | Phase 18 (2026-01) | Natural input in physical mode |
| Basic card name parsing | Progressive fallback with typo tolerance | Phase 18 (2026-01) | Robust to user input variations |
| Fixed wizard flow (3 questions) | Extensible wizard with state passing | Phase 18 (2026-01) | Supports feature additions |

**Current best practices (2026):**
- Wizard flows support progressive disclosure with conditional steps
- String matching uses normalization-first strategy for robustness
- CLI tools maintain backwards compatibility via sensible defaults
- Configuration state flows forward through wizard steps

**Deprecated/outdated:**
- Rigid wizard flows that can't accommodate new steps gracefully
- Case-sensitive string matching in user-facing tools
- Breaking changes to defaults without migration path

## Open Questions

### 1. Order of Suits in 78-Card Numbering

**What we know:** Standard tarot has 4 suits (Wands, Cups, Swords, Pentacles), each with 14 cards. Order varies by reader/tradition.

**What's unclear:** Whether suit order matters for user experience or should match a particular tradition.

**Recommendation:** Use alphabetical order by element correspondence (Fire/Wands → Water/Cups → Air/Swords → Earth/Pentacles), resulting in numbering: Wands 22-35, Cups 36-49, Swords 50-63, Pentacles 64-77. This is intuitive and consistent. Suit order doesn't affect reading quality, only internal organization.

### 2. Default Deck Selection Presentation

**What we know:** Backwards compatibility requires Major-only as default. User has discretion over how options are worded.

**What's unclear:** Whether to emphasize Major-only as "beginner-friendly" vs. Full deck as "traditional complete experience."

**Recommendation:** Present neutrally with usage guidance:
- "Major Arcana only (22 cards) - Focused archetypal readings" [DEFAULT]
- "Full deck (78 cards) - Complete tarot experience with all suits"

This respects both approaches without implying one is "better."

### 3. Handling Duplicate Cards in Physical Mode with Full Deck

**What we know:** Phase 16 prevents duplicates in multi-card spreads by tracking entered cards.

**What's unclear:** With 78 cards vs. 22, probability of accidental duplicates is much lower. Should validation remain the same?

**Recommendation:** Keep duplicate checking for consistency. Even with 78 cards, users might accidentally enter same card twice, and validation prevents confusion. No added complexity since logic already exists.

### 4. Court Card Naming in Different Decks

**What we know:** Some decks rename court cards (Page/Princess, Knight/Prince, etc.). User decisions specify standard names.

**What's unclear:** Whether to support alternative court card names from popular non-standard decks.

**Recommendation:** Support only traditional names (Page, Knight, Queen, King) for Phase 18. Alternative naming systems could be future enhancement if users request. Keep scope focused on variations of standard names.

### 5. Roman Numeral Support for Minor Arcana

**What we know:** User decisions specify "III cups" as valid for Major Arcana (The Empress).

**What's unclear:** Whether Roman numerals should work for Minor Arcana pip cards (I-X).

**Recommendation:** Support Roman numerals for Minor Arcana pip cards (I-X maps to 1-10, e.g., "III cups" → "Three of Cups"). Consistent with Major Arcana pattern and some physical decks use Roman numerals on pip cards.

## Sources

### Primary (HIGH confidence)

- User's CONTEXT.md - Locked decisions on fuzzy matching requirements, input variations, Claude's discretion areas
- Existing SKILL.md - Current wizard flow (Questions 1-3), card matching functions, mode dispatch patterns
- Phase 16 RESEARCH.md - Established architecture patterns for card index, lazy loading, file structure
- Card files (major-arcana.md, wands.md, cups.md, swords.md, pentacles.md) - Current 78-card content structure

### Secondary (MEDIUM confidence)

- [Bash String Comparison Best Practices](https://bashcommands.com/bash-case-insensitive-compare) - Parameter expansion for case-insensitive matching
- [Bash String Equality](https://labex.io/tutorials/shell-bash-string-equality-391858) - String normalization techniques
- [Wizard Design Pattern (Nielsen Norman Group)](https://www.nngroup.com/articles/wizards/) - UX guidelines for multi-step wizards
- [PatternFly Wizard Guidelines](https://www.patternfly.org/components/wizard/design-guidelines/) - Progressive wizard design patterns
- [Standard 78-Card Tarot Structure](https://karmaandtide.com/tarot/beginner-guide/78-tarot-cards-explained) - Canonical deck composition
- [Minor Arcana Wikipedia](https://en.wikipedia.org/wiki/Minor_Arcana) - Suit structure and naming conventions
- [Tarot Court Cards Alternative Names](https://littleredtarot.com/beyond-kings-queens-renaming-tarot-court-cards/) - Naming variations across decks

### Tertiary (LOW confidence)

- WebSearch results on fuzzy matching algorithms (fzf, agrep, Levenshtein) - Marked for validation; conceptual guidance only
- WebSearch results on CLI UX best practices - General principles, not skill-specific
- WebSearch results on string normalization security - OWASP guidance may be overkill for tarot card matching

## Metadata

**Confidence breakdown:**
- Wizard flow patterns: HIGH - Based on existing skill structure + standard wizard UX patterns
- Fuzzy matching strategy: HIGH - User decisions in CONTEXT.md + bash built-in capabilities
- Card pool management: HIGH - Straightforward conditional logic on existing shuf pattern
- 78-card numbering scheme: HIGH - Standard tarot structure + Phase 16 index pattern
- Backwards compatibility: HIGH - Default selection preserves existing behavior

**Research date:** 2026-01-26
**Valid until:** 90 days (stable skill architecture, bash features unlikely to change)
