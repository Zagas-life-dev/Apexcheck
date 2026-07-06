"use client";

import { useState } from "react";
import { FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { InquiryForm } from "@/components/site/inquiry-form";
import { trackEvent } from "@/lib/analytics";

export function RequestQuoteButton({
  itemId,
  itemTitle,
}: {
  itemId?: string;
  itemTitle?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => {
          trackEvent("interested_click", { itemId });
          setOpen(true);
        }}
      >
        <FileTextIcon /> Request a quote
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} className="max-w-lg">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Request a quote</h3>
          <p className="text-sm text-muted-foreground">
            Tell us what you need and we&apos;ll respond quickly.
          </p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <InquiryForm
            itemId={itemId}
            itemTitle={itemTitle}
            compact
            onSuccess={() => setTimeout(() => setOpen(false), 1800)}
          />
        </div>
      </Modal>
    </>
  );
}
