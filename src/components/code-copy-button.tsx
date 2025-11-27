import React from 'react';

import { Button } from './ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type CopyButtonProps = {
  code: string;
  className?: string;
};

export function CodeCopyButton({ code, className }: CopyButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setOpen(true);

      // Hide popover after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={className}
          onClick={handleCopy}
          aria-label={copied ? 'Code copied' : 'Copy code'}
        >
          {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left" sideOffset={-3} className="w-auto border-none px-2 py-1">
        <div className="text-muted-foreground text-xs font-bold">Copied!</div>
      </PopoverContent>
    </Popover>
  );
}
