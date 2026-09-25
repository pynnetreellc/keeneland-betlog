# Fall Stars Bet Log

A handicapping and bet-logging app for Keeneland's Fall Stars Weekend,
October 2–4 2026. Installs to a phone home screen as a real app and works with
no signal.

Live at https://pynnetreellc.github.io/keeneland-betlog/

## What's in it

- **Today's bets** — log a bet against a day, settle it, watch the day's net.
- **Totals** — ROI by angle and by odds band, plus a *Copy log* button that puts
  the whole record on the clipboard as JSON.
- **Trainers** — Keeneland trainer standings, turf and dirt, from the Fall 2025
  and Spring 2026 meets. 191 trainers, 2,409 starts, baked in and searchable.

Everything lives in `localStorage` on the device it was typed on. Hand the link
to someone else and they keep their own book — nothing shared, nothing synced,
and clearing site data wipes it. Use *Copy log* before that happens.

## Deploying

GitHub Pages, served from the repo root. Note this repo is on `main` (GitHub
Desktop's default) while panda-planner is on `master` — set Pages to whichever
branch the repo is actually on.

    git init -b main
    git add .
    git commit -m "Keeneland Fall Stars bet log"
    git remote add origin https://github.com/pynnetreellc/keeneland-betlog.git
    git push -u origin main

Then Settings → Pages → *Deploy from a branch*, `main`, `/ (root)`. The repo
has to be public for Pages on a free plan.

On the phone: open the Pages URL in Chrome, ⋮ → *Install*. Real app icon, no
Chrome badge. A page without both HTTPS and a manifest plus service worker only
ever gets a bookmark shortcut with a letter tile.

## Shipping a change

`index.html` and `app.js` are fetched network-first, so a push lands on the next
open — no version bump needed for normal edits. Bump `VERSION` in `sw.js` only
when you want to force a clean cache sweep.

## Rebuilding app.js

`app.js` is compiled from `keenelandbetlog.jsx` and committed, so deploys need no
build step:

    npx esbuild keenelandbetlog.jsx --loader:.jsx=jsx --jsx=transform \
      --minify --target=es2018 --outfile=app.js

The source expects `React` and `ReactDOM` as globals. Both are committed at the
repo root rather than pulled from a CDN, so the offline cache is complete.

## Local preview

    python -m http.server 4174

Service workers need a secure context; `localhost` counts.

## Icons

`icon-192` and `icon-512` are the plain tiles. The `-maskable` pair exists
because Android crops adaptive icons to a circle or squircle and only the inner
~80% is safe — those variants pull the artwork in so the horse keeps its legs.

## Credits

Horse-and-money artwork is licensed clip art, recoloured to the app's palette.
Trainer figures come from Equibase's published Keeneland meet standings.
