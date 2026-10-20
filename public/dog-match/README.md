# Pawfect Match

A buildless HTML, CSS, and JavaScript dog lifestyle matcher for Unit 2, Part 1.

## Run

From the repository root:

```sh
python3 -m http.server 8080 --directory public
```

Open `http://localhost:8080/dog-match/`. Use an HTTP server because native JavaScript
modules are restricted when opening an HTML file directly with `file://`.

## Files

- `index.html`: semantic form, result regions, scoring explanation, source links.
- `style.css`: responsive cream, terracotta, and sage interface.
- `app.js`: form events, persistent state, rendering, favorites, comparison.
- `engine.mjs`: validated profile data, deterministic scoring, saved-state recovery.
- `dog.svg`: original locally bundled illustration; no remote images or font requests.
- `../../AI_LOG.txt`: AI disclosure, exact prompt, real fixes, and architecture.
- `../../tests/dog-match.test.mjs`: regression tests, run with Node's built-in runner.

## Try it

1. Answer all three steps and reveal your matches.
2. Change activity time or prioritize coat care to see rankings change.
3. Set hours away above five to reveal the care-plan branch.
4. Save a favorite, reload, and verify it is still saved.
5. Select up to three breeds; switch the comparison metric.
6. Filter to saved dogs; clear saved data to return to the initial state.

Answers stay in localStorage on the current device/browser/origin. The clear-data
button removes only this project's storage key. Breed profiles are simplified
teaching data, with source links and limitations explained in the UI.
