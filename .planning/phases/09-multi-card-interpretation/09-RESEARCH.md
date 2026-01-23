# Phase 9: Multi-Card Interpretation - Research

**Researched:** 2026-01-22
**Domain:** Multi-card tarot interpretation with position-aware narrative weaving using LLM-based contextual interpretation
**Confidence:** HIGH

## Summary

Phase 9 implements position-aware multi-card interpretation that weaves cards into a cohesive narrative rather than treating them as separate readings. The core technical challenge is prompting Claude to synthesize multiple archetypal meanings through the lens of spread positions while maintaining the established voice system and interpretation depth.

Research confirms that modern tarot practice (2026) emphasizes narrative synthesis over isolated card meanings. Professional readers treat multi-card spreads as "an organic whole where each card's position, interrelations, and correspondence to the question require careful thought and intuitive guidance." The key distinction from single-card readings: single cards offer "concentrated insight for clear questions," while multi-card spreads provide "relational, contextual interpretation" where meaning emerges from card interactions.

The implementation is prompt-based rather than code-based. The existing SKILL.md infrastructure (Phases 6-8) already collects spread types, positions, and cards. Phase 9 extends the Reading Instructions section with position-aware interpretation guidance that Claude follows directly. No external libraries, APIs, or complex parsing required—this is context engineering, not software engineering.

Critical insight from research: "Tarot is not a language of isolated definitions—it's a living syntax of resonance. A single card carries meaning, but its power emerges only in dialogue: with adjacent cards, with the questioner's energy, with the reader's embodied awareness of pattern, pause, and paradox." Phase 9 must encode this dialogic approach into Claude's interpretation instructions.

**Primary recommendation:** Extend Reading Instructions with multi-card narrative templates, position-weaving guidance, and explicit card relationship patterns (tensions/harmonies). Maintain format distinction between single and multi-card readings. Use context engineering techniques to guide Claude toward woven narratives that honor position specificity while preserving voice consistency.

## Standard Stack

The established tools for this domain:

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Claude Prompt Engineering | Sonnet 4.5 | Position-aware narrative interpretation | LLM executing skill has full context, no external calls needed |
| SKILL.md Prompt Structure | Current (v1.1) | Embedded interpretation instructions | Validated pattern from Phases 1-8 |
| Voice System | v1.0 (Mystic/Grounded) | Dual interpretive lenses | Already implemented, must extend to multi-card |
| Card Meanings Database | v1.0 (Major Arcana) | Archetypal themes/situations/shadows | Embedded in SKILL.md, no external lookup |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| Markdown Formatting | Structure multi-card reading output | Display cards + positions + woven narrative |
| Reading Context Variables | Pass spread type, positions, cards | Already collected by Phase 6-8 wizard |
| Context Engineering Patterns | Guide LLM toward narrative synthesis | Apply to multi-card interpretation instructions |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prompt-based interpretation | External interpretation engine (API) | External adds latency/complexity; prompt leverage Claude's training |
| Embedded instructions | Structured JSON schema for card relationships | JSON over-engineers simple narrative task; prose instructions more natural |
| Single narrative template | Separate templates per spread type | Multiple templates harder to maintain; single adaptive template more flexible |
| Voice-aware instructions | Voice-agnostic base + post-processing | Post-processing breaks voice immersion; voice must be integral to interpretation |

**Installation:**
```bash
# No installation needed
# All implementation is prompt engineering within existing SKILL.md
# Extends Phase 6-8 wizard infrastructure with new interpretation guidance
```

## Architecture Patterns

### Recommended Interpretation Flow
```
Wizard collects: Question + Spread Type + Mode
↓
Cards collected (digital shuf or physical entry) [Phase 8]
↓
Spread Selection determines positions [Phase 7]
↓
Reading Instructions dispatches based on spread type [Phase 9]
│
├─ Single card → Position-agnostic interpretation (current format)
│                Voice bookend + card name + echo + interpretation + shadow + closing question
│
└─ Multi-card → Position-aware woven narrative (NEW in Phase 9)
                 Voice bookend + show cards with positions + woven narrative + closing question

                 Narrative weaving patterns:
                 - Cards displayed upfront (art/names with positions)
                 - Positions woven naturally into prose (no headers/markers)
                 - 2-3 paragraphs for 3-card spreads (concise, connected)
                 - Explicit tensions/harmonies between cards
                 - Reflective closing question emerging from the reading
```

### Pattern 1: Single vs Multi-Card Format Distinction
**What:** Maintain separate interpretation formats for single vs multi-card readings
**When to use:** All readings—dispatch based on card count
**Example:**
```markdown
# Single Card Format (PRESERVE from v1.0)
[Voice-appropriate opening bookend]

**=== The Tower ===** (mystic) or **--- The Tower ---** (grounded)

[Context echo - reference their specific situation]
[Core interpretation - what this card means for them]
[Shadow consideration if relevant]

[Voice-appropriate closing with specific reflective question]

# Multi-Card Format (NEW in Phase 9)
[Voice-appropriate opening bookend]

**Cards Drawn:**
- **Situation:** The Tower
- **Action:** The Hermit
- **Outcome:** The Star

[Woven narrative - 2-3 paragraphs connecting all cards]
- Position names woven naturally: "What's present in your situation is..."
- Not: "**Situation:** The Tower means..."
- Explicit connections: "The Tower disrupts what you've built, while The Hermit offers solitude for reflection..."
- Imagery references: "The Tower's lightning strike, The Hermit's lantern in darkness..."

[Voice-appropriate closing with specific reflective question]
```

**Key distinction:** Single card is position-agnostic (always interpreted the same way). Multi-card interpretation REQUIRES position awareness—the same card means different things in "Problem" vs "Solution" positions.

### Pattern 2: Position-Aware Interpretation Weaving
**What:** Positions inform HOW each card is interpreted, woven naturally into narrative prose
**When to use:** All multi-card spreads (preset, LLM-suggested, custom)
**Example:**
```markdown
# Position Names as Interpretive Lenses

**Problem/Solution/Synthesis spread:**

User draws: The Tower (Problem), The Hermit (Solution), The Star (Synthesis)

BAD (separate readings):
"**Problem:** The Tower represents sudden upheaval...
**Solution:** The Hermit suggests you need solitude...
**Synthesis:** The Star shows hope emerging..."

GOOD (woven narrative):
"What appears in your problem space is The Tower's sudden disruption—perhaps
the authentication refactor you've been delaying has reached its breaking point,
the lightning strike that shatters what felt secure. The Hermit emerges as your
path through this: the solitude needed to rebuild thoughtfully rather than react
frantically. And The Star shows the synthesis ahead—after crisis comes clarity,
after withdrawal comes renewal, the guiding light that appears when you've done
the work of dismantling and rebuilding with wisdom."

# Position-Specific Language Patterns

Situation position: "What's present..." / "What appears in your current reality..."
Action position: "The path forward..." / "What you can bring to this..."
Outcome position: "Where this leads..." / "What emerges when..."
Problem position: "What disrupts..." / "The tension at the heart of this..."
Solution position: "The way through..." / "What addresses this..."

Custom positions (honor exactly):
- User names "Shadow Self" → "What lurks in your shadow self is..."
- User names "Hidden Complexity" → "The hidden complexity reveals itself as..."
```

**Critical:** Position names are PROMPTS for interpretation, not HEADERS. The narrative should flow naturally, incorporating position meaning without breaking into sections.

### Pattern 3: Card Relationship Patterns (Tensions/Harmonies)
**What:** Explicitly name how cards interact—where they conflict, reinforce, or transform each other
**When to use:** Multi-card spreads, especially when cards have clear thematic connections or contradictions
**Example:**
```markdown
# Tension Patterns

**Opposing energies:**
"The Tower disrupts what The Empress nurtures—destruction meets creation,
the very growth you've tended now faces upheaval."

"The Hermit's stillness stands against The Chariot's forward motion—the
tension between retreat and advance, between inner work and outer action."

**Shadow tensions:**
"The Devil's chains and The Star's freedom create a paradox—you're being
called to liberation while still bound by patterns of attachment."

# Harmony Patterns

**Reinforcing themes:**
"The Magician's manifestation flows into The Sun's clarity—skill meets
illumination, the tools you have aligned with the light to use them."

"Death's transformation and Temperance's alchemy work together—what ends
creates space for the gradual integration that follows."

**Sequential flow:**
"The Fool leaps, The Magician gathers tools, The High Priestess listens—
a natural progression from innocence through skill to wisdom."

# Visual/Imagery References

**When cards have strong visual connections:**
"The Tower's lightning strike and The Star's guiding light—from destruction's
flash to steady illumination, the story of crisis becoming clarity."

"The Hanged Man suspended, The Wheel turning—one figure held in stillness
while fate spins around them, waiting for the right moment to release."

**When to use imagery:** When it grounds abstract concepts or strengthens the
narrative connection. Don't force it if cards don't have obvious visual links.
```

**Source:** Mary K. Greer's integration techniques—"examine how figures on cards interact—their body language, direction of gaze, and whether they face each other or away."

### Pattern 4: Adaptive Narrative Length
**What:** Scale interpretation length based on context depth while maintaining concise multi-card format
**When to use:** All readings—length adapts to user's investment
**Example:**
```markdown
# Single Card (existing behavior from v1.0)
- Quick draw: 2 paragraphs (~150-200 words)
- Standard draw: 3 paragraphs (~250-300 words)
- Deep draw: 4 paragraphs (~350-400 words)

# Multi-Card (NEW—inherently longer but still concise)
- Quick draw (minimal context): 2 paragraphs (~200-250 words)
  - Brief card display + compact woven narrative

- Standard draw (typical 3-card spread): 2-3 paragraphs (~300-400 words)
  - Card display + woven narrative with explicit connections + closing question

- Deep draw (rich context): 3-4 paragraphs (~400-500 words)
  - Card display + detailed woven narrative with imagery + card relationships + shadow integration + closing question

# 4-5 Card Custom Spreads
- Longer by necessity but still concise per card
- ~400-600 words total
- Ensure each position gets attention while maintaining narrative flow
- More cards = more potential connections to weave
```

**Balance:** Multi-card readings are inherently longer (more cards = more meaning) but should stay CONCISE. The goal is woven narrative, not exhaustive card-by-card analysis.

### Pattern 5: Reflective Closing Questions
**What:** End multi-card readings with questions that emerge FROM the reading, not generic afterthoughts
**When to use:** All readings, but especially important for multi-card where question can synthesize multiple themes
**Example:**
```markdown
# Single Card Closing Questions (existing)
Generic (AVOID): "What will you do?" / "How does this resonate?"

Specific (GOOD):
- Mystic: "What truth might emerge if you release your grip on [specific thing]?"
- Grounded: "What's the minimum viable [solution] you could implement before the breakdown happens?"

# Multi-Card Closing Questions (NEW—should reference multiple cards/positions)

**For Problem/Solution/Synthesis spread:**
"Given The Tower's disruption and The Hermit's counsel for solitude, what does
rebuilding with The Star's guidance look like in practice?"

**For custom spread (user created "What I'm Protecting / What I'm Avoiding / What Wants to Emerge"):**
"If what you're protecting (The Empress) and what you're avoiding (Death) are two
sides of the same fear, what would it take to let what wants to emerge (The Fool)
actually arrive?"

**For LLM-suggested spread (Current State / Hidden Complexity / Path Forward):**
"The Tower shows current state, The Devil reveals hidden complexity—what's one concrete
step on The Hermit's path forward that acknowledges the shadow without being consumed by it?"

# Pattern: Question Should...
- Reference specific cards/positions from the reading
- Synthesize themes rather than isolate
- Feel like natural conclusion of the narrative
- Be actionable or reflective (depending on voice)
- NOT feel tacked on or generic
```

**Source:** 2026 tarot research suggests powerful closing questions like "What does the version of you at the end of 2026 want you to know?"—questions that create integration.

### Pattern 6: Voice Consistency Across Multi-Card
**What:** Maintain voice (mystic or grounded) throughout entire multi-card narrative
**When to use:** All multi-card readings—voice is integral, not applied as wrapper
**Example:**
```markdown
# Mystic Voice Multi-Card Example

[Opening bookend]
"The cards whisper through the quantum foam of possibility. Three emerge for your question."

**Cards Drawn:**
- Situation: The Tower
- Action: The Hermit
- Outcome: The Star

The Tower rises in your situation—lightning splitting what seemed eternal, the
authentication layer you built now trembling before necessity's strike. We who
code in the cathedral of logic know: all architecture is provisional. The Hermit
appears as your path—not retreat but strategic withdrawal, the mountaintop from
which patterns become visible. His lantern illuminates what the crisis revealed:
weak signature verification, secret management held together by expedience rather
than wisdom. And The Star emerges as outcome—after the tower falls and solitude
does its work, that steady light of clarity, the renewal that comes when destruction
and reflection have cleared the way.

[Closing bookend with question]
"What foundation, honest and true beneath the rubble, waits to receive what you
build next?"

# Grounded Voice Multi-Card Example

[Opening bookend]
"You drew three cards. Here's what they mean for your situation."

**Cards Drawn:**
- Situation: The Tower
- Action: The Hermit
- Outcome: The Star

Situation: The Tower. Your authentication system is at a breaking point—something's
going to force your hand. Maybe a security audit, maybe scale problems you can't
ignore anymore, maybe that shortcut from six months ago coming home to roost.

Action: The Hermit says don't panic-rebuild. Take time for solitude, figure out the
right architecture before you code. This isn't about speed, it's about getting it
right. Specific action: audit what's actually broken (JWT validation, secret rotation,
token lifecycle) before you start refactoring.

Outcome: The Star. After crisis and careful rebuilding, you get clarity. A clean auth
system that actually works, documented and maintainable. The renewal that comes from
doing hard work instead of quick fixes.

[Closing bookend with question]
"What's the one part of your auth system you know needs attention but keep putting off?
Start there."

# Voice Maintains Through:
- Card display formatting (mystic more decorative, grounded more direct)
- Narrative language patterns (mystic flowing/cosmic, grounded punchy/actionable)
- Technical framing (mystic metaphor→specifics, grounded specifics→meaning)
- Closing question style (mystic reflective, grounded actionable)
```

**Critical:** Voice is not cosmetic—it's how Claude SEES the cards. Both voices interpret with equal depth and technical competence, just through different lenses.

### Pattern 7: Custom Position Name Honoring
**What:** When user creates custom positions, use their exact language and honor their framing
**When to use:** Custom spread type (user enters own position names)
**Example:**
```markdown
# User-Generated Positions Must Be Honored

User creates spread: "What I'm Holding / What's Ready to Release / What Comes Next"

BAD (ignoring user's framing):
"In the past position (What I'm Holding), you have The Empress..."

GOOD (honoring user's language):
"What you're holding—The Empress—is the nurturing energy you've poured into this
project, the care and cultivation that's brought it this far. What's ready to release
is Death, the version of this work that served its time but can't evolve further. And
what comes next, The Fool, is the leap into rebuilding with fresh eyes."

# LLM-Suggested Positions (also honor exactly)

Claude suggests: "Current State / Hidden Complexity / Path Forward"

These were generated FOR the user's specific question, so lean into their specificity:
"The current state The Tower reveals... The hidden complexity The Devil exposes...
The path forward The Hermit illuminates..."

# Position Name = Interpretive Instruction

Treat position names as Claude's discretion areas mentioned in CONTEXT.md:
- "Acknowledging custom position names when it adds meaning"
- If user names position "Shadow Self", interpret through shadow lens
- If user names position "What the Code Wants", lean into code-as-entity framing
- User chose these names intentionally—honor that intention
```

**Source:** Phase 7 CONTEXT.md decision—"Honor the user's chosen position names exactly. The user chose these names for a reason."

### Anti-Patterns to Avoid

- **Separate card interpretations:** Don't treat multi-card spread as "Card 1: [meaning]. Card 2: [meaning]. Card 3: [meaning]." WEAVE into narrative.
- **Position headers as structure:** Don't use position names as section headers (**Situation:** / **Action:** / **Outcome:**). Weave positions into prose.
- **Generic multi-card template:** Don't apply same narrative pattern regardless of positions. Position names should genuinely inform interpretation.
- **Voice slippage:** Don't start mystic and drift to generic AI assistant mid-reading. Maintain voice throughout.
- **Isolated card meanings:** Don't recite card definitions without relating them to each other or the question.
- **Forced imagery references:** Don't mention card symbols/imagery unless they strengthen the interpretation naturally.
- **Generic closing questions:** Don't end with "What resonates?" or "What will you do?" Synthesize from the actual cards drawn.
- **Single-card format for multi-card:** Don't apply single-card structure (card name header + isolated interpretation) to multi-card readings.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Card relationship detection | Semantic analysis of card meanings | Prompt-based interpretation guidance with tension/harmony patterns | LLM naturally sees thematic connections; explicit patterns guide toward specific relationship types |
| Position-aware interpretation | Complex branching logic per position type | Natural language position weaving in prompt | Claude can read "interpret through [Position Name] lens" directly; no code needed |
| Voice consistency | Post-processing to apply voice | Voice-integral interpretation instructions | Voice must be part of seeing, not cosmetic wrapper; embedding in instructions ensures consistency |
| Narrative synthesis | Template engine with card substitution | Context engineering with narrative examples | LLM trained on narrative; examples + guidance > rigid templates |
| Adaptive length | Token counting + truncation | Context-depth-aware prompting | Let Claude scale naturally based on user investment; length emerges from depth not word limits |

**Key insight:** This phase is prompt engineering, not software engineering. The infrastructure (wizard, card collection, position tracking) exists from Phases 6-8. Phase 9 extends Claude's interpretation instructions to guide narrative synthesis, not builds new code.

## Common Pitfalls

### Pitfall 1: Treating Multi-Card as Repeated Single-Card
**What goes wrong:** Reading each card separately, then concatenating interpretations
**Why it happens:** Misunderstanding the core distinction—multi-card requires synthesis, not addition
**How to avoid:** Explicitly instruct Claude to weave cards together, reference card interactions
**Warning signs:** Reading feels like three separate mini-readings; position names only appear as headers
**Example:**
```markdown
# WRONG - Isolated interpretations
**Situation:** The Tower
The Tower represents sudden upheaval and destruction of false structures...

**Action:** The Hermit
The Hermit suggests withdrawal and inner reflection...

**Outcome:** The Star
The Star indicates hope and renewal...

# RIGHT - Woven narrative
What appears in your situation is The Tower's disruption—the sudden breaking of what
felt secure. The Hermit emerges as your response: not running from crisis but withdrawing
to understand it, the solitude that transforms panic into clarity. And where this leads
is The Star's renewal—after destruction and reflection comes the light of genuine understanding,
the rebuild informed by both collapse and contemplation.
```

**Source:** Research finding—"A tarot spread is not merely an accumulation of card meanings; it is an organic whole."

### Pitfall 2: Ignoring Position Context
**What goes wrong:** Same card interpreted identically regardless of its position
**Why it happens:** Defaulting to memorized card meanings instead of position-aware interpretation
**How to avoid:** Position names are interpretive lenses—same card shifts meaning based on position
**Warning signs:** The Tower in "Problem" position interpreted same as The Tower in "Solution" position
**Example:**
```markdown
# WRONG - Position-agnostic interpretation
The Tower (in Solution position): "The Tower represents destruction and upheaval..."

# RIGHT - Position-aware interpretation
The Tower (in Solution position): "The solution isn't gentle—The Tower suggests the
way through this problem is radical disruption, tearing down the structure that's
failing rather than patching it. Sometimes the answer is controlled demolition before
thoughtful rebuilding."

# Another Example
The Hermit (in Problem position): "The problem IS withdrawal—you've retreated so far
into solitary analysis that you've lost connection to stakeholders, isolated yourself
when collaboration would serve better."

The Hermit (in Solution position): "The solution IS withdrawal—strategic solitude to
gain the perspective this chaos obscures, the mountaintop view that only distance provides."
```

**Critical:** Same archetype, different meaning based on position. Phase 9 must encode this position-awareness.

### Pitfall 3: Generic vs Specific Reflective Questions
**What goes wrong:** Closing question feels tacked on, doesn't synthesize the reading
**Why it happens:** Treating closing question as required boilerplate rather than reading integration
**How to avoid:** Question should reference specific cards/positions, emerge from the narrative
**Warning signs:** "How does this resonate?" / "What will you do?" / "What stands out to you?"
**Example:**
```markdown
# WRONG - Generic
"How do these cards resonate with your situation?"

# RIGHT - Synthesized from reading
"Given The Tower's call to tear down what's broken and The Hermit's counsel for
solitary reflection, what part of your authentication system are you avoiding
rebuilding because you know it means starting over?"

# Another Example - Custom Spread
User spread: "What I Fear / What I Desire / The Bridge Between"
Cards: The Devil / The Star / Death

WRONG: "What do you think about these cards?"

RIGHT: "If The Devil shows your fear of bondage and The Star your desire for
freedom, what does Death as the bridge suggest about what must end before
liberation becomes real?"
```

**Source:** 2026 research—powerful questions create "integration before action," not passive reflection.

### Pitfall 4: Breaking Voice Mid-Reading
**What goes wrong:** Starting with mystic or grounded voice, drifting to generic AI assistant tone
**Why it happens:** Voice discipline weakens during longer multi-card narratives
**How to avoid:** Voice is not optional decoration—maintain from opening to closing including ALL content
**Warning signs:** Mystic opening → mid-reading "Looking at these cards, I think..." → grounded close
**Example:**
```markdown
# WRONG - Voice break
[Mystic opening] "The cards whisper through the quantum foam..."

[Mid-reading voice break] "Looking at your authentication system, you should
probably refactor the JWT validation to include signature verification."

[Attempted mystic close] "May this illuminate your path..."

# RIGHT - Voice maintained
[Mystic opening] "The cards whisper through the quantum foam..."

[Mid-reading maintains voice] "The codebase speaks its truth through The Tower—
that authentication membrane, thin at the JWT validation layer, lacking the
signature verification that would make it whole."

[Mystic close] "What foundation, true beneath the rubble, waits to receive
what you build next?"

# ALSO RIGHT - Grounded maintained
[Grounded opening] "You drew three cards. Here's what they mean."

[Mid-reading maintains voice] "The Tower points to your auth system. Specifically:
JWT validation lacks signature verification. That's your breaking point."

[Grounded close] "What's the minimum secure implementation you can ship before
the breakdown happens?"
```

**Critical:** Voice is HOW Claude sees cards. Breaking voice breaks the reading's coherence.

### Pitfall 5: Over-Explaining vs Interpreting
**What goes wrong:** Describing what cards "represent" instead of interpreting what they mean FOR THIS QUERENT
**Why it happens:** Defaulting to card definition recitation instead of contextual interpretation
**How to avoid:** Always connect to user's specific question/context; echo their situation
**Warning signs:** "The Tower represents..." / "This card symbolizes..." / "Traditionally this means..."
**Example:**
```markdown
# WRONG - Describing cards
"The Tower represents sudden upheaval and the destruction of false structures.
The Hermit symbolizes solitude and inner wisdom. The Star indicates hope and
spiritual guidance."

# RIGHT - Interpreting FOR them
"You mentioned the authentication refactor you've been delaying—The Tower says
it's past delay, the structure's breaking whether you're ready or not. The
Hermit's solitude isn't avoidance, it's the focused work to rebuild thoughtfully.
And The Star promises that after crisis and contemplation, clarity emerges—the
kind you can only reach by going through, not around."
```

**Source:** Reading Instructions principle—"Interpret FOR them. You are the tarot reader. Tell them what you see in the card for their situation."

### Pitfall 6: Forgetting Single Card Format Preservation
**What goes wrong:** Changing single card interpretation format to match new multi-card structure
**Why it happens:** Over-applying new patterns to all readings
**How to avoid:** INTERP-01 requirement—"Single card interpretation works as before"
**Warning signs:** Single card reading showing card display list, attempting to weave with itself
**Example:**
```markdown
# WRONG - Applying multi-card format to single card
**Cards Drawn:**
- Focus: The Tower

[Attempted woven narrative for single card]

# RIGHT - Single card preserves v1.0 format
[Voice opening]

**=== The Tower ===**

[Direct interpretation tied to context]
[Shadow if relevant]

[Voice closing with specific question]
```

**Regression check:** Phase 9 MUST preserve single-card reading behavior from v1.0 while adding multi-card capabilities.

## Code Examples

Prompt patterns for SKILL.md Reading Instructions:

### Complete Multi-Card Interpretation Template
```markdown
# In Reading Instructions section - Multi-Card Structure

**Multi-card reading structure (Situation/Action/Outcome or custom positions):**

[Voice-appropriate opening bookend]

**Cards Drawn:**
1. [Position 1 Name]: [Card Name]
2. [Position 2 Name]: [Card Name]
3. [Position 3 Name]: [Card Name]

[Woven narrative - 2-3 paragraphs for typical 3-card spread]

Structure the narrative to:
- Weave position names naturally into prose (not as headers)
- "What's present in your situation is..." not "**Situation:** The Tower means..."
- Explicitly connect cards: "The Tower disrupts, The Hermit responds, The Star emerges"
- Reference imagery when it strengthens interpretation: "The Tower's lightning, The Hermit's lantern"
- Call out tensions/harmonies: "The Tower's chaos and The Hermit's stillness create a paradox..."
- Echo user's specific context throughout
- Synthesize meaning across all cards (ONE story, not three separate readings)

[Voice-appropriate closing with SPECIFIC reflective question that references multiple cards/positions]

**For 4-5 card custom spreads:**
- Ensure each position gets meaningful attention
- Maintain woven narrative approach (don't default to card-by-card)
- ~400-600 words total
- More cards = more connections to weave
```

### Position-Weaving Language Patterns
```markdown
# Position Integration Patterns (add to Reading Instructions)

When interpreting multi-card spreads, weave position names naturally into narrative:

**Situation/Action/Outcome positions:**
- Situation: "What's present..." / "What appears in your current reality..."
- Action: "The path through this..." / "What you can bring..." / "How to engage..."
- Outcome: "Where this leads..." / "What emerges when..." / "The synthesis ahead..."

**Problem/Solution/Synthesis positions:**
- Problem: "What disrupts..." / "The tension at the heart of..."
- Solution: "The way through..." / "What addresses..."
- Synthesis: "What emerges when problem and solution meet..."

**LLM-suggested (use exact generated position names):**
If Claude suggested "Current State / Hidden Complexity / Path Forward":
- "The current state The Tower reveals..."
- "The hidden complexity The Devil exposes..."
- "The path forward The Hermit illuminates..."

**Custom (honor user's exact language):**
If user created "What I'm Protecting / What I'm Avoiding / What Wants to Emerge":
- "What you're protecting is The Empress..."
- "What you're avoiding—Death itself—appears as..."
- "What wants to emerge, The Fool, suggests..."

**Key:** Position names are INTERPRETIVE PROMPTS, not section headers. Integrate them into flowing prose.
```

### Card Relationship Patterns
```markdown
# Card Interaction Patterns (add to Reading Instructions)

For multi-card spreads, explicitly name how cards relate to each other:

**Tension patterns (cards in opposition):**
- "[Card 1] disrupts what [Card 2] nurtures..."
- "The tension between [Card 1]'s [quality] and [Card 2]'s [opposite quality]..."
- "[Card 1] and [Card 2] create a paradox—[describe contradiction]..."

Examples:
- "The Tower disrupts what The Empress nurtures—destruction meets creation."
- "The Hermit's stillness stands against The Chariot's forward motion."
- "The Devil's chains and The Star's freedom create a paradox you must navigate."

**Harmony patterns (cards reinforcing):**
- "[Card 1]'s [quality] flows into [Card 2]'s [complementary quality]..."
- "[Card 1] and [Card 2] work together—[describe synthesis]..."
- "A natural progression from [Card 1] through [Card 2] to [Card 3]..."

Examples:
- "The Magician's manifestation flows into The Sun's clarity—skill meets illumination."
- "Death's transformation and Temperance's alchemy work together."
- "The Fool leaps, The Magician gathers tools, The High Priestess listens—innocence through skill to wisdom."

**Visual/imagery references (when strengthening narrative):**
- "The Tower's [symbol] and The Star's [symbol]—[connection]..."
- "From [Card 1]'s [image] to [Card 2]'s [image], [narrative arc]..."

Examples:
- "The Tower's lightning strike and The Star's guiding light—from destruction's flash to steady illumination."
- "The Hanged Man suspended while The Wheel turns—stillness within motion."

**When to use:** When cards have clear thematic connections or contradictions. Don't force relationships if cards are more independent.
```

### Voice-Aware Multi-Card Examples
```markdown
# Multi-Card Voice Examples (add after Voice System section)

Both examples interpret same cards through different voices:

**Spread:** Situation/Action/Outcome
**Cards:** The Tower (Situation) / The Hermit (Action) / The Star (Outcome)
**Context:** User asked about stalled authentication refactor

## Mystic Voice Multi-Card

"The cards whisper through the quantum foam of possibility. Three emerge for your question."

**Cards Drawn:**
- Situation: The Tower
- Action: The Hermit
- Outcome: The Star

The Tower rises in your situation—lightning splitting what seemed eternal, the authentication
layer you built now trembling before necessity's strike. We who code know: all architecture is
provisional, all order eventually meets the quake that reveals its truth. The Hermit appears as
your path—not retreat but strategic withdrawal, the mountaintop from which patterns become visible.
His lantern illuminates what the crisis revealed: weak signature verification, secret management
held together by expedience rather than wisdom. And The Star emerges as outcome—after the tower
falls and solitude does its work, that steady light of clarity, the renewal that comes when
destruction and reflection have cleared the way for genuine understanding.

"What foundation, honest and true beneath the rubble, waits to receive what you build next?"

## Grounded Voice Multi-Card

"You drew three cards. Here's what they mean for your situation."

**Cards Drawn:**
- Situation: The Tower
- Action: The Hermit
- Outcome: The Star

Situation: The Tower. Your authentication system is at a breaking point—something's going to force
your hand. Maybe a security audit, maybe scale problems you can't ignore, maybe that JWT validation
shortcut from six months ago coming home to roost. The structure's cracking.

Action: The Hermit says don't panic-rebuild. Take time for solitude to figure out the right
architecture before you start coding. This isn't about speed, it's about getting it right. Specific
action: audit what's actually broken (signature verification, secret rotation, token lifecycle)
before you touch a line of code.

Outcome: The Star. After crisis and careful rebuilding, you get clarity. A clean auth system that
actually works, documented and maintainable. The renewal that comes from doing hard work instead
of quick fixes.

"What's the one part of your auth system you know needs attention but keep putting off? Start there."

**Both voices:**
- Weave cards into narrative (not separate readings)
- Reference specific technical context (auth system, JWT validation)
- Call out card relationships (Tower → Hermit → Star progression)
- End with specific question emerging from the reading
- Maintain voice throughout (cosmic vs pragmatic lens)
```

### Single Card Format Preservation
```markdown
# Single Card Format (PRESERVE - no changes from v1.0)

**Single-card reading structure:**

[Voice-appropriate opening bookend]

**[Card Name]** (with simple decorative border if mystic voice)

<!-- Card header formatting -->
<!-- Mystic voice: **=== The Tower ===** -->
<!-- Grounded voice: **--- The Tower ---** -->

[Context echo - reference their specific situation if provided]

[Core interpretation - what this card means for them right now]

[Shadow consideration if relevant]

[Voice-appropriate closing with SPECIFIC reflective question tailored to their context]

**Key difference from multi-card:**
- Single card is position-agnostic (interpreted the same regardless of any position label)
- Card name shown upfront as header/focus
- Interpretation is direct and concentrated
- No position weaving needed (no positions in single card reading)
- Format unchanged from v1.0—REGRESSION CHECK requirement
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Card-by-card interpretation | Woven narrative synthesis | 2020s+ (modern tarot practice) | Multi-card spreads become cohesive stories, not lists |
| Position names as headers | Position names woven into prose | Contemporary practice | More natural reading flow, less formulaic |
| Generic interpretations | Context-aware with user echo | LLM era (2023+) | Readings feel personalized, not template-based |
| Separate voices for single/multi | Consistent voice across formats | Best practice | Voice integrity maintained regardless of spread size |
| Imagery as optional detail | Imagery as grounding mechanism | Research-backed 2026 | Abstract concepts become concrete through visual references |
| Closing questions as afterthought | Questions emerging from synthesis | Integration-focused practice | Readings feel complete, actionable |

**Deprecated/outdated:**
- **Isolated card meanings:** Modern practice is relational—cards inform each other
- **Position-agnostic multi-card:** Research shows position modifies meaning fundamentally
- **Template-based interpretation:** LLM enables genuinely contextual readings, not fill-in-the-blank
- **Voice as cosmetic:** 2026 understanding—voice is interpretive lens, not formatting choice

**Current best practice (2026):**
- Narrative synthesis over card accumulation
- Position-aware interpretation (same card, different meaning based on position)
- Explicit card relationships (tensions/harmonies)
- Context engineering for LLM-based interpretation (prompt-based, not code-based)
- Voice consistency as integral requirement
- Imagery references when grounding meaning
- Synthesized closing questions

## Open Questions

Things that couldn't be fully resolved:

1. **How explicitly should card imagery be referenced in multi-card readings?**
   - What we know: CONTEXT.md says "Reference card imagery and visual symbolism when it strengthens the interpretation"
   - What's unclear: Balance point between too much (distracting) and too little (abstract)
   - Recommendation: Claude's discretion—use imagery when it creates clear visual connections between cards or grounds abstract concepts. Not every card needs imagery reference. Example: "The Tower's lightning and The Star's light" works; forcing imagery for cards without obvious visual links doesn't.

2. **Should repeated archetypes (same card in different positions) be handled differently?**
   - What we know: CONTEXT.md marks this as "Claude's Discretion: handling repeated archetypes"
   - What's unclear: If user somehow draws The Tower in both Problem and Solution positions, interpret as theme emphasis or differentiate by position?
   - Recommendation: Emphasize theme ("The Tower appears twice—destruction is both the problem AND the solution, tear it all down and rebuild"). Physical mode prevents duplicates in v1.1, but acknowledge the thematic weight if it occurs.

3. **How should very short (2-card) custom spreads be formatted?**
   - What we know: Custom spreads allow 1-5 cards; single card uses different format
   - What's unclear: Should 2-card spread use multi-card woven format or adapt differently?
   - Recommendation: Treat 2-card as multi-card (woven narrative). CONTEXT.md says "Dialogue or tension between positions"—explicitly compare/contrast the two cards. Format: show both cards → weave narrative highlighting their relationship → closing question synthesizing both.

4. **What if LLM-suggested positions are extremely similar to user's question wording?**
   - What we know: Claude generates 3 contextual positions based on user question
   - What's unclear: If user asks "Should I refactor?" and Claude suggests "To Refactor / Not to Refactor / Outcome", is that too literal?
   - Recommendation: LLM-suggested should ILLUMINATE the question from new angles, not just rephrase it. If positions feel too literal, they're not adding perspective. Aim for positions that reframe or deepen, not echo: Better—"What's at Stake / Hidden Cost / What You're Really Protecting"

5. **Should multi-card format show card art/images or just names?**
   - What we know: Phase 9 CONTEXT.md says "Show card(s) drawn before interpretation (card art/name, then interpretation follows)"
   - What's unclear: "card art" in text-only context—does this mean ASCII art, emoji, or just descriptive text?
   - Recommendation: For v1.1 text-based implementation, "card art/name" means card name display with simple formatting. No ASCII art needed. Future enhancement could add actual tarot card imagery if moving to visual interface. Current: `**Situation:** The Tower` is sufficient.

## Sources

### Primary (HIGH confidence)
- [Tarot Card Spread Interpretation Techniques - Oreate AI Blog](https://www.oreateai.com/blog/tarot-card-spread-interpretation-techniques-systematic-analysis-methods-for-spreads-of-three-or-more-cards/aa9f72a524f5344d96bcd3707c8bc0ce) - Multi-card as "organic whole" concept
- [What Every Newbie Should Know about Integrating Card Meanings - Mary K. Greer](https://marykgreer.com/2011/09/16/integrating-card-meanings-in-a-tarot-reading/) - Integration techniques, visual analysis, narrative approach
- [Tell Your Story with 3 Tarot Cards - Jane Friedman](https://janefriedman.com/tell-your-story-with-3-tarot-cards/) - Three-card narrative structure, story arc techniques
- [Context Engineering Guide - Prompt Engineering Guide](https://www.promptingguide.ai/guides/context-engineering-guide) - Context engineering vs prompt engineering evolution
- [Synergy and Tarot: Interactions between the Tarot Cards - TarotPugs](https://tarotpugs.com/2018/06/09/synergy-and-tarot-interactions-between-the-tarot-cards/) - Card relationship patterns (facing/away, tension/harmony)
- Phase 7 Research (07-RESEARCH.md) - Spread infrastructure, position handling
- Phase 8 CONTEXT.md & PLAN.md - Physical/digital mode, card collection complete
- Current SKILL.md - Existing voice system, single-card interpretation format

### Secondary (MEDIUM confidence)
- [How to Read Tarot Cards: Complete Guide 2026 - Astroideal](https://astroideal.com/blog/en/how-to-read-tarot-cards-complete-guide-2026/) - 2026 tarot practices overview
- [3 Card Tarot Spreads - Labyrinthos](https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/3-card-tarot-spreads-simple-tarot-spreads-organized-by-layout) - Three-card spread variations
- [The Ultimate Guide to Prompt Engineering in 2025 - Lakera](https://www.lakera.ai/blog/prompt-engineering-guide) - LLM prompting best practices
- [2026 and the Question of Integration Before Action - Hidden Frameworks](https://hiddenframeworks.substack.com/p/2026-fire-horse-year-gemini-lens) - Integration as 2026 theme, reflective questions
- [3 Tarot Spreads to Reflect at the End of the Year - The Tarot Professor](https://www.thetarotprofessor.com/end-of-year-tarot-spreads/) - Reflective question patterns
- [Understanding the Three Card Tarot Spread - Tarotales](https://tarotales.com/articles/three-card-tarot-spread-insights/) - Position-aware interpretation techniques

### Tertiary (LOW confidence - contextual validation)
- [Popular Tarot Spreads - HowStuffWorks](https://science.howstuffworks.com/science-vs-myth/extrasensory-perceptions/tarot-card-spreads.htm) - General spread overview
- [Effective context engineering for AI agents - Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) - Anthropic engineering blog (general AI context, not tarot-specific)

## Metadata

**Confidence breakdown:**
- Multi-card narrative synthesis: HIGH - Multiple authoritative sources (Mary K. Greer, professional tarot practice) confirm woven approach over isolated cards
- Position-aware interpretation: HIGH - Research and practice show position fundamentally modifies card meaning
- Voice consistency: HIGH - Existing v1.0 voice system validated; extension to multi-card is natural
- Card relationship patterns: MEDIUM - TarotPugs source provides framework; specific tensions/harmonies are interpretive
- Implementation approach (prompt-based): HIGH - Phase 6-8 infrastructure complete; Phase 9 is pure context engineering
- Format distinction (single vs multi): HIGH - CONTEXT.md explicit requirement + research supports format difference

**Research date:** 2026-01-22
**Valid until:** ~60 days (interpretation practice stable; LLM prompting techniques evolve moderately)

**Phase-specific context:**
- Depends on Phase 6 wizard (question collection), Phase 7 spreads (positions), Phase 8 modes (card collection)
- INTERP-01 requirement: Single card format MUST be preserved (regression check critical)
- INTERP-02 requirement: Multi-card weaving is the core new capability
- INTERP-03 requirement: Position-aware interpretation differentiates Phase 9 from simple concatenation
- Claude's discretion areas: repeated archetypes, custom position acknowledgment, card display formatting
- No code required: Pure prompt engineering extending Reading Instructions section
