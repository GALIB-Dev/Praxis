"use client";

import React from "react";

interface TypewriterProps {
  texts: string[];
  typingSpeed?: number; // ms per char
  deletingSpeed?: number; // ms per char when deleting
  pauseDelay?: number; // ms to pause after full text
  className?: string;
}

export default function Typewriter({
  texts,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDelay = 1400,
  className = "",
}: TypewriterProps) {
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [blink, setBlink] = React.useState(true);

  React.useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  React.useEffect(() => {
    if (!texts || texts.length === 0) return;

    const currentText = texts[index % texts.length];
    let timeout: number;

    if (!isDeleting && subIndex === currentText.length) {
      // pause at end
      timeout = window.setTimeout(() => setIsDeleting(true), pauseDelay);
    } else if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    } else {
      timeout = window.setTimeout(() => {
        setSubIndex((s) => s + (isDeleting ? -1 : 1));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, texts, typingSpeed, deletingSpeed, pauseDelay]);

  const display = texts[index % texts.length].slice(0, subIndex);

  return (
    <span className={`inline-block ${className}`}>
      {display}
      <span
        aria-hidden
        className="typewriter-cursor"
        style={{ opacity: blink ? 1 : 0 }}
      />
    </span>
  );
}
