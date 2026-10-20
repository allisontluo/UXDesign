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
- `dog.svg`: original locally bundled illustration.
- `photos/`: six bundled breed photos and source/license metadata in `credits.json`. Photo attribution also appears in the website’s sources disclosure. No runtime image API or font requests.
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

## Photo discovery

Complete the questionnaire first to unlock the discovery section below it. Swipe/drag the photo right
or left, use Like/Pass buttons, or focus the card and use arrow keys. Likes save
the breed to favorites; passes remove it from favorites. The next unseen breed is
ranked using 65% lifestyle fit, 20% explicit fluffy/sleek preference, and 15% learned
trait similarity (coat appearance 50%, size 25%, activity target 25%). The learning
term strengthens over the first three choices. The displayed lifestyle score
remains independent of appearance. This is a local deterministic recommender,
not a runtime AI service.

Each breed appears once per round. Undo restores the last decision’s prior favorite
state. Restart clears swipe history but retains favorites and quiz answers. The
same coat preference is available in the quiz and stays synchronized with the deck.
Old saved profiles migrate to an open coat preference and empty swipe history.

## Simplified visual design

Soft blue, white, and navy with locally bundled DM Sans (SIL Open Font License).
The questionnaire is the first task; discovery and match results unlock after it
is completed. All breed cards are grouped in a disclosure, and comparisons appear
when breeds have been selected. Old `#discover` links redirect incomplete quizzes
to `#quiz`. Asset version parameters prevent stale scripts/styles after updates.
