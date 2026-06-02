import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudFormDialog, type CrudField } from "@/components/shared/CrudFormDialog";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { toast } from "sonner";
import { PageDataSkeleton } from "@/components/shared/PageDataSkeleton";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { exportRowsToPdf } from "@/lib/exportPdf";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/costing/allocation": { title: "ปันส่วนต้นทุนการผลิต", desc: "จัดสรรต้นทุนทางอ้อมให้หน่วยผลิต" },
  "/costing/actual-cost": { title: "คำนวณ Actual Cost", desc: "คำนวณต้นทุนการผลิตจริง" },
  "/costing/ending-stock": { title: "สรุป Ending Stock", desc: "สรุปมูลค่าคงเหลือสินค้า" },
  "/costing/stock-card": { title: "Stock Card Pricing", desc: "การเคลื่อนไหวและมูลค่าสินค้า" },
};

const columns = [
  { key: "item_code", label: "รหัสสินค้า" },
  { key: "item_name", label: "ชื่อสินค้า" },
  { key: "material_cost", label: "ต้นทุนวัตถุดิบ", className: "text-right" },
  { key: "labor_cost", label: "ค่าแรง", className: "text-right" },
  { key: "overhead", label: "โสหุ้ย", className: "text-right" },
  { key: "total", label: "ต้นทุนรวม", className: "text-right" },
  { key: "qty", label: "จำนวน", className: "text-right" },
  { key: "unit_cost", label: "ต้นทุน/หน่วย", className: "text-right" },
];

type CostingRow = {
  item_code: string;
  item_name: string;
  material_cost: string;
  labor_cost: string;
  overhead: string;
  total: string;
  qty: number;
  unit_cost: string;
};

const parseMoneyToNumber = (value: string) => Number((value || "0").replace(/[^\d.-]/g, ""));
const formatMoney = (value: number) => `฿${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Costing = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: costingData, isLoading, isError, refetch } = useQuery({
    queryKey: ["costing", location.pathname],
    queryFn: () => mockApi.getCosting(location.pathname),
  });
  const { data: master, isLoading: isMasterLoading, isError: isMasterError, refetch: refetchMaster } = useQuery({
    queryKey: ["master-data"],
    queryFn: () => mockApi.getMasterData(),
  });
  const rows: CostingRow[] = costingData?.rows ?? [];
  const summary = costingData?.summary ?? [];
  const pageInfo = pageTitles[location.pathname] || { title: "บัญชีต้นทุน", desc: "" };
  const [selectedItemCodes, setSelectedItemCodes] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CostingRow | null>(null);

  const costingFields: CrudField[] = [
    {
      key: "item_code",
      label: "รหัสสินค้า",
      type: "select",
      required: true,
      options: (master?.itemMaster ?? []).map((item) => ({
        value: item.itemCode,
        label: `${item.itemCode} - ${item.itemName}`,
      })),
    },
    { key: "item_name", label: "ชื่อสินค้า", type: "text", required: true, readOnly: true },
    { key: "material_cost", label: "ต้นทุนวัตถุดิบ", type: "number", required: true },
    { key: "labor_cost", label: "ค่าแรง", type: "number", required: true },
    { key: "overhead", label: "โสหุ้ย", type: "number", required: true },
    { key: "qty", label: "จำนวน", type: "number", required: true },
  ];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["costing", location.pathname] });
  const createMutation = useMutation({
    mutationFn: (row: CostingRow) => mockApi.createCosting(location.pathname, row),
    onSuccess: refresh,
  });
  const updateMutation = useMutation({
    mutationFn: ({ itemCode, patch }: { itemCode: string; patch: Partial<CostingRow> }) =>
      mockApi.updateCosting(location.pathname, itemCode, patch),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (itemCodes: string[]) => mockApi.deleteCosting(location.pathname, itemCodes),
    onSuccess: () => {
      setSelectedItemCodes(new Set());
      refresh();
    },
  });
  const undoDeleteMutation = useMutation({
    mutationFn: () => mockApi.undoDeleteCosting(location.pathname),
    onSuccess: refresh,
  });

  const buildItemCode = () => `FG-${String(Date.now()).slice(-6)}`;

  const openCreateDialog = () => {
    setEditingRow(null);
    setDialogOpen(true);
  };

  const openEditDialog = (row: CostingRow) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleSubmitDialog = (values: Record<string, string>) => {
    const material = Number(values.material_cost);
    const labor = Number(values.labor_cost);
    const overhead = Number(values.overhead);
    const qty = Number(values.qty);
    const total = (Number.isNaN(material) ? 0 : material) + (Number.isNaN(labor) ? 0 : labor) + (Number.isNaN(overhead) ? 0 : overhead);
    const safeQty = Number.isNaN(qty) || qty <= 0 ? 1 : qty;

    const selectedItem = (master?.itemMaster ?? []).find((item) => item.itemCode === values.item_code);
    const payload: CostingRow = {
      item_code: values.item_code,
      item_name: selectedItem?.itemName ?? values.item_name,
      material_cost: formatMoney(Number.isNaN(material) ? 0 : material),
      labor_cost: formatMoney(Number.isNaN(labor) ? 0 : labor),
      overhead: formatMoney(Number.isNaN(overhead) ? 0 : overhead),
      total: formatMoney(total),
      qty: safeQty,
      unit_cost: formatMoney(total / safeQty),
    };

    if (editingRow) {
      updateMutation.mutate({ itemCode: editingRow.item_code, patch: payload });
      toast.success("แก้ไขข้อมูลสำเร็จ");
      return;
    }
    createMutation.mutate(payload);
    toast.success("เพิ่มข้อมูลสำเร็จ");
  };

  const handleDeleteSelected = () => {
    const itemCodes = Array.from(selectedItemCodes);
    if (!itemCodes.length) {
      toast.error("กรุณาเลือกรายการที่ต้องการลบ");
      return;
    }
    if (!window.confirm(`ยืนยันการลบ ${itemCodes.length} รายการ?`)) return;
    deleteMutation.mutate(itemCodes);
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
        item_code: editingRow.item_code,
        item_name: editingRow.item_name,
        material_cost: String(parseMoneyToNumber(editingRow.material_cost)),
        labor_cost: String(parseMoneyToNumber(editingRow.labor_cost)),
        overhead: String(parseMoneyToNumber(editingRow.overhead)),
        qty: String(editingRow.qty),
      }
    : {
        item_code: master?.itemMaster?.[0]?.itemCode ?? buildItemCode(),
        item_name: master?.itemMaster?.[0]?.itemName ?? "",
        material_cost: "0",
        labor_cost: "0",
        overhead: "0",
        qty: "1",
      };

  const handleExportPdf = (exportData: CostingRow[]) => {
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
        onSecondaryAction={() => handleExportPdf(selectedItemCodes.size ? rows.filter((row) => selectedItemCodes.has(row.item_code)) : rows)}
        actionLabel="สร้างใหม่"
        onAction={openCreateDialog}
      />
      <div className="flex justify-end gap-2 mb-3">
        <Button variant="outline" onClick={handleDeleteSelected}>ลบที่เลือก</Button>
        <Button variant="outline" onClick={handleUndoDelete}>Undo Delete</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {summary.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={rows}
        selectable
        selectedRowIds={selectedItemCodes}
        onSelectionChange={setSelectedItemCodes}
        getRowId={(row: CostingRow) => row.item_code}
        onRowClick={openEditDialog}
      />
      <CrudFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRow ? `แก้ไข${pageInfo.title}` : `สร้าง${pageInfo.title}`}
        fields={costingFields}
        initialValues={dialogInitialValues}
        submitLabel={editingRow ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
        onSubmit={handleSubmitDialog}
      />
    </div>
  );
};

export default Costing;
