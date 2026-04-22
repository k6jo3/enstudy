const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const router = express.Router();

const CACHE_DIR = path.join(__dirname, '..', 'cache', 'tts');
fs.mkdirSync(CACHE_DIR, { recursive: true });

const DEFAULT_VOICE = 'en-US-AriaNeural';
const ALLOWED_VOICES = new Set([
  'en-US-AriaNeural',
  'en-US-JennyNeural',
  'en-US-GuyNeural',
  'en-US-AndrewNeural',
  'en-US-EmmaNeural',
  'en-GB-LibbyNeural',
  'en-GB-RyanNeural',
]);

function cacheKey(text, voice, rate) {
  return crypto
    .createHash('sha1')
    .update(`${voice}|${rate}|${text}`)
    .digest('hex');
}

async function synthesize(text, voice, rate) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const rateStr = `${rate >= 0 ? '+' : ''}${rate}%`;
  const { audioStream } = tts.toStream(text, { rate: rateStr });
  const chunks = [];
  for await (const chunk of audioStream) chunks.push(chunk);
  try { tts.close(); } catch {}
  return Buffer.concat(chunks);
}

router.get('/', async (req, res) => {
  const text = (req.query.text || '').toString().trim();
  if (!text || text.length > 1000) {
    return res.status(400).json({ error: 'invalid text' });
  }
  const voice = ALLOWED_VOICES.has(req.query.voice) ? req.query.voice : DEFAULT_VOICE;
  let rate = parseInt(req.query.rate, 10);
  if (!Number.isFinite(rate)) rate = -10;
  rate = Math.max(-50, Math.min(50, rate));

  const key = cacheKey(text, voice, rate);
  const file = path.join(CACHE_DIR, `${key}.mp3`);

  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=604800');

  if (fs.existsSync(file)) {
    return fs.createReadStream(file).pipe(res);
  }

  try {
    const buf = await synthesize(text, voice, rate);
    fs.writeFile(file, buf, () => {});
    res.end(buf);
  } catch (err) {
    console.error('[tts] synth failed:', err?.message || err);
    res.status(502).json({ error: 'tts failed' });
  }
});

module.exports = router;
