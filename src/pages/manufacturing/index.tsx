import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudFormDialog, type CrudField } from "@/components/shared/CrudFormDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { toast } from "sonner";
import { PageDataSkeleton } from "@/components/shared/PageDataSkeleton";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { exportRowsToPdf } from "@/lib/exportPdf";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/manufacturing/mps": { title: "MPS", desc: "Master Production Schedule - ตารางการผลิตหลัก" },
  "/manufacturing/mrp": { title: "MRP", desc: "Material Requirement Planning - วางแผนความต้องการวัตถุดิบ" },
  "/manufacturing/calendar": { title: "ปฏิทินการผลิต", desc: "ตารางกำหนดการผลิต" },
  "/manufacturing/bom": { title: "Bill of Material", desc: "สูตรการผลิต (BOM)" },
  "/manufacturing/job-order": { title: "ใบสั่งผลิต", desc: "จัดการใบสั่งผลิตและใบเบิกวัตถุดิบ" },
  "/manufacturing/job-transaction": { title: "โอนย้ายงาน WIP", desc: "ใบโอนย้ายงานระหว่างการผลิต" },
  "/manufacturing/monitoring": { title: "ติดตามการผลิต", desc: "Production Monitoring System" },
  "/manufacturing/work-centers": { title: "Work Centers", desc: "จัดการศูนย์การผลิต" },
  "/manufacturing/machines": { title: "Machine List", desc: "รายการเครื่องจักร" },
  "/manufacturing/resources": { title: "Resource", desc: "จัดการทรัพยากรการผลิต" },
  "/manufacturing/material-issue": { title: "เบิกวัตถุดิบ", desc: "เบิกวัตถุดิบไปผลิต" },
  "/manufacturing/material-return": { title: "รับคืนวัตถุดิบ", desc: "รับคืนวัตถุดิบจากการผลิต" },
  "/manufacturing/fg-receive": { title: "รับสินค้าผลิตได้", desc: "บันทึกรับสินค้าที่ผลิตเสร็จ" },
  "/manufacturing/subcontract-issue": { title: "เบิกจ้างผลิต", desc: "เบิกวัตถุดิบไปจ้างผลิต" },
  "/manufacturing/subcontract-receive": { title: "รับงานจ้างผลิต", desc: "รับสินค้างานจ้างผลิต" },
  "/manufacturing/aql": { title: "ตาราง AQL", desc: "Acceptable Quality Level Table" },
  "/manufacturing/qa-inspection": { title: "ตรวจสอบคุณภาพ", desc: "การตรวจสอบคุณภาพสินค้าและวัตถุดิบ" },
  "/manufacturing/report-plan": { title: "รายงานวางแผน", desc: "รายงานแผนการผลิต" },
  "/manufacturing/report-daily": { title: "การผลิตประจำวัน", desc: "รายงานผลการผลิตประจำวัน" },
  "/manufacturing/report-material": { title: "ความต้องการวัตถุดิบ", desc: "รายงานความต้องการวัตถุดิบ" },
  "/manufacturing/report-job-status": { title: "สถานะใบสั่งผลิต", desc: "รายงานสถานะใบสั่งผลิต" },
};

const columns = [
  { key: "doc_no", label: "เลขที่" },
  { key: "date", label: "วันที่" },
  { key: "product", label: "สินค้า" },
  { key: "qty_plan", label: "แผน", className: "text-right" },
  { key: "qty_done", label: "ผลิตได้", className: "text-right" },
  { key: "work_center", label: "Work Center" },
  { key: "progress", label: "ความคืบหน้า", render: (v: number) => (
    <div className="flex items-center gap-2">
      <Progress value={v} className="h-2 w-20" />
      <span className="text-xs text-muted-foreground">{v}%</span>
    </div>
  )},
  { key: "status", label: "สถานะ", render: (v: string) => <StatusBadge status={v} /> },
];

const reportPaths = ["/manufacturing/report-plan", "/manufacturing/report-daily", "/manufacturing/report-material", "/manufacturing/report-job-status", "/manufacturing/monitoring", "/manufacturing/calendar"];

type ManufacturingRow = {
  doc_no: string;
  date: string;
  product: string;
  qty_plan: number;
  qty_done: number;
  work_center: string;
  progress: number;
  status: string;
};

const statusOptions = ["pending", "in_progress", "completed", "approved", "draft"];

const Manufacturing = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: manufacturingData, isLoading, isError, refetch } = useQuery({
    queryKey: ["manufacturing", location.pathname],
    queryFn: () => mockApi.getManufacturing(location.pathname),
  });
  const { data: master, isLoading: isMasterLoading, isError: isMasterError, refetch: refetchMaster } = useQuery({
    queryKey: ["master-data"],
    queryFn: () => mockApi.getMasterData(),
  });
  const rows: ManufacturingRow[] = manufacturingData?.rows ?? [];
  const monitoring = manufacturingData?.monitoring ?? [];
  const calendarDays = manufacturingData?.calendarDays ?? [];
  const pageInfo = pageTitles[location.pathname] || { title: "บริหารการผลิต", desc: "" };
  const [selectedDocNos, setSelectedDocNos] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ManufacturingRow | null>(null);
  const isReport = reportPaths.includes(location.pathname);
  const isMonitoring = location.pathname === "/manufacturing/monitoring";
  const isCalendar = location.pathname === "/manufacturing/calendar";

  const manufacturingFields: CrudField[] = [
    { key: "doc_no", label: "เลขที่ใบสั่งผลิต", type: "text", required: true },
    { key: "date", label: "วันที่", type: "date", required: true },
    {
      key: "product",
      label: "สินค้า",
      type: "select",
      required: true,
      options: (master?.itemMaster ?? []).filter((item) => item.itemType !== "Raw").map((item) => ({
        value: item.itemName,
        label: `${item.itemCode} - ${item.itemName}`,
      })),
    },
    { key: "qty_plan", label: "แผนผลิต", type: "number", required: true },
    { key: "qty_done", label: "ผลิตได้", type: "number", required: true },
    {
      key: "work_center",
      label: "Work Center",
      type: "select",
      required: true,
      options: (master?.workCenterMaster ?? []).map((wc) => ({ value: wc.workCenterCode, label: `${wc.workCenterCode} - ${wc.workCenterName}` })),
    },
    {
      key: "status",
      label: "สถานะ",
      type: "select",
      required: true,
      enumValues: statusOptions,
      options: statusOptions.map((value) => ({ value, label: value })),
    },
  ];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["manufacturing", location.pathname] });
  const createMutation = useMutation({
    mutationFn: (row: ManufacturingRow) => mockApi.createManufacturing(location.pathname, row),
    onSuccess: refresh,
  });
  const updateMutation = useMutation({
    mutationFn: ({ docNo, patch }: { docNo: string; patch: Partial<ManufacturingRow> }) =>
      mockApi.updateManufacturing(location.pathname, docNo, patch),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (docNos: string[]) => mockApi.deleteManufacturing(location.pathname, docNos),
    onSuccess: () => {
      setSelectedDocNos(new Set());
      refresh();
    },
  });
  const undoDeleteMutation = useMutation({
    mutationFn: () => mockApi.undoDeleteManufacturing(location.pathname),
    onSuccess: refresh,
  });

  const buildDocNo = () => `JO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  const openCreateDialog = () => {
    setEditingRow(null);
    setDialogOpen(true);
  };

  const openEditDialog = (row: ManufacturingRow) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleSubmitDialog = (values: Record<string, string>) => {
    const qtyPlan = Number(values.qty_plan);
    const qtyDone = Number(values.qty_done);
    const safeQtyPlan = Number.isNaN(qtyPlan) ? 0 : qtyPlan;
    const safeQtyDone = Number.isNaN(qtyDone) ? 0 : qtyDone;
    const payload: ManufacturingRow = {
      doc_no: values.doc_no,
      date: values.date,
      product: values.product,
      qty_plan: safeQtyPlan,
      qty_done: safeQtyDone,
      work_center: values.work_center,
      progress: safeQtyPlan > 0 ? Math.min(100, Math.round((safeQtyDone / safeQtyPlan) * 100)) : 0,
      status: values.status,
    };

    if (editingRow) {
      updateMutation.mutate({ docNo: editingRow.doc_no, patch: payload });
      toast.success("แก้ไขข้อมูลสำเร็จ");
      return;
    }
    createMutation.mutate(payload);
    toast.success("เพิ่มข้อมูลสำเร็จ");
  };

  const handleDeleteSelected = () => {
    const docNos = Array.from(selectedDocNos);
    if (!docNos.length) {
      toast.error("กรุณาเลือกรายการที่ต้องการลบ");
      return;
    }
    if (!window.confirm(`ยืนยันการลบ ${docNos.length} รายการ?`)) return;
    deleteMutation.mutate(docNos);
    toast.success("ลบข้อมูลสำเร็จ");
  };

  const handleUndoDelete = () => {
    undoDeleteMutation.mutate(undefined, {
      onSuccess: (ok) => {
        if (ok) toast.success("กู้คืนรายการล่าสุดสำเร็จ");
        else toast.error("ไม่มีรายการที่กู้คืนได้");
      },
    });
  };

  const dialogInitialValues: Record<string, string> = editingRow
    ? {
        doc_no: editingRow.doc_no,
        date: editingRow.date,
        product: editingRow.product,
        qty_plan: String(editingRow.qty_plan),
        qty_done: String(editingRow.qty_done),
        work_center: editingRow.work_center,
        status: editingRow.status,
      }
    : {
        doc_no: buildDocNo(),
        date: new Date().toISOString().slice(0, 10),
        product: master?.itemMaster?.find((item) => item.itemType !== "Raw")?.itemName ?? "",
        qty_plan: "0",
        qty_done: "0",
        work_center: master?.workCenterMaster?.[0]?.workCenterCode ?? "WC-CUT",
        status: "pending",
      };

  const handleExportPdf = (exportData: ManufacturingRow[]) => {
    const ok = exportRowsToPdf(
      pageInfo.title,
      columns
        .filter((col) => col.key !== "progress")
        .map((col) => ({
          key: col.key,
          label: col.label,
          alignRight: col.className?.includes("text-right") ?? false,
        })),
      exportData as Array<Record<string, unknown>>,
    );
    if (!ok) toast.error("ไม่สามารถ Export PDF ได้");
  };

  if (isLoading || isMasterLoading) {
    return <PageDataSkeleton rows={8} />;
  }

  if (isError || isMasterError) {
    return <PageErrorState onRetry={() => { refetch(); refetchMaster(); }} />;
  }

  if (isMonitoring) {
    return (
      <div>
        <PageHeader title={pageInfo.title} description={pageInfo.desc} secondaryActionLabel="Export PDF" onSecondaryAction={() => handleExportPdf(rows)} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {monitoring.map(s => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <Progress value={s.pct} className="h-2 mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <DataTable
          columns={columns}
          data={rows}
          selectable={false}
          selectedRowIds={selectedDocNos}
          onSelectionChange={setSelectedDocNos}
          getRowId={(row: ManufacturingRow) => row.doc_no}
        />
      </div>
    );
  }

  if (isCalendar) {
    return (
      <div>
        <PageHeader title={pageInfo.title} description={pageInfo.desc} secondaryActionLabel="Export PDF" onSecondaryAction={() => handleExportPdf(rows)} />
        <Card>
          <CardHeader><CardTitle className="text-base">มีนาคม 2024</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const cal = calendarDays.find(c => c.day === day);
                return (
                  <div key={day} className={`min-h-[80px] border rounded p-1 text-xs ${cal ? "bg-warning/5 border-warning/20" : ""}`}>
                    <span className="font-medium">{day}</span>
                    {cal?.items.map((item, j) => (
                      <div key={j} className="mt-1 bg-warning/10 text-warning rounded px-1 py-0.5 text-[10px] truncate">{item}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={pageInfo.title}
        description={pageInfo.desc}
        secondaryActionLabel="Export PDF"
        onSecondaryAction={() => handleExportPdf(selectedDocNos.size ? rows.filter((row) => selectedDocNos.has(row.doc_no)) : rows)}
        actionLabel={!isReport ? "สร้างใหม่" : undefined}
        onAction={openCreateDialog}
      />
      {!isReport && (
        <div className="flex justify-end gap-2 mb-3">
          <Button variant="outline" onClick={handleDeleteSelected}>ลบที่เลือก</Button>
          <Button variant="outline" onClick={handleUndoDelete}>Undo Delete</Button>
        </div>
      )}
      <DataTable
        columns={columns}
        data={rows}
        selectable={!isReport}
        selectedRowIds={selectedDocNos}
        onSelectionChange={setSelectedDocNos}
        getRowId={(row: ManufacturingRow) => row.doc_no}
        onRowClick={!isReport ? openEditDialog : undefined}
      />
      <CrudFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRow ? `แก้ไข${pageInfo.title}` : `สร้าง${pageInfo.title}`}
        fields={manufacturingFields}
        initialValues={dialogInitialValues}
        submitLabel={editingRow ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
        onSubmit={handleSubmitDialog}
      />
    </div>
  );
};

export default Manufacturing;
