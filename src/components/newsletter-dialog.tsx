import { NewsletterSignup } from './newsletter-signup';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

type NewsletterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewsletterDialog({ open, onOpenChange }: NewsletterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl border-black/[0.06] p-0 sm:w-full sm:max-w-md dark:border-white/[0.06]"
        onInteractOutside={(event) => {
          // Keep dialog open when extension UI (like password managers) is clicked.
          event.preventDefault();
        }}
      >
        <div className="bg-emerald-500/[0.04] px-8 pt-8 pb-6 dark:bg-emerald-500/[0.06]">
          <DialogHeader>
            <DialogTitle className="font-figtree text-xl font-bold">What changed and why it matters</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm leading-relaxed">
              Get Haloy updates, deployment tips, and a light roast of cloud complexity.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="bg-emerald-500/[0.04] px-8 pt-6 pb-8 dark:bg-emerald-500/[0.06]">
          <NewsletterSignup variant="inline" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
