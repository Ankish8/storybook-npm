import { Button } from "@/components/ui/v2/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/v2/dropdown-menu";
import {
  ModalRoot,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalCancel,
} from "@/components/ui/v2/modal";

export default function InDialog() {
  return (
    <ModalRoot>
      <ModalTrigger asChild>
        <Button variant="outline">Open workspace dialog</Button>
      </ModalTrigger>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Workspace preferences</ModalTitle>
          <ModalDescription>
            Open the menu, then press Escape once to dismiss it and again to
            close the dialog.
          </ModalDescription>
        </ModalHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Workspace actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rename workspace</DropdownMenuItem>
            <DropdownMenuItem disabled>Transfer ownership</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModalFooter>
          <ModalCancel>Done</ModalCancel>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  );
}
