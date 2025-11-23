import {
  type Control,
  type FieldValues,
  type FieldError,
  Controller,
  type Path,
} from "react-hook-form";
import { Checkbox as ShadcnCheckbox } from "@/frontend/core/components/ui/checkbox";
import { Label } from "@/frontend/core/components/ui/label";

type CheckboxProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  error?: FieldError;
  control: Control<T>;
};

export default function Checkbox<T extends FieldValues>({
  label,
  error,
  control,
  name,
}: CheckboxProps<T>) {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <ShadcnCheckbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor={name} className="cursor-pointer">
          {label}
        </Label>
      </div>
      {error && (
        <div className="text-sm text-destructive mt-1">{error.message}</div>
      )}
    </div>
  );
}
