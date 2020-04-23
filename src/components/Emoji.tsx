import React from 'react';

type EmojiProps = {
  className?: string;
  symbol: any;
  size?: number;
  ariaLabel?: string;
};

function Emoji({ className, symbol, size, ariaLabel }: EmojiProps) {
  return (
    <span
      className={`Emoji ${className}`}
      style={{ fontSize: size }}
      role="img"
      aria-label={ariaLabel}
    >
      {symbol}
    </span>
  );
}

Emoji.defaultProps = {
  size: 20,
  ariaLabel: 'emoji',
};

export default Emoji;
