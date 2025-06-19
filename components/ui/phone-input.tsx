import * as React from "react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/frontend";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StyledInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <Input ref={ref} className={cn("w-full", className)} {...props} />
));
StyledInput.displayName = "StyledInput";

export function CustomPhoneInput({
  label = "Phone Number",
  required,
  value,
  onChange,
  onErrorChange, 
  ...props
}: {
  label?: React.ReactNode;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onErrorChange?: (error: string | undefined) => void; 
}) {
  let error: string | undefined = undefined;
  if (required && !value) {
    error = "Phone number required";
  } else if (value && !isPossiblePhoneNumber(value)) {
    error = "Invalid phone number";
  }

  React.useEffect(() => {
    if (onErrorChange) onErrorChange(error);
  }, [error, onErrorChange]);

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <PhoneInput
        value={value}
        onChange={onChange}
        defaultCountry="US"
        international
        countryCallingCodeEditable={false}
        inputComponent={StyledInput}
        {...props}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
