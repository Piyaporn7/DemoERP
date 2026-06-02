import {
  LayoutDashboard, Package, ShoppingCart, ShoppingBag, BookOpen, Calculator,
  Factory, ChevronDown, Warehouse, ArrowDownToLine, ArrowUpFromLine, BarChart3,
  Layers, FileText, Calendar, CreditCard, Receipt, Building2, Cog, ClipboardCheck,
  Boxes, ArrowRightLeft, Shield, Database
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuGroups = [
  {
    label: "หน้าหลัก",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "คลังสินค้า",
    icon: Package,
    items: [
      {
        title: "สินค้าขาเข้า", icon: ArrowDownToLine, children: [
          { title: "รับสินค้าเข้า", url: "/inventory/goods-receive" },
          { title: "รับคืนสินค้า", url: "/inventory/sales-return" },
          { title: "ปรับปรุงสต็อกขาเข้า", url: "/inventory/stock-adjust-in" },
          { title: "สินค้ายกมา", url: "/inventory/opening-stock" },
        ]
      },
      {
        title: "สินค้าขาออก", icon: ArrowUpFromLine, children: [
          { title: "ส่งคืนสินค้า", url: "/inventory/purchase-return" },
          { title: "เบิกสินค้าเพื่อขาย", url: "/inventory/issue-for-sale" },
          { title: "ใบเบิกทั่วไป", url: "/inventory/general-issue" },
          { title: "ปรับปรุงสต็อกขาออก", url: "/inventory/stock-adjust-out" },
          { title: "เบิกย้ายคลัง", url: "/inventory/warehouse-transfer" },
        ]
      },
      {
        title: "รายงานคลัง", icon: BarChart3, children: [
          { title: "ยอดคงเหลือสินค้า", url: "/inventory/report-balance" },
          { title: "การเคลื่อนไหวสินค้า", url: "/inventory/report-movement" },
          { title: "สร้าง QR Code", url: "/inventory/qr-code" },
          { title: "ต่ำกว่าจุดสั่งซื้อ", url: "/inventory/report-reorder" },
          { title: "สูงกว่ายอดคงคลังสูงสุด", url: "/inventory/report-overstock" },
        ]
      },
      {
        title: "SHELF", icon: Layers, children: [
          { title: "รับเข้า SHELF", url: "/inventory/shelf-in" },
          { title: "เบิกออก SHELF", url: "/inventory/shelf-out" },
          { title: "ย้าย SHELF", url: "/inventory/shelf-transfer" },
          { title: "สรุปยอด SHELF", url: "/inventory/shelf-balance" },
          { title: "เคลื่อนไหว SHELF", url: "/inventory/shelf-movement" },
          { title: "ตรวจนับ SHELF", url: "/inventory/shelf-count" },
        ]
      },
    ],
  },
  {
    label: "ระบบขาย",
    icon: ShoppingCart,
    items: [
      { title: "ใบเสนอราคา", url: "/sales/quotation", icon: FileText },
      { title: "ใบรับคำสั่งซื้อ", url: "/sales/order", icon: ShoppingCart },
      { title: "ใบส่งของ", url: "/sales/delivery", icon: ShoppingBag },
      { title: "ปฏิทินส่งของ", url: "/sales/calendar", icon: Calendar },
      {
        title: "รายงานขาย", icon: BarChart3, children: [
          { title: "รายงาน Quotation", url: "/sales/report-quotation" },
          { title: "รายงาน Sales Order", url: "/sales/report-order" },
          { title: "รายงาน Delivery", url: "/sales/report-delivery" },
        ]
      },
    ],
  },
  {
    label: "ระบบซื้อ",
    icon: ShoppingBag,
    items: [
      { title: "ใบขอซื้อ", url: "/purchase/request", icon: FileText },
      { title: "ใบสั่งซื้อ", url: "/purchase/order", icon: ShoppingBag },
      { title: "ปฏิทินรับสินค้า", url: "/purchase/calendar", icon: Calendar },
      {
        title: "รายงานซื้อ", icon: BarChart3, children: [
          { title: "รายงานใบขอซื้อ", url: "/purchase/report-request" },
          { title: "ต้นทุนซื้อสินค้า", url: "/purchase/report-cost" },
          { title: "สินค้าค้างรับ", url: "/purchase/report-pending" },
        ]
      },
    ],
  },
  {
    label: "ระบบบัญชี",
    icon: BookOpen,
    items: [
      {
        title: "เจ้าหนี้", icon: CreditCard, children: [
          { title: "ซื้อสินค้า", url: "/accounting/ap-purchase" },
          { title: "ซื้อบริการ", url: "/accounting/ap-service" },
          { title: "ค่าใช้จ่าย", url: "/accounting/ap-expense" },
          { title: "จ่ายชำระหนี้", url: "/accounting/ap-payment" },
          { title: "รายงานเจ้าหนี้", url: "/accounting/ap-report" },
        ]
      },
      {
        title: "ลูกหนี้", icon: Receipt, children: [
          { title: "ขายสินค้า", url: "/accounting/ar-sale" },
          { title: "ขายบริการ", url: "/accounting/ar-service" },
          { title: "รายได้อื่นๆ", url: "/accounting/ar-other" },
          { title: "รับชำระหนี้", url: "/accounting/ar-receive" },
          { title: "รายงานลูกหนี้", url: "/accounting/ar-report" },
        ]
      },
      {
        title: "General Ledger", icon: BookOpen, children: [
          { title: "ใบหักภาษี ณ ที่จ่าย", url: "/accounting/gl-withholding" },
          { title: "สมุดรายวันทั่วไป", url: "/accounting/gl-journal" },
          { title: "รายงานภาษีซื้อ", url: "/accounting/gl-input-tax" },
          { title: "รายงานภาษีขาย", url: "/accounting/gl-output-tax" },
          { title: "ภ.ง.ด.53", url: "/accounting/gl-pnd53" },
        ]
      },
    ],
  },
  {
    label: "บัญชีต้นทุน",
    icon: Calculator,
    items: [
      { title: "ปันส่วนต้นทุน", url: "/costing/allocation", icon: Calculator },
      { title: "คำนวณ Actual Cost", url: "/costing/actual-cost", icon: Calculator },
      { title: "สรุป Ending Stock", url: "/costing/ending-stock", icon: Boxes },
      { title: "Stock Card Pricing", url: "/costing/stock-card", icon: BarChart3 },
    ],
  },
  {
    label: "บริหารการผลิต",
    icon: Factory,
    items: [
      {
        title: "MRP II", icon: Cog, children: [
          { title: "MPS", url: "/manufacturing/mps" },
          { title: "MRP", url: "/manufacturing/mrp" },
          { title: "ปฏิทินการผลิต", url: "/manufacturing/calendar" },
        ]
      },
      {
        title: "ควบคุมการผลิต", icon: ClipboardCheck, children: [
          { title: "BOM", url: "/manufacturing/bom" },
          { title: "ใบสั่งผลิต", url: "/manufacturing/job-order" },
          { title: "โอนย้ายงาน WIP", url: "/manufacturing/job-transaction" },
          { title: "ติดตามการผลิต", url: "/manufacturing/monitoring" },
        ]
      },
      {
        title: "Operation", icon: Building2, children: [
          { title: "Work Centers", url: "/manufacturing/work-centers" },
          { title: "Machine List", url: "/manufacturing/machines" },
          { title: "Resource", url: "/manufacturing/resources" },
        ]
      },
      {
        title: "เบิกจ่ายวัตถุดิบ", icon: ArrowRightLeft, children: [
          { title: "เบิกวัตถุดิบ", url: "/manufacturing/material-issue" },
          { title: "รับคืนวัตถุดิบ", url: "/manufacturing/material-return" },
          { title: "รับสินค้าผลิตได้", url: "/manufacturing/fg-receive" },
          { title: "เบิกจ้างผลิต", url: "/manufacturing/subcontract-issue" },
          { title: "รับงานจ้างผลิต", url: "/manufacturing/subcontract-receive" },
        ]
      },
      {
        title: "QA", icon: Shield, children: [
          { title: "ตาราง AQL", url: "/manufacturing/aql" },
          { title: "ตรวจสอบคุณภาพ", url: "/manufacturing/qa-inspection" },
        ]
      },
      {
        title: "รายงานการผลิต", icon: BarChart3, children: [
          { title: "รายงานวางแผน", url: "/manufacturing/report-plan" },
          { title: "การผลิตประจำวัน", url: "/manufacturing/report-daily" },
          { title: "ความต้องการวัตถุดิบ", url: "/manufacturing/report-material" },
          { title: "สถานะใบสั่งผลิต", url: "/manufacturing/report-job-status" },
        ]
      },
    ],
  },
    {
    label: "Master Data",
    icon: Database,
    items: [
      {
        title: "Master Data",
        icon: Database,
        children: [
          { title: "ผู้ขาย ", url: "/master-data/vendor" },
          { title: "ลูกค้า", url: "/master-data/customer" },
          { title: "เงื่อนไขการชำระเงิน", url: "/master-data/payment-term" },
        ],
      },
    ],
  },
];

interface MenuItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: { title: string; url: string }[];
}

function SidebarMenuItemWithSub({ item, collapsed }: { item: MenuItem; collapsed: boolean }) {
  const location = useLocation();
  const isChildActive = item.children?.some(c => location.pathname === c.url) ?? false;

  if (item.children) {
    return (
      <Collapsible defaultOpen={isChildActive}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="justify-between">
              <span className="flex items-center gap-2">
                {item.icon && <item.icon className="h-4 w-4" />}
                {!collapsed && <span>{item.title}</span>}
              </span>
              {!collapsed && <ChevronDown className="h-3 w-3 transition-transform [[data-state=open]>&]:rotate-180" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map(child => (
                <SidebarMenuSubItem key={child.url}>
                  <SidebarMenuSubButton asChild>
                    <NavLink to={child.url} end activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <span className="text-xs">{child.title}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink to={item.url!} end activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
          {item.icon && <item.icon className="h-4 w-4" />}
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sm font-bold text-sidebar-primary-foreground">E</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-sidebar-foreground">DemoERP</h2>
              <p className="text-[10px] text-sidebar-foreground/60">Enterprise Resource Planning</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto">
        {menuGroups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider">
              {!collapsed && group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItemWithSub key={item.title} item={item as MenuItem} collapsed={collapsed} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
