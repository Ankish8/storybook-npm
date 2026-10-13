import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import {
  ModalRoot,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/v2/modal";
import { SelectField } from "@/components/ui/v2/select";
const options = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic Auth" },
  { value: "bearer", label: "Bearer Token" },
  { value: "api-key", label: "API Key" },
  { value: "oauth2", label: "OAuth 2.0" },
];
export default function InDialog() {
  const [open, setOpen] = useState(false);
  return (
    <ModalRoot open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button variant="secondary">Edit authentication</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Webhook authentication</ModalTitle>
          <ModalDescription>
            Choose a method for this local example.
          </ModalDescription>
        </ModalHeader>
        <SelectField
          label="Authentication"
          searchable
          options={options}
          defaultValue="basic"
        />
      </ModalContent>
    </ModalRoot>
  );
}
