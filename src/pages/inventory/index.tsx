import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudFormDialog, type CrudField } from "@/components/shared/CrudFormDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Download, Plus, Search, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { PageDataSkeleton } from "@/components/shared/PageDataSkeleton";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { exportRowsToPdf } from "@/lib/exportPdf";
import { exportRowsToCsv } from "@/lib/exportCsv";
import { exportRowsToExcel } from "@/lib/exportExcel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/inventory/goods-receive": { title: "รับสินค้าเข้า", desc: "บันทึกรับสินค้าเข้าจากการซื้อ" },
  "/inventory/sales-return": { title: "รับคืนสินค้า", desc: "รับคืนสินค้าจากใบสั่งขาย" },
  "/inventory/stock-adjust-in": { title: "ปรับปรุงสต็อกขาเข้า", desc: "ปรับปรุงยอดสต็อกขาเข้า" },
  "/inventory/opening-stock": { title: "สินค้าคงเหลือยกมา", desc: "บันทึกสินค้าคงเหลือยกมาจากงวดก่อน" },
  "/inventory/purchase-return": { title: "ส่งคืนสินค้า", desc: "ส่งคืนสินค้าให้ผู้ขาย" },
  "/inventory/issue-for-sale": { title: "เบิกสินค้าเพื่อขาย", desc: "เบิกสินค้าออกเพื่อจำหน่าย" },
  "/inventory/general-issue": { title: "ใบเบิกทั่วไป", desc: "เบิกสินค้าเพื่อใช้งานทั่วไป" },
  "/inventory/stock-adjust-out": { title: "ปรับปรุงสต็อกขาออก", desc: "ปรับปรุงยอดสต็อกขาออก" },
  "/inventory/warehouse-transfer": { title: "เบิกย้ายคลังสินค้า", desc: "โอนย้ายสินค้าระหว่างคลัง" },
  "/inventory/report-balance": { title: "รายงานยอดคงเหลือสินค้า", desc: "รายงานสรุปยอดคงเหลือ" },
  "/inventory/report-movement": { title: "รายงานการเคลื่อนไหวสินค้า", desc: "ติดตามการเคลื่อนไหวสินค้า" },
  "/inventory/qr-code": { title: "สร้าง QR Code", desc: "สร้าง QR Code รหัสสินค้า" },
  "/inventory/report-reorder": { title: "สินค้าต่ำกว่าจุดสั่งซื้อ", desc: "สินค้าที่คงเหลือต่ำกว่ายอดจุดสั่งซื้อ" },
  "/inventory/report-overstock": { title: "สินค้าสูงกว่ายอดคงคลังสูงสุด", desc: "สินค้าที่เกินยอดคงคลังสูงสุด" },
  "/inventory/shelf-in": { title: "รับเข้า SHELF", desc: "บันทึกรับสินค้าเข้า SHELF" },
  "/inventory/shelf-out": { title: "เบิกออก SHELF", desc: "บันทึกเบิกสินค้าออก SHELF" },
  "/inventory/shelf-transfer": { title: "ย้าย SHELF", desc: "บันทึกย้ายสินค้าระหว่าง SHELF" },
  "/inventory/shelf-balance": { title: "สรุปยอด SHELF", desc: "สรุปยอดคงเหลือสินค้า SHELF" },
  "/inventory/shelf-movement": { title: "เคลื่อนไหว SHELF", desc: "การเคลื่อนไหวสินค้า SHELF" },
  "/inventory/shelf-count": { title: "ตรวจนับ SHELF", desc: "การตรวจนับสินค้า SHELF" },
};

const baseColumns = [
  { key: "doc_no", label: "เลขที่เอกสาร" },
  { key: "date", label: "วันที่" },
  { key: "item_code", label: "รหัสสินค้า" },
  { key: "item_name", label: "ชื่อสินค้า" },
  { key: "qty", label: "จำนวน", className: "text-right" },
  { key: "unit", label: "หน่วย" },
  { key: "warehouse", label: "คลัง" },
  { key: "location", label: "ชั้นวาง" },
  { key: "status", label: "สถานะ", render: (v: string) => <StatusBadge status={v} /> },
];

const reportPaths = ["/inventory/report-balance", "/inventory/report-movement", "/inventory/qr-code", "/inventory/report-reorder", "/inventory/report-overstock", "/inventory/shelf-balance", "/inventory/shelf-movement", "/inventory/shelf-count"];

type InventoryRow = {
  doc_no: string;
  date: string;
  item_code: string;
  item_name: string;
  qty: number;
  unit: string;
  warehouse: string;
  location: string;
  status: string;
};

const statusOptions = ["ร่าง", "รออนุมัติ",  "อนุมัติ", "เสรร็จสิ้น", "ยกเลิก"];

const Inventory = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: inventoryData = [], isLoading, isError, refetch } = useQuery<InventoryRow[]>({
    queryKey: ["inventory", location.pathname],
    queryFn: () => mockApi.getInventory(location.pathname),
  });
  const { data: master, isLoading: isMasterLoading, isError: isMasterError, refetch: refetchMaster } = useQuery({
    queryKey: ["master-data"],
    queryFn: () => mockApi.getMasterData(),
  });
  const pageInfo = pageTitles[location.pathname] || { title: "คลังสินค้า", desc: "" };
  const [selectedDocNos, setSelectedDocNos] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<InventoryRow | null>(null);
  const [filterDocNo, setFilterDocNo] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterItemCode, setFilterItemCode] = useState("");
  const [filterItemName, setFilterItemName] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterQtyMin, setFilterQtyMin] = useState("");
  const isReport = reportPaths.includes(location.pathname);
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["inventory", location.pathname] });
  const createMutation = useMutation({
    mutationFn: (row: InventoryRow) => mockApi.createInventory(location.pathname, row),
    onSuccess: refresh,
  });
  const updateMutation = useMutation({
    mutationFn: ({ docNo, patch }: { docNo: string; patch: Partial<InventoryRow> }) =>
      mockApi.updateInventory(location.pathname, docNo, patch),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (docNos: string[]) => mockApi.deleteInventory(location.pathname, docNos),
    onSuccess: () => {
      setSelectedDocNos(new Set());
      refresh();
    },
  });
  const undoDeleteMutation = useMutation({
    mutationFn: () => mockApi.undoDeleteInventory(location.pathname),
    onSuccess: refresh,
  });

  const buildDocNo = () => `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  const openCreateDialog = () => {
    setEditingRow(null);
    setDialogOpen(true);
  };

  const openEditDialog = (row: InventoryRow) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleSearch = () => {
    if (filteredData.length === 0) {
      toast.info("ไม่พบข้อมูลตามเงื่อนไขค้นหา");
    } else {
      toast.success(`พบข้อมูล ${filteredData.length} รายการ`);
    }
  };

  const handleClearFilters = () => {
    setFilterDocNo("");
    setFilterDate("");
    setFilterItemCode("");
    setFilterItemName("");
    setFilterWarehouse("");
    setFilterLocation("");
    setFilterUnit("");
    setFilterStatus("");
    setFilterQtyMin("");
    setSelectedDocNos(new Set());
  };

  const handleSettings = () => {
    toast.info("การตั้งค่ายังไม่เปิดใช้งาน");
  };

  const inventoryFields: CrudField[] = [
    { key: "doc_no", label: "เลขที่เอกสาร", type: "text", required: true },
    { key: "date", label: "วันที่", type: "date", required: true },
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
    { key: "qty", label: "จำนวน", type: "number", required: true },
    {
      key: "unit",
      label: "หน่วย",
      type: "select",
      required: true,
      options: (master?.unitMaster ?? []).map((unit) => ({ value: unit.unitCode, label: `${unit.unitCode} - ${unit.unitName}` })),
    },
    {
      key: "warehouse",
      label: "คลัง",
      type: "select",
      required: true,
      options: (master?.warehouseMaster ?? []).map((wh) => ({ value: wh.warehouseName, label: `${wh.warehouseCode} - ${wh.warehouseName}` })),
    },
    {
        key: "location",
        label: "ชั้นวาง",
        type: "select",
        required: true,
        options: (master?.locationMaster ?? []).map((shelf) => ({ value: shelf.locationName, label: `${shelf.locationCode} - ${shelf.locationName}` })),
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

  const handleSubmitDialog = (values: Record<string, string>) => {
    const qty = Number(values.qty);
    const selectedItem = (master?.itemMaster ?? []).find((item) => item.itemCode === values.item_code);
    const payload: InventoryRow = {
      doc_no: values.doc_no,
      date: values.date,
      item_code: values.item_code,
      item_name: selectedItem?.itemName ?? values.item_name,
      qty: Number.isNaN(qty) ? 0 : qty,
      unit: values.unit || selectedItem?.unit || "",
      warehouse: values.warehouse || selectedItem?.warehouseDefault || "",
      location: values.location,
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

  const handleExport = (format: "pdf" | "csv" | "xlsx", rows: InventoryRow[]) => {
    const exportColumns = baseColumns.map((col) => ({
      key: col.key as keyof InventoryRow,
      label: col.label,
      alignRight: col.className?.includes("text-right") ?? false,
    }));
    const ok =
      format === "pdf"
        ? exportRowsToPdf(pageInfo.title, exportColumns as { key: string; label: string; alignRight?: boolean }[], rows as Array<Record<string, unknown>>)
        : format === "xlsx"
          ? exportRowsToExcel(pageInfo.title, exportColumns, rows as Array<Record<string, unknown>>)
          : exportRowsToCsv(pageInfo.title, exportColumns, rows as Array<Record<string, unknown>>);
    if (!ok) {
      const message = format === "pdf" ? "ไม่สามารถ Export PDF ได้" : format === "xlsx" ? "ไม่สามารถ Export Excel ได้" : "ไม่สามารถ Export CSV ได้";
      toast.error(message);
    }
  };
  const columns = baseColumns;
  const warehouseOptions = Array.from(new Set(inventoryData.map((row) => row.warehouse))).sort();
  const locationOptions = Array.from(
    new Set(
      inventoryData
        .filter((row) => !filterWarehouse || row.warehouse === filterWarehouse)
        .map((row) => row.location)
    )
  ).sort();
  const unitOptions = Array.from(new Set(inventoryData.map((row) => row.unit))).sort();
  const filteredData = inventoryData.filter((row) => {
    const matchDocNo = row.doc_no.toLowerCase().includes(filterDocNo.toLowerCase());
    const matchDate = !filterDate || row.date === filterDate;
    const matchItemCode = row.item_code.toLowerCase().includes(filterItemCode.toLowerCase());
    const matchItemName = row.item_name.toLowerCase().includes(filterItemName.toLowerCase());
    const matchWarehouse = !filterWarehouse || row.warehouse === filterWarehouse;
    const matchLocation = !filterLocation || row.location === filterLocation;
    const matchUnit = !filterUnit || row.unit === filterUnit;
    const matchStatus = !filterStatus || row.status === filterStatus;
    const qtyMin = Number(filterQtyMin);
    const matchQtyMin = Number.isNaN(qtyMin) || row.qty >= qtyMin;
    return matchDocNo && matchDate && matchItemCode && matchItemName && matchWarehouse && matchLocation && matchUnit && matchStatus && matchQtyMin;
  });
  const selectedRows = filteredData.filter((row) => selectedDocNos.has(row.doc_no));
  const exportRows = isReport ? inventoryData : (selectedRows.length ? selectedRows : inventoryData);
  const dialogInitialValues: Record<string, string> = editingRow
    ? {
        doc_no: editingRow.doc_no,
        date: editingRow.date,
        item_code: editingRow.item_code,
        item_name: editingRow.item_name,
        qty: String(editingRow.qty),
        unit: editingRow.unit,
        warehouse: editingRow.warehouse,
        location: editingRow.location,
        status: editingRow.status,
      }
    : {
        doc_no: buildDocNo(),
        date: new Date().toISOString().slice(0, 10),
        item_code: master?.itemMaster?.[0]?.itemCode ?? "",
        item_name: master?.itemMaster?.[0]?.itemName ?? "",
        qty: "0",
        unit: master?.unitMaster?.[0]?.unitCode ?? "",
        warehouse: master?.warehouseMaster?.[0]?.warehouseName ?? "",
        location: master?.locationMaster?.[0]?.locationName ?? "",
        status: "draft",
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
        secondaryActionContent={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("pdf", exportRows)}>
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("xlsx", exportRows)}>
                Export Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv", exportRows)}>
                Export CSV (UTF-8)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      
      {!isReport && (
        <div className="bg-white p-4 rounded-lg border mb-4">
          {/* Filter Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">เลขที่เอกสาร</label>
              <Input
                placeholder="ค้นหาเลขที่เอกสาร"
                value={filterDocNo}
                onChange={(e) => setFilterDocNo(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">วันที่</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">รหัสสินค้า</label>
              <Input
                placeholder="ค้นหารหัสสินค้า"
                value={filterItemCode}
                onChange={(e) => setFilterItemCode(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">ชื่อสินค้า</label>
              <Input
                placeholder="ค้นหาชื่อสินค้า"
                value={filterItemName}
                onChange={(e) => setFilterItemName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
              <div>
                <label className="text-xs text-gray-600 block mb-1">คลัง</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  value={filterWarehouse}
                  onChange={(e) => {
                    setFilterWarehouse(e.target.value);
                    setFilterLocation("");
                  }}
                >
                  <option value="">ระบุคลัง</option>
                  {warehouseOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">ชั้นวาง</label>
                <select
                  className={`h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm ${!filterWarehouse ? "opacity-60 cursor-not-allowed" : ""}`}
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  disabled={!filterWarehouse}
                >
                  <option value="">ระบุชั้นวาง</option>
                  {locationOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div>
                <label className="text-xs text-gray-600 block mb-1">หน่วย</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  value={filterUnit}
                  onChange={(e) => setFilterUnit(e.target.value)}
                >
                  <option value="">ระบุหน่วย</option>
                  {unitOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">สถานะ</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">ระบุสถานะ</option>
                  {statusOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">จำนวนขั้นต่ำ</label>
                <Input
                  type="number"
                  min={0}
                  placeholder="ระบุจำนวน"
                  value={filterQtyMin}
                  onChange={(e) => setFilterQtyMin(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex justify-start  gap-5">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="px-6 bg-red-500 hover:bg-red-600 text-white px-20 gap-4 border border-red-600"
                >
                  ล้างทั้งหมด
                </Button>

             <div className="flex gap-3 justify-end items-center">
                <Button
                  className="bg-blue-900 hover:bg-blue-950 text-white px-10 gap-4 border border-blue-950"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                  ค้นหา
                </Button>

              </div>
                <Button
                  className="flex justify-start gap-2 bg-white hover:bg-blue-700 text-blue-900 px-10 border border-blue-300"
                  onClick={openCreateDialog}
                >
                  <Plus className="h-4 w-4" />
                  สร้างเอกสาร
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredData}
        selectable={!isReport}
        selectedRowIds={selectedDocNos}
        onSelectionChange={setSelectedDocNos}
        getRowId={(row: InventoryRow) => row.doc_no}
        onRowClick={!isReport ? openEditDialog : undefined}
        selectionActions={
          !isReport ? (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleDeleteSelected}
                disabled={selectedDocNos.size === 0}
                title="ลบข้อมูลรายการ"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleUndoDelete}
                title="ย้อนกลับข้อมูล"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </div>
          ) : null
        }
      />
      <CrudFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRow ? `แก้ไข${pageInfo.title}` : `สร้าง${pageInfo.title}`}
        fields={inventoryFields}
        initialValues={dialogInitialValues}
        submitLabel={editingRow ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
        onSubmit={handleSubmitDialog}
      />
    </div>
  );
};

export default Inventory;
