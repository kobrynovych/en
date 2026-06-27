"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "@/shared/lib/use-speech";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";

interface SpeakButtonProps {
  /** The word or phrase to pronounce. */
  word: string;
  /** BCP-47 language tag. Defaults to "en-US". */
  lang?: string;
  /** Extra classes forwarded to the underlying Button. */
  className?: string;
  /** Button size; defaults to "icon". */
  size?: "sm" | "md" | "lg" | "icon";
}

/**
 * A small icon button that speaks `word` using the Web Speech API.
 * Renders nothing when speechSynthesis is unavailable (e.g. during SSR or
 * in unsupported browsers) so it degrades gracefully.
 *
 * Uses a `mounted` guard so SSR and the first client render both output null,
 * preventing the hydration mismatch that occurs when the server doesn't know
 * whether the browser supports speechSynthesis.
 */
export function SpeakButton({ word, lang = "en-US", className, size = "icon" }: SpeakButtonProps) {
  const { speak, speaking, supported } = useSpeech(lang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: classic SSR hydration guard
    setMounted(true);
  }, []);

  // Render nothing until after hydration so SSR and first client render match.
  if (!mounted || !supported) return null;

  return (
    <Button
      type="button"
      size={size}
      variant="ghost"
      aria-label={`Вимовити "${word}"`}
      title={`Вимовити "${word}"`}
      onClick={(e) => {
        // Prevent navigating when button is inside a <Link> wrapper.
        e.preventDefault();
        e.stopPropagation();
        speak(word);
      }}
      className={cn(
        "shrink-0 transition-colors",
        speaking && "text-emerald-600",
        className,
      )}
    >
      {speaking ? (
        <VolumeX className="size-4" aria-hidden="true" />
      ) : (
        <Volume2 className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
