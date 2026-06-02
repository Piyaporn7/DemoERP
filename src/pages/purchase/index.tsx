import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudFormDialog, type CrudField } from "@/components/shared/CrudFormDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { toast } from "sonner";
import { PageDataSkeleton } from "@/components/shared/PageDataSkeleton";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { exportRowsToPdf } from "@/lib/exportPdf";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/purchase/request": { title: "ใบขอซื้อ", desc: "จัดทำใบขอซื้อ (Purchase Request)" },
  "/purchase/order": { title: "ใบสั่งซื้อ", desc: "จัดการใบสั่งซื้อ (Purchase Order)" },
  "/purchase/calendar": { title: "ปฏิทินรับสินค้า", desc: "ตารางกำหนดรับสินค้าตามใบสั่งซื้อ" },
  "/purchase/report-request": { title: "รายงานใบขอซื้อ", desc: "รายงานและสถานะใบขอซื้อ" },
  "/purchase/report-cost": { title: "รายงานต้นทุนซื้อสินค้า", desc: "สรุปต้นทุนการจัดซื้อ" },
  "/purchase/report-pending": { title: "สินค้าค้างรับ", desc: "รายงานสินค้าค้างรับตามใบสั่งซื้อ" },
};

const columns = [
  { key: "doc_no", label: "เลขที่เอกสาร" },
  { key: "date", label: "วันที่" },
  { key: "supplier", label: "ผู้ขาย" },
  { key: "amount", label: "จำนวนเงิน", className: "text-right" },
  { key: "expected_date", label: "กำหนดรับ" },
  { key: "status", label: "สถานะ", render: (v: string) => <StatusBadge status={v} /> },
];

const reportPaths = ["/purchase/report-request", "/purchase/report-cost", "/purchase/report-pending", "/purchase/calendar"];

type PurchaseRow = {
  doc_no: string;
  date: string;
  supplier: string;
  amount: string;
  expected_date: string;
  status: string;
};

const statusOptions = ["draft", "pending", "in_progress", "approved", "completed", "partial"];

const parseMoneyToNumber = (value: string) => Number((value || "0").replace(/[^\d.-]/g, ""));
const formatMoney = (value: number) => `฿${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Purchase = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: purchaseData, isLoading, isError, refetch } = useQuery({
    queryKey: ["purchase", location.pathname],
    queryFn: () => mockApi.getPurchase(location.pathname),
  });
  const { data: master, isLoading: isMasterLoading, isError: isMasterError, refetch: refetchMaster } = useQuery({
    queryKey: ["master-data"],
    queryFn: () => mockApi.getMasterData(),
  });
  const rows: PurchaseRow[] = purchaseData?.rows ?? [];
  const calendarDays = purchaseData?.calendarDays ?? [];
  const pageInfo = pageTitles[location.pathname] || { title: "ระบบซื้อ", desc: "" };
  const isCalendar = location.pathname === "/purchase/calendar";
  const [selectedDocNos, setSelectedDocNos] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<PurchaseRow | null>(null);
  const isReport = reportPaths.includes(location.pathname);

  const purchaseFields: CrudField[] = [
    { key: "doc_no", label: "เลขที่เอกสาร", type: "text", required: true },
    { key: "date", label: "วันที่", type: "date", required: true },
    {
      key: "supplier",
      label: "ผู้ขาย",
      type: "select",
      required: true,
      options: (master?.vendorMaster ?? []).map((vendor) => ({
        value: vendor.vendorName,
        label: `${vendor.vendorCode} - ${vendor.vendorName}`,
      })),
    },
    { key: "amount", label: "จำนวนเงิน", type: "number", required: true },
    { key: "expected_date", label: "กำหนดรับ", type: "date", required: true },
    {
      key: "status",
      label: "สถานะ",
      type: "select",
      required: true,
      enumValues: statusOptions,
      options: statusOptions.map((value) => ({ value, label: value })),
    },
  ];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["purchase", location.pathname] });

  const createMutation = useMutation({
    mutationFn: (row: PurchaseRow) => mockApi.createPurchase(location.pathname, row),
    onSuccess: refresh,
  });
  const updateMutation = useMutation({
    mutationFn: ({ docNo, patch }: { docNo: string; patch: Partial<PurchaseRow> }) =>
      mockApi.updatePurchase(location.pathname, docNo, patch),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (docNos: string[]) => mockApi.deletePurchase(location.pathname, docNos),
    onSuccess: () => {
      setSelectedDocNos(new Set());
      refresh();
    },
  });
  const undoDeleteMutation = useMutation({
    mutationFn: () => mockApi.undoDeletePurchase(location.pathname),
    onSuccess: refresh,
  });

  const buildDocNo = () => `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  const openCreateDialog = () => {
    setEditingRow(null);
    setDialogOpen(true);
  };

  const openEditDialog = (row: PurchaseRow) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleSubmitDialog = (values: Record<string, string>) => {
    const numericAmount = Number(values.amount);
    const payload: PurchaseRow = {
      doc_no: values.doc_no,
      date: values.date,
      supplier: values.supplier,
      amount: formatMoney(Number.isNaN(numericAmount) ? 0 : numericAmount),
      expected_date: values.expected_date,
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
    if (docNos.length === 0) {
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
        supplier: editingRow.supplier,
        amount: String(parseMoneyToNumber(editingRow.amount)),
        expected_date: editingRow.expected_date,
        status: editingRow.status,
      }
    : {
        doc_no: buildDocNo(),
        date: new Date().toISOString().slice(0, 10),
        supplier: master?.vendorMaster?.[0]?.vendorName ?? "",
        amount: "0",
        expected_date: new Date().toISOString().slice(0, 10),
        status: "draft",
      };

  const handleExportPdf = (exportData: PurchaseRow[]) => {
    const ok = exportRowsToPdf(
      pageInfo.title,
      columns.map((col) => ({
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

  if (isCalendar) {
    return (
      <div>
        <PageHeader title={pageInfo.title} description={pageInfo.desc} secondaryActionLabel="Export PDF" onSecondaryAction={() => handleExportPdf(rows)} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">มีนาคม 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const cal = calendarDays.find(c => c.day === day);
                return (
                  <div key={day} className={`min-h-[80px] border rounded p-1 text-xs ${cal ? "bg-info/5 border-info/20" : ""}`}>
                    <span className="font-medium">{day}</span>
                    {cal?.items.map((item, j) => (
                      <div key={j} className="mt-1 bg-info/10 text-info rounded px-1 py-0.5 text-[10px] truncate">{item}</div>
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
        getRowId={(row: PurchaseRow) => row.doc_no}
        onRowClick={!isReport ? openEditDialog : undefined}
      />
      <CrudFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRow ? `แก้ไข${pageInfo.title}` : `สร้าง${pageInfo.title}`}
        fields={purchaseFields}
        initialValues={dialogInitialValues}
        submitLabel={editingRow ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
        onSubmit={handleSubmitDialog}
      />
    </div>
  );
};

export default Purchase;
