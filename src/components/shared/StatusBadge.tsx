import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  approved: { label: "อนุมัติ", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "รออนุมัติ", className: "bg-warning/10 text-warning border-warning/20" },
  cancelled: { label: "ยกเลิก", className: "bg-destructive/10 text-destructive border-destructive/20" },
  draft: { label: "ร่าง", className: "bg-muted text-muted-foreground border-border" },
  completed: { label: "เสร็จสิ้น", className: "bg-success/10 text-success border-success/20" },
  in_progress: { label: "กำลังดำเนินการ", className: "bg-info/10 text-info border-info/20" },
  delivered: { label: "ส่งแล้ว", className: "bg-success/10 text-success border-success/20" },
  partial: { label: "บางส่วน", className: "bg-warning/10 text-warning border-warning/20" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
