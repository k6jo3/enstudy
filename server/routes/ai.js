const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini-service');
const { isNonEmptyString } = require('../utils/validation');

function badRequest(res, msg) {
  return res.status(400).json({ error: msg });
}

// POST /api/ai/explain-word
router.post('/explain-word', async (req, res) => {
  try {
    const { word, meaning, partOfSpeech, example, exampleZh, isPhrase } = req.body;
    if (!isNonEmptyString(word)) return badRequest(res, 'word is required');
    if (!isNonEmptyString(meaning)) return badRequest(res, 'meaning is required');

    const explanation = await geminiService.explainWord({
      word: word.trim().slice(0, 200),
      meaning: meaning.trim().slice(0, 300),
      partOfSpeech: isNonEmptyString(partOfSpeech) ? partOfSpeech.trim() : '',
      example: isNonEmptyString(example) ? example.trim().slice(0, 400) : '',
      exampleZh: isNonEmptyString(exampleZh) ? exampleZh.trim().slice(0, 400) : '',
      isPhrase: Boolean(isPhrase),
    });

    res.json({ explanation });
  } catch (err) {
    console.error('AI explain-word error:', err);
    res.status(500).json({ error: err.message || 'Gemini API 錯誤' });
  }
});

// POST /api/ai/explain-grammar
router.post('/explain-grammar', async (req, res) => {
  try {
    const { sentence, answer, explanation, topic } = req.body;
    if (!isNonEmptyString(sentence)) return badRequest(res, 'sentence is required');
    if (!isNonEmptyString(answer)) return badRequest(res, 'answer is required');

    const result = await geminiService.explainGrammar({
      sentence: sentence.trim().slice(0, 500),
      answer: answer.trim().slice(0, 200),
      explanation: isNonEmptyString(explanation) ? explanation.trim().slice(0, 500) : '',
      topic: isNonEmptyString(topic) ? topic.trim() : '',
    });

    res.json({ explanation: result });
  } catch (err) {
    console.error('AI explain-grammar error:', err);
    res.status(500).json({ error: err.message || 'Gemini API 錯誤' });
  }
});

module.exports = router;
