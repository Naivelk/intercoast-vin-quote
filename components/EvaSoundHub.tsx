import { useEffect, useRef } from 'react';

export default function EvaSoundHub() {
  const sendRef = useRef<HTMLAudioElement | null>(null);
  const recvRef = useRef<HTMLAudioElement | null>(null);
  const openRef = useRef<HTMLAudioElement | null>(null);
  const closeRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audios (must exist in public/sounds/)
    sendRef.current = new Audio('/sounds/bubble-send.mp3');
    recvRef.current = new Audio('/sounds/bubble-receive.mp3');
    openRef.current = new Audio('/sounds/bubble-open.mp3');
    closeRef.current = new Audio('/sounds/bubble-close.mp3');

    const play = (a?: HTMLAudioElement | null) => a?.play().catch(() => {/* ignore autoplay restrictions */});

    const onSent = () => play(sendRef.current);
    const onRecv = () => play(recvRef.current);
    const onOpen = () => play(openRef.current);
    const onClose = () => play(closeRef.current);

    window.addEventListener('eva:sound:sent', onSent as EventListener);
    window.addEventListener('eva:sound:received', onRecv as EventListener);
    window.addEventListener('eva:sound:open', onOpen as EventListener);
    window.addEventListener('eva:sound:close', onClose as EventListener);

    return () => {
      window.removeEventListener('eva:sound:sent', onSent as EventListener);
      window.removeEventListener('eva:sound:received', onRecv as EventListener);
      window.removeEventListener('eva:sound:open', onOpen as EventListener);
      window.removeEventListener('eva:sound:close', onClose as EventListener);
    };
  }, []);

  return null;
}
