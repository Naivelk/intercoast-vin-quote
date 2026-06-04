import { useEffect, useRef } from 'react';

export default function EvaSoundHub() {
  const openRef = useRef<HTMLAudioElement | null>(null);
  const closeRef = useRef<HTMLAudioElement | null>(null);
  const sendRef = useRef<HTMLAudioElement | null>(null);
  const recvRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  useEffect(() => {
    // Preload (WAV) and set volume
    openRef.current = new Audio('/sounds/bubble-open.wav');
    closeRef.current = new Audio('/sounds/bubble-close.wav');
    sendRef.current = new Audio('/sounds/bubble-send.wav');
    recvRef.current = new Audio('/sounds/bubble-receive.wav');
    [openRef.current, closeRef.current, sendRef.current, recvRef.current].forEach(a => { if (a) a.volume = 0.45; });

    // iOS unlock: on first interaction, play muted then reset so future play() works
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      const audios = [openRef.current, closeRef.current, sendRef.current, recvRef.current].filter(Boolean) as HTMLAudioElement[];
      audios.forEach(a => {
        try {
          a.muted = true;
          a.play().finally(() => {
            a.pause();
            a.currentTime = 0;
            a.muted = false;
          });
        } catch {}
      });
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    const play = (a?: HTMLAudioElement | null) => {
      try {
        if (!a) return;
        a.currentTime = 0;
        a.play().catch(() => {});
      } catch {}
    };

    const onOpen = () => play(openRef.current);
    const onClose = () => play(closeRef.current);
    const onSent = () => play(sendRef.current);
    let lastRecv = 0;
    const onRecv = () => {
      const now = performance.now();
      if (now - lastRecv < 120) return; // throttle bursts <120ms
      lastRecv = now;
      play(recvRef.current);
    };

    window.addEventListener('eva:sound:open', onOpen as EventListener);
    window.addEventListener('eva:sound:close', onClose as EventListener);
    window.addEventListener('eva:sound:sent', onSent as EventListener);
    window.addEventListener('eva:sound:received', onRecv as EventListener);

    return () => {
      window.removeEventListener('eva:sound:open', onOpen as EventListener);
      window.removeEventListener('eva:sound:close', onClose as EventListener);
      window.removeEventListener('eva:sound:sent', onSent as EventListener);
      window.removeEventListener('eva:sound:received', onRecv as EventListener);
    };
  }, []);

  return null;
}
