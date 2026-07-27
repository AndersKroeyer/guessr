import { useState } from "react";

interface ImageHintProps {
  src: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void
  alt?: string;
}

export default function ImageHint({
  src,
  expanded,
  setExpanded,
  alt = "Hint",
}: ImageHintProps) {

  return (
    <>
      <button
        className="hint-thumbnail"
        onClick={() => setExpanded(true)}
      >
        <img src={src} alt={alt} />
      </button>

      {expanded && (
        <div
          className="hint-overlay"
          onClick={() => setExpanded(false)}
        >
          <img
            className="hint-fullsize"
            src={src}
            alt={alt}
          />
        </div>
      )}
    </>
  );
}