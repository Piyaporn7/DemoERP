import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CrudFieldType = "text" | "number" | "date" | "select";

export interface CrudField {
  key: string;
  label: string;
  type: CrudFieldType;
  required?: boolean;
  readOnly?: boolean;
  options?: Array<{ value: string; label: string }>;
  enumValues?: string[];
}

interface CrudFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: CrudField[];
  initialValues: Record<string, string>;
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => void;
}

export function CrudFormDialog({
  open,
  onOpenChange,
  title,
  fields,
  initialValues,
  submitLabel,
  onSubmit,
}: CrudFormDialogProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues, open]);

  const formFields = useMemo(() => fields, [fields]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    for (const field of formFields) {
      const rawValue = values[field.key] ?? "";
      const value = String(rawValue).trim();

      if (field.required && !value) {
        nextErrors[field.key] = "ฟิลด์นี้จำเป็นต้องกรอก";
        continue;
      }

      if (field.type === "number" && value) {
        const parsed = Number(value.replace(/,/g, ""));
        if (Number.isNaN(parsed)) {
          nextErrors[field.key] = "กรุณากรอกเป็นตัวเลข";
          continue;
        }
      }

      if (field.enumValues && value && !field.enumValues.includes(value)) {
        nextErrors[field.key] = "ค่าสถานะไม่ถูกต้อง";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
          {formFields.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label>{field.label}</Label>
              {field.type === "select" ? (
                <Select
                  value={values[field.key] ?? ""}
                  onValueChange={(v) => updateValue(field.key, v)}
                  disabled={field.readOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`เลือก${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options ?? []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  value={values[field.key] ?? ""}
                  onChange={(event) => updateValue(field.key, event.target.value)}
                  readOnly={field.readOnly}
                />
              )}
              {errors[field.key] && <p className="text-xs text-destructive">{errors[field.key]}</p>}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
