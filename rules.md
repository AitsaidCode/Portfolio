# Engineering Rules & Guidelines

## 1. Core Principles of Conduct
1. **Zero Incomplete Code**: Never generate partial implementations, pseudo-code, or lazy comments (e.g. `// add logic here`, `/* rest of code unchanged */`, `// TODO: handle error`). Every function and file must be completely written and production-ready.
2. **Strict Guard Clauses & Error Handling**:
   - Always validate inputs at the top of functions using guard clauses and early returns.
   - Never nest deep `if-else` pyramids.
   - Wrap external I/O (network requests, storage access, DOM queries) in safe `try/catch` or conditional guards.
3. **Type Safety & Defensive Programming**:
   - Validate data types, DOM node existence, and external library bindings before access.
   - Handle null, undefined, empty strings, and malformed inputs defensively.
4. **Communication Style**:
   - Concise, direct, and factual.
   - No pleasantries or fluff.
   - No apologies for errors; immediately apply the correct technical fix.

---

## 2. Code Quality & Formatting Standards

### 2.1. JavaScript (ES6+)
- Use `const` by default; use `let` only when reassignment is mandatory. Never use `var`.
- Enforce strict equality checks (`===` and `!==`).
- Sanitize and trim all user strings prior to state mutation or payload submission.
- Prefer named functions or standard arrow functions with explicit signatures.
- Avoid memory leaks: clean up event listeners or use passive listeners where appropriate (`{ passive: true }`).

### 2.2. HTML5 & Semantic Integrity
- Maintain strict heading hierarchy (`h1` -> `h2` -> `h3`). Exactly one `h1` per page.
- All interactive elements must have unique, descriptive `id` and accessible `aria-label` attributes.
- Include explicit `width` and `height` attributes or aspect ratios on media elements to prevent Cumulative Layout Shift (CLS).

### 2.3. CSS & Design System
- Utilize CSS Custom Properties (`var(--...)`) defined in `:root`. Ad-hoc hex values scattered across selectors are prohibited.
- Use mobile-first or structured desktop-down media queries with consistent breakpoints (`640px`, `768px`, `1024px`, `1280px`).
- Ensure all interactive touch targets meet the minimum 44x44px standard.

---

## 3. Development Lifecycle Protocol
For every phase executed from `phases.md`:
1. **Implementation**: Write complete, robust, production-grade code.
2. **Testing & Edge Cases**: Validate functionality, verify null/undefined boundaries, test failure scenarios.
3. **Data Flow Documentation**: Explicitly trace:
   - **Data Source**: Where the data originates (user input, static config, API response).
   - **Usage / Mutation**: Where and how the data is transformed, validated, or rendered.
   - **Destination**: Where the data persists or dispatches (DOM update, database, external API).
4. **Tracking Updates**: Update `phases.md` status and log changes/decisions in `memory.md`.
