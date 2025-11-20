import type { ThemedToken } from 'shiki';

interface TokensToHtmlProps {
  tokens: ThemedToken[][];
  className?: string;
}

export function TokensToHtml({ tokens, className }: TokensToHtmlProps) {
  return (
    <div className={className}>
      {tokens.map((line, i) => (
        <span key={i} className="block">
          {line.map((token, i) => (
            <span key={i} style={{ color: token.color }}>
              {token.content}
            </span>
          ))}
          {'\n'}
        </span>
      ))}
    </div>
  );
}
