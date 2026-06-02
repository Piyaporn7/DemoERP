import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { PageDataSkeleton } from "@/components/shared/PageDataSkeleton";
import { PageErrorState } from "@/components/shared/PageErrorState";
import { mockApi } from "@/data/mockApi";
import { CrudFormDialog, type CrudField } from "@/components/shared/CrudFormDialog";
import { toast } from "sonner";

const pageMap: Record<string, { title: string; desc: string; columns: Array<{ key: string; label: string }>; type: "vendor" | "customer" | "payment-term" }> = {
  "/master-data/vendor": {
    title: "Vendor Master",
    desc: "ข้อมูลผู้ขายสำหรับระบบซื้อและเจ้าหนี้",
    type: "vendor",
columns: [
      { key: "vendorCode", label: "รหัสผู้ขาย" },
      { key: "vendorName", label: "ชื่อผู้ขาย" },
      { key: "vendorType", label: "ประเภทผู้ขาย" },
      { key: "taxId", label: "เลขประจำตัวผู้เสียภาษี" },
      { key: "address", label: "ที่อยู่" },
      { key: "contactName", label: "ชื่อผู้ติดต่อ" },
      { key: "contact", label: "เบอร์โทรศัพท์ / อีเมล" },
      { key: "paymentTerm", label: "เงื่อนไขการชำระเงิน" },
      { key: "creditLimit", label: "วงเงินเครดิต" },
      { key: "currency", label: "สกุลเงิน" },
      { key: "taxType", label: "ประเภทภาษี" },
      { key: "withholdingTax", label: "ภาษีหัก ณ ที่จ่าย" },
      { key: "status", label: "สถานะ" },
    ],
  },
  "/master-data/customer": {
    title: "Customer Master",
    desc: "ข้อมูลลูกค้าสำหรับระบบขายและลูกหนี้",
    type: "customer",
columns: [
      { key: "customerCode", label: "รหัสลูกค้า" },
      { key: "customerName", label: "ชื่อลูกค้า" },
      { key: "customerGroup", label: "กลุ่มลูกค้า" },
      { key: "taxId", label: "เลขประจำตัวผู้เสียภาษี" },
      { key: "address", label: "ที่อยู่" },
      { key: "contactName", label: "ชื่อผู้ติดต่อ" },
      { key: "contact", label: "เบอร์โทรศัพท์ / อีเมล" },
      { key: "paymentTerm", label: "เงื่อนไขการชำระเงิน" },
      { key: "creditLimit", label: "วงเงินเครดิต" },
      { key: "priceList", label: "รายการราคา" },
      { key: "currency", label: "สกุลเงิน" },
      { key: "taxType", label: "ประเภทภาษี" },
      { key: "salesPerson", label: "พนักงานขาย" },
      { key: "status", label: "สถานะ" },
    ],
  },
  "/master-data/payment-term": {
    title: "Payment Term Master",
    desc: "กำหนดเงื่อนไขเครดิตของลูกค้าและผู้ขาย",
    type: "payment-term",
columns: [
      { key: "paymentTermCode", label: "รหัสเงื่อนไขการชำระเงิน" },
      { key: "paymentTermName", label: "ชื่อเงื่อนไขการชำระเงิน" },
      { key: "creditDay", label: "จำนวนวันเครดิต" },
      { key: "dueDateType", label: "ประเภทวันครบกำหนด" },
      { key: "description", label: "คำอธิบาย" },
      { key: "status", label: "สถานะ" },
    ],
  },
};

const MasterData = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const pageInfo = pageMap[location.pathname] ?? pageMap["/master-data/vendor"];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["master-data"],
    queryFn: () => mockApi.getMasterData(),
  });

  const createMutation = useMutation({
    mutationFn: (row: Record<string, unknown>) => mockApi.createMasterData(pageInfo.type, row),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["master-data"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ idValue, patch }: { idValue: string; patch: Record<string, unknown> }) =>
      mockApi.updateMasterData(pageInfo.type, idValue, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["master-data"] }),
  });

  const rows = useMemo(() => {
    if (!data) return [];
    if (location.pathname === "/master-data/customer") return data.customerMaster ?? [];
    if (location.pathname === "/master-data/payment-term") return data.paymentTermMaster ?? [];
    return data.vendorMaster ?? [];
  }, [data, location.pathname]);

  const statusOptions = ["Active", "Inactive"];
  const vendorTypeOptions = ["สินค้า", "บริการ"].map((value) => ({ value, label: value }));
  const paymentTermOptions = (data?.paymentTermMaster ?? []).map((term) => ({
    value: term.paymentTermCode,
    label: `${term.paymentTermCode} - ${term.paymentTermName}`,
  }));
  const customerGroupOptions = (data?.customerGroupMaster ?? []).map((group) => ({
    value: group.customerGroupCode,
    label: `${group.customerGroupCode} - ${group.customerGroupName}`,
  }));
  const priceListOptions = (data?.priceListMaster ?? []).map((price) => ({
    value: price.priceListCode,
    label: `${price.priceListCode} - ${price.priceListName}`,
  }));
  const currencyOptions = (data?.currencyMaster ?? []).map((currency) => ({
    value: currency.currencyCode,
    label: `${currency.currencyCode} - ${currency.currencyName}`,
  }));
  const taxTypeOptions = (data?.taxMaster ?? []).map((tax) => ({
    value: tax.taxCode,
    label: `${tax.taxCode} - ${tax.taxName}`,
  }));
  const withholdingTaxOptions = [
    { value: "-", label: "-" },
    ...(data?.withholdingTaxMaster ?? []).map((wht) => ({
      value: wht.whtCode,
      label: `${wht.whtCode} - ${wht.whtName}`,
    })),
  ];
  const dueDateOptions = [
    { value: "Invoice Date", label: "Invoice Date" },
    { value: "End of Month", label: "End of Month" },
  ];

  const fields: CrudField[] = useMemo(() => {
    if (pageInfo.type === "vendor") {
      return [{ key: "vendorCode", label: "รหัสผู้ขาย", type: "text", required: true },
        { key: "vendorName", label: "ชื่อผู้ขาย", type: "text", required: true },
        { key: "vendorType", label: "ประเภทผู้ขาย", type: "select", required: true, options: vendorTypeOptions },
        { key: "taxId", label: "เลขประจำตัวผู้เสียภาษี", type: "text" },
        { key: "address", label: "ที่อยู่", type: "text" },
        { key: "contactName", label: "ชื่อผู้ติดต่อ", type: "text" },
        { key: "contact", label: "เบอร์โทรศัพท์ / อีเมล", type: "text" },
        { key: "paymentTerm", label: "เงื่อนไขการชำระเงิน", type: "select", options: paymentTermOptions },
        { key: "creditLimit", label: "วงเงินเครดิต", type: "number" },
        { key: "currency", label: "สกุลเงิน", type: "select", options: currencyOptions },
        { key: "taxType", label: "ประเภทภาษี", type: "select", options: taxTypeOptions },
        { key: "withholdingTax", label: "ภาษีหัก ณ ที่จ่าย", type: "select", options: withholdingTaxOptions },
        { key: "status", label: "สถานะ", type: "select", required: true, enumValues: statusOptions, options: statusOptions.map((value) => ({ value, label: value })) },
      ];
    }

    if (pageInfo.type === "customer") {
      return [
{ key: "customerCode", label: "รหัสลูกค้า", type: "text", required: true },
        { key: "customerName", label: "ชื่อลูกค้า", type: "text", required: true },
        { key: "customerGroup", label: "กลุ่มลูกค้า", type: "select", options: customerGroupOptions },
        { key: "taxId", label: "เลขประจำตัวผู้เสียภาษี", type: "text" },
        { key: "address", label: "ที่อยู่", type: "text" },
        { key: "contactName", label: "ชื่อผู้ติดต่อ", type: "text" },
        { key: "contact", label: "เบอร์โทรศัพท์ / อีเมล", type: "text" },
        { key: "paymentTerm", label: "เงื่อนไขการชำระเงิน", type: "select", options: paymentTermOptions },
        { key: "creditLimit", label: "วงเงินเครดิต", type: "number" },
        { key: "priceList", label: "รายการราคา", type: "select", options: priceListOptions },
        { key: "currency", label: "สกุลเงิน", type: "select", options: currencyOptions },
        { key: "taxType", label: "ประเภทภาษี", type: "select", options: taxTypeOptions },
        { key: "salesPerson", label: "พนักงานขาย", type: "text" },
        { key: "status", label: "สถานะ", type: "select", required: true, enumValues: statusOptions, options: statusOptions.map((value) => ({ value, label: value })) },
      ];
    }

    return [
      { key: "paymentTermCode", label: "รหัสเงื่อนไขการชำระเงิน", type: "text", required: true },
      { key: "paymentTermName", label: "ชื่อเงื่อนไขการชำระเงิน", type: "text", required: true },
      { key: "creditDay", label: "จำนวนวันเครดิต", type: "number" },
      { key: "dueDateType", label: "ประเภทวันครบกำหนด", type: "select", options: dueDateOptions },
      { key: "description", label: "คำอธิบาย", type: "text" },
      { key: "status", label: "สถานะ", type: "select", required: true, enumValues: statusOptions, options: statusOptions.map((value) => ({ value, label: value })) },
    ];
  }, [customerGroupOptions, currencyOptions, dueDateOptions, pageInfo.type, paymentTermOptions, priceListOptions, statusOptions, taxTypeOptions, vendorTypeOptions, withholdingTaxOptions]);

  const buildInitialValues = (row?: Record<string, unknown>) => {
    if (row) {
      return Object.fromEntries(fields.map((field) => [field.key, String(row[field.key] ?? "")]));
    }

    if (pageInfo.type === "vendor") {
      return {
        vendorCode: "",
        vendorName: "",
        vendorType: vendorTypeOptions[0]?.value ?? "สินค้า",
        taxId: "",
        address: "",
        contactName: "",
        contact: "",
        paymentTerm: paymentTermOptions[0]?.value ?? "",
        creditLimit: "0",
        currency: currencyOptions[0]?.value ?? "THB",
        taxType: taxTypeOptions[0]?.value ?? "VAT7",
        withholdingTax: withholdingTaxOptions[0]?.value ?? "-",
        status: "Active",
      };
    }

    if (pageInfo.type === "customer") {
      return {
        customerCode: "",
        customerName: "",
        customerGroup: customerGroupOptions[0]?.value ?? "",
        taxId: "",
        address: "",
        contactName: "",
        contact: "",
        paymentTerm: paymentTermOptions[0]?.value ?? "",
        creditLimit: "0",
        priceList: priceListOptions[0]?.value ?? "",
        currency: currencyOptions[0]?.value ?? "THB",
        taxType: taxTypeOptions[0]?.value ?? "VAT7",
        salesPerson: "",
        status: "Active",
      };
    }

    return {
      paymentTermCode: "",
      paymentTermName: "",
      creditDay: "0",
      dueDateType: dueDateOptions[0]?.value ?? "Invoice Date",
      description: "",
      status: "Active",
    };
  };

  const handleCreate = () => {
    setEditingRow(null);
    setDialogOpen(true);
  };

  const handleEdit = (row: Record<string, unknown>) => {
    setEditingRow(row);
    setDialogOpen(true);
  };

  const handleSubmit = (values: Record<string, string>) => {
    const payload: Record<string, unknown> = { ...values };

    if (pageInfo.type === "vendor" || pageInfo.type === "customer") {
      payload.creditLimit = Number(values.creditLimit || 0);
    }

    if (pageInfo.type === "payment-term") {
      payload.creditDay = Number(values.creditDay || 0);
    }

    if (editingRow) {
      const idKey = pageInfo.type === "vendor" ? "vendorCode" : pageInfo.type === "customer" ? "customerCode" : "paymentTermCode";
      const idValue = String(editingRow[idKey] ?? "");
      updateMutation.mutate(
        { idValue, patch: payload },
        {
          onSuccess: (ok) => {
            if (ok) toast.success("แก้ไขข้อมูลสำเร็จ");
            else toast.error("ไม่สามารถแก้ไขข้อมูลได้");
          },
        },
      );
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: (ok) => {
        if (ok) toast.success("เพิ่มข้อมูลสำเร็จ");
        else toast.error("รหัสซ้ำหรือข้อมูลไม่ครบ");
      },
    });
  };

  if (isLoading) {
    return <PageDataSkeleton rows={8} />;
  }

  if (isError) {
    return <PageErrorState onRetry={() => refetch()} />;
  }

  return (
    <div>
      <PageHeader title={pageInfo.title} description={pageInfo.desc} actionLabel="สร้างรายการ" onAction={handleCreate} />
      <DataTable columns={pageInfo.columns} data={rows} onRowClick={handleEdit} />
      <CrudFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRow ? `แก้ไข${pageInfo.title}` : `สร้าง${pageInfo.title}`}
        fields={fields}
        initialValues={buildInitialValues(editingRow ?? undefined)}
        submitLabel={editingRow ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default MasterData;
