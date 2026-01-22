# Phase 7: Spread Options - Research

**Researched:** 2026-01-22
**Domain:** Multi-card tarot spread implementation with shell scripting, LLM-based position generation, and input validation
**Confidence:** HIGH

## Summary

Phase 7 implements four spread types for tarot readings: single card (existing behavior), 3-card preset (Situation/Action/Outcome), LLM-suggested (Claude generates contextual positions), and custom (user enters position names). The implementation leverages existing shell injection patterns established in Phase 1, extending the proven `shuf` randomness approach to support unique multi-card draws without replacement.

The core technical challenge is drawing multiple unique cards (like a physical deck) rather than independent random selections. Research confirms `shuf -i 0-21 -n COUNT` naturally provides unique selections without requiring additional deduplication logic, using the same `/dev/urandom` entropy source validated in Phase 1. This maps directly to physical tarot practice: once a card is drawn, it's removed from the deck for that reading.

For LLM-suggested spreads, the pattern is prompt-based: Claude receives the user's question and recent conversation context, generates exactly 3 position names, presents them for approval, and regenerates if rejected. This leverages Claude's contextual awareness within the skill execution context rather than requiring external LLM API calls.

Custom spread parsing follows standard Unix patterns: comma-separated input split with `tr`, whitespace trimmed with `xargs` or `sed`, validated for count (1-5 cards), and passed as position array to card selection flow.

**Primary recommendation:** Extend existing shell injection pattern (`!shuf -i 0-21 -n COUNT`) for unique card draws, use inline prompt instructions for LLM-suggested spread generation, and apply simple Unix text processing for custom spread validation.

## Standard Stack

The established tools for this domain:

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `shuf` | GNU coreutils 9.x | Unique random selection without replacement | Already validated in Phase 1, uses `/dev/urandom`, prevents duplicates naturally |
| `tr` | GNU coreutils | Split comma-separated input to lines | POSIX-standard, cross-platform, simple delimiter conversion |
| `xargs` | findutils | Trim whitespace from strings | Standard utility, handles leading/trailing spaces elegantly |
| `sed` | GNU sed 4.x+ | Pattern-based text transformation | Alternative trimming approach, more portable than `xargs` in some contexts |
| `grep -c` | GNU grep 3.x+ | Count non-empty lines | Validation of position count after parsing |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| `echo` + pipe | String processing pipeline | Combining tr/xargs/sed for parsing |
| `[ ]` test | Numeric comparison | Validating position count (1-5 range) |
| `while read` loop | Process parsed positions | Converting split text to actionable data |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `shuf -n COUNT` | Loop with duplicate checking | Loop is complex, error-prone; shuf guarantees uniqueness |
| `tr` + `xargs` | IFS + read -a array | IFS approach is shell-specific (bash vs zsh syntax differs); tr/xargs is portable |
| Inline Claude prompt | External LLM API call | External call adds latency and complexity; Claude is already executing the skill |
| Simple validation | JSON schema | JSON adds unnecessary complexity for 1-5 position names |

**Installation:**
```bash
# No installation needed - all tools are standard Unix utilities
# Available on all Unix-like systems (macOS, Linux)
# Already verified in Phase 1 research for shuf
```

## Architecture Patterns

### Recommended Flow Structure
```
User selects spread type in wizard
│
├─ Single card → Draw 1 card (existing: shuf -i 0-21 -n 1)
│
├─ Three-card preset → Use fixed positions ["Situation", "Action", "Outcome"]
│                      → Draw 3 unique cards (shuf -i 0-21 -n 3)
│
├─ LLM-suggested → Claude generates 3 positions based on user's question
│                → Show positions for approval
│                → If approved: draw 3 unique cards
│                → If rejected: regenerate positions (loop)
│
└─ Custom → User enters "Position1, Position2, Position3, ..."
          → Parse with tr + xargs
          → Validate count (1-5)
          → Draw N unique cards (shuf -i 0-21 -n N)
```

### Pattern 1: Unique Card Drawing (Core Mechanism)
**What:** Draw multiple cards without replacement using shuf
**When to use:** Any multi-card spread (3-card preset, LLM-suggested, custom)
**Example:**
```bash
# Source: GNU coreutils shuf documentation (verified via man shuf)
# Draw 3 unique cards from Major Arcana (0-21)
cards=$(shuf -i 0-21 -n 3)
# Output: Three lines, each a unique number 0-21
# Example output:
# 16
# 3
# 20

# Single-line version for shell injection in SKILL.md
!shuf -i 0-21 -n 3

# Why this works:
# - shuf generates permutation of input range (0-21)
# - -n 3 outputs first 3 items from permutation
# - Guarantees uniqueness (same card never drawn twice)
# - Uses /dev/urandom for randomness (same quality as Phase 1)
```

**Key insight:** Unlike independent random draws (which could theoretically draw the same card twice), `shuf` samples without replacement by design. This matches physical tarot practice exactly.

### Pattern 2: LLM-Suggested Spread Generation
**What:** Use Claude's contextual awareness to generate relevant position names
**When to use:** User selects "Claude suggests" spread option
**Example:**
```markdown
# Source: Prompt engineering best practices (Context Engineering Guide)
# Pattern: Embedded instruction within skill prompt

## LLM-Suggested Spread Generation

When user selects "Claude suggests" spread option:

1. **Generate positions based on context:**
   - Review the user's question from wizard Question 1
   - Review recent conversation context (if any)
   - Generate exactly 3 position names that illuminate their specific situation
   - Position names should be:
     * Specific to their context (not generic)
     * Actionable or insightful
     * Clear and concise (2-4 words each)

2. **Present for approval:**
   "I suggest these three positions for your reading:
   1. [Position 1]
   2. [Position 2]
   3. [Position 3]

   Would you like me to proceed with these positions, or would you prefer different ones?"

3. **Handle response:**
   - If approved: Proceed to draw 3 unique cards with these positions
   - If rejected: Generate new positions (return to step 1)
   - Do NOT fall back to custom input - keep generating until approved

**Examples of good LLM-suggested positions:**

User question: "Should I refactor this authentication system?"
- Current State
- Hidden Complexity
- Path Forward

User question: "How to approach this difficult conversation with my team?"
- What's Unspoken
- Your Leverage
- Bridge to Build

User question: "I'm stuck on this architectural decision"
- The Real Constraint
- What You're Protecting
- The Question Beneath
```

**Why inline prompting works:** Claude is already executing within the skill context with full conversation history. No external API needed - the skill prompt itself contains the instructions for position generation.

### Pattern 3: Custom Spread Input Parsing
**What:** Parse and validate user-entered comma-separated position names
**When to use:** User selects "Custom spread" option
**Example:**
```bash
# Source: Unix text processing best practices (tested in research)
# Parse comma-separated input with whitespace handling

# Input: "Past, Present,Future, Outcome,  Fifth Card"
# Expected: ["Past", "Present", "Future", "Outcome", "Fifth Card"]

user_input="Past, Present,Future, Outcome"

# Step 1: Split on commas and convert to lines
positions=$(echo "$user_input" | tr ',' '\n')

# Step 2: Trim whitespace from each line and filter empty
parsed_positions=$(echo "$positions" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -v '^$')

# Step 3: Count positions
count=$(echo "$parsed_positions" | grep -c .)

# Step 4: Validate count (1-5 allowed)
if [ "$count" -gt 5 ]; then
    echo "ERROR: Maximum 5 positions allowed. You entered $count."
    # Return to wizard or prompt for re-entry
elif [ "$count" -lt 1 ]; then
    echo "ERROR: At least 1 position required."
    # Return to wizard or prompt for re-entry
else
    echo "Valid: $count positions"
    # Proceed with drawing $count unique cards
fi

# Step 5: Draw unique cards for validated positions
cards=$(shuf -i 0-21 -n "$count")
```

**Validation requirements:**
- Minimum: 1 position (custom single-card is valid per CONTEXT.md)
- Maximum: 5 positions (specified in CONTEXT.md)
- Handle edge cases: empty input, trailing commas, extra whitespace
- Position names preserved as-is (no title case conversion required unless Claude's discretion applied)

### Pattern 4: Spread Selection Flow Integration
**What:** Extend Phase 6 wizard to implement spread logic
**When to use:** User completes wizard and spread selection is processed
**Example:**
```markdown
# Source: Phase 6 wizard infrastructure (verified in 06-VERIFICATION.md)
# Extension of existing wizard flow

## After Wizard Completes

**Question 2 response determines spread type:**

If user selected "Single card (Recommended)":
- Positions: ["Focus"]  # or no position label, just direct interpretation
- Draw: shuf -i 0-21 -n 1
- Proceed to reading with 1 card

If user selected "Three card":
- Positions: ["Situation", "Action", "Outcome"]
- Show preview: "You'll draw for: Situation, Action, Outcome"
- Draw: shuf -i 0-21 -n 3
- Proceed to reading with 3 cards + positions

If user selected "Claude suggests":
- Generate contextual positions (see Pattern 2)
- Show for approval
- Loop until approved
- Draw: shuf -i 0-21 -n 3
- Proceed to reading with 3 cards + positions

If user selected "Custom spread":
- Prompt: "Enter position names (comma-separated, 1-5 cards):"
- Collect user input
- Parse and validate (see Pattern 3)
- If invalid: show error, re-prompt
- If valid: show preview "You'll draw for: [positions]"
- Draw: shuf -i 0-21 -n COUNT
- Proceed to reading with COUNT cards + positions
```

### Pattern 5: Position Preview Before Draw
**What:** Show position names to user before drawing cards
**When to use:** All multi-card spreads (3-card preset, LLM-suggested, custom)
**Example:**
```markdown
# User experience pattern for transparency

Before drawing cards, show positions:

**Three-card preset:**
"You'll draw three cards for:
1. Situation
2. Action
3. Outcome

Drawing cards now..."

**LLM-suggested (after approval):**
"You'll draw three cards for:
1. [Generated position 1]
2. [Generated position 2]
3. [Generated position 3]

Drawing cards now..."

**Custom:**
"You'll draw [N] cards for:
1. [User position 1]
2. [User position 2]
...

Drawing cards now..."
```

**Why show positions first:** Matches physical tarot practice (you lay out positions before drawing), creates anticipation, makes the reading feel more intentional.

### Anti-Patterns to Avoid

- **Independent random draws for multi-card:** Using `shuf -i 0-21 -n 1` three times could draw duplicates. Always use `shuf -i 0-21 -n 3` for unique draws.
- **Complex deduplication logic:** Don't build loops that check for and regenerate duplicate cards. `shuf` handles this inherently.
- **External LLM API for suggestions:** Claude is already running the skill. Use inline prompting, not API calls.
- **JSON parsing for simple input:** User enters "Past, Present, Future" - don't require JSON formatting.
- **Validating position name content:** Don't restrict what users can name positions (e.g., checking against a dictionary). Any text is valid. Only validate count.
- **Falling back from LLM-suggested to custom:** Per CONTEXT.md, if user rejects LLM suggestions, generate new suggestions - don't force them to custom input.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Unique random selection | Loop with duplicate checking | `shuf -i 0-21 -n COUNT` | Built-in uniqueness guarantee, no edge cases |
| Comma parsing | Custom split logic with substring manipulation | `tr ',' '\n'` + `xargs`/`sed` | Handles edge cases (spaces, empty values) |
| Whitespace trimming | Manual string manipulation | `xargs` or `sed 's/^\s*//;s/\s*$//'` | Standard, tested, portable |
| Count validation | Multiple nested if/then | Single numeric comparison with clear error messages | Simpler, more maintainable |
| Position name generation | Hardcoded templates | LLM contextual generation | Leverages Claude's intelligence, no template maintenance |

**Key insight:** Shell utilities (shuf, tr, xargs, sed) are designed exactly for these text processing tasks. Using them reduces custom code, eliminates edge case bugs, and follows Unix philosophy (small tools, combined via pipes).

## Common Pitfalls

### Pitfall 1: Using Independent Random Draws for Multi-Card Spreads
**What goes wrong:** Drawing cards with repeated `shuf -n 1` can produce duplicates
**Why it happens:** Treating multi-card spread as "single draw repeated N times"
**How to avoid:** Always use `shuf -n COUNT` for multi-card draws
**Warning signs:** Card interpretation receives same card number multiple times
**Example:**
```bash
# WRONG - Can draw duplicates
card1=$(shuf -i 0-21 -n 1)  # Draws 16
card2=$(shuf -i 0-21 -n 1)  # Could also draw 16
card3=$(shuf -i 0-21 -n 1)  # Independent draw

# RIGHT - Guaranteed unique
cards=$(shuf -i 0-21 -n 3)
# Example output:
# 16
# 3
# 12
```

**Physical deck analogy:** When you draw 3 cards from a physical deck, you can't draw the same card twice. The shell command should match this behavior.

### Pitfall 2: Complex LLM-Suggested Approval Loop
**What goes wrong:** Over-engineering the approval flow with state management
**Why it happens:** Treating it like a complex form with cancel/back buttons
**How to avoid:** Simple question-response pattern using AskUserQuestion or direct prompt
**Warning signs:** Tracking "approval state", "regeneration count", timeout logic
**Example:**
```markdown
# WRONG - Over-engineered
- Store approval state in variable
- Track regeneration attempts (max 3)
- Timeout after 30 seconds of no response
- Provide "cancel and go to custom" option

# RIGHT - Simple prompt pattern
1. Generate positions
2. Show positions + ask "Proceed with these? (yes/no)"
3. If yes: continue
4. If no: generate new positions (return to step 1)
```

**Principle:** Keep it conversational. Claude can handle the loop naturally without explicit state tracking.

### Pitfall 3: Validating Position Name Content
**What goes wrong:** Restricting what users can name positions (e.g., no special characters, max length)
**Why it happens:** Trying to prevent "bad input"
**How to avoid:** Only validate COUNT (1-5). Accept any text for position names.
**Warning signs:** Regex checking position names, rejecting emojis, enforcing capitalization
**Example:**
```bash
# WRONG - Over-validation
if [[ "$position" =~ ^[A-Za-z ]+$ ]]; then
    # Only allow letters and spaces
    echo "Valid"
else
    echo "Invalid: Use only letters"
fi

# RIGHT - Count-only validation
count=$(echo "$positions" | grep -c .)
if [ "$count" -ge 1 ] && [ "$count" -le 5 ]; then
    echo "Valid: $count positions"
else
    echo "Invalid: Must be 1-5 positions"
fi
```

**User freedom:** If someone wants to name positions "💀 Shadow", "✨ Light", "🔮 Integration" - let them. Only the count matters.

### Pitfall 4: Not Showing Positions Before Drawing
**What goes wrong:** Drawing cards first, then revealing positions
**Why it happens:** Thinking of positions as "labels for cards" rather than "questions we're asking"
**How to avoid:** Always show positions BEFORE drawing cards
**Warning signs:** User sees "You drew The Tower" before knowing what position it's for
**Example:**
```markdown
# WRONG - Cards first
"You drew:
Card 1: The Tower
Card 2: The Hermit
Card 3: The Star

For the positions:
1. Problem
2. Solution
3. Synthesis"

# RIGHT - Positions first
"You'll draw three cards for:
1. Problem
2. Solution
3. Synthesis

Drawing cards now...

Results:
Position 1 (Problem): The Tower
Position 2 (Solution): The Hermit
Position 3 (Synthesis): The Star"
```

**Physical practice:** In real tarot readings, you lay out position markers before drawing cards. Digital should match.

### Pitfall 5: Parsing Position Names Into Array Variables
**What goes wrong:** Trying to store parsed positions in bash/zsh arrays for later use
**Why it happens:** Thinking you need to "store" positions to use them
**How to avoid:** Process positions immediately in pipeline; pass to reading as string or re-parse when needed
**Warning signs:** `declare -a positions=()`, array index bugs, shell-specific syntax
**Example:**
```bash
# WRONG - Array management complexity
declare -a positions
IFS=',' read -ra positions <<< "$user_input"
for i in "${!positions[@]}"; do
    positions[$i]=$(echo "${positions[$i]}" | xargs)
done
count=${#positions[@]}

# RIGHT - Pipeline processing
positions=$(echo "$user_input" | tr ',' '\n' | xargs -n1)
count=$(echo "$positions" | grep -c .)

# Use positions immediately or pass as string to reading
```

**Simplicity:** Bash/zsh arrays have different syntax. Avoid them unless absolutely necessary. String processing with standard tools is more portable.

### Pitfall 6: Forgetting Maximum Position Limit
**What goes wrong:** Accepting custom spreads with 10+ positions
**Why it happens:** Not validating user input count
**How to avoid:** Enforce maximum of 5 positions per CONTEXT.md
**Warning signs:** User enters "1,2,3,4,5,6,7,8,9,10" and system attempts 10-card draw
**Example:**
```bash
# WRONG - No maximum validation
count=$(echo "$positions" | grep -c .)
if [ "$count" -ge 1 ]; then
    # Proceed with any count
    cards=$(shuf -i 0-21 -n "$count")
fi

# RIGHT - Enforce 1-5 range
count=$(echo "$positions" | grep -c .)
if [ "$count" -lt 1 ]; then
    echo "ERROR: At least 1 position required"
elif [ "$count" -gt 5 ]; then
    echo "ERROR: Maximum 5 positions allowed"
else
    # Valid range
    cards=$(shuf -i 0-21 -n "$count")
fi
```

**Rationale:** 5-card maximum keeps readings focused. More cards dilute meaning and make interpretation unwieldy.

## Code Examples

Verified patterns from research and testing:

### Complete Multi-Card Draw Implementation
```bash
# Source: GNU coreutils shuf documentation + research testing
# Draw N unique cards from Major Arcana

# For shell injection in SKILL.md
# Example: Draw 3 unique cards
!shuf -i 0-21 -n 3

# Output format (3 lines, one card number per line):
# 7
# 15
# 2

# Process output with positions:
# If positions are: ["Situation", "Action", "Outcome"]
# Then:
#   Position 1 (Situation): Card 7 (The Chariot)
#   Position 2 (Action): Card 15 (The Devil)
#   Position 3 (Outcome): Card 2 (The High Priestess)
```

### Custom Spread Input Parsing (Complete Pipeline)
```bash
# Source: Tested during research (2026-01-22)
# Parse comma-separated positions with validation

user_input="Past, Present,Future"  # Example user input

# Step 1: Split and trim
positions=$(echo "$user_input" | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -v '^$')

# Step 2: Count non-empty positions
count=$(echo "$positions" | grep -c .)

# Step 3: Validate count
if [ "$count" -lt 1 ]; then
    echo "ERROR: Please enter at least 1 position"
    exit 1
elif [ "$count" -gt 5 ]; then
    echo "ERROR: Maximum 5 positions allowed (you entered $count)"
    exit 1
fi

# Step 4: Show positions for confirmation
echo "You'll draw $count cards for:"
echo "$positions" | nl

# Step 5: Draw unique cards
cards=$(shuf -i 0-21 -n "$count")

# Step 6: Combine positions with cards
paste <(echo "$positions") <(echo "$cards")
# Output:
# Past    7
# Present 15
# Future  2
```

### Inline Shell Injection Version (Minimal)
```bash
# Source: Optimized for SKILL.md shell injection context
# Single-line version for position count extraction

# Get count from user input (minimal validation)
!COUNT=$(echo "$CUSTOM_POSITIONS" | tr ',' '\n' | sed 's/^\s*//;s/\s*$//' | grep -c .); [ "$COUNT" -le 5 ] && [ "$COUNT" -ge 1 ] && echo "$COUNT" || echo "0"

# Draw cards based on validated count
!COUNT=$(echo "$CUSTOM_POSITIONS" | tr ',' '\n' | sed 's/^\s*//;s/\s*$//' | grep -c .); if [ "$COUNT" -le 5 ] && [ "$COUNT" -ge 1 ]; then shuf -i 0-21 -n "$COUNT"; else echo "ERROR"; fi
```

### LLM-Suggested Spread Prompt Template
```markdown
# Source: Prompt engineering patterns + Phase 7 CONTEXT.md
# Embedded in SKILL.md for Claude execution

## Generate Contextual Spread Positions

Based on the user's question: "[USER_QUESTION]"

Generate exactly 3 position names that will provide insight into their specific situation.

**Guidelines:**
- Be specific to their context (not generic like "Past/Present/Future")
- Use language that resonates with their question
- Each position should illuminate a different facet
- Keep position names concise (2-4 words)
- Make positions actionable or insightful

**Example quality:**

User asks: "Should I refactor this authentication system?"
Good positions:
1. Current State
2. Hidden Complexity
3. Path Forward

Poor positions (too generic):
1. Past
2. Present
3. Future

**Your suggested positions:**
1. [Generate based on context]
2. [Generate based on context]
3. [Generate based on context]

Present these to the user and ask for approval before drawing cards.
```

### Position Preview Pattern (UX)
```markdown
# Source: Physical tarot practice + Phase 7 CONTEXT.md
# Shows positions before drawing

**Three-card preset (Situation/Action/Outcome):**

"You'll draw three cards for:

1. **Situation** - What is present now
2. **Action** - What you can do
3. **Outcome** - Where this leads

Drawing cards now..."

[Cards drawn with shuf -i 0-21 -n 3]

**Results:**

**Position 1 (Situation):** The Tower
[Interpretation addressing "what is present now"]

**Position 2 (Action):** The Hermit
[Interpretation addressing "what you can do"]

**Position 3 (Outcome):** The Star
[Interpretation addressing "where this leads"]
```

### Spread Type Dispatch Logic
```bash
# Source: Phase 6 wizard + Phase 7 spread implementation
# Determines which spread pattern to use

# After wizard Question 2 (Spread selection)
SPREAD_CHOICE="$WIZARD_Q2_RESPONSE"

case "$SPREAD_CHOICE" in
    "Single card (Recommended)")
        # Existing behavior from v1.0
        POSITION_COUNT=1
        POSITIONS="Focus"
        CARDS=$(shuf -i 0-21 -n 1)
        ;;

    "Three card")
        # Preset: Situation/Action/Outcome
        POSITION_COUNT=3
        POSITIONS="Situation\nAction\nOutcome"
        echo "You'll draw for: Situation, Action, Outcome"
        CARDS=$(shuf -i 0-21 -n 3)
        ;;

    "Claude suggests")
        # LLM-generated positions (see prompt template)
        # Generate positions based on user question
        # Show for approval
        # Loop if rejected
        # When approved:
        POSITION_COUNT=3
        POSITIONS="[Generated 1]\n[Generated 2]\n[Generated 3]"
        CARDS=$(shuf -i 0-21 -n 3)
        ;;

    "Custom spread")
        # User-entered positions
        echo "Enter position names (comma-separated, 1-5 cards):"
        # Collect input via AskUserQuestion or direct prompt
        # Parse and validate
        POSITION_COUNT=$(echo "$USER_INPUT" | tr ',' '\n' | sed 's/^\s*//;s/\s*$//' | grep -c .)

        if [ "$POSITION_COUNT" -lt 1 ] || [ "$POSITION_COUNT" -gt 5 ]; then
            echo "ERROR: Enter 1-5 positions"
            # Re-prompt
        else
            POSITIONS=$(echo "$USER_INPUT" | tr ',' '\n' | sed 's/^\s*//;s/\s*$//')
            echo "You'll draw for: $(echo "$POSITIONS" | paste -sd ', ')"
            CARDS=$(shuf -i 0-21 -n "$POSITION_COUNT")
        fi
        ;;
esac

# Proceed to reading with $POSITION_COUNT, $POSITIONS, $CARDS
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Independent draws (each card random) | Single shuf call for all cards | Always preferred | Prevents duplicate cards in spread |
| Hardcoded spread presets only | LLM-generated contextual positions | 2023+ (LLM era) | Personalized, adaptive spreads |
| JSON or complex format for custom input | Simple comma-separated text | Always preferred for simple cases | Lower barrier to entry |
| External LLM API calls for generation | Inline prompt within skill | Claude Code pattern | No latency, no external dependencies |
| Complex array manipulation | Pipeline processing with standard tools | Unix philosophy (1970s+) | More portable, less bug-prone |

**Deprecated/outdated:**
- **Drawing cards independently:** Modern pattern is batch unique selection
- **Requiring structured input formats:** User-friendly is comma-separated text, not JSON
- **External API dependency for LLM features:** Claude Code skills execute in Claude context

**Current best practice (2026):**
- Use `shuf -n COUNT` for unique multi-card draws
- Leverage executing LLM for contextual generation (no external calls)
- Simple text parsing with standard Unix tools
- Validate only what matters (count), not content
- Show positions before drawing (matches physical practice)

## Open Questions

Things that couldn't be fully resolved:

1. **Should LLM-suggested spreads always be exactly 3 cards, or allow variable count?**
   - What we know: CONTEXT.md specifies "exactly 3 cards"
   - What's unclear: Whether this is a v1.1 simplification or permanent design
   - Recommendation: Keep at 3 cards for v1.1. LLM-suggested with variable count adds complexity (user approval for both positions AND count). Can revisit in v1.2 if users request it.

2. **How should position names be formatted in the reading output?**
   - What we know: Positions should be shown before drawing, and tied to cards in interpretation
   - What's unclear: Claude's discretion per CONTEXT.md - title case? All caps? As-entered?
   - Recommendation: Title case for preset spreads (Situation/Action/Outcome), preserve user input for custom. This feels polished but respects user intent.

3. **What if user rejects LLM suggestions many times in a row?**
   - What we know: CONTEXT.md says "keep suggesting, don't fall back to custom"
   - What's unclear: Is there a reasonable limit? 5 rejections? 10?
   - Recommendation: No hard limit for v1.1. Trust the conversational loop. If user wants custom, they can select that option from wizard. In practice, users will accept or switch options, not reject indefinitely.

4. **Should custom spread input support multi-line or quoted positions?**
   - What we know: Basic comma-separated parsing with tr + sed
   - What's unclear: What if user wants position name "Past, Present" (with comma in name)?
   - Recommendation: Keep simple for v1.1. Comma is delimiter, period. If a user needs a comma in position name, they can use semicolon or dash. Edge case doesn't justify quoting complexity.

5. **How to handle empty/whitespace-only position names in custom input?**
   - What we know: Current parsing filters empty lines with `grep -v '^$'`
   - What's unclear: Should "Position1, , Position3" result in error or 2 positions?
   - Recommendation: Filter out empty/whitespace-only positions silently. If result is 0 positions or >5 positions, then error. Easier UX than rejecting "Position1, , Position3" entirely.

## Sources

### Primary (HIGH confidence)
- [GNU Coreutils: shuf documentation](https://www.gnu.org/software/coreutils/shuf) - Official shuf command specification and behavior
- shuf man page (verified 2026-01-22 via `man shuf`) - Confirmed `-n COUNT` provides unique selection without replacement
- [Bash Read Comma Separated CSV File - nixCraft](https://www.cyberciti.biz/faq/unix-linux-bash-read-comma-separated-cvsfile/) - Standard comma parsing patterns
- Phase 1 Research (01-RESEARCH.md) - Validated shuf for random card selection with /dev/urandom
- Phase 6 Verification (06-VERIFICATION.md) - Confirmed wizard infrastructure and AskUserQuestion pattern

### Secondary (MEDIUM confidence)
- [Generation of Random Integers in Bash | Baeldung on Linux](https://www.baeldung.com/linux/bash-draw-random-ints) - Random number generation patterns (referenced in search)
- [Split a List by Comma in Bash | Baeldung on Linux](https://www.baeldung.com/linux/bash-split-list-by-comma) - IFS and tr-based parsing approaches (referenced in search)
- [Context Engineering Guide | Prompt Engineering Guide](https://www.promptingguide.ai/guides/context-engineering-guide) - LLM contextual prompting patterns
- [Input Validation of comma separated values - Unix.com](https://www.unix.com/shell-programming-and-scripting/160336-input-validation-comma-separated-values.html) - Validation patterns for CSV input
- Research testing (2026-01-22) - Verified tr + xargs/sed + grep for parsing and validation

### Tertiary (LOW confidence - for validation)
- [Bash Shell Generate Random Numbers - nixCraft](https://www.cyberciti.biz/faq/bash-shell-script-generating-random-numbers/) - General random number techniques (needs specific verification for uniqueness guarantees)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - shuf validated in Phase 1, tr/sed/xargs are POSIX-standard, tested during research
- Unique card drawing: HIGH - shuf -n COUNT behavior verified via man page and testing, guarantees uniqueness
- LLM-suggested pattern: HIGH - Claude Code execution context confirmed in Phase 6, inline prompting is standard pattern
- Custom input parsing: HIGH - tr + sed + grep verified through testing, handles edge cases correctly
- Spread flow integration: HIGH - Extends validated Phase 6 wizard infrastructure

**Research date:** 2026-01-22
**Valid until:** ~90 days (stable domain - shell utilities and Claude Code patterns evolve slowly)

**Phase-specific context:**
- Depends on Phase 6 wizard infrastructure (validated as complete)
- Unique card drawing is critical differentiator from single-card behavior
- LLM-suggested spreads leverage Claude's contextual intelligence (no external API needed)
- Custom spread validation must enforce 1-5 position limit per CONTEXT.md
- Three-card preset uses "Situation/Action/Outcome" NOT "Problem/Solution/Synthesis" per CONTEXT.md
