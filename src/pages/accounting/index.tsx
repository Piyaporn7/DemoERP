import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudFormDialog, type CrudField } from "@/components/shared/CrudFormDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { toast } from "sonner";
import { PageDataSkeleton } from "@/components/shared/PageDataSkeleton";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { exportRowsToPdf } from "@/lib/exportPdf";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/accounting/ap-purchase": { title: "ซื้อสินค้า (เจ้าหนี้)", desc: "บันทึกการซื้อสินค้า" },
  "/accounting/ap-service": { title: "ซื้อบริการ (เจ้าหนี้)", desc: "บันทึกการซื้อบริการ" },
  "/accounting/ap-expense": { title: "ค่าใช้จ่าย (เจ้าหนี้)", desc: "บันทึกค่าใช้จ่าย" },
  "/accounting/ap-payment": { title: "จ่ายชำระหนี้", desc: "บันทึกการจ่ายชำระหนี้" },
  "/accounting/ap-report": { title: "รายงานเจ้าหนี้", desc: "วิเคราะห์ระบบเจ้าหนี้" },
  "/accounting/ar-sale": { title: "ขายสินค้า (ลูกหนี้)", desc: "บันทึกการขายสินค้า" },
  "/accounting/ar-service": { title: "ขายบริการ (ลูกหนี้)", desc: "บันทึกการขายบริการ" },
  "/accounting/ar-other": { title: "รายได้อื่นๆ", desc: "บันทึกรายได้อื่นๆ" },
  "/accounting/ar-receive": { title: "รับชำระหนี้", desc: "บันทึกการรับชำระหนี้" },
  "/accounting/ar-report": { title: "รายงานลูกหนี้", desc: "วิเคราะห์ระบบลูกหนี้" },
  "/accounting/gl-withholding": { title: "ใบหักภาษี ณ ที่จ่าย", desc: "จัดทำใบหักภาษี ณ ที่จ่าย" },
  "/accounting/gl-journal": { title: "สมุดบัญชีรายวันทั่วไป", desc: "บันทึกรายการบัญชีรายวัน" },
  "/accounting/gl-input-tax": { title: "รายงานภาษีซื้อ", desc: "รายงานภาษีซื้อประจำเดือน" },
  "/accounting/gl-output-tax": { title: "รายงานภาษีขาย", desc: "รายงานภาษีขายประจำเดือน" },
  "/accounting/gl-pnd53": { title: "ภ.ง.ด.53", desc: "ภาษีหัก ณ ที่จ่าย ภ.ง.ด.53" },
};

const columns = [
  { key: "doc_no", label: "เลขที่เอกสาร" },
  { key: "date", label: "วันที่" },
  { key: "vendor", label: "คู่ค้า" },
  { key: "description", label: "รายละเอียด" },
  { key: "debit", label: "เดบิต", className: "text-right" },
  { key: "credit", label: "เครดิต", className: "text-right" },
  { key: "status", label: "สถานะ", render: (v: string) => <StatusBadge status={v} /> },
];

const reportPaths = ["/accounting/ap-report", "/accounting/ar-report", "/accounting/gl-input-tax", "/accounting/gl-output-tax", "/accounting/gl-pnd53"];

type AccountingRow = {
  doc_no: string;
  date: string;
  vendor: string;
  description: string;
  debit: string;
  credit: string;
  status: string;
};

const statusOptions = ["draft", "pending", "approved", "completed"];

const parseMoneyToNumber = (value: string) => Number((value || "0").replace(/[^\d.-]/g, ""));
const formatMoney = (value: number) => `฿${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Accounting = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: accountingRows = [], isLoading, isError, refetch } = useQuery<AccountingRow[]>({
    queryKey: ["accounting", location.pathname],
    queryFn: () => mockApi.getAccounting(location.pathname),
  });
  const { data: master, isLoading: isMasterLoading, isError: isMasterError, refetch: refetchMaster } = useQuery({
    queryKey: ["master-data"],
    queryFn: () => mockApi.getMasterData(),
  });
  const pageInfo = pageTitles[location.pathname] || { title: "ระบบบัญชี", desc: "" };
  const [selectedDocNos, setSelectedDocNos] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<AccountingRow | null>(null);
  const isReport = reportPaths.includes(location.pathname);

  const accountingFields: CrudField[] = [
    { key: "doc_no", label: "เลขที่เอกสาร", type: "text", required: true },
    { key: "date", label: "วันที่", type: "date", required: true },
    {
      key: "vendor",
      label: "คู่ค้า",
      type: "select",
      required: true,
      options: [...(master?.vendorMaster ?? []).map((vendor) => ({
        value: vendor.vendorName,
        label: `${vendor.vendorCode} - ${vendor.vendorName}`,
      })), ...(master?.customerMaster ?? []).map((customer) => ({
        value: customer.customerName,
        label: `${customer.customerCode} - ${customer.customerName}`,
      }))],
    },
    {
      key: "description",
      label: "รายละเอียด",
      type: "select",
      required: true,
      options: (master?.chartOfAccountMaster ?? []).map((coa) => ({
        value: coa.accountName,
        label: `${coa.accountCode} - ${coa.accountName}`,
      })),
    },
    { key: "debit", label: "เดบิต", type: "number", required: true },
    { key: "credit", label: "เครดิต", type: "number", required: true },
    {
      key: "status",
      label: "สถานะ",
      type: "select",
      required: true,
      enumValues: statusOptions,
      options: statusOptions.map((value) => ({ value, label: value })),
    },
  ];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["accounting", location.pathname] });
  const createMutation = useMutation({
    mutationFn: (row: AccountingRow) => mockApi.createAccounting(location.pathname, row),
    onSuccess: refresh,
  });
  const updateMutation = useMutation({
    mutationFn: ({ docNo, patch }: { docNo: string; patch: Partial<AccountingRow> }) =>
      mockApi.updateAccounting(location.pathname, docNo, patch),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (docNos: string[]) => mockApi.deleteAccounting(location.pathname, docNos),
    onSuccess: () => {
      setSelectedDocNos(new Set());
      refresh();
    },
  });
  const undoDeleteMutation = useMutation({
    mutationFn: () => mockApi.undoDeleteAccounting(location.pathname),
    onSuccess: refresh,
  });

  const buildDocNo = () => `JV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  const openCreateDialog = () => {
    setEditingRow(null);
    setDialogOpen(true);
  };

  const openEditDialog = (row: AccountingRow) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleSubmitDialog = (values: Record<string, string>) => {
    const debitNumber = Number(values.debit);
    const creditNumber = Number(values.credit);
    const payload: AccountingRow = {
      doc_no: values.doc_no,
      date: values.date,
      vendor: values.vendor,
      description: values.description,
      debit: formatMoney(Number.isNaN(debitNumber) ? 0 : debitNumber),
      credit: formatMoney(Number.isNaN(creditNumber) ? 0 : creditNumber),
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
        vendor: editingRow.vendor,
        description: editingRow.description,
        debit: String(parseMoneyToNumber(editingRow.debit)),
        credit: String(parseMoneyToNumber(editingRow.credit)),
        status: editingRow.status,
      }
    : {
        doc_no: buildDocNo(),
        date: new Date().toISOString().slice(0, 10),
        vendor: master?.vendorMaster?.[0]?.vendorName ?? "",
        description: master?.chartOfAccountMaster?.[0]?.accountName ?? "",
        debit: "0",
        credit: "0",
        status: "draft",
      };

  const handleExportPdf = (exportData: AccountingRow[]) => {
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

  return (
    <div>
      <PageHeader
        title={pageInfo.title}
        description={pageInfo.desc}
        secondaryActionLabel="Export PDF"
        onSecondaryAction={() => handleExportPdf(selectedDocNos.size ? accountingRows.filter((row) => selectedDocNos.has(row.doc_no)) : accountingRows)}
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
        data={accountingRows}
        selectable={!isReport}
        selectedRowIds={selectedDocNos}
        onSelectionChange={setSelectedDocNos}
        getRowId={(row: AccountingRow) => row.doc_no}
        onRowClick={!isReport ? openEditDialog : undefined}
      />
      <CrudFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRow ? `แก้ไข${pageInfo.title}` : `สร้าง${pageInfo.title}`}
        fields={accountingFields}
        initialValues={dialogInitialValues}
        submitLabel={editingRow ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
        onSubmit={handleSubmitDialog}
      />
    </div>
  );
};

export default Accounting;
