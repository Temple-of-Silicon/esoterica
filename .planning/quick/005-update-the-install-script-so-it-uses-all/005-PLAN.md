---
phase: quick-005
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - bin/install.js
autonomous: true

must_haves:
  truths:
    - "Running npx @templeofsilicon/esoterica installs all 6 user-facing skills"
    - "Internal skill (generate-image) is NOT installed"
    - "Help text accurately describes multi-skill installation"
    - "Uninstall removes all installed skills"
  artifacts:
    - path: "bin/install.js"
      provides: "Multi-skill installation logic"
      contains: "SKILLS_TO_INSTALL"
  key_links:
    - from: "bin/install.js"
      to: "skills/*"
      via: "loop over skill directories"
      pattern: "forEach.*skill"
---

<objective>
Update the install script to install all 6 user-facing skills instead of just tarot.

Purpose: Users who run `npx @templeofsilicon/esoterica` should get all available skills (tarot, micro-ritual, sacred-blessing, romantical, correspondence, incantation) but NOT the internal generate-image skill.

Output: Updated bin/install.js that installs all skills to the target directory.
</objective>

<execution_context>
@/Users/jem/.claude/get-shit-done/workflows/execute-plan.md
@/Users/jem/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@bin/install.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update install.js for multi-skill installation</name>
  <files>bin/install.js</files>
  <action>
Refactor bin/install.js to install all user-facing skills:

1. Define skills list at top (after require statements):
```javascript
const SKILLS_TO_INSTALL = [
  'tarot',
  'micro-ritual',
  'sacred-blessing',
  'romantical',
  'correspondence',
  'incantation'
];
// Note: generate-image is internal and NOT included
```

2. Update help text:
- Change "Tarot reading skill" to "Esoterica skills collection"
- Update path examples from `skills/tarot` to `skills/` (indicating multiple)
- Update "After installation" section to mention multiple skills with their slash commands

3. Update getInstallTarget():
- Change dest from `path.join(..., 'skills', 'tarot')` to `path.join(..., 'skills')` (parent directory)
- Keep label updates (remove "tarot" from labels)

4. Update install logic:
- Loop over SKILLS_TO_INSTALL array
- For each skill, copy from `skills/{skillName}` to `target.dest/{skillName}`
- Update "already exists" check to check parent skills dir
- Update verification to check all SKILL.md files exist

5. Update uninstall logic:
- Loop over SKILLS_TO_INSTALL and remove each skill directory
- Keep parent skills dir intact (may have other skills)

6. Update all console messages:
- "Installing Esoterica skills..." (plural)
- "Esoterica installed successfully!" (no "tarot")
- Success message: list all installed skills
- Next steps: mention all available slash commands

7. Add witchy flourish to success message:
- List the skills installed with a mystical feel
- Keep "The cards are shuffled. The threshold awaits." but add more
  </action>
  <verify>
Run `node bin/install.js --help` and verify:
- Help text mentions multiple skills
- Path examples show skills/ not skills/tarot

Dry-run test (don't actually install):
- Read through the updated logic to confirm loop structure
  </verify>
  <done>
- SKILLS_TO_INSTALL array contains 6 skills (not generate-image)
- Help text updated for multi-skill context
- Install loops over all skills
- Uninstall loops over all skills
- All console messages reflect plural skills
  </done>
</task>

</tasks>

<verification>
- `node bin/install.js --help` shows updated multi-skill help
- Code review confirms SKILLS_TO_INSTALL has exactly 6 skills
- Code review confirms generate-image is NOT in the list
- Install/uninstall logic loops over SKILLS_TO_INSTALL array
</verification>

<success_criteria>
- Script installs all 6 user-facing skills to target directory
- generate-image skill is excluded from installation
- Help text accurately describes multi-skill installation
- Success messages list all installed skills
</success_criteria>

<output>
After completion, create `.planning/quick/005-update-the-install-script-so-it-uses-all/005-SUMMARY.md`
</output>
