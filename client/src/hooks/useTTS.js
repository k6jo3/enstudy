import { useCallback, useEffect, useRef, useState } from 'react';

const PREFERRED_US_VOICE_NAMES = [
  'Google US English',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft Zira - English (United States)',
  'Microsoft David - English (United States)',
  'Samantha',
  'Alex',
];

function pickUSVoice(voices) {
  if (!voices || voices.length === 0) return null;
  return (
    PREFERRED_US_VOICE_NAMES.map(n => voices.find(v => v.name === n)).find(Boolean) ||
    voices.find(v => v.lang === 'en-US' && /natural|neural|online/i.test(v.name)) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en-us')) ||
    null
  );
}

const DEFAULT_SERVER_VOICE = 'en-US-AriaNeural';

export function useTTS() {
  const audioRef = useRef(null);
  const sessionRef = useRef(0);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const update = () => setVoice(pickUSVoice(synth.getVoices()));
    update();
    synth.addEventListener?.('voiceschanged', update);
    return () => synth.removeEventListener?.('voiceschanged', update);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined') return;
    sessionRef.current += 1;
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.onerror = null;
      audioRef.current.onplaying = null;
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  const speakFallback = useCallback((text, rate, session) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    if (session !== sessionRef.current) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1;
    const chosen = voice || pickUSVoice(synth.getVoices());
    if (chosen) utterance.voice = chosen;
    synth.speak(utterance);
  }, [voice]);

  const speak = useCallback((text, rate = 0.9) => {
    if (!text) return;
    stop();
    const session = sessionRef.current;

    const serverRate = Math.round((rate - 1) * 100);
    const url = `/api/tts?text=${encodeURIComponent(text)}&voice=${DEFAULT_SERVER_VOICE}&rate=${serverRate}`;
    const audio = new Audio(url);
    audioRef.current = audio;

    let started = false;
    let settled = false;
    const fallbackOnce = () => {
      if (settled) return;
      settled = true;
      if (session !== sessionRef.current) return;
      if (audioRef.current === audio) audioRef.current = null;
      speakFallback(text, rate, session);
    };

    audio.onplaying = () => { started = true; settled = true; };
    audio.onerror = () => { if (!started) fallbackOnce(); };
    audio.play().catch(() => { if (!started) fallbackOnce(); });
  }, [speakFallback, stop]);

  return { speak, stop };
}
