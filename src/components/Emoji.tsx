import React from 'react';

type EmojiProps = {
  symbol: any;
  size?: number;
  ariaLabel?: string;
};

function Emoji({ symbol, size, ariaLabel }: EmojiProps) {
  return (
    <span style={{ fontSize: size }} role="img" aria-label={ariaLabel}>
      {symbol}
    </span>
  );
}

Emoji.defaultProps = {
  size: 20,
  ariaLabel: 'emoji',
};

export default Emoji;
