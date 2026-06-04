import { createPortal } from 'react-dom';
import React, { useEffect, useState } from 'react';

export default function InputPortal({ children, targetId }: { children: React.ReactNode; targetId: string }) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const node = document.getElementById(targetId);
    setEl(node);
  }, [targetId]);

  if (!el) return null;
  return createPortal(children, el);
}
