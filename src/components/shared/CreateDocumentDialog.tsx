import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Save, Printer } from "lucide-react";

export interface FormFieldConfig {
  key: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "textarea";
  options?: { value: string; label: string }[];
  defaultValue?: string;
  placeholder?: string;
  colSpan?: number;
}

export interface LineItemConfig {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  width?: string;
}

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  docPrefix: string;
  headerFields: FormFieldConfig[];
  lineItems?: LineItemConfig[];
  showLineItems?: boolean;
}

const generateDocNo = (prefix: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  return `${prefix}-${year}-${seq}`;
};

const mockLineData = [
  { item_code: "RM-001", item_name: "เหล็กแผ่น 3mm", qty: 100, unit: "แผ่น", unit_price: 250, amount: 25000 },
  { item_code: "RM-002", item_name: "สีพ่นอุตสาหกรรม", qty: 50, unit: "กระป๋อง", unit_price: 180, amount: 9000 },
];

export function CreateDocumentDialog({
  open,
  onOpenChange,
  title,
  docPrefix,
  headerFields,
  lineItems,
  showLineItems = true,
}: CreateDocumentDialogProps) {
  const [docNo] = useState(() => generateDocNo(docPrefix));
  const [lines, setLines] = useState(mockLineData);

  const addLine = () => {
    setLines([...lines, { item_code: "", item_name: "", qty: 0, unit: "ชิ้น", unit_price: 0, amount: 0 }]);
  };

  const removeLine = (idx: number) => {
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleSave = (status: string) => {
    toast.success(`บันทึกเอกสาร ${docNo} สำเร็จ (${status})`, {
      description: `เอกสาร ${title} ถูกบันทึกเรียบร้อยแล้ว`,
    });
    onOpenChange(false);
  };

  const totalAmount = lines.reduce((sum, l) => sum + (l.amount || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        {/* Document Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <div>
            <Label className="text-xs text-muted-foreground">เลขที่เอกสาร</Label>
            <Input value={docNo} readOnly className="mt-1 bg-muted/50 font-mono" />
          </div>
          {headerFields.map((field) => (
            <div key={field.key} className={field.colSpan === 2 ? "md:col-span-2" : ""}>
              <Label className="text-xs text-muted-foreground">{field.label}</Label>
              {field.type === "select" ? (
                <Select defaultValue={field.defaultValue}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={field.placeholder || `เลือก${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea className="mt-1" placeholder={field.placeholder} rows={2} defaultValue={field.defaultValue} />
              ) : (
                <Input
                  type={field.type}
                  className="mt-1"
                  placeholder={field.placeholder}
                  defaultValue={field.defaultValue || (field.type === "date" ? new Date().toISOString().split("T")[0] : "")}
                />
              )}
            </div>
          ))}
        </div>

        {/* Line Items */}
        {showLineItems && (
          <>
            <Separator className="my-2" />
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">รายการสินค้า</h4>
              <Button variant="outline" size="sm" onClick={addLine} className="gap-1 text-xs">
                <Plus className="h-3 w-3" /> เพิ่มรายการ
              </Button>
            </div>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-8 text-center">#</TableHead>
                    <TableHead className="w-24">รหัสสินค้า</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead className="w-20 text-right">จำนวน</TableHead>
                    <TableHead className="w-16">หน่วย</TableHead>
                    <TableHead className="w-24 text-right">ราคา/หน่วย</TableHead>
                    <TableHead className="w-28 text-right">จำนวนเงิน</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-center text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <Input value={line.item_code} className="h-8 text-xs" readOnly={!!line.item_code} />
                      </TableCell>
                      <TableCell>
                        <Input value={line.item_name} className="h-8 text-xs" readOnly={!!line.item_name} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={line.qty} className="h-8 text-xs text-right" readOnly />
                      </TableCell>
                      <TableCell>
                        <Input value={line.unit} className="h-8 text-xs" readOnly />
                      </TableCell>
                      <TableCell>
                        <Input type="number" value={line.unit_price} className="h-8 text-xs text-right" readOnly />
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        ฿{(line.amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeLine(i)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-3">
              <div className="w-72 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">รวมก่อนภาษี</span>
                  <span>฿{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม 7%</span>
                  <span>฿{(totalAmount * 0.07).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>รวมทั้งสิ้น</span>
                  <span>฿{(totalAmount * 1.07).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Remarks */}
        <div className="mt-2">
          <Label className="text-xs text-muted-foreground">หมายเหตุ</Label>
          <Textarea className="mt-1" placeholder="หมายเหตุเพิ่มเติม..." rows={2} />
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button variant="secondary" onClick={() => handleSave("ร่าง")} className="gap-1">
            <Save className="h-4 w-4" /> บันทึกร่าง
          </Button>
          <Button onClick={() => handleSave("อนุมัติ")} className="gap-1">
            <Printer className="h-4 w-4" /> บันทึกและอนุมัติ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Pre-built form configs for each module
export const formConfigs: Record<string, { docPrefix: string; headerFields: FormFieldConfig[]; showLineItems?: boolean }> = {
  // === Inventory ===
  "/inventory/goods-receive": {
    docPrefix: "GR",
    headerFields: [
      { key: "date", label: "วันที่รับ", type: "date" },
      { key: "po_ref", label: "อ้างอิง PO", type: "select", options: [{ value: "PO-2024-0001", label: "PO-2024-0001" }, { value: "PO-2024-0002", label: "PO-2024-0002" }] },
      { key: "supplier", label: "ผู้ขาย", type: "select", options: [{ value: "s1", label: "บริษัท วัตถุดิบไทย จำกัด" }, { value: "s2", label: "บริษัท สตีลเวิร์ค จำกัด" }] },
      { key: "warehouse", label: "คลังสินค้า", type: "select", options: [{ value: "A", label: "คลัง A" }, { value: "B", label: "คลัง B" }, { value: "C", label: "คลัง C" }] },
    ],
  },
  "/inventory/sales-return": {
    docPrefix: "SR",
    headerFields: [
      { key: "date", label: "วันที่รับคืน", type: "date" },
      { key: "so_ref", label: "อ้างอิง SO", type: "select", options: [{ value: "SO-2024-0001", label: "SO-2024-0001" }, { value: "SO-2024-0002", label: "SO-2024-0002" }] },
      { key: "customer", label: "ลูกค้า", type: "select", options: [{ value: "c1", label: "บริษัท ABC จำกัด" }, { value: "c2", label: "บริษัท XYZ จำกัด" }] },
      { key: "reason", label: "เหตุผลรับคืน", type: "text", placeholder: "ระบุเหตุผล" },
    ],
  },
  "/inventory/stock-adjust-in": {
    docPrefix: "AI",
    headerFields: [
      { key: "date", label: "วันที่ปรับปรุง", type: "date" },
      { key: "warehouse", label: "คลังสินค้า", type: "select", options: [{ value: "A", label: "คลัง A" }, { value: "B", label: "คลัง B" }] },
      { key: "reason", label: "เหตุผล", type: "text", placeholder: "เหตุผลปรับปรุง" },
    ],
  },
  "/inventory/opening-stock": {
    docPrefix: "OS",
    headerFields: [
      { key: "date", label: "วันที่ยกมา", type: "date" },
      { key: "period", label: "งวดบัญชี", type: "select", options: [{ value: "2024-01", label: "มกราคม 2024" }, { value: "2024-02", label: "กุมภาพันธ์ 2024" }] },
      { key: "warehouse", label: "คลังสินค้า", type: "select", options: [{ value: "A", label: "คลัง A" }, { value: "B", label: "คลัง B" }] },
    ],
  },
  "/inventory/purchase-return": {
    docPrefix: "PR",
    headerFields: [
      { key: "date", label: "วันที่ส่งคืน", type: "date" },
      { key: "gr_ref", label: "อ้างอิง GR", type: "select", options: [{ value: "GR-2024-0001", label: "GR-2024-0001" }] },
      { key: "supplier", label: "ผู้ขาย", type: "select", options: [{ value: "s1", label: "บริษัท วัตถุดิบไทย จำกัด" }] },
      { key: "reason", label: "เหตุผลส่งคืน", type: "text", placeholder: "ระบุเหตุผล" },
    ],
  },
  "/inventory/issue-for-sale": {
    docPrefix: "IS",
    headerFields: [
      { key: "date", label: "วันที่เบิก", type: "date" },
      { key: "so_ref", label: "อ้างอิง SO", type: "select", options: [{ value: "SO-2024-0001", label: "SO-2024-0001" }] },
      { key: "customer", label: "ลูกค้า", type: "select", options: [{ value: "c1", label: "บริษัท ABC จำกัด" }] },
      { key: "warehouse", label: "คลังสินค้า", type: "select", options: [{ value: "A", label: "คลัง A" }] },
    ],
  },
  "/inventory/general-issue": {
    docPrefix: "GI",
    headerFields: [
      { key: "date", label: "วันที่เบิก", type: "date" },
      { key: "department", label: "แผนก", type: "select", options: [{ value: "prod", label: "ฝ่ายผลิต" }, { value: "maint", label: "ฝ่ายซ่อมบำรุง" }, { value: "admin", label: "ฝ่ายบริหาร" }] },
      { key: "purpose", label: "วัตถุประสงค์", type: "text", placeholder: "ระบุวัตถุประสงค์" },
    ],
  },
  "/inventory/stock-adjust-out": {
    docPrefix: "AO",
    headerFields: [
      { key: "date", label: "วันที่ปรับปรุง", type: "date" },
      { key: "warehouse", label: "คลังสินค้า", type: "select", options: [{ value: "A", label: "คลัง A" }, { value: "B", label: "คลัง B" }] },
      { key: "reason", label: "เหตุผล", type: "text", placeholder: "เหตุผลปรับปรุง" },
    ],
  },
  "/inventory/warehouse-transfer": {
    docPrefix: "WT",
    headerFields: [
      { key: "date", label: "วันที่โอนย้าย", type: "date" },
      { key: "from_wh", label: "จากคลัง", type: "select", options: [{ value: "A", label: "คลัง A" }, { value: "B", label: "คลัง B" }] },
      { key: "to_wh", label: "ไปคลัง", type: "select", options: [{ value: "B", label: "คลัง B" }, { value: "C", label: "คลัง C" }] },
    ],
  },
  "/inventory/shelf-in": {
    docPrefix: "SI",
    headerFields: [
      { key: "date", label: "วันที่รับเข้า", type: "date" },
      { key: "shelf", label: "ตำแหน่ง SHELF", type: "select", options: [{ value: "A-01-01", label: "A-01-01" }, { value: "A-01-02", label: "A-01-02" }, { value: "B-01-01", label: "B-01-01" }] },
      { key: "warehouse", label: "คลังสินค้า", type: "select", options: [{ value: "A", label: "คลัง A" }] },
    ],
  },
  "/inventory/shelf-out": {
    docPrefix: "SO",
    headerFields: [
      { key: "date", label: "วันที่เบิกออก", type: "date" },
      { key: "shelf", label: "ตำแหน่ง SHELF", type: "select", options: [{ value: "A-01-01", label: "A-01-01" }, { value: "B-01-01", label: "B-01-01" }] },
      { key: "purpose", label: "วัตถุประสงค์", type: "text", placeholder: "ระบุวัตถุประสงค์" },
    ],
  },
  "/inventory/shelf-transfer": {
    docPrefix: "ST",
    headerFields: [
      { key: "date", label: "วันที่ย้าย", type: "date" },
      { key: "from_shelf", label: "จาก SHELF", type: "select", options: [{ value: "A-01-01", label: "A-01-01" }] },
      { key: "to_shelf", label: "ไป SHELF", type: "select", options: [{ value: "B-01-01", label: "B-01-01" }] },
    ],
  },
  // === Sales ===
  "/sales/quotation": {
    docPrefix: "QT",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "customer", label: "ลูกค้า", type: "select", options: [{ value: "c1", label: "บริษัท ABC จำกัด" }, { value: "c2", label: "บริษัท XYZ จำกัด" }, { value: "c3", label: "ห้างหุ้นส่วน DEF" }] },
      { key: "valid_until", label: "ใช้ได้ถึง", type: "date" },
      { key: "payment_term", label: "เงื่อนไขชำระ", type: "select", options: [{ value: "cash", label: "เงินสด" }, { value: "30d", label: "เครดิต 30 วัน" }, { value: "60d", label: "เครดิต 60 วัน" }] },
      { key: "salesperson", label: "พนักงานขาย", type: "select", options: [{ value: "sp1", label: "สมชาย ใจดี" }, { value: "sp2", label: "สมหญิง รักงาน" }] },
    ],
  },
  "/sales/order": {
    docPrefix: "SO",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "qt_ref", label: "อ้างอิง QT", type: "select", options: [{ value: "QT-2024-0001", label: "QT-2024-0001" }, { value: "QT-2024-0002", label: "QT-2024-0002" }] },
      { key: "customer", label: "ลูกค้า", type: "select", options: [{ value: "c1", label: "บริษัท ABC จำกัด" }, { value: "c2", label: "บริษัท XYZ จำกัด" }] },
      { key: "delivery_date", label: "กำหนดส่ง", type: "date" },
      { key: "payment_term", label: "เงื่อนไขชำระ", type: "select", options: [{ value: "cash", label: "เงินสด" }, { value: "30d", label: "เครดิต 30 วัน" }] },
    ],
  },
  "/sales/delivery": {
    docPrefix: "DO",
    headerFields: [
      { key: "date", label: "วันที่ส่ง", type: "date" },
      { key: "so_ref", label: "อ้างอิง SO", type: "select", options: [{ value: "SO-2024-0001", label: "SO-2024-0001" }] },
      { key: "customer", label: "ลูกค้า", type: "select", options: [{ value: "c1", label: "บริษัท ABC จำกัด" }] },
      { key: "shipping", label: "วิธีจัดส่ง", type: "select", options: [{ value: "truck", label: "รถบรรทุก" }, { value: "courier", label: "ขนส่งเอกชน" }, { value: "pickup", label: "ลูกค้ารับเอง" }] },
      { key: "address", label: "ที่อยู่จัดส่ง", type: "textarea", placeholder: "ที่อยู่จัดส่งสินค้า", colSpan: 2 },
    ],
  },
  // === Purchase ===
  "/purchase/request": {
    docPrefix: "PR",
    headerFields: [
      { key: "date", label: "วันที่ขอซื้อ", type: "date" },
      { key: "department", label: "แผนกที่ขอ", type: "select", options: [{ value: "prod", label: "ฝ่ายผลิต" }, { value: "maint", label: "ฝ่ายซ่อมบำรุง" }, { value: "admin", label: "ฝ่ายบริหาร" }] },
      { key: "urgency", label: "ความเร่งด่วน", type: "select", options: [{ value: "normal", label: "ปกติ" }, { value: "urgent", label: "เร่งด่วน" }, { value: "critical", label: "เร่งด่วนมาก" }] },
      { key: "needed_date", label: "ต้องการภายใน", type: "date" },
    ],
  },
  "/purchase/order": {
    docPrefix: "PO",
    headerFields: [
      { key: "date", label: "วันที่สั่งซื้อ", type: "date" },
      { key: "pr_ref", label: "อ้างอิง PR", type: "select", options: [{ value: "PR-2024-0001", label: "PR-2024-0001" }] },
      { key: "supplier", label: "ผู้ขาย", type: "select", options: [{ value: "s1", label: "บริษัท วัตถุดิบไทย จำกัด" }, { value: "s2", label: "บริษัท สตีลเวิร์ค จำกัด" }] },
      { key: "delivery_date", label: "กำหนดรับ", type: "date" },
      { key: "payment_term", label: "เงื่อนไขชำระ", type: "select", options: [{ value: "cash", label: "เงินสด" }, { value: "30d", label: "เครดิต 30 วัน" }, { value: "60d", label: "เครดิต 60 วัน" }] },
    ],
  },
  // === Accounting ===
  "/accounting/ap-purchase": {
    docPrefix: "AP",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "vendor", label: "ผู้ขาย", type: "select", options: [{ value: "s1", label: "บริษัท วัตถุดิบไทย จำกัด" }, { value: "s2", label: "บริษัท สตีลเวิร์ค จำกัด" }] },
      { key: "invoice_no", label: "เลขที่ใบแจ้งหนี้", type: "text", placeholder: "INV-XXXX" },
      { key: "due_date", label: "วันครบกำหนด", type: "date" },
    ],
  },
  "/accounting/ap-service": {
    docPrefix: "SV",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "vendor", label: "ผู้ให้บริการ", type: "select", options: [{ value: "s1", label: "บริษัท ขนส่ง จำกัด" }, { value: "s2", label: "บริษัท ซ่อมบำรุง จำกัด" }] },
      { key: "service_desc", label: "รายละเอียดบริการ", type: "text", placeholder: "ระบุบริการ" },
    ],
  },
  "/accounting/ap-expense": {
    docPrefix: "EX",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "expense_type", label: "ประเภทค่าใช้จ่าย", type: "select", options: [{ value: "util", label: "ค่าสาธารณูปโภค" }, { value: "rent", label: "ค่าเช่า" }, { value: "other", label: "อื่นๆ" }] },
      { key: "description", label: "รายละเอียด", type: "text", placeholder: "ระบุรายละเอียด" },
    ],
    showLineItems: false,
  },
  "/accounting/ap-payment": {
    docPrefix: "PV",
    headerFields: [
      { key: "date", label: "วันที่จ่าย", type: "date" },
      { key: "vendor", label: "ผู้รับเงิน", type: "select", options: [{ value: "s1", label: "บริษัท วัตถุดิบไทย จำกัด" }] },
      { key: "pay_method", label: "วิธีชำระ", type: "select", options: [{ value: "transfer", label: "โอนเงิน" }, { value: "cheque", label: "เช็ค" }, { value: "cash", label: "เงินสด" }] },
      { key: "amount", label: "จำนวนเงิน", type: "number", placeholder: "0.00" },
    ],
    showLineItems: false,
  },
  "/accounting/ar-sale": {
    docPrefix: "IV",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "customer", label: "ลูกค้า", type: "select", options: [{ value: "c1", label: "บริษัท ABC จำกัด" }, { value: "c2", label: "บริษัท XYZ จำกัด" }] },
      { key: "so_ref", label: "อ้างอิง SO", type: "select", options: [{ value: "SO-2024-0001", label: "SO-2024-0001" }] },
      { key: "due_date", label: "วันครบกำหนด", type: "date" },
    ],
  },
  "/accounting/ar-service": {
    docPrefix: "SV",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "customer", label: "ลูกค้า", type: "select", options: [{ value: "c1", label: "บริษัท ABC จำกัด" }] },
      { key: "service_desc", label: "รายละเอียดบริการ", type: "text", placeholder: "ระบุบริการ" },
    ],
  },
  "/accounting/ar-other": {
    docPrefix: "OI",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "income_type", label: "ประเภทรายได้", type: "select", options: [{ value: "interest", label: "ดอกเบี้ยรับ" }, { value: "rent", label: "ค่าเช่ารับ" }, { value: "other", label: "อื่นๆ" }] },
      { key: "description", label: "รายละเอียด", type: "text", placeholder: "ระบุรายละเอียด" },
      { key: "amount", label: "จำนวนเงิน", type: "number", placeholder: "0.00" },
    ],
    showLineItems: false,
  },
  "/accounting/ar-receive": {
    docPrefix: "RV",
    headerFields: [
      { key: "date", label: "วันที่รับ", type: "date" },
      { key: "customer", label: "ผู้จ่ายเงิน", type: "select", options: [{ value: "c1", label: "บริษัท ABC จำกัด" }] },
      { key: "pay_method", label: "วิธีรับชำระ", type: "select", options: [{ value: "transfer", label: "โอนเงิน" }, { value: "cheque", label: "เช็ค" }, { value: "cash", label: "เงินสด" }] },
      { key: "amount", label: "จำนวนเงิน", type: "number", placeholder: "0.00" },
    ],
    showLineItems: false,
  },
  "/accounting/gl-withholding": {
    docPrefix: "WT",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "payer", label: "ผู้จ่ายเงิน", type: "text", placeholder: "ชื่อผู้จ่ายเงิน" },
      { key: "payee", label: "ผู้รับเงิน", type: "text", placeholder: "ชื่อผู้รับเงิน" },
      { key: "tax_rate", label: "อัตราภาษี", type: "select", options: [{ value: "1", label: "1%" }, { value: "2", label: "2%" }, { value: "3", label: "3%" }, { value: "5", label: "5%" }] },
      { key: "amount", label: "จำนวนเงินที่จ่าย", type: "number", placeholder: "0.00" },
    ],
    showLineItems: false,
  },
  "/accounting/gl-journal": {
    docPrefix: "JV",
    headerFields: [
      { key: "date", label: "วันที่", type: "date" },
      { key: "description", label: "คำอธิบาย", type: "text", placeholder: "คำอธิบายรายการ", colSpan: 2 },
    ],
  },
  // === Manufacturing ===
  "/manufacturing/mps": {
    docPrefix: "MPS",
    headerFields: [
      { key: "date", label: "วันที่วางแผน", type: "date" },
      { key: "product", label: "สินค้า", type: "select", options: [{ value: "fg1", label: "ชิ้นส่วนประกอบ A" }, { value: "fg2", label: "ผลิตภัณฑ์ B" }] },
      { key: "qty", label: "จำนวนแผน", type: "number", placeholder: "0" },
      { key: "start_date", label: "วันเริ่ม", type: "date" },
      { key: "end_date", label: "วันสิ้นสุด", type: "date" },
    ],
    showLineItems: false,
  },
  "/manufacturing/mrp": {
    docPrefix: "MRP",
    headerFields: [
      { key: "date", label: "วันที่คำนวณ", type: "date" },
      { key: "mps_ref", label: "อ้างอิง MPS", type: "select", options: [{ value: "MPS-2024-0001", label: "MPS-2024-0001" }] },
      { key: "product", label: "สินค้า", type: "select", options: [{ value: "fg1", label: "ชิ้นส่วนประกอบ A" }] },
    ],
  },
  "/manufacturing/bom": {
    docPrefix: "BOM",
    headerFields: [
      { key: "product", label: "สินค้า FG", type: "select", options: [{ value: "fg1", label: "ชิ้นส่วนประกอบ A" }, { value: "fg2", label: "ผลิตภัณฑ์ B" }] },
      { key: "version", label: "เวอร์ชัน", type: "text", defaultValue: "1.0" },
      { key: "effective_date", label: "วันที่มีผล", type: "date" },
      { key: "qty_base", label: "จำนวนฐาน", type: "number", defaultValue: "1" },
    ],
  },
  "/manufacturing/job-order": {
    docPrefix: "JO",
    headerFields: [
      { key: "date", label: "วันที่สั่งผลิต", type: "date" },
      { key: "bom_ref", label: "อ้างอิง BOM", type: "select", options: [{ value: "BOM-001", label: "BOM-001 ชิ้นส่วน A" }] },
      { key: "product", label: "สินค้า", type: "select", options: [{ value: "fg1", label: "ชิ้นส่วนประกอบ A" }] },
      { key: "qty", label: "จำนวนสั่งผลิต", type: "number", placeholder: "0" },
      { key: "work_center", label: "Work Center", type: "select", options: [{ value: "WC-01", label: "WC-01" }, { value: "WC-02", label: "WC-02" }] },
      { key: "due_date", label: "กำหนดเสร็จ", type: "date" },
    ],
  },
  "/manufacturing/job-transaction": {
    docPrefix: "JT",
    headerFields: [
      { key: "date", label: "วันที่โอนย้าย", type: "date" },
      { key: "jo_ref", label: "อ้างอิง JO", type: "select", options: [{ value: "JO-2024-0001", label: "JO-2024-0001" }] },
      { key: "from_wc", label: "จาก Work Center", type: "select", options: [{ value: "WC-01", label: "WC-01" }] },
      { key: "to_wc", label: "ไป Work Center", type: "select", options: [{ value: "WC-02", label: "WC-02" }] },
      { key: "qty", label: "จำนวน", type: "number", placeholder: "0" },
    ],
    showLineItems: false,
  },
  "/manufacturing/work-centers": {
    docPrefix: "WC",
    headerFields: [
      { key: "name", label: "ชื่อ Work Center", type: "text", placeholder: "ชื่อศูนย์การผลิต" },
      { key: "code", label: "รหัส", type: "text", placeholder: "WC-XX" },
      { key: "capacity", label: "กำลังการผลิต/วัน", type: "number", placeholder: "0" },
      { key: "cost_per_hour", label: "ต้นทุน/ชม.", type: "number", placeholder: "0.00" },
    ],
    showLineItems: false,
  },
  "/manufacturing/machines": {
    docPrefix: "MC",
    headerFields: [
      { key: "name", label: "ชื่อเครื่องจักร", type: "text", placeholder: "ชื่อเครื่องจักร" },
      { key: "code", label: "รหัส", type: "text", placeholder: "MC-XX" },
      { key: "work_center", label: "Work Center", type: "select", options: [{ value: "WC-01", label: "WC-01" }, { value: "WC-02", label: "WC-02" }] },
      { key: "status", label: "สถานะ", type: "select", options: [{ value: "active", label: "ใช้งาน" }, { value: "maintenance", label: "ซ่อมบำรุง" }, { value: "inactive", label: "ไม่ใช้งาน" }] },
    ],
    showLineItems: false,
  },
  "/manufacturing/resources": {
    docPrefix: "RS",
    headerFields: [
      { key: "name", label: "ชื่อทรัพยากร", type: "text", placeholder: "ชื่อทรัพยากร" },
      { key: "type", label: "ประเภท", type: "select", options: [{ value: "labor", label: "แรงงาน" }, { value: "machine", label: "เครื่องจักร" }, { value: "tool", label: "เครื่องมือ" }] },
      { key: "capacity", label: "ความสามารถ", type: "number", placeholder: "0" },
      { key: "unit", label: "หน่วย", type: "select", options: [{ value: "hr", label: "ชั่วโมง" }, { value: "unit", label: "หน่วย" }] },
    ],
    showLineItems: false,
  },
  "/manufacturing/material-issue": {
    docPrefix: "MI",
    headerFields: [
      { key: "date", label: "วันที่เบิก", type: "date" },
      { key: "jo_ref", label: "อ้างอิง JO", type: "select", options: [{ value: "JO-2024-0001", label: "JO-2024-0001" }] },
      { key: "warehouse", label: "คลังสินค้า", type: "select", options: [{ value: "A", label: "คลัง A" }] },
    ],
  },
  "/manufacturing/material-return": {
    docPrefix: "MR",
    headerFields: [
      { key: "date", label: "วันที่รับคืน", type: "date" },
      { key: "jo_ref", label: "อ้างอิง JO", type: "select", options: [{ value: "JO-2024-0001", label: "JO-2024-0001" }] },
      { key: "reason", label: "เหตุผล", type: "text", placeholder: "ระบุเหตุผล" },
    ],
  },
  "/manufacturing/fg-receive": {
    docPrefix: "FG",
    headerFields: [
      { key: "date", label: "วันที่รับ", type: "date" },
      { key: "jo_ref", label: "อ้างอิง JO", type: "select", options: [{ value: "JO-2024-0001", label: "JO-2024-0001" }] },
      { key: "warehouse", label: "คลังรับ", type: "select", options: [{ value: "A", label: "คลัง A - สินค้าสำเร็จรูป" }] },
      { key: "qa_status", label: "สถานะ QA", type: "select", options: [{ value: "passed", label: "ผ่าน" }, { value: "pending", label: "รอตรวจ" }] },
    ],
  },
  "/manufacturing/subcontract-issue": {
    docPrefix: "SC",
    headerFields: [
      { key: "date", label: "วันที่เบิก", type: "date" },
      { key: "contractor", label: "ผู้รับจ้าง", type: "select", options: [{ value: "ct1", label: "บริษัท รับจ้างผลิต จำกัด" }] },
      { key: "jo_ref", label: "อ้างอิง JO", type: "select", options: [{ value: "JO-2024-0004", label: "JO-2024-0004" }] },
      { key: "due_date", label: "กำหนดรับคืน", type: "date" },
    ],
  },
  "/manufacturing/subcontract-receive": {
    docPrefix: "CR",
    headerFields: [
      { key: "date", label: "วันที่รับ", type: "date" },
      { key: "sc_ref", label: "อ้างอิงใบเบิกจ้าง", type: "select", options: [{ value: "SC-2024-0001", label: "SC-2024-0001" }] },
      { key: "qa_status", label: "สถานะ QA", type: "select", options: [{ value: "passed", label: "ผ่าน" }, { value: "pending", label: "รอตรวจ" }] },
    ],
  },
  "/manufacturing/aql": {
    docPrefix: "AQL",
    headerFields: [
      { key: "product", label: "สินค้า", type: "select", options: [{ value: "fg1", label: "ชิ้นส่วนประกอบ A" }] },
      { key: "lot_size", label: "ขนาด Lot", type: "number", placeholder: "0" },
      { key: "inspection_level", label: "ระดับตรวจ", type: "select", options: [{ value: "I", label: "Level I" }, { value: "II", label: "Level II" }, { value: "III", label: "Level III" }] },
      { key: "aql_value", label: "AQL", type: "select", options: [{ value: "0.65", label: "0.65" }, { value: "1.0", label: "1.0" }, { value: "2.5", label: "2.5" }] },
    ],
    showLineItems: false,
  },
  "/manufacturing/qa-inspection": {
    docPrefix: "QA",
    headerFields: [
      { key: "date", label: "วันที่ตรวจ", type: "date" },
      { key: "jo_ref", label: "อ้างอิง JO", type: "select", options: [{ value: "JO-2024-0001", label: "JO-2024-0001" }] },
      { key: "product", label: "สินค้า", type: "select", options: [{ value: "fg1", label: "ชิ้นส่วนประกอบ A" }] },
      { key: "inspector", label: "ผู้ตรวจ", type: "select", options: [{ value: "ins1", label: "สมชาย QA" }, { value: "ins2", label: "สมหญิง QA" }] },
      { key: "result", label: "ผลตรวจ", type: "select", options: [{ value: "pass", label: "ผ่าน" }, { value: "fail", label: "ไม่ผ่าน" }, { value: "conditional", label: "ผ่านแบบมีเงื่อนไข" }] },
    ],
    showLineItems: false,
  },
  // === Costing ===
  "/costing/allocation": {
    docPrefix: "CA",
    headerFields: [
      { key: "period", label: "งวดบัญชี", type: "select", options: [{ value: "2024-03", label: "มีนาคม 2024" }, { value: "2024-02", label: "กุมภาพันธ์ 2024" }] },
      { key: "method", label: "วิธีปันส่วน", type: "select", options: [{ value: "direct", label: "Direct" }, { value: "step", label: "Step-down" }, { value: "reciprocal", label: "Reciprocal" }] },
      { key: "cost_center", label: "ศูนย์ต้นทุน", type: "select", options: [{ value: "cc1", label: "ฝ่ายผลิต 1" }, { value: "cc2", label: "ฝ่ายผลิต 2" }] },
    ],
    showLineItems: false,
  },
  "/costing/actual-cost": {
    docPrefix: "AC",
    headerFields: [
      { key: "period", label: "งวดบัญชี", type: "select", options: [{ value: "2024-03", label: "มีนาคม 2024" }] },
      { key: "product", label: "สินค้า", type: "select", options: [{ value: "fg1", label: "ชิ้นส่วนประกอบ A" }, { value: "fg2", label: "ผลิตภัณฑ์ B" }] },
    ],
    showLineItems: false,
  },
};
