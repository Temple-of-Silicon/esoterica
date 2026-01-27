---
phase: quick-001
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [README.md]
autonomous: true

must_haves:
  truths:
    - "README accurately describes all current features"
    - "Voice naming matches actual config values (grounded, not direct)"
    - "No claims about features that don't exist"
  artifacts:
    - path: "README.md"
      provides: "Accurate project documentation"
      contains: "grounded"
  key_links:
    - from: "README.md"
      to: "skills/tarot/SKILL.md"
      via: "feature descriptions match"
      pattern: "grounded"
---

<objective>
Update README.md to accurately reflect the current v1.3 feature set.

Purpose: README contains outdated information (wrong voice name, claims about non-existent features) and is missing documentation for newer features like deck choice and physical mode.

Output: Accurate README.md that matches SKILL.md capabilities
</objective>

<execution_context>
@/Users/jem/.claude/get-shit-done/workflows/execute-plan.md
@/Users/jem/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@README.md
@skills/tarot/SKILL.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix inaccuracies and update voice naming</name>
  <files>README.md</files>
  <action>
Fix these specific issues in README.md:

1. **Voice naming (line 94-95):** Change "Direct voice" to "Grounded voice" to match actual config value. The config uses `voice=grounded`, not `voice=direct`.

2. **Technical truth section (line 17):**
   - Remove "full RWS imagery" claim - there are no images in the skill
   - Remove "reading history" claim - this feature doesn't exist yet
   - Fix voice naming: "2 interpretive voices (Mystic and Grounded)"
   - Keep: "78 cards (Major and Minor Arcana), 4 spread types, CLI-native"

3. **Voice configuration example (line 101-106):** Change `voice=grounded` comment to match the actual default. The example shows `voice=mystic` but the comment should clarify grounded is the default.

4. **Voice Selection section (line 89-106):** Update the description of the grounded voice to match SKILL.md:
   - "Grounded voice" not "Direct voice"
   - Example quote should match SKILL.md style

Do NOT add new sections in this task - just fix inaccuracies.
  </action>
  <verify>
    - `grep -i "direct voice" README.md` returns no results
    - `grep "grounded" README.md` returns multiple matches
    - No mention of "RWS imagery" or "reading history" in README.md
  </verify>
  <done>README contains no inaccurate claims and voice naming matches config values</done>
</task>

<task type="auto">
  <name>Task 2: Document deck choice and physical mode features</name>
  <files>README.md</files>
  <action>
Add documentation for features that exist but aren't mentioned:

1. **Wizard section (around line 42-48):** Update the wizard description to mention the full flow:
   - Your question or context
   - Which spread to use
   - **Which deck (Major Arcana only or Full 78-card deck)** - ADD THIS
   - Digital draw or physical deck

2. **The Deck section (around line 122-132):** Add a brief note about deck choice:
   - "During readings, choose Major Arcana only (22 cards) for focused archetypal readings, or the full 78-card deck for complete tarot experience."

3. **Usage Examples section:** Add one example showing physical deck mode:
   ```
   ### Physical Deck Mode

   Use your own cards — shuffle physically, enter what you draw.

   ```
   /tarot
   > Question: Decision I'm facing
   > Spread: Single card
   > Deck: Major Arcana only
   > Mode: Physical deck
   ```

   The wizard guides you through entering your drawn card(s) with flexible input (card names, numbers, or abbreviations).
   ```

Keep additions brief - this is a README, not full documentation.
  </action>
  <verify>
    - `grep -i "physical" README.md` returns results
    - `grep -i "deck" README.md` shows deck choice mention
    - README stays under 200 lines total
  </verify>
  <done>README documents deck choice and physical mode features</done>
</task>

</tasks>

<verification>
After both tasks:
1. All feature claims in README are accurate (no non-existent features)
2. Voice naming is consistent (grounded, not direct)
3. New features (deck choice, physical mode) are documented
4. README remains concise and readable
</verification>

<success_criteria>
- README accurately reflects SKILL.md capabilities
- No mention of non-existent features (RWS imagery, reading history)
- Voice naming matches config values throughout
- Deck choice and physical mode documented
- README under 200 lines
</success_criteria>

<output>
After completion, create `.planning/quick/001-review-readme-and-update-for-current-fea/001-SUMMARY.md`
</output>
