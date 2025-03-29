import { Input } from "@/components/ui/input";

interface LabeledInputProps {
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: boolean;
}

export default function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error = false,
}: LabeledInputProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border p-2 rounded-md ${error ? "border-red-500" : ""}`}
      />
    </div>
  );
}
