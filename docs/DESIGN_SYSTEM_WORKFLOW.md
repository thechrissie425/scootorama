# Design System Workflow (Runbook)

**Purpose:** the repeatable process for getting design system values and components from Figma into this codebase.
**Scope:** operational. For the strategy and ownership model, see [DESIGN_SYSTEM_INTEGRATION_GUIDE.md](./DESIGN_SYSTEM_INTEGRATION_GUIDE.md).

---

## 1. The chain of custody

```
Figma Variables ──► design-tokens/generated/figma.json  (mirror, generated)
                              │
                              │  human review + promotion
                              ▼
                    design-tokens/tokens.json           (source of truth)
                              │
                              │  npm run build:tokens (Style Dictionary)
                              ▼
              lib/design-tokens.js + lib/design-tokens.d.ts
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            tailwind.config.ts    components/ui/*
```

Two rules keep this honest:

1. **`design-tokens/tokens.json` is the source of truth, not Figma.** Figma is upstream input. The generated mirror is never built directly — [style-dictionary.config.js](../style-dictionary.config.js) reads `tokens.json` only.
2. **Promotion is deliberate.** The sync tool reports drift; a human decides what to accept. This protects the semantic layer (`color.formField.*`, `color.action.*`), which is authored in code and has no Figma equivalent today.

---

## 2. Setup (once per developer)

Add a Figma personal access token with the `file_variables:read` scope to `.env.local`:

```bash
FIGMA_ACCESS_TOKEN=figd_...
# Optional: override the file in design-tokens/figma-mapping.json
FIGMA_FILE_KEY=your-figma-file-key
```

Create the token at <https://www.figma.com/developers/api#access-tokens>.

> **Enterprise requirement:** the Variables REST API (`/v1/files/:key/variables/local`) is only available on Figma Enterprise. If `npm run tokens:check` returns 403, see [§6 Fallback](#6-fallback-without-enterprise-api-access).

---

## 3. Workflow A — a designer changed a token

Run this whenever design says values moved, and in CI on a schedule.

```bash
npm run tokens:check     # report drift; exits 1 if Figma and tokens.json disagree
```

Output classifies every difference:

| Symbol                   | Meaning                                       | Action                                                                             |
| ------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| `~`                      | Value differs between Figma and `tokens.json` | Decide which is correct. Usually promote Figma's value.                            |
| `+`                      | Exists in Figma, missing locally              | Add it to `tokens.json` if the codebase needs it.                                  |
| `ℹ️`                     | Exists locally, no Figma counterpart          | Expected for semantic tokens. Not an error.                                        |
| `⚠️ Unmapped collection` | New Figma collection                          | Add it to [design-tokens/figma-mapping.json](../design-tokens/figma-mapping.json). |

To promote changes:

```bash
npm run tokens:sync      # writes design-tokens/generated/figma.json
# review the generated mirror, copy accepted values into design-tokens/tokens.json
npm run build:tokens     # regenerate lib/design-tokens.*
npm run typecheck && npm run build
```

Commit `tokens.json` and the generated mirror together so the diff shows both what Figma said and what we accepted.

**Do not hand-edit `lib/design-tokens.js`** — it is generated and gitignored.

---

## 4. Workflow B — bringing a Figma component into code

Worked example: the `Form Field` component (`node-id=5959-22434`).

**Step 1 — read the design, don't guess.**

Use the Figma Dev Mode MCP tools rather than eyeballing a screenshot:

- `get_metadata` — structure and variant axes. Form Field exposes `State` (Enabled/Hovered/Focused/Pressed) × `Filled` (True/False), which become component props, not eight components.
- `get_variable_defs` — the bound tokens. This is the important one: it tells you which existing tokens the component already uses.
- `get_code_connect_map` — whether a code component is already mapped.

**Step 2 — map variables to existing tokens before writing any CSS.**

For Form Field this resolved to values already in `tokens.json`:

| Figma variable    | Repo token                                                     | Value          |
| ----------------- | -------------------------------------------------------------- | -------------- |
| `DarkGrey/Base`   | `color.formField.content`                                      | `#373F4D`      |
| `LightGrey/Base`  | `color.formField.fill.default`                                 | `#E5E8EC`      |
| `LightGrey/Dark`  | `color.formField.fill.press`, `color.formField.stroke.default` | `#CBD0D8`      |
| `Chonk`           | `stroke.chonk`                                                 | `2px`          |
| `Small` / `Large` | `radius.small` / `radius.large`                                | `8px` / `16px` |

If a value has no token, stop and add the token first. Never inline a hex.

**Step 3 — compose from `components/ui/`, don't generate new markup.**

Check what exists before building. Form Field is `label.tsx` + `input.tsx` + an error slot — not a new component. The variant axes map to props:

```tsx
<FormField state="focused" filled label="Email" />
```

**Step 4 — theme via tokens, matching the established pattern.**

```tsx
import * as tokens from '@/lib/design-tokens'

style={{
  borderRadius: tokens.RadiusSmall,
  borderWidth: tokens.StrokeChonk,
  '--field-fill': tokens.ColorFormFieldFillDefault,
  '--field-stroke': tokens.ColorFormFieldStrokeDefault,
}}
```

**Step 5 — add a Storybook story covering every Figma variant.** The story is the contract: if Figma has 8 states, the story has 8 states.

**Step 6 — register Code Connect** so the next person (or agent) gets your component back instead of regenerating it. See §5.

---

## 5. Code Connect (not yet set up — required)

`get_code_connect_map` currently returns `{}` for this design system. Nothing in Figma points at `components/ui/`, which means every design-to-code request rebuilds components from scratch. **This is the highest-leverage gap in the workflow**, especially for agent-assisted development.

Setup, once:

```bash
npx figma connect create --token $FIGMA_ACCESS_TOKEN
```

Then per component, e.g. `components/ui/input.figma.tsx`:

```tsx
import figma from '@figma/code-connect'
import { Input } from './input'

figma.connect(Input, 'https://figma.com/design/<fileKey>?node-id=18496-17205', {
  props: {
    state: figma.enum('State', {
      Enabled: 'enabled',
      Hovered: 'hovered',
      Focused: 'focused',
      Pressed: 'pressed',
    }),
    filled: figma.boolean('Filled'),
  },
  example: props => <Input {...props} />,
})
```

Publish with `npx figma connect publish`.

**Priority order:** map the already-themed primitives first — `button`, `input`, `label`, `checkbox`, `switch` — then composites.

---

## 6. Fallback without Enterprise API access

If the Variables API returns 403, either path works:

**Per-node, via Dev Mode MCP.** `get_variable_defs` on a node returns its bound variables without Enterprise access, as a flat `{ "Name/Path": "value" }` map. Save that output and feed it straight in:

```bash
npx tsx scripts/figma-tokens.ts --input path/to/vardefs.json
```

The script detects the flat shape automatically and maps it using the `prefixes` block in `figma-mapping.json` (collection metadata is absent, so grouping comes from name prefixes).

This is how the type ramp is currently harvested — see [§6a](#6a-harvesting-the-type-ramp).

**Saved API payload.** If anyone can produce a full Variables API response (or a Tokens Studio export in the same shape), the same command works:

```bash
npx tsx scripts/figma-tokens.ts --check --input path/to/variables.json
```

This is also how the transform is tested without hitting the network.

---

## 6a. Harvesting the type ramp

The ramp is the biggest gap in `tokens.json` (see §7). Until Enterprise API access exists, harvest it incrementally.

**How the ramp is structured in Figma:**

```
ZG Font/{category}/{step}/font-size      e.g. ZG Font/body/3/font-size   = 14
ZG Font/{category}/{step}/line-height    e.g. ZG Font/body/3/line-height = 20
ZG Font/{category}/{step}/font-weight    e.g. Medium
ZG Font/{category}/{step}/font-family    e.g. Scootorama Fondo
ZG Font Ramp/{Category}/{Step}           composite descriptor — ignored, not a value
```

**Procedure:**

1. Pick nodes that use a wide range of type styles — documentation frames are ideal, since they exercise headings, body and labels together.
2. Run `get_variable_defs` on each and save the JSON.
3. Run `npx tsx scripts/figma-tokens.ts --input <file>` for each; the script merges into `design-tokens/generated/figma.json`.
4. Promote the accumulated `typography.*` block into `tokens.json`.
5. Repeat until no new ramp steps appear.

**Verified so far** (from the Form Field documentation frame):

| Token                | Size / Line height | Weight | Family           |
| -------------------- | ------------------ | ------ | ---------------- |
| `typography.label.2` | 16px / 18px        | Bold   | Scootorama Fondo |
| `typography.body.3`  | 14px / 20px        | Medium | Scootorama Fondo |
| `typography.body.4`  | 12px / 16px        | Medium | Scootorama Fondo |

This is a partial ramp. **Do not promote a partial ramp into `tokens.json`** — a half-populated scale is worse than none, because components will be built against step numbers that may not survive contact with the full ramp. Harvest until complete, or get API access.

**Wiring into Tailwind** once the ramp lands, in `tailwind.config.ts`:

```ts
import * as tokens from './lib/design-tokens'

fontSize: {
  'body-3': [tokens.TypographyBody3FontSize, { lineHeight: tokens.TypographyBody3LineHeight }],
  'label-2': [tokens.TypographyLabel2FontSize, { lineHeight: tokens.TypographyLabel2LineHeight }],
}
```

Pairing size with line-height is what stops the two drifting apart in component code.

---

## 7. Known divergences (debt register)

### There are two Figma design systems — use the right one

| System  | File                                                   | Use for                                                                         |
| ------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Web** | `<web-library-file-key>` / Components                  | **This codebase.** Configured in `figma-mapping.json`.                          |
| Game    | `<game-library-file-key>` / Game — Tokens — Components | In-game HUD. Different naming, different type ramp, different button aesthetic. |

The web system's variable naming maps almost 1:1 onto `tokens.json` — it even uses the same semantic spacing names (`spacing/relaxed`, `spacing/extraCompact`). The game system uses a different vocabulary (`Space-16`, `Game Font/body/4`, `DarkGrey/Base`).

> **`tokens.json` appears to have been seeded, at least partly, from the _game_ system.** Evidence: `color.action.tertiary.fill.default` was `#FCFCFC` — exactly the game file's `White/Base` — where the web system specifies `#FFFFFF`. Corrected. `stroke.heftyChonk` = `6px` is likely the same class of error: both Figma files define Hefty-Chonk as `4`, which the repo calls `heckinChonk`.
>
> Auditing the rest of `tokens.json` against the web system is outstanding work. Only the tokens exercised by the button and form field have been verified so far.

### Current divergences

| Issue                                | Detail                                                                                                                                                                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stroke ramp mismatch**             | Both Figma files define `Hefty-Chonk` = `4`; the repo has `stroke.heftyChonk` = `6px` and `stroke.heckinChonk` = `4px`. Aliased to `heckinChonk`. The repo ramp appears to be off by one rung. |
| **`/default` suffix on leaf tokens** | Figma uses `color/action/primary/content/default`; the repo uses `color.action.primary.content`. Handled by aliases; worth aligning at source.                                                 |
| **Type ramp is partial**             | `typography.label.{1,2,3}` promoted (20/24, 16/20, 12/16) because the button needed them. The rest of the web ramp — `title`, `body`, `heading` — is still unmapped.                           |
| **Font family representation**       | Figma stores family names (`Scootorama Fondo`); the repo stores full CSS stacks (`Nunito-Bold, system-ui, sans-serif`). Not real drift — `font/family/` is ignored in the mapping.             |
| **Legacy numeric spacing**           | Figma still carries `Space-2`/`Space-12`/`Space-16` alongside the semantic `spacing/*` scale. Ignored in the mapping in favour of the semantic names.                                          |
| **Semantic binding is inconsistent** | Some components bind semantic tokens (`color/action/tertiary/fill/default`), others bind raw primitives. Consistent binding on both sides is what makes a token rename safe.                   |

---

## 8. Ownership

| Artifact                           | Owner              | Reviewer           |
| ---------------------------------- | ------------------ | ------------------ |
| Figma variables and components     | Design system team | —                  |
| `design-tokens/tokens.json`        | Design system team | Engineering        |
| `design-tokens/figma-mapping.json` | Engineering        | Design system team |
| `components/ui/*`                  | Engineering        | Design             |
| Code Connect mappings              | Engineering        | —                  |

Semantic token names are a **shared** decision. They are the interface between the two systems, and unilateral changes on either side create the divergences in §7.

---

## 9. CI

Recommended, not yet wired:

```yaml
# Scheduled drift detection — surfaces design changes as a PR comment or failure
- run: npm run tokens:check
  env:
    FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }}
```

Run this on a schedule rather than on every PR — it depends on an external API and on design activity, not on the commit under test.

Also worth adding to the pre-commit hook: `npm run typecheck`. It currently runs ESLint and Prettier only, which is how type errors have reached `main`.

---

## Reference

- [design-tokens/README.md](../design-tokens/README.md) — token catalogue
- [DESIGN_SYSTEM_INTEGRATION_GUIDE.md](./DESIGN_SYSTEM_INTEGRATION_GUIDE.md) — strategy and rationale
- [scripts/figma-tokens.ts](../scripts/figma-tokens.ts) — sync and drift implementation
- [Figma Code Connect docs](https://www.figma.com/developers/code-connect)
