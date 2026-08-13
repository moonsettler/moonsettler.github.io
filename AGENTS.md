# AGENTS.md

GitHub Pages user site (`moonsettler.github.io`) hosting self-contained, offline-usable Bitcoin demo tools. Pure static HTML/CSS/vanilla JS with vendored third-party libraries.

## No build system

There is no `package.json`, bundler, test suite, linter, or formatter. Verification is opening the page in a browser. `index.html` files load scripts with plain `<script>` tags in order — preserve that order and keep all paths relative so pages still work over `file://` (offline use is a stated goal).

Deployment: GitHub Pages serves the `main` branch directly. `.nojekyll` prevents Jekyll processing. There is no CI workflow (a `static.yml` was added and reverted).

## Structure

- `index.html` — landing page linking the demos below.
- `argon-bwg/` — "Border Wallet Generator": derives a BIP-39 mnemonic from SHA256(file) + passphrase via Argon2id.
  - `01/` — v0.1, pure-JS Argon2id (worker-based).
  - `02/` — v0.2, WASM argon2 (current version; `argon-bwg/index.html` redirects here).
- `lamport-js/` — Lamport signature generator for CashVM (BCH spec). Global namespace: `bitcoinjs`, plus `buffer.Buffer` from `lib/buffer-6.0.3.js`. `js/script.js` defines op helpers (`op_hash160`, `op_cat`, ...) mirroring CashVM opcodes; `js/lamport.js` defines the `Lamport` class. Load order in `index.html` is required: `lib/` bundles first, then `js/assert.js`, `js/script.js`, `js/lamport.js`, then `index.js`.

## Vendored libraries — treat as read-only

Every app's `lib/` (and `argon-bwg/02/dist/`) contains pinned, often single-line minified UMD bundles. Do not reformat, "fix", or prettify them. Each app README records the upstream repo/commit and SHA256 checksums of every vendored file, plus local modifications:
- `argon-bwg/02/lib/argon2.js` (vendored argon2-browser) loads `argon2.wasm` via a relative path (`../dist/argon2.wasm`) — keep the wasm next to `dist/argon2.js`. v0.1 is pure JS (no wasm). `lib/argon2id.js` and `lib/argon2id_worker.js` are hand-written wrappers (not vendored) spawning a worker that `importScripts("argon2.js")`.
- `jsbip39.js` in both argon versions has PBKDF2_ROUNDS hardcoded to 2048 (random-mnemonic code stripped).
- When replacing/updating any vendored file, update the provenance table and checksums in the README.

`test/**` is gitignored inside `argon-bwg/01` and `argon-bwg/02`.

## Intentional design constraints

- Argon2id defaults differ between versions and are deliberate (both target ~1 hour generation on an average PC): v0.1 `p=2, m=1024` (KiB), `i=3600`; v0.2 `p=1, m=1024` (MB), `i=360`. Do not "optimize" them.
- Note the unit mismatch: v0.2 `index.js` multiplies the memory-cost field by 1024 (MB → KiB) before calling `Argon2id.hash`; v0.1 passes it through.
- This is wallet/keys material: derive params, hashing steps (message = lowercase file hash, salt = lowercase passphrase), and README warnings are load-bearing. Do not alter crypto behavior.
