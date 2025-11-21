import { Button } from "@/frontend/core/components/ui/button";
import { Plus } from "lucide-react";

type PlusButtonProps = {
  onClick: () => void;
};

export default function PlusButton({ onClick }: PlusButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="h-8 w-8 rounded-full bg-black hover:bg-black/90"
    >
      <Plus className="h-4 w-4 text-white" />
    </Button>
  );
}
