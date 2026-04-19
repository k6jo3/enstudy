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

export function useTTS() {
  const utteranceRef = useRef(null);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const update = () => setVoice(pickUSVoice(synth.getVoices()));
    update();
    synth.addEventListener?.('voiceschanged', update);
    return () => synth.removeEventListener?.('voiceschanged', update);
  }, []);

  const speak = useCallback((text, rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1;

    const chosen = voice || pickUSVoice(synth.getVoices());
    if (chosen) utterance.voice = chosen;

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [voice]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
    }
  }, []);

  return { speak, stop };
}
