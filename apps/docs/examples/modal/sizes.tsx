import { useState } from "react";
import { Button } from "@/components/ui/v2/button";
import { Modal, type ModalProps } from "@/components/ui/v2/modal";

const SIZES: NonNullable<ModalProps["size"]>[] = ["xs", "sm", "default", "lg"];

export default function Sizes() {
  const [size, setSize] = useState<ModalProps["size"] | null>(null);

  return (
    <>
      {SIZES.map((option) => (
        <Button
          key={option}
          variant="secondary"
          onClick={() => setSize(option)}
        >
          {option}
        </Button>
      ))}
      <Modal
        open={size !== null}
        onOpenChange={(open) => !open && setSize(null)}
        size={size ?? "sm"}
        title={`Size ${size}`}
        description="xs is 320px, sm 384px, default 512px and lg 672px. xs stacks its content and splits the actions into two equal columns."
        confirmButtonText="Done"
        onConfirm={() => setSize(null)}
      />
    </>
  );
}
