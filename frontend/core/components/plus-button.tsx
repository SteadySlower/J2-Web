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
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-black hover:bg-black/90 shadow-lg"
    >
      <Plus className="h-5 w-5 text-white" />
    </Button>
  );
}
