# Project Instructions

## Generated Files

The files in `public/markdown/` are generated on build. Do not edit them directly.

## Code Component Formatting

For single-line code, use the inline syntax:
```
<Code code="npm install package" lang="bash" />
```

For multi-line code, start on the second line and indent each line with two spaces:
```
<Code lang="typescript" code={`
  const config = {
    enabled: true,
    timeout: 5000,
  };
`} />
```

Without the two-space indentation, multi-line code blocks will not render correctly.
