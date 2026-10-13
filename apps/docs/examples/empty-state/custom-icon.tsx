import { FolderPlus } from "lucide-react";
import { EmptyState } from "@/components/ui/v2/empty-state";
export default function Example() {
  return (
    <EmptyState
      size="sm"
      icon={<FolderPlus />}
      illustration="no-results"
      title={<span>Create your first collection</span>}
      description={
        <span>
          Organize the <strong>shared inbox</strong> before inviting your team.
        </span>
      }
    />
  );
}
