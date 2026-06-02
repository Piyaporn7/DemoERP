import { Button } from "@/components/ui/button";

interface PageErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function PageErrorState({ message = "ไม่สามารถโหลดข้อมูลได้", onRetry }: PageErrorStateProps) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <Button className="mt-3" variant="outline" onClick={onRetry}>
          ลองใหม่
        </Button>
      )}
    </div>
  );
}
