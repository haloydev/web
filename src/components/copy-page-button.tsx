import { CheckIcon, ChevronDownIcon, CopyIcon, FileTextIcon, LoaderIcon, TypeIcon } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { copyPageAsMarkdown, copyPageAsText } from '@/lib/copy-page';

type CopyPageButtonProps = {
  className?: string;
};

export function CopyPageButton({ className }: CopyPageButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState<'markdown' | 'text' | null>(null);

  const handleCopyMarkdown = async () => {
    setLoading(true);
    try {
      const success = await copyPageAsMarkdown();
      if (success) {
        setCopied('markdown');
        setTimeout(() => setCopied(null), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = async () => {
    setLoading(true);
    try {
      const success = await copyPageAsText();
      if (success) {
        setCopied('text');
        setTimeout(() => setCopied(null), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    if (loading) return <LoaderIcon className="size-4 animate-spin" />;
    if (copied) return <CheckIcon className="size-4" />;
    return <CopyIcon className="size-4" />;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className} disabled={loading}>
          {getIcon()}
          Copy page
          <ChevronDownIcon
            className={`size-4 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleCopyMarkdown} disabled={loading}>
          <FileTextIcon />
          {copied === 'markdown' ? 'Copied!' : 'Copy as Markdown'}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCopyText} disabled={loading}>
          <TypeIcon />
          {copied === 'text' ? 'Copied!' : 'Copy as Plain Text'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
