import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const DEPARTMENTS = [
  "Accounting",
  "Finance",
  "HR",
  "Operations",
  "Payroll",
  "Tax",
  "Legal",
  "IT",
  "Executive",
  "Administration",
];

const CUSTOM_VALUE = "__custom__";

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DepartmentSelect({ value, onChange, placeholder }: DepartmentSelectProps) {
  const [isCustom, setIsCustom] = useState(
    () => !!value && !DEPARTMENTS.some((d) => d.toLowerCase() === value.toLowerCase())
  );

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter department name"
          className="flex-1"
          autoFocus
        />
        <button
          type="button"
          onClick={() => { setIsCustom(false); onChange(""); }}
          className="text-xs text-muted-foreground hover:text-foreground px-2 shrink-0"
        >
          Cancel
        </button>
      </div>
    );
  }

  const matchedValue = DEPARTMENTS.find((d) => d.toLowerCase() === value.toLowerCase()) || "";

  return (
    <Select
      value={matchedValue}
      onValueChange={(v) => {
        if (v === CUSTOM_VALUE) {
          setIsCustom(true);
          onChange("");
        } else {
          onChange(v);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder || "Select department"} />
      </SelectTrigger>
      <SelectContent>
        {DEPARTMENTS.map((dept) => (
          <SelectItem key={dept} value={dept}>
            {dept}
          </SelectItem>
        ))}
        <SelectItem value={CUSTOM_VALUE} className="text-muted-foreground italic">
          + Add custom…
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
