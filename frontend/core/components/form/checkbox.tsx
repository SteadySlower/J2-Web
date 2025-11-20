import { useState } from "react";
import { type UseFormRegisterReturn, type FieldError } from "react-hook-form";
import { Checkbox as ShadcnCheckbox } from "@/frontend/core/components/ui/checkbox";
import { Label } from "@/frontend/core/components/ui/label";

type CheckboxProps = {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
};

export default function Checkbox({ label, error, register }: CheckboxProps) {
  const id = register.name;
  const { onChange, name, ref } = register;
  const [checked, setChecked] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <ShadcnCheckbox
          id={id}
          name={name}
          ref={ref}
          checked={checked}
          onCheckedChange={(isChecked) => {
            const newChecked = !!isChecked;
            setChecked(newChecked);
            const event = {
              target: { name, value: newChecked, checked: newChecked },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }}
        />
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
      </div>
      {error && (
        <div className="text-sm text-destructive mt-1">{error.message}</div>
      )}
    </div>
  );
}
