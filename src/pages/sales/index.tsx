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
import { Key } from "lucide-react";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/sales/quotation": { title: "ใบเสนอราคา", desc: "จัดทำและจัดการใบเสนอราคา (Quotation)" },
  "/sales/order": { title: "ใบรับคำสั่งซื้อ", desc: "จัดการใบรับคำสั่งซื้อจากลูกค้า (Sales Order)" },
  "/sales/delivery": { title: "ใบส่งของ", desc: "จัดการใบส่งของ (Delivery Order)" },
  "/sales/calendar": { title: "ปฏิทินส่งของ", desc: "ตารางกำหนดการส่งสินค้า" },
  "/sales/report-quotation": { title: "รายงาน Quotation", desc: "รายงานยอดใบเสนอราคา" },
  "/sales/report-order": { title: "รายงาน Sales Order", desc: "รายงานยอดคำสั่งซื้อ" },
  "/sales/report-delivery": { title: "รายงาน Delivery", desc: "รายงานการส่งสินค้า" },
};

const columns = [
  { key: "doc_no", label: "เลขที่เอกสาร" },
  { key: "date", label: "วันที่" },
  { key: "customer", label: "ลูกค้า" },
  { key: "amount", label: "จำนวนเงิน", className: "text-right" },
  { key: "due_date", label: "กำหนดส่ง" },

  { key: "status", label: "สถานะ", render: (v: string) => <StatusBadge status={v} /> },
];

const reportPaths = ["/sales/report-quotation", "/sales/report-order", "/sales/report-delivery", "/sales/calendar"];

type SalesRow = {
  doc_no: string;
  date: string;
  customer: string;
  amount: string;
  due_date: string;
  status: string;
};

const statusOptions = ["draft", "pending", "in_progress", "approved", "completed", "delivered"];

const parseMoneyToNumber = (value: string) => Number((value || "0").replace(/[^\d.-]/g, ""));
const formatMoney = (value: number) => `฿${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Sales = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: salesData, isLoading, isError, refetch } = useQuery({
    queryKey: ["sales", location.pathname],
    queryFn: () => mockApi.getSales(location.pathname),
  });
  const { data: master, isLoading: isMasterLoading, isError: isMasterError, refetch: refetchMaster } = useQuery({
    queryKey: ["master-data"],
    queryFn: () => mockApi.getMasterData(),
  });
  const rows: SalesRow[] = salesData?.rows ?? [];
  const calendarDays = salesData?.calendarDays ?? [];
  const pageInfo = pageTitles[location.pathname] || { title: "ระบบขาย", desc: "" };
  const isCalendar = location.pathname === "/sales/calendar";
  const [selectedDocNos, setSelectedDocNos] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<SalesRow | null>(null);
  const isReport = reportPaths.includes(location.pathname);

  const salesFields: CrudField[] = [
    { key: "doc_no", label: "เลขที่เอกสาร", type: "text", required: true },
    { key: "date", label: "วันที่", type: "date", required: true },
    {
      key: "customer",
      label: "ลูกค้า",
      type: "select",
      required: true,
      options: (master?.customerMaster ?? []).map((customer) => ({
        value: customer.customerName,
        label: `${customer.customerCode} - ${customer.customerName}`,
      })),
    },
    { key: "amount", label: "จำนวนเงิน", type: "number", required: true },
    { key: "due_date", label: "กำหนดส่ง", type: "date", required: true },
    {
      key: "status",
      label: "สถานะ",
      type: "select",
      required: true,
      enumValues: statusOptions,
      options: statusOptions.map((value) => ({ value, label: value })),
    },
  ];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["sales", location.pathname] });
  const createMutation = useMutation({
    mutationFn: (row: SalesRow) => mockApi.createSales(location.pathname, row),
    onSuccess: refresh,
  });
  const updateMutation = useMutation({
    mutationFn: ({ docNo, patch }: { docNo: string; patch: Partial<SalesRow> }) =>
      mockApi.updateSales(location.pathname, docNo, patch),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (docNos: string[]) => mockApi.deleteSales(location.pathname, docNos),
    onSuccess: () => {
      setSelectedDocNos(new Set());
      refresh();
    },
  });
  const undoDeleteMutation = useMutation({
    mutationFn: () => mockApi.undoDeleteSales(location.pathname),
    onSuccess: refresh,
  });

  const buildDocNo = () => `SO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  const openCreateDialog = () => {
    setEditingRow(null);
    setDialogOpen(true);
  };

  const openEditDialog = (row: SalesRow) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleSubmitDialog = (values: Record<string, string>) => {
    const numericAmount = Number(values.amount);
    const payload: SalesRow = {
      doc_no: values.doc_no,
      date: values.date,
      customer: values.customer,
      amount: formatMoney(Number.isNaN(numericAmount) ? 0 : numericAmount),
      due_date: values.due_date,
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
        customer: editingRow.customer,
        amount: String(parseMoneyToNumber(editingRow.amount)),
        due_date: editingRow.due_date,
        status: editingRow.status,
      }
    : {
        doc_no: buildDocNo(),
        date: new Date().toISOString().slice(0, 10),
        customer: master?.customerMaster?.[0]?.customerName ?? "",
        amount: "0",
        due_date: new Date().toISOString().slice(0, 10),
        status: "draft",
      };

  const handleExportPdf = (exportData: SalesRow[]) => {
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
                  <div key={day} className={`min-h-[80px] border rounded p-1 text-xs ${cal ? "bg-primary/5 border-primary/20" : ""}`}>
                    <span className="font-medium">{day}</span>
                    {cal?.items.map((item, j) => (
                      <div key={j} className="mt-1 bg-primary/10 text-primary rounded px-1 py-0.5 text-[10px] truncate">{item}</div>
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
        getRowId={(row: SalesRow) => row.doc_no}
        onRowClick={!isReport ? openEditDialog : undefined}
      />
      <CrudFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRow ? `แก้ไข${pageInfo.title}` : `สร้าง${pageInfo.title}`}
        fields={salesFields}
        initialValues={dialogInitialValues}
        submitLabel={editingRow ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
        onSubmit={handleSubmitDialog}
      />
    </div>
  );
};

export default Sales;
