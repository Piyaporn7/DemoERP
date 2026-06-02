export type MasterStatus = "Active" | "Inactive";

export const vendorMaster = [
  {
    vendorCode: "V0001",
    vendorName: "บจก. สตีลพาร์ท",
    vendorType: "สินค้า",
    taxId: "0105555000111",
    address: "123 ม.1 ถ.บางนา ต.บางแก้ว อ.บางพลี สมุทรปราการ",
    contactName: "สมชาย ใจดี",
    contact: "02-111-2222 / somchai@steel.com",
    paymentTerm: "NET30",
    creditLimit: 500000,
    currency: "THB",
    taxType: "VAT7",
    withholdingTax: "-",
    status: "Active" as MasterStatus,
  },
  {
    vendorCode: "V0002",
    vendorName: "บจก. ไอทีเซอร์วิส",
    vendorType: "บริการ",
    taxId: "0105566000222",
    address: "45/6 ถ.รัชดาภิเษก ดินแดง กทม.",
    contactName: "สมหญิง รักงาน",
    contact: "02-333-4444 / it@itservice.co.th",
    paymentTerm: "NET15",
    creditLimit: 100000,
    currency: "THB",
    taxType: "VAT7",
    withholdingTax: "WHT3",
    status: "Active" as MasterStatus,
  },
];

export const customerMaster = [
  {
    customerCode: "C0001",
    customerName: "หจก. เฟอร์นิเจอร์มอลล์",
    customerGroup: "CG-WS",
    taxId: "0103555000333",
    address: "88 ม.5 ถ.พระราม 2 บางขุนเทียน กทม.",
    contactName: "วิชัย",
    contact: "081-999-8888 / wichai@fmall.com",
    paymentTerm: "NET30",
    creditLimit: 1000000,
    priceList: "PL-WS",
    currency: "THB",
    taxType: "VAT7",
    salesPerson: "SP01",
    status: "Active" as MasterStatus,
  },
  {
    customerCode: "C0002",
    customerName: "ร้านค้าปลีก เจริญดี",
    customerGroup: "CG-RT",
    taxId: "3100555000444",
    address: "99 ถ.ลาดพร้าว แขวงจตุจักร กทม.",
    contactName: "เจ๊นก",
    contact: "089-777-6666",
    paymentTerm: "CASH",
    creditLimit: 0,
    priceList: "PL-STD",
    currency: "THB",
    taxType: "VAT7",
    salesPerson: "SP02",
    status: "Active" as MasterStatus,
  },
];

export const paymentTermMaster = [
  { paymentTermCode: "CASH", paymentTermName: "เงินสด", creditDay: 0, dueDateType: "Invoice Date", description: "ชำระทันที", status: "Active" as MasterStatus },
  { paymentTermCode: "NET15", paymentTermName: "เครดิต 15 วัน", creditDay: 15, dueDateType: "Invoice Date", description: "ชำระภายใน 15 วัน", status: "Active" as MasterStatus },
  { paymentTermCode: "NET30", paymentTermName: "เครดิต 30 วัน", creditDay: 30, dueDateType: "Invoice Date", description: "ชำระภายใน 30 วัน", status: "Active" as MasterStatus },
];

export const itemMaster = [
  { itemCode: "RM-001", itemName: "เหล็กแผ่น 2mm", itemType: "Raw", itemGroup: "Material", unit: "KG", costPrice: 35, sellingPrice: 0, minStock: 500, maxStock: 2000, reorderPoint: 600, warehouseDefault: "WH-RAW", shelfLocation: "A-01-01", barcode: "885000000001", status: "Active" as MasterStatus },
  { itemCode: "RM-002", itemName: "น็อตเบอร์ 10", itemType: "Raw", itemGroup: "Material", unit: "PCS", costPrice: 2.5, sellingPrice: 0, minStock: 1000, maxStock: 5000, reorderPoint: 1200, warehouseDefault: "WH-RAW", shelfLocation: "A-01-02", barcode: "885000000002", status: "Active" as MasterStatus },
  { itemCode: "FG-001", itemName: "โต๊ะทำงานเหล็ก", itemType: "Finished", itemGroup: "Furniture", unit: "PCS", costPrice: 1200, sellingPrice: 2500, minStock: 50, maxStock: 200, reorderPoint: 80, warehouseDefault: "WH-FG", shelfLocation: "C-05-02", barcode: "885111100001", status: "Active" as MasterStatus },
  { itemCode: "SV-001", itemName: "ค่าบริการติดตั้ง", itemType: "Service", itemGroup: "Service", unit: "JOB", costPrice: 0, sellingPrice: 3000, minStock: 0, maxStock: 0, reorderPoint: 0, warehouseDefault: "-", shelfLocation: "-", barcode: "-", status: "Active" as MasterStatus },
];

export const unitMaster = [
  { unitCode: "PCS", unitName: "ชิ้น", unitDescription: "หน่วยนับเป็นชิ้น", baseUnit: true, status: "Active" as MasterStatus },
  { unitCode: "BOX", unitName: "กล่อง", unitDescription: "1 กล่อง = 10 ชิ้น", baseUnit: false, status: "Active" as MasterStatus },
  { unitCode: "KG", unitName: "กิโลกรัม", unitDescription: "หน่วยน้ำหนัก", baseUnit: true, status: "Active" as MasterStatus },
  { unitCode: "JOB", unitName: "งาน", unitDescription: "หน่วยบริการ", baseUnit: true, status: "Active" as MasterStatus },
];

export const warehouseMaster = [
  { warehouseCode: "WH-RAW", warehouseName: "คลังวัตถุดิบ", warehouseType: "Raw Material", address: "อาคาร 1 ชั้น 1", responsiblePerson: "Store 1", status: "Active" as MasterStatus },
  { warehouseCode: "WH-FG", warehouseName: "คลังสินค้าสำเร็จรูป", warehouseType: "Finished Goods", address: "อาคาร 2 ชั้น 1", responsiblePerson: "Store 2", status: "Active" as MasterStatus },
  { warehouseCode: "WH-WIP", warehouseName: "คลังงานระหว่างผลิต", warehouseType: "WIP", address: "อาคารผลิต ชั้น 1", responsiblePerson: "Production Store", status: "Active" as MasterStatus },
];

export const locationMaster = [
  { locationCode: "A-01-01", locationName: "โซน A ชั้น 1 ล็อก 1", warehouse: "WH-RAW", zone: "A", shelf: "01", bin: "01", status: "Active" as MasterStatus },
  { locationCode: "B-03-02", locationName: "โซน B ชั้น 1 ล็อก 2", warehouse: "WH-RAW", zone: "B", shelf: "03", bin: "02", status: "Active" as MasterStatus },
  { locationCode: "C-05-02", locationName: "โซน C ชั้น 5 ล็อก 2", warehouse: "WH-FG", zone: "C", shelf: "05", bin: "03", status: "Active" as MasterStatus },
];

export const vendorGroupMaster = [
  { vendorGroupCode: "VG-RAW", vendorGroupName: "Raw Material", description: "ผู้ขายวัตถุดิบ", status: "Active" as MasterStatus },
  { vendorGroupCode: "VG-SVC", vendorGroupName: "Service Vendor", description: "ผู้ขายบริการ", status: "Active" as MasterStatus },
  { vendorGroupCode: "VG-SUB", vendorGroupName: "Subcontract", description: "ผู้รับจ้างผลิต", status: "Active" as MasterStatus },
];

export const purchaseTypeMaster = [
  { purchaseTypeCode: "PO-MAT", purchaseTypeName: "Purchase Raw Material", description: "ซื้อวัตถุดิบ", status: "Active" as MasterStatus },
  { purchaseTypeCode: "PO-SVC", purchaseTypeName: "Purchase Service", description: "ซื้อบริการ", status: "Active" as MasterStatus },
  { purchaseTypeCode: "PO-AST", purchaseTypeName: "Purchase Asset", description: "ซื้อสินทรัพย์", status: "Active" as MasterStatus },
];

export const customerGroupMaster = [
  { customerGroupCode: "CG-WS", customerGroupName: "Wholesale", description: "ลูกค้าขายส่ง", status: "Active" as MasterStatus },
  { customerGroupCode: "CG-RT", customerGroupName: "Retail", description: "ลูกค้าขายปลีก", status: "Active" as MasterStatus },
  { customerGroupCode: "CG-DIS", customerGroupName: "Distributor", description: "ลูกค้าตัวแทน", status: "Active" as MasterStatus },
];

export const priceListMaster = [
  { priceListCode: "PL-STD", priceListName: "Standard Price", currency: "THB", effectiveDate: "2026-01-01", description: "ราคาขายมาตรฐาน", status: "Active" as MasterStatus },
  { priceListCode: "PL-WS", priceListName: "Wholesale Price", currency: "THB", effectiveDate: "2026-01-01", description: "ราคาขายส่ง", status: "Active" as MasterStatus },
  { priceListCode: "PL-PRO", priceListName: "Promotion Price", currency: "THB", effectiveDate: "2026-04-01", description: "ราคาโปรโมชั่น", status: "Active" as MasterStatus },
];

export const chartOfAccountMaster = [
  { accountCode: "1000", accountName: "เงินสด", accountType: "Asset", parentAccount: "1000", level: 1, status: "Active" as MasterStatus },
  { accountCode: "1100", accountName: "ลูกหนี้การค้า", accountType: "Asset", parentAccount: "1000", level: 2, status: "Active" as MasterStatus },
  { accountCode: "2000", accountName: "เจ้าหนี้การค้า", accountType: "Liability", parentAccount: "2000", level: 1, status: "Active" as MasterStatus },
  { accountCode: "4100", accountName: "รายได้จากการขาย", accountType: "Revenue", parentAccount: "4000", level: 2, status: "Active" as MasterStatus },
  { accountCode: "5100", accountName: "ต้นทุนขาย", accountType: "Expense", parentAccount: "5000", level: 2, status: "Active" as MasterStatus },
];

export const taxMaster = [
  { taxCode: "VAT7", taxName: "VAT 7%", taxRate: 7, taxType: "Purchase/Sales", status: "Active" as MasterStatus },
  { taxCode: "VAT0", taxName: "VAT 0%", taxRate: 0, taxType: "Purchase/Sales", status: "Active" as MasterStatus },
  { taxCode: "NON-VAT", taxName: "NON VAT", taxRate: 0, taxType: "Purchase/Sales", status: "Active" as MasterStatus },
];

export const withholdingTaxMaster = [
  { whtCode: "WHT3", whtName: "WHT 3%", taxRate: 3, taxType: "Service", description: "ภาษีหัก ณ ที่จ่าย 3%", status: "Active" as MasterStatus },
  { whtCode: "WHT5", whtName: "WHT 5%", taxRate: 5, taxType: "Rent", description: "ภาษีหัก ณ ที่จ่าย 5%", status: "Active" as MasterStatus },
];

export const bomHeaderMaster = [
  { bomCode: "BOM-FG001", productItem: "FG-001", version: "1.0", effectiveDate: "2026-01-01", description: "สูตรการผลิตโต๊ะทำงานเหล็ก", status: "Active" as MasterStatus },
];

export const bomDetailMaster = [
  { bomCode: "BOM-FG001", item: "RM-001", quantity: 15, unit: "KG", scrapPercent: 2 },
  { bomCode: "BOM-FG001", item: "RM-002", quantity: 20, unit: "PCS", scrapPercent: 1 },
  { bomCode: "BOM-FG001", item: "RM-003", quantity: 0.5, unit: "L", scrapPercent: 5 },
];

export const workCenterMaster = [
  { workCenterCode: "WC-CUT", workCenterName: "Cutting", department: "PRD", capacity: "100 ชิ้น/วัน", status: "Active" as MasterStatus },
  { workCenterCode: "WC-ASM", workCenterName: "Assembly", department: "PRD", capacity: "50 ชิ้น/วัน", status: "Active" as MasterStatus },
  { workCenterCode: "WC-PKG", workCenterName: "Packing", department: "PRD", capacity: "80 ชิ้น/วัน", status: "Active" as MasterStatus },
];

export const machineMaster = [
  { machineCode: "MAC-CUT-01", machineName: "เครื่องตัดเลเซอร์ 1", workCenter: "WC-CUT", capacity: "50 ชิ้น/วัน", status: "Active" as MasterStatus },
  { machineCode: "MAC-CUT-02", machineName: "เครื่องตัดพลาสม่า", workCenter: "WC-CUT", capacity: "50 ชิ้น/วัน", status: "Active" as MasterStatus },
  { machineCode: "MAC-ASM-01", machineName: "เครื่องประกอบอัตโนมัติ", workCenter: "WC-ASM", capacity: "30 ชิ้น/วัน", status: "Active" as MasterStatus },
];

export const resourceMaster = [
  { resourceCode: "LAB-001", resourceName: "ช่างเชื่อม", resourceType: "Labor", costRate: 500, status: "Active" as MasterStatus },
  { resourceCode: "LAB-002", resourceName: "ช่างประกอบ", resourceType: "Labor", costRate: 450, status: "Active" as MasterStatus },
  { resourceCode: "MAC-ENERGY", resourceName: "ค่าไฟเครื่องจักร", resourceType: "Machine", costRate: 50, status: "Active" as MasterStatus },
];

export const currencyMaster = [
  { currencyCode: "THB", currencyName: "Thai Baht", exchangeRate: 1, status: "Active" as MasterStatus },
  { currencyCode: "USD", currencyName: "US Dollar", exchangeRate: 35.5, status: "Active" as MasterStatus },
  { currencyCode: "EUR", currencyName: "Euro", exchangeRate: 39.2, status: "Active" as MasterStatus },
];

export const departmentMaster = [
  { departmentCode: "PRD", departmentName: "Production", description: "ฝ่ายผลิต", status: "Active" as MasterStatus },
  { departmentCode: "SAL", departmentName: "Sales", description: "ฝ่ายขาย", status: "Active" as MasterStatus },
  { departmentCode: "ADM", departmentName: "Admin", description: "ฝ่ายบริหาร", status: "Active" as MasterStatus },
  { departmentCode: "ACC", departmentName: "Accounting", description: "ฝ่ายบัญชี", status: "Active" as MasterStatus },
];

export const costCenterMaster = [
  { costCenterCode: "CC-PRD", costCenterName: "Production", department: "PRD", status: "Active" as MasterStatus },
  { costCenterCode: "CC-SAL", costCenterName: "Sales", department: "SAL", status: "Active" as MasterStatus },
  { costCenterCode: "CC-ADM", costCenterName: "Admin", department: "ADM", status: "Active" as MasterStatus },
];

export const masterData = {
  vendorMaster,
  customerMaster,
  paymentTermMaster,
  itemMaster,
  unitMaster,
  warehouseMaster,
  locationMaster,
  vendorGroupMaster,
  purchaseTypeMaster,
  customerGroupMaster,
  priceListMaster,
  chartOfAccountMaster,
  taxMaster,
  withholdingTaxMaster,
  bomHeaderMaster,
  bomDetailMaster,
  workCenterMaster,
  machineMaster,
  resourceMaster,
  currencyMaster,
  departmentMaster,
  costCenterMaster,
};
