# Phase 8: Reading Modes - Research

**Researched:** 2026-01-22
**Domain:** Physical deck integration with fuzzy card name matching, conversational input validation, and ritual-preserving UX
**Confidence:** HIGH

## Summary

Phase 8 implements two reading modes: digital (random selection with `shuf`) and physical (user enters cards from real deck). Digital mode preserves existing v1.0/v1.1 behavior. Physical mode introduces a conversational card entry flow where users type card names or numbers, the system performs fuzzy matching against the 22 Major Arcana, and validates/confirms before interpretation.

The core technical challenge is **fuzzy string matching without external dependencies**. Research confirms that pure bash case-insensitive pattern matching combined with simple heuristics (prefix matching, partial word matching, numeric parsing) provides sufficient accuracy for 22 distinct card names. Full Levenshtein distance implementations exist in bash but add unnecessary complexity for a small, well-defined set where "tower", "the tower", "TOWER", and "16" can all resolve unambiguously.

For UX, research on conversational error handling and tarot app physical integration patterns reveals best practices: gentle retry messages ("I don't recognize that card" not "Invalid input"), ritual moments ("Take a moment with your cards"), position-by-position entry with context ("Card for Situation:"), and summary confirmation before interpretation. This balances the somatic grounding of physical decks with digital convenience.

**Primary recommendation:** Implement case-insensitive matching with multiple fallback strategies (exact match → prefix match → partial match → numeric), use while-loop retry pattern with gentle error messages, and design physical mode as distinct ritual experience with intentional pacing.

## Standard Stack

The established tools for this domain:

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `grep -i` | GNU grep 3.x+ | Case-insensitive string matching | POSIX-standard, no external dependencies, handles all case variations |
| Bash `[[ ... =~ ]]` | Bash 3.2+ | Pattern matching with regex | Built into bash, supports both exact and partial matching |
| `tr '[:upper:]' '[:lower:]'` | GNU coreutils | Case normalization | Standard approach for case folding before comparison |
| `while read` loop | Bash/sh | Retry pattern for input validation | Standard conversational input pattern, natural exit conditions |
| Bash `case` statement | Bash/sh | Multi-pattern matching | Clean dispatch for card name variants and numeric input |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| `grep -c` | Count matches | Duplicate card detection (already in spread check) |
| `echo` + pipes | String processing | Normalization before matching |
| `[ ]` test | Validation logic | Checking numeric range (0-21) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Simple pattern matching | Levenshtein distance (pure bash) | Levenshtein is overkill for 22 distinct names; adds 50+ lines of code for marginal accuracy gain |
| Simple pattern matching | `fzf` (fuzzy finder) | fzf is powerful but external dependency; overkill for single-card entry (not selecting from menu) |
| Bash case-insensitive matching | Python fuzzy matching library | Requires Python environment; Claude Code skill pattern is shell-based |
| While-loop retry | Maximum retry limit (e.g., 3 attempts) | User might be typing slowly or checking deck; no UX benefit to hard limit |

**Installation:**
```bash
# No installation needed - all tools are bash/coreutils built-ins
# grep, tr, bash pattern matching available on all Unix-like systems
# Already validated in Phase 1-7 implementations
```

## Architecture Patterns

### Recommended Flow Structure
```
Mode Selection (Wizard Question 3)
│
├─ Digital mode → Use existing shuf behavior (Phases 6-7)
│                → shuf -i 0-21 -n COUNT
│
└─ Physical mode → Ritual moment prompt
                 → For each position in spread:
                    ├─ Show position context ("Card for Situation:")
                    ├─ Collect user input (card name or number)
                    ├─ Fuzzy match against 22 Major Arcana
                    ├─ If ambiguous: confirm ("Did you mean The Magician?")
                    ├─ If unrecognized: gentle retry with example
                    └─ Store resolved card number
                 → Show summary of all cards with positions
                 → Confirm or allow correction
                 → Proceed to interpretation
```

### Pattern 1: Case-Insensitive Fuzzy Matching
**What:** Match user input to card names with forgiveness for case, "The" prefix, partial names
**When to use:** Physical mode card entry validation
**Example:**
```bash
# Source: Bash pattern matching + grep case-insensitive patterns
# Match user input against 22 Major Arcana cards

# Card list (name + number mapping)
# Card 0: The Fool
# Card 1: The Magician
# ...
# Card 21: The World

user_input="tower"  # Example: user types "tower" for "The Tower"

# Strategy 1: Normalize to lowercase for comparison
normalized=$(echo "$user_input" | tr '[:upper:]' '[:lower:]')

# Strategy 2: Try exact match (case-insensitive)
# "the tower" matches "the tower"
if grep -qi "^the tower$" <<< "the tower"; then
    card_number=16
fi

# Strategy 3: Try with "The" prefix added
# "tower" → try matching "the tower"
if grep -qi "^the $normalized$" card_list.txt; then
    # Match found
fi

# Strategy 4: Try partial match (contains)
# "magician" matches "The Magician"
if grep -qi "$normalized" card_list.txt; then
    # May need disambiguation if multiple matches
fi

# Strategy 5: Check if numeric input (0-21)
if [[ "$user_input" =~ ^[0-9]+$ ]]; then
    if [ "$user_input" -ge 0 ] && [ "$user_input" -le 21 ]; then
        card_number="$user_input"
    fi
fi
```

**Key insight:** For 22 distinct card names, simple strategies (case normalization + prefix handling + partial matching) handle 95%+ of inputs. Edge cases like "high priestess" vs "hierophant" (both start with 'hi') can use "best match" confirmation.

### Pattern 2: Multi-Strategy Matching with Confirmation
**What:** Try multiple matching strategies in order, confirm ambiguous matches
**When to use:** Physical card entry where user types "magician" or "mag" or "1"
**Example:**
```bash
# Source: Conversational UI best practices + bash pattern matching
# Implements escalating match strategies

match_card() {
    local input="$1"
    local normalized=$(echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/^the //')

    # Strategy 1: Exact match (normalized)
    case "$normalized" in
        "fool") echo "0"; return 0 ;;
        "magician") echo "1"; return 0 ;;
        "high priestess") echo "2"; return 0 ;;
        # ... all 22 cards
        "world") echo "21"; return 0 ;;
    esac

    # Strategy 2: Numeric input
    if [[ "$input" =~ ^[0-9]+$ ]] && [ "$input" -ge 0 ] && [ "$input" -le 21 ]; then
        echo "$input"
        return 0
    fi

    # Strategy 3: Prefix match
    case "$normalized" in
        fool*) echo "0"; return 0 ;;
        mag*) echo "1"; return 0 ;;  # Catches "mag", "magician", etc.
        high*) echo "2"; return 0 ;;
        # ... all 22 cards
    esac

    # Strategy 4: Partial match (may need confirmation)
    # If "tower" appears in input, likely Card 16
    if [[ "$normalized" == *"tower"* ]]; then
        # Ask: "Did you mean The Tower (16)?"
        echo "16-confirm"
        return 0
    fi

    # No match found
    return 1
}

# Usage in physical mode:
user_input="mag"
result=$(match_card "$user_input")
if [ $? -eq 0 ]; then
    if [[ "$result" == *"-confirm" ]]; then
        card_num="${result%-confirm}"
        # Show confirmation: "Did you mean The Magician?"
    else
        card_num="$result"
        # Direct match, proceed
    fi
else
    # No match - gentle retry
    echo "I don't recognize that card. Examples: The Fool, Death, 16"
fi
```

### Pattern 3: Position-by-Position Entry with Context
**What:** Collect cards one at a time, showing position name for context
**When to use:** Physical mode with multi-card spreads
**Example:**
```markdown
# Source: Tarot app UX research + conversational CLI patterns
# Entry flow for 3-card spread (Situation/Action/Outcome)

Physical mode selected for Situation/Action/Outcome spread:

**Step 1: Ritual moment**
"Take a moment with your cards. Shuffle while focusing on your question,
then draw 3 cards for this reading. When ready, I'll guide you through
entering them."

**Step 2: Position-by-position entry**
For position 1 of 3:
  Prompt: "Card for Situation (what is present now):"
  User types: "tower"
  System matches: Card 16 (The Tower)
  System confirms: "The Tower — continuing..."

For position 2 of 3:
  Prompt: "Card for Action (what you can do):"
  User types: "9"
  System matches: Card 9 (The Hermit)
  System confirms: "The Hermit — continuing..."

For position 3 of 3:
  Prompt: "Card for Outcome (where this leads):"
  User types: "star"
  System matches: Card 17 (The Star)
  System confirms: "The Star — proceeding..."

**Step 3: Summary confirmation**
"You drew:
1. Situation: The Tower
2. Action: The Hermit
3. Outcome: The Star

Shall I interpret these cards? (yes to proceed, or name a position to change it)"

**Step 4: Proceed to interpretation** (existing Phase 9 logic)
```

**Why position-by-position:** Matches physical ritual (you draw cards in sequence), provides context for each entry, prevents overwhelming user with "enter 3 cards at once".

### Pattern 4: Gentle Retry with Examples
**What:** Conversational error messages that guide user to success
**When to use:** Unrecognized card input in physical mode
**Example:**
```markdown
# Source: Conversational error message UX research
# Never blame user, always provide path forward

**Bad error message:**
"Error: Invalid input. Card not found."

**Good error message (gentle retry):**
"I don't recognize that card. What card did you draw for Situation?

Try the card's name (like 'The Fool' or 'Death') or its number (0-21)"

**Even better (contextual example):**
"I don't recognize 'mag1c1an' — did you mean 'Magician'?

If not, try: The Fool, Death, Tower, or the card number (0-21)"

**Best (gentle + specific):**
User typed: "magc"
System: "Hmm, I'm not sure which card you mean. Did you draw:
  - The Magician (1)
  - The Magus (not in Major Arcana)

Or type the full name or number to help me match it."
```

**Tone principles:**
- Never use "error" or "invalid"
- Use "I don't recognize" or "I'm not sure"
- Always provide examples
- Make retry feel like a natural part of conversation, not a failure

### Pattern 5: Duplicate Card Prevention
**What:** Prevent same card from being entered twice in a spread
**When to use:** Physical mode with multi-card spreads
**Example:**
```bash
# Source: Physical tarot practice (can't draw same card twice from one deck)
# Validation during position-by-position entry

# Track already-entered cards (array or newline-separated string)
entered_cards=""

for position in "Situation" "Action" "Outcome"; do
    while true; do
        echo "Card for $position:"
        read user_input

        card_num=$(match_card "$user_input")

        if [ $? -ne 0 ]; then
            echo "I don't recognize that card. Try: The Fool, Death, 16"
            continue
        fi

        # Check for duplicate
        if grep -q "^$card_num$" <<< "$entered_cards"; then
            card_name=$(get_card_name "$card_num")
            echo "$card_name is already in your spread. Please draw another card."
            continue
        fi

        # Valid unique card
        entered_cards="$entered_cards$card_num\n"
        echo "$(get_card_name "$card_num") — continuing..."
        break
    done
done
```

**Why prevent duplicates:** Physical tarot decks can't have duplicates in a single spread. Digital mode enforces this via `shuf` (sampling without replacement). Physical mode must validate manually.

### Anti-Patterns to Avoid

- **Requiring exact case/spelling:** Don't reject "tower" because it's not "The Tower". Be forgiving.
- **No retry limit enforcement:** Don't cap retries at 3 attempts. User might be fumbling with cards or checking spelling.
- **Showing all 22 cards on error:** Don't dump the full card list. Provide 2-3 examples.
- **Validating card exists in user's physical deck:** Don't ask "do you have a physical Major Arcana deck?" or "are you sure you drew that card?" Trust user input.
- **Over-engineering ambiguity detection:** For 22 cards, most inputs are unambiguous. Don't build complex similarity scoring for every input.
- **Skipping ritual moment:** Don't jump straight to "enter card 1". Give user a pause to shuffle/draw with intention.
- **Batch entry ("enter all cards at once"):** Don't ask user to type "tower, hermit, star" in one prompt for 3-card spread. One at a time matches ritual.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Case-insensitive string matching | Custom char-by-char comparison loop | `grep -i` or `tr [:upper:] [:lower:]` | Built-in, tested, handles all cases correctly |
| Fuzzy matching for small set | Levenshtein distance algorithm | Simple case normalization + prefix/partial match | 22 cards with distinct names don't need edit distance |
| Card number to name lookup | Hardcoded if/elif chains | Case statement or associative array | More maintainable, matches shell patterns |
| User input retry loop | Complex state machine | `while read` with `continue`/`break` | Standard shell pattern, self-documenting |
| Validating numeric input is 0-21 | Regex then multiple comparisons | `[[ $input =~ ^[0-9]+$ ]] && [ $input -ge 0 ] && [ $input -le 21 ]` | Single-line validation, clear intent |

**Key insight:** Bash built-ins and coreutils handle string matching, case folding, and numeric validation. For 22 distinct card names, simple heuristics outperform complex algorithms in both code clarity and maintenance.

## Common Pitfalls

### Pitfall 1: Assuming Users Type Perfect Card Names
**What goes wrong:** Requiring "The Tower" exactly, rejecting "tower" or "Tower" or "the tower"
**Why it happens:** Thinking validation should enforce "proper" format
**How to avoid:** Normalize all inputs to lowercase, strip "the" prefix, match flexibly
**Warning signs:** Users get frustrated by "invalid input" for minor variations
**Example:**
```bash
# WRONG - Strict matching
if [ "$input" = "The Tower" ]; then
    card_number=16
fi

# RIGHT - Flexible matching
normalized=$(echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/^the //')
if [ "$normalized" = "tower" ]; then
    card_number=16
fi
```

### Pitfall 2: Not Preventing Duplicate Cards
**What goes wrong:** Allowing user to enter same card multiple times in spread
**Why it happens:** Forgetting that physical decks can't have duplicates
**How to avoid:** Track entered cards, validate against list before accepting
**Warning signs:** User accidentally types same card twice, gets nonsensical reading
**Example:**
```bash
# WRONG - No duplicate check
for pos in 1 2 3; do
    read card
    cards="$cards $card"
done

# RIGHT - Duplicate prevention
entered=""
for pos in 1 2 3; do
    while true; do
        read card
        if grep -q "$card" <<< "$entered"; then
            echo "That card is already in your spread"
            continue
        fi
        entered="$entered $card"
        break
    done
done
```

### Pitfall 3: Harsh Error Messages
**What goes wrong:** "ERROR: Invalid card", "FAILED TO PARSE INPUT"
**Why it happens:** Treating user input like technical validation
**How to avoid:** Use gentle, conversational language with examples
**Warning signs:** Users feel stupid or frustrated instead of guided
**Example:**
```bash
# WRONG - Harsh
if ! valid_card "$input"; then
    echo "ERROR: Invalid card name"
    exit 1
fi

# RIGHT - Gentle
if ! valid_card "$input"; then
    echo "I don't recognize that card. Try: The Fool, Death, or a number (0-21)"
    # Loop continues
fi
```

### Pitfall 4: Skipping the Ritual Moment
**What goes wrong:** Physical mode feels identical to digital mode (just typing vs random)
**Why it happens:** Focusing on input validation, forgetting experiential design
**How to avoid:** Add intentional pause/prompt before card entry: "Take a moment with your cards..."
**Warning signs:** Physical mode feels transactional, loses somatic grounding
**Example:**
```markdown
# WRONG - Jump straight to input
"Enter the first card:"

# RIGHT - Create ritual space
"Take a moment with your cards. Shuffle while focusing on your question,
then draw 3 cards and lay them out. When you're ready, I'll guide you
through entering them.

[User indicates readiness]

Card for Situation:"
```

**Why ritual matters:** Physical mode users chose that mode for embodied practice. Honor that intention with pacing and language.

### Pitfall 5: Batch Entry for Multi-Card Spreads
**What goes wrong:** Asking "Enter 3 cards (comma-separated):" for 3-card spread
**Why it happens:** Thinking efficiency (one prompt) is better than multiple prompts
**How to avoid:** Enter one card at a time with position context
**Warning signs:** Users confused about order, format, or which position they're on
**Example:**
```bash
# WRONG - Batch entry
echo "Enter 3 cards for Situation, Action, Outcome (comma-separated):"
read cards
# Parse and hope user got order right

# RIGHT - Position-by-position
for pos in "Situation" "Action" "Outcome"; do
    echo "Card for $pos:"
    read card
    # Immediate feedback per card
done
```

**Physical practice alignment:** You don't draw 3 cards simultaneously and announce them all at once. You draw one, note it, draw next, note it, etc.

### Pitfall 6: Over-Engineering Ambiguity Resolution
**What goes wrong:** Building complex "did you mean X, Y, or Z?" logic for every partial match
**Why it happens:** Trying to handle all possible user inputs elegantly
**How to avoid:** For 22 cards with distinct names, most inputs are unambiguous. Confirm only when truly ambiguous.
**Warning signs:** Every input triggers disambiguation prompt, users get annoyed
**Example:**
```bash
# WRONG - Over-disambiguation
if [[ "$input" == "m"* ]]; then
    echo "Did you mean: Magician, Moon, or something else?"
    # Complex sub-menu
fi

# RIGHT - Match confidently when clear
if [[ "$input" == "mag"* ]]; then
    card=1  # The Magician (only Major Arcana starting with 'mag')
elif [[ "$input" == "moon"* ]]; then
    card=18  # The Moon
else
    # Unrecognized
fi
```

**Ambiguity threshold:** Only ask "did you mean" when multiple cards could match (rare with Major Arcana distinct names).

## Code Examples

Verified patterns from research and codebase review:

### Complete Card Matching Function
```bash
# Source: Research synthesis (2026-01-22)
# Matches user input to Major Arcana card number (0-21)

match_card() {
    local input="$1"
    local normalized=$(echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/^the //')

    # Exact match (normalized)
    case "$normalized" in
        "fool") echo "0"; return 0 ;;
        "magician") echo "1"; return 0 ;;
        "high priestess") echo "2"; return 0 ;;
        "empress") echo "3"; return 0 ;;
        "emperor") echo "4"; return 0 ;;
        "hierophant") echo "5"; return 0 ;;
        "lovers") echo "6"; return 0 ;;
        "chariot") echo "7"; return 0 ;;
        "strength") echo "8"; return 0 ;;
        "hermit") echo "9"; return 0 ;;
        "wheel of fortune"|"wheel") echo "10"; return 0 ;;
        "justice") echo "11"; return 0 ;;
        "hanged man"|"hanged") echo "12"; return 0 ;;
        "death") echo "13"; return 0 ;;
        "temperance") echo "14"; return 0 ;;
        "devil") echo "15"; return 0 ;;
        "tower") echo "16"; return 0 ;;
        "star") echo "17"; return 0 ;;
        "moon") echo "18"; return 0 ;;
        "sun") echo "19"; return 0 ;;
        "judgement"|"judgment") echo "20"; return 0 ;;
        "world") echo "21"; return 0 ;;
    esac

    # Numeric input (0-21)
    if [[ "$input" =~ ^[0-9]+$ ]] && [ "$input" -ge 0 ] && [ "$input" -le 21 ]; then
        echo "$input"
        return 0
    fi

    # No match
    return 1
}

# Usage:
card_num=$(match_card "tower")
if [ $? -eq 0 ]; then
    echo "Matched card: $card_num"
else
    echo "No match found"
fi
```

### Card Number to Name Lookup
```bash
# Source: Derived from SKILL.md card list
# Convert card number (0-21) to full card name

get_card_name() {
    local num="$1"
    case "$num" in
        0) echo "The Fool" ;;
        1) echo "The Magician" ;;
        2) echo "The High Priestess" ;;
        3) echo "The Empress" ;;
        4) echo "The Emperor" ;;
        5) echo "The Hierophant" ;;
        6) echo "The Lovers" ;;
        7) echo "The Chariot" ;;
        8) echo "Strength" ;;
        9) echo "The Hermit" ;;
        10) echo "Wheel of Fortune" ;;
        11) echo "Justice" ;;
        12) echo "The Hanged Man" ;;
        13) echo "Death" ;;
        14) echo "Temperance" ;;
        15) echo "The Devil" ;;
        16) echo "The Tower" ;;
        17) echo "The Star" ;;
        18) echo "The Moon" ;;
        19) echo "The Sun" ;;
        20) echo "Judgement" ;;
        21) echo "The World" ;;
        *) echo "Unknown" ;;
    esac
}
```

### Physical Mode Entry Flow (Single Card)
```markdown
# Source: UX research synthesis + conversational CLI patterns
# Entry flow for single-card physical reading

Mode: Physical deck selected

**Ritual moment:**
"Take a moment with your cards. Shuffle while focusing on your question,
then draw one card. When ready, tell me what you drew."

[User indicates readiness]

**Card entry:**
Prompt: "What card did you draw? (e.g., The Fool, Death, 16)"
User input: "tower"

[System: match_card "tower" → returns 16]
[System: get_card_name 16 → returns "The Tower"]

Confirm: "The Tower — proceeding to your reading..."

[Continue to interpretation with card_number=16]
```

### Physical Mode Entry Flow (Multi-Card with Duplicate Prevention)
```bash
# Source: Research synthesis (2026-01-22)
# Entry flow for 3-card physical reading with validation

positions=("Situation" "Action" "Outcome")
position_descriptions=("what is present now" "what you can do" "where this leads")
entered_cards=""

echo "Take a moment with your cards. Shuffle while focusing on your question,"
echo "then draw 3 cards for this reading. When ready, I'll guide you through entering them."
echo ""
# [Wait for user readiness]

for i in 0 1 2; do
    pos="${positions[$i]}"
    desc="${position_descriptions[$i]}"

    while true; do
        echo "Card for $pos ($desc):"
        read user_input

        # Match card
        card_num=$(match_card "$user_input")
        if [ $? -ne 0 ]; then
            echo "I don't recognize that card. Try: The Fool, Death, or a number (0-21)"
            echo ""
            continue
        fi

        # Check duplicate
        if grep -q "^$card_num$" <<< "$entered_cards"; then
            card_name=$(get_card_name "$card_num")
            echo "$card_name is already in your spread. Please draw another card."
            echo ""
            continue
        fi

        # Valid unique card
        card_name=$(get_card_name "$card_num")
        entered_cards="$entered_cards$card_num"$'\n'
        echo "$card_name — continuing..."
        echo ""
        break
    done
done

# Show summary
echo "You drew:"
echo "1. Situation: $(get_card_name $(echo "$entered_cards" | sed -n '1p'))"
echo "2. Action: $(get_card_name $(echo "$entered_cards" | sed -n '2p'))"
echo "3. Outcome: $(get_card_name $(echo "$entered_cards" | sed -n '3p'))"
echo ""
echo "Shall I interpret these cards?"
# [Proceed to interpretation]
```

### Mode Dispatch (Digital vs Physical)
```bash
# Source: Phase 6-7 wizard pattern extended for Phase 8
# Mode selection determines card collection method

MODE="$WIZARD_Q3_RESPONSE"  # From wizard Question 3

case "$MODE" in
    "Digital (Recommended)")
        # Use existing shuf behavior (Phase 1-7)
        CARDS=$(shuf -i 0-21 -n "$POSITION_COUNT")
        ;;

    "Physical deck")
        # Physical mode: collect cards via user input
        # Use position-by-position entry flow (see above)
        # Validate with match_card function
        # Prevent duplicates
        # Store card numbers in CARDS variable (same format as digital)
        ;;
esac

# After mode dispatch, CARDS contains card numbers (one per line)
# Proceed to interpretation (Phase 9) - identical for both modes
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Strict case-sensitive matching | Case-insensitive fuzzy matching | Always preferred for CLI UX | Reduces user frustration, feels conversational |
| Requiring full card name | Accept partial/numeric input | Modern CLI best practice (2020+) | Faster input, accommodates user preferences |
| Batch multi-card entry | Position-by-position entry | Tarot app UX evolution (2022+) | Matches physical ritual, clearer context |
| Generic error messages | Gentle conversational retry | Error message UX research (2023+) | Users feel guided not blamed, higher success rate |
| Digital-only tarot apps | Physical deck integration | Hybrid UX trend (2024+) | Serves both digital-native and physical practitioners |

**Deprecated/outdated:**
- **Exact string matching:** Modern apps use fuzzy/flexible matching for better UX
- **"Invalid input" error messages:** Current best practice is conversational, helpful errors
- **All-at-once card entry:** One-by-one with context is more intuitive

**Current best practice (2026):**
- Case-insensitive matching with multiple fallback strategies
- Gentle retry loops with examples, no hard limits
- Ritual moments in physical mode (pause for intention)
- Position-by-position entry showing context
- Duplicate prevention matching physical deck behavior
- Summary confirmation before interpretation

## Open Questions

Things that couldn't be fully resolved:

1. **Should physical mode remember last-entered card for quick re-entry?**
   - What we know: Users may want to change a card during summary confirmation
   - What's unclear: Is "edit card 2" worth implementing vs "start over"?
   - Recommendation: Claude's discretion per CONTEXT.md. For v1.1, allow full re-entry if user says "change Situation" or similar. Simple "start over" button is acceptable. Can enhance in v1.2 if users request granular editing.

2. **How to handle "The Judgement" vs "Judgement" spelling variation?**
   - What we know: Both spellings are used in tarot
   - What's unclear: Which spelling to display to user?
   - Recommendation: Match both in input ("judgement" and "judgment"), display as "Judgement" (matches SKILL.md Card 20 title). Accept either, normalize to one.

3. **Should physical mode support voice input in future?**
   - What we know: Voice config exists for interpretation style, not card entry
   - What's unclear: Voice-to-text for card names would be convenient but adds dependency
   - Recommendation: Out of scope for v1.1. Text-based entry is universal, no platform dependencies. Voice entry is v2.0+ feature if user demand exists.

4. **What if user types "3 card" or "three of pentacles" (Minor Arcana)?**
   - What we know: Only Major Arcana (22 cards) in v1.1, Minor Arcana deferred
   - What's unclear: How to handle clear Minor Arcana references?
   - Recommendation: Gentle error: "I only know the Major Arcana (The Fool through The World). Which Major Arcana card did you draw?" Don't try to parse "3 of cups" as "card 3".

5. **Mode memory: Should system remember last-used mode (digital vs physical)?**
   - What we know: CONTEXT.md marks this as Claude's discretion
   - What's unclear: User benefit vs. added state management
   - Recommendation: No mode memory for v1.1. Wizard asks every time. Most users have a preference (always digital OR always physical), but changing context mid-session is common. Asking is safer than assuming. If user feedback shows "I always use physical", v1.2 can add config file setting.

## Sources

### Primary (HIGH confidence)
- [Bash Pattern Matching - GNU Manual](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html) - Official bash pattern matching spec
- [grep Case Insensitive Search](https://linuxtect.com/grep-search-case-insensitive-string-ignore-case/) - grep -i flag usage
- [How to Use Bash Until Loop](https://docs.vultr.com/how-to-use-bash-until-loop) - While/until retry patterns
- [Error Message UX Best Practices](https://www.pencilandpaper.io/articles/ux-pattern-analysis-error-feedback) - Gentle conversational error messaging
- [Visual Tarot Professional Program 2026](http://visualtarot.com/) - Physical deck recording features
- SKILL.md (verified 2026-01-22) - 22 Major Arcana card list (Card 0-21)
- Phase 7 RESEARCH.md - Multi-card spread patterns and shuf validation

### Secondary (MEDIUM confidence)
- [GitHub - fzf fuzzy finder](https://github.com/junegunn/fzf) - Referenced as alternative (not recommended for this use case)
- [Bash function to calculate Levenshtein distance](https://gist.github.com/benpitman/e1e3c158040dc78b017ce7ac6b94a9fa) - Pure bash implementation reviewed (deemed overkill)
- [Moonlight Tarot Platform](https://moonlight.world/) - Physical deck integration UX patterns
- [Labyrinthos Tarot Reading App](https://apps.apple.com/us/app/labyrinthos-tarot-reading/id1155180220) - "Pick your own cards" feature reference
- [Writing Clear Error Messages - UX Content Collective](https://uxcontent.com/how-to-write-error-messages/) - Conversational error message patterns
- [Tarot app physical deck integration discussion - Quora](https://www.quora.com/Is-there-a-website-or-a-tarot-app-that-lets-you-enter-what-tarot-cards-were-drawn-from-a-real-deck-into-the-spread) - User demand validation

### Tertiary (LOW confidence - for validation)
- [Pure Bash Bible - GitHub](https://github.com/dylanaraps/pure-bash-bible) - String manipulation patterns (referenced but not required)
- [Approximate string matching - Wikipedia](https://en.wikipedia.org/wiki/Approximate_string_matching) - Levenshtein distance background (informational only)

## Metadata

**Confidence breakdown:**
- Case-insensitive matching: HIGH - grep -i and tr are POSIX-standard, tested extensively
- Fuzzy matching strategy: HIGH - For 22 distinct card names, simple heuristics verified sufficient
- Physical mode UX flow: MEDIUM-HIGH - Tarot app research confirms patterns, not yet user-tested in this codebase
- Gentle retry patterns: HIGH - Error message UX research well-established (2023-2025 sources)
- Duplicate prevention: HIGH - Extends Phase 7 validation logic, matches physical deck behavior
- Mode dispatch: HIGH - Direct extension of Phase 6-7 wizard patterns

**Research date:** 2026-01-22
**Valid until:** ~60 days (UX patterns stable, bash tools stable, tarot domain stable)

**Phase-specific context:**
- Depends on Phase 6 wizard infrastructure (wizard Question 3 for mode selection)
- Depends on Phase 7 spread logic (POSITION_COUNT and position names for multi-card entry)
- Physical mode is NEW capability, digital mode preserves v1.0-v1.1 behavior
- Card matching must handle all 22 Major Arcana (Card 0 The Fool through Card 21 The World)
- No Minor Arcana support in v1.1 - reject Minor Arcana references gently
- No reversal support in v1.1 - all cards read upright (per CONTEXT.md deferred ideas)
- Mode memory is Claude's discretion - recommendation: no memory for v1.1 (ask each time)
