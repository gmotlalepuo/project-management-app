import { useState, useEffect, useCallback } from "react";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export function useTruncate(text: string, forceMaxLength?: number) {
  const [truncatedText, setTruncatedText] = useState(text);

  const calculateMaxLength = useCallback((width: number): number => {
    if (width < BREAKPOINTS.sm) return 20; // Mobile
    if (width < BREAKPOINTS.md) return 15; // Small tablets
    if (width < BREAKPOINTS.lg) return 10; // Tablets
    return 7; // Desktop
  }, []);

  const truncateText = useCallback(() => {
    if (forceMaxLength !== undefined) {
      setTruncatedText(
        text.length > forceMaxLength ? `${text.slice(0, forceMaxLength)}...` : text,
      );
      return;
    }

    const width = window.innerWidth;
    const maxLength = calculateMaxLength(width);
    setTruncatedText(
      text.length > maxLength ? `${text.slice(0, maxLength)}...` : text,
    );
  }, [text, forceMaxLength, calculateMaxLength]);

  useEffect(() => {
    truncateText();
    window.addEventListener("resize", truncateText);

    return () => {
      window.removeEventListener("resize", truncateText);
    };
  }, [truncateText]);

  return truncatedText;
}
