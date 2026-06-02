export const dashboardSummaryCards = [
  { title: "ยอดขายเดือนนี้", value: "฿2,450,000", change: "+12.5%", up: true, color: "text-success" },
  { title: "ยอดซื้อเดือนนี้", value: "฿1,820,000", change: "+8.2%", up: true, color: "text-info" },
  { title: "สินค้าคงเหลือ", value: "3,456 รายการ", change: "-2.1%", up: false, color: "text-warning" },
  { title: "ใบสั่งผลิต", value: "28 รายการ", change: "+5.3%", up: true, color: "text-primary" },
  { title: "ใบรับสินค้า", value: "142 รายการ", change: "+4.1%", up: true, color: "text-success" },
  { title: "สินค้ารอส่ง", value: "57 รายการ", change: "-1.4%", up: false, color: "text-warning" },
];

export const dashboardMonthlySales = [
  { month: "ม.ค.", sales: 1800000, purchase: 1200000 },
  { month: "ก.พ.", sales: 2100000, purchase: 1500000 },
  { month: "มี.ค.", sales: 1950000, purchase: 1350000 },
  { month: "เม.ย.", sales: 2300000, purchase: 1600000 },
  { month: "พ.ค.", sales: 2450000, purchase: 1820000 },
  { month: "มิ.ย.", sales: 2200000, purchase: 1700000 },
  { month: "ก.ค.", sales: 2380000, purchase: 1750000 },
  { month: "ส.ค.", sales: 2520000, purchase: 1880000 },
];

export const dashboardRecentOrders = [
  { id: "SO-2024-001", customer: "บริษัท ABC จำกัด", date: "2024-03-15", amount: "฿125,000", status: "approved" },
  { id: "SO-2024-002", customer: "บริษัท XYZ จำกัด", date: "2024-03-14", amount: "฿89,500", status: "pending" },
  { id: "SO-2024-003", customer: "ห้างหุ้นส่วน DEF", date: "2024-03-13", amount: "฿245,000", status: "completed" },
  { id: "SO-2024-004", customer: "บริษัท GHI จำกัด", date: "2024-03-12", amount: "฿67,800", status: "in_progress" },
  { id: "SO-2024-005", customer: "บริษัท JKL จำกัด", date: "2024-03-11", amount: "฿198,000", status: "draft" },
  { id: "SO-2024-006", customer: "บริษัท NOP จำกัด", date: "2024-03-10", amount: "฿74,500", status: "approved" },
  { id: "SO-2024-007", customer: "บริษัท QRS จำกัด", date: "2024-03-09", amount: "฿132,900", status: "pending" },
];

export const inventoryRows = [
  { doc_no: "GR-2024-0001", date: "2024-03-15", item_code: "RM-001", item_name: "เหล็กแผ่น 3mm", qty: 500, unit: "แผ่น", warehouse: "คลัง A", location: "โซน A ชั้น 1 ล็อก 1", status: "approved" },
  { doc_no: "GR-2024-0002", date: "2024-03-14", item_code: "RM-002", item_name: "สีพ่นอุตสาหกรรม", qty: 200, unit: "กระป๋อง", warehouse: "คลัง B", location: "โซน A ชั้น 1 ล็อก 2", status: "pending" },
  { doc_no: "GR-2024-0003", date: "2024-03-13", item_code: "FG-001", item_name: "ชิ้นส่วนประกอบ A", qty: 1000, unit: "ชิ้น", warehouse: "คลัง A", location: "โซน C ชั้น 5 ล็อก 2", status: "completed" },
  { doc_no: "GR-2024-0004", date: "2024-03-12", item_code: "RM-003", item_name: "น็อตสแตนเลส M8", qty: 5000, unit: "ตัว", warehouse: "คลัง C", location: "โซน A ชั้น 1 ล็อก 1", status: "draft" },
  { doc_no: "GR-2024-0005", date: "2024-03-11", item_code: "FG-002", item_name: "ผลิตภัณฑ์สำเร็จรูป B", qty: 300, unit: "ชิ้น", warehouse: "คลัง A", location: "โซน C ชั้น 5 ล็อก 2", status: "approved" },
  { doc_no: "GR-2024-0006", date: "2024-03-10", item_code: "RM-001", item_name: "เหล็กแผ่น 2mm", qty: 800, unit: "แผ่น", warehouse: "คลัง B", location: "โซน A ชั้น 1 ล็อก 2", status: "pending" },
  { doc_no: "GR-2024-0007", date: "2024-03-09", item_code: "FG-001", item_name: "ชิ้นส่วนประกอบ A", qty: 420, unit: "ชิ้น", warehouse: "คลัง C", location: "โซน C ชั้น 5 ล็อก 2", status: "approved" },
  { doc_no: "GR-2024-0008", date: "2024-03-08", item_code: "RM-002", item_name: "สีพ่นอุตสาหกรรม", qty: 120, unit: "กระป๋อง", warehouse: "คลัง A", location: "โซน A ชั้น 1 ล็อก 1", status: "completed" },
];

export const salesRows = [
  { doc_no: "QT-2024-0001", date: "2024-03-15", customer: "บริษัท ABC จำกัด", amount: "฿125,000.00", due_date: "2024-03-30", status: "approved" },
  { doc_no: "QT-2024-0002", date: "2024-03-14", customer: "บริษัท XYZ จำกัด", amount: "฿89,500.00", due_date: "2024-03-29", status: "pending" },
  { doc_no: "QT-2024-0003", date: "2024-03-13", customer: "ห้างหุ้นส่วน DEF", amount: "฿245,000.00", due_date: "2024-03-28", status: "completed" },
  { doc_no: "SO-2024-0001", date: "2024-03-12", customer: "บริษัท GHI จำกัด", amount: "฿67,800.00", due_date: "2024-03-27", status: "in_progress" },
  { doc_no: "SO-2024-0002", date: "2024-03-11", customer: "บริษัท JKL จำกัด", amount: "฿198,000.00", due_date: "2024-03-26", status: "draft" },
  { doc_no: "DO-2024-0001", date: "2024-03-10", customer: "บริษัท MNO จำกัด", amount: "฿156,200.00", due_date: "2024-03-25", status: "delivered" },
  { doc_no: "SO-2024-0003", date: "2024-03-09", customer: "บริษัท PQR จำกัด", amount: "฿92,000.00", due_date: "2024-03-24", status: "approved" },
  { doc_no: "DO-2024-0002", date: "2024-03-08", customer: "บริษัท STU จำกัด", amount: "฿64,500.00", due_date: "2024-03-23", status: "delivered" },
  { doc_no: "QT-2024-0004", date: "2024-03-07", customer: "บริษัท VWX จำกัด", amount: "฿214,300.00", due_date: "2024-03-22", status: "pending" },
];

export const salesCalendarDays = [
  { day: 15, items: ["DO-001 บ.ABC"] },
  { day: 18, items: ["DO-002 บ.XYZ", "DO-003 หจก.DEF"] },
  { day: 22, items: ["DO-004 บ.GHI"] },
  { day: 25, items: ["DO-005 บ.JKL"] },
  { day: 27, items: ["DO-006 บ.NOP"] },
  { day: 30, items: ["DO-007 บ.QRS", "DO-008 บ.STU"] },
];

export const purchaseRows = [
  { doc_no: "PR-2024-0001", date: "2024-03-15", supplier: "บริษัท วัตถุดิบไทย จำกัด", amount: "฿350,000.00", expected_date: "2024-03-25", status: "approved" },
  { doc_no: "PR-2024-0002", date: "2024-03-14", supplier: "บริษัท สตีลเวิร์ค จำกัด", amount: "฿180,000.00", expected_date: "2024-03-24", status: "pending" },
  { doc_no: "PO-2024-0001", date: "2024-03-13", supplier: "บริษัท เคมีภัณฑ์ จำกัด", amount: "฿95,000.00", expected_date: "2024-03-23", status: "completed" },
  { doc_no: "PO-2024-0002", date: "2024-03-12", supplier: "บริษัท อุปกรณ์อิเล็กทรอนิกส์ จำกัด", amount: "฿420,000.00", expected_date: "2024-03-22", status: "in_progress" },
  { doc_no: "PO-2024-0003", date: "2024-03-11", supplier: "บริษัท บรรจุภัณฑ์ไทย จำกัด", amount: "฿75,000.00", expected_date: "2024-03-21", status: "partial" },
  { doc_no: "PR-2024-0003", date: "2024-03-10", supplier: "บริษัท โลหะรุ่งเรือง จำกัด", amount: "฿210,000.00", expected_date: "2024-03-20", status: "approved" },
  { doc_no: "PO-2024-0004", date: "2024-03-09", supplier: "บริษัท สารเคมีไทย จำกัด", amount: "฿64,500.00", expected_date: "2024-03-19", status: "pending" },
  { doc_no: "PO-2024-0005", date: "2024-03-08", supplier: "บริษัท โกลบอลแพ็ค จำกัด", amount: "฿98,700.00", expected_date: "2024-03-18", status: "completed" },
];

export const purchaseCalendarDays = [
  { day: 10, items: ["PO-001 บ.วัตถุดิบ"] },
  { day: 15, items: ["PO-002 บ.สตีล"] },
  { day: 20, items: ["PO-003 บ.เคมี", "PO-004 บ.อิเล็ก"] },
  { day: 28, items: ["PO-005 บ.บรรจุภัณฑ์"] },
  { day: 12, items: ["PO-006 บ.โลหะ"] },
  { day: 24, items: ["PO-007 บ.สารเคมี"] },
];

export const accountingRows = [
  { doc_no: "AP-2024-0001", date: "2024-03-15", vendor: "บริษัท วัตถุดิบไทย จำกัด", description: "ซื้อเหล็กแผ่น", debit: "฿350,000.00", credit: "-", status: "approved" },
  { doc_no: "AP-2024-0002", date: "2024-03-14", vendor: "บริษัท สตีลเวิร์ค จำกัด", description: "ซื้อน็อตสแตนเลส", debit: "฿85,000.00", credit: "-", status: "pending" },
  { doc_no: "AP-2024-0003", date: "2024-03-13", vendor: "บริษัท เคมีภัณฑ์ จำกัด", description: "ค่าบริการขนส่ง", debit: "฿15,000.00", credit: "-", status: "completed" },
  { doc_no: "PV-2024-0001", date: "2024-03-12", vendor: "บริษัท วัตถุดิบไทย จำกัด", description: "จ่ายชำระ AP-001", debit: "-", credit: "฿350,000.00", status: "approved" },
  { doc_no: "AR-2024-0001", date: "2024-03-11", vendor: "บริษัท ABC จำกัด", description: "ขายสินค้า", debit: "-", credit: "฿125,000.00", status: "approved" },
  { doc_no: "AP-2024-0004", date: "2024-03-10", vendor: "บริษัท โลหะรุ่งเรือง จำกัด", description: "ซื้อเหล็กเส้น", debit: "฿72,000.00", credit: "-", status: "pending" },
  { doc_no: "PV-2024-0002", date: "2024-03-09", vendor: "บริษัท สตีลเวิร์ค จำกัด", description: "จ่ายชำระ AP-002", debit: "-", credit: "฿85,000.00", status: "approved" },
  { doc_no: "AR-2024-0002", date: "2024-03-08", vendor: "บริษัท JKL จำกัด", description: "ขายสินค้า", debit: "-", credit: "฿198,000.00", status: "approved" },
];

export const costingRows = [
  { item_code: "FG-001", item_name: "ชิ้นส่วนประกอบ A", material_cost: "฿45,000", labor_cost: "฿12,000", overhead: "฿8,000", total: "฿65,000", qty: 500, unit_cost: "฿130.00" },
  { item_code: "FG-002", item_name: "ผลิตภัณฑ์สำเร็จรูป B", material_cost: "฿120,000", labor_cost: "฿35,000", overhead: "฿22,000", total: "฿177,000", qty: 300, unit_cost: "฿590.00" },
  { item_code: "FG-003", item_name: "อะไหล่ซ่อมบำรุง C", material_cost: "฿28,000", labor_cost: "฿8,000", overhead: "฿5,500", total: "฿41,500", qty: 800, unit_cost: "฿51.88" },
  { item_code: "WIP-001", item_name: "งานระหว่างผลิต D", material_cost: "฿85,000", labor_cost: "฿25,000", overhead: "฿15,000", total: "฿125,000", qty: 200, unit_cost: "฿625.00" },
  { item_code: "FG-004", item_name: "ชิ้นส่วนประกอบ E", material_cost: "฿62,000", labor_cost: "฿18,000", overhead: "฿9,500", total: "฿89,500", qty: 400, unit_cost: "฿223.75" },
  { item_code: "WIP-002", item_name: "งานระหว่างผลิต F", material_cost: "฿96,000", labor_cost: "฿28,000", overhead: "฿17,500", total: "฿141,500", qty: 250, unit_cost: "฿566.00" },
];

export const costingSummary = [
  { label: "ต้นทุนวัตถุดิบรวม", value: "฿278,000" },
  { label: "ค่าแรงรวม", value: "฿80,000" },
  { label: "โสหุ้ยรวม", value: "฿50,500" },
  { label: "ต้นทุนรวมทั้งหมด", value: "฿408,500" },
  { label: "ต้นทุนเฉลี่ยต่อหน่วย", value: "฿215.40" },
  { label: "รายการต้นทุน", value: "6 รายการ" },
];

export const manufacturingJobOrders = [
  { doc_no: "JO-2024-0001", date: "2024-03-15", product: "ชิ้นส่วนประกอบ A", qty_plan: 500, qty_done: 350, work_center: "WC-01", progress: 70, status: "in_progress" },
  { doc_no: "JO-2024-0002", date: "2024-03-14", product: "ผลิตภัณฑ์สำเร็จรูป B", qty_plan: 300, qty_done: 300, work_center: "WC-02", progress: 100, status: "completed" },
  { doc_no: "JO-2024-0003", date: "2024-03-13", product: "อะไหล่ซ่อมบำรุง C", qty_plan: 800, qty_done: 0, work_center: "WC-01", progress: 0, status: "pending" },
  { doc_no: "JO-2024-0004", date: "2024-03-12", product: "งานจ้างผลิตภายนอก D", qty_plan: 200, qty_done: 120, work_center: "WC-03", progress: 60, status: "in_progress" },
  { doc_no: "JO-2024-0005", date: "2024-03-11", product: "สินค้า E", qty_plan: 1000, qty_done: 450, work_center: "WC-02", progress: 45, status: "in_progress" },
  { doc_no: "JO-2024-0006", date: "2024-03-10", product: "สินค้า F", qty_plan: 600, qty_done: 200, work_center: "WC-01", progress: 33, status: "in_progress" },
  { doc_no: "JO-2024-0007", date: "2024-03-09", product: "อะไหล่ซ่อมบำรุง G", qty_plan: 450, qty_done: 0, work_center: "WC-03", progress: 0, status: "pending" },
];

export const manufacturingMonitoringSummary = [
  { label: "กำลังผลิต", value: "3 ใบสั่ง", pct: 60 },
  { label: "รอผลิต", value: "2 ใบสั่ง", pct: 0 },
  { label: "เสร็จสิ้น", value: "1 ใบสั่ง", pct: 100 },
  { label: "ยกเลิก", value: "0 ใบสั่ง", pct: 0 },
];

export const manufacturingCalendarDays = [
  { day: 5, items: ["JO-001 ชิ้นส่วน A"] },
  { day: 12, items: ["JO-002 ผลิตภัณฑ์ B"] },
  { day: 18, items: ["JO-003 อะไหล่ C", "JO-004 งานจ้าง D"] },
  { day: 25, items: ["JO-005 สินค้า E"] },
  { day: 27, items: ["JO-006 สินค้า F"] },
  { day: 29, items: ["JO-007 อะไหล่ G"] },
];
