# enStuido Worklog

## Scope

This repo is being cleaned up as an English-learning content system. The main work areas are:

1. Add `context` to words and phrases.
   Purpose: explain usage, tone, nuance, and differences between similar expressions.

2. Fix unnatural Chinese translations.
   Purpose: replace overly literal or awkward translations with more natural Chinese.

3. Remove duplicate entries.
   Purpose: avoid repeated content across words/phrases and across spelling variants such as merged, spaced, or hyphenated forms.

4. Reduce quiz confusion.
   Purpose: make hint mode, fill-in mode, and listening mode distinguish items like `check out` vs `checkout`.

## Done

### Context and content cleanup

- A large number of word/phrase entries already have `context` added.
- Many high-confusion synonym groups and near-synonym groups have been clarified.
- A batch of word-vs-phrase overlap items has been clarified with usage differences.

### Answer checking

- Shared answer normalization logic was created for quiz/listen answer comparison.
- Punctuation-only differences like `what's up` vs `what's up?` no longer fail.

### Duplicate cleanup

- A batch of obvious duplicate entries was removed from the main data source.
- DB sync was run afterward so removed items were deleted from the database too.

Examples already cleaned:

- keep only one of duplicated forms such as:
  - `round trip` instead of `roundtrip` / `round-trip`
  - `jet lag` instead of `jetlag`
  - `live stream` instead of `livestream`
  - `post-mortem` instead of `postmortem`
  - `second-hand` instead of `secondhand`
- `Cheers` was reduced to one surviving entry instead of both word and phrase copies

### Quiz/listen structure hints

- Hint mode now preserves word structure better instead of flattening everything.
- Listening mode now exposes answer shape structure, preserving spaces and hyphens without revealing letters.

## In Progress

1. Finish word-vs-phrase differentiation.
   Keep clarifying cases where Chinese meaning looks the same but usage differs by part of speech or construction.

2. Finish remaining phrase `context` gaps.
   Some phrase files still have entries without `context`.

3. Continue translation naturalization.
   Many entries still read too literally or too stiffly in Chinese.

4. Continue duplicate policy cleanup.
   Not every visually similar pair should be merged. Some pairs differ by meaning or grammatical role and should stay separate.

## Remaining Work

### 1. Duplicate policy finalization

Need a stable rule set for:

- exact duplicate terms across files
- merged vs spaced vs hyphenated forms
- word entry vs phrase entry collisions
- cases that look similar but should remain separate, such as:
  - noun vs verb phrase
  - standalone word vs idiomatic phrase
  - same normalized text but different meaning

### 2. Quiz-level confusion filtering

Need to decide which items should:

- stay available in all quiz modes
- be restricted from hint/listening mode
- require stronger structural hints
- be excluded from certain mode combinations

High-risk examples:

- `checkout` vs `check out`
- `layoff` vs `lay off`
- `workout` vs `work out`
- `breakdown` vs `break down`
- `turnout` vs `turn out`

### 3. Data source consistency

Current important sources:

- `server/data/words.js`
- `server/data/phrases_all.js`
- phrase split files `phrases1.js` through `phrases8.js`
- some older files still exist and may contain legacy duplicates

Important note:

- `server/db/seed.js` seeds words from `server/data/words.js`
- `server/db/seed.js` seeds phrases from `server/data/phrases_all.js`
- `phrases_all.js` is a concatenation of `phrases1.js` through `phrases8.js`

That means cleanup must be applied to the actual seed sources, not just legacy copies.

### 4. Full validation pass

Need a final pass that checks:

- data files still load correctly
- seed sync still runs correctly
- quiz item generation behaves correctly
- hint mode structure looks correct
- listening mode structure looks correct
- duplicate entries no longer reappear in DB-backed quiz data

## Files Already Touched Heavily

Data:

- `server/data/phrases.js`
- `server/data/phrases1.js`
- `server/data/phrases2.js`
- `server/data/phrases3.js`
- `server/data/phrases4.js`
- `server/data/phrases5.js`
- `server/data/phrases6.js`
- `server/data/phrases7.js`
- `server/data/phrases8.js`
- `server/data/words.js`
- multiple split word files such as `words4.js`, `words5.js`, `words6.js`, `words7.js`, `words8.js`, `words11.js`, `words12.js`, `words13.js`, `words14.js`, `words16.js`, `words17.js`

Quiz / frontend:

- `client/src/pages/QuizPage.jsx`
- `client/src/pages/ListenPage.jsx`
- `client/src/pages/QuizPage.css`
- `client/src/pages/ListenPage.css`
- `client/src/utils/answerCompare.js`
- `server/routes/quiz.js`

## Known Notes

- Do not assume every normalized duplicate should be deleted.
- Preserve meaningful distinctions when the grammar role differs.
- For user experience, if two items are too confusable in a given quiz mode, prefer quiz filtering over forcing the learner to guess from insufficient hints.

## Suggested Resume Prompt

If continuing in a new session, use something like:

> Continue the enStuido dataset cleanup work from `WORKLOG.md`. First inspect current progress, then continue with duplicate cleanup, context completion, translation naturalization, and quiz confusion reduction. Do not restart from scratch.

