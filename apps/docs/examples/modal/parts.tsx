import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/v2/button";
import {
  ModalAction,
  ModalCancel,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalMedia,
  ModalRoot,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/v2/modal";

export default function Parts() {
  return (
    <ModalRoot>
      <ModalTrigger asChild>
        <Button variant="secondary">Share project</Button>
      </ModalTrigger>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalMedia>
            <Share2 />
          </ModalMedia>
          <ModalTitle>Share this project?</ModalTitle>
          <ModalDescription>
            Anyone with the link will be able to view and edit this project.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalCancel>Not now</ModalCancel>
          <ModalAction>Share</ModalAction>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  );
}
