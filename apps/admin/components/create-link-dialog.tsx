"use client";

import { useState } from "react";
import { Dialog } from "./dialog";
import { PlusIcon } from "./interface-icons";
import { LinkForm } from "./link-form";

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="create-button" type="button" onClick={() => setOpen(true)}>
        <PlusIcon /> Create link
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create a short link"
        description="Choose a destination. The path stays yours, even after deletion."
      >
        <LinkForm autofocus />
      </Dialog>
    </>
  );
}
