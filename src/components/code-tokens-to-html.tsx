import type { ThemedToken } from 'shiki';

interface TokensToHtmlProps {
  tokens: ThemedToken[][];
  className?: string;
}

export function TokensToHtml({ tokens, className }: TokensToHtmlProps) {
  console.log(JSON.stringify(tokens, null, 2));
  return (
    <div className={className}>
      {tokens.map((line, i) => (
        <span key={i} className="block">
          {line.map((token, i) => (
            <span key={i} style={{ color: token.color }}>
              {token.content}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
