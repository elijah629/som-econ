"use client";

import { Currency } from "@/types/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/shell";

export function CurrencyPicker({ value }: { value: Currency }) {
  const router = useRouter();

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        router.push(`/${value}`);
      }}
    >
      <SelectTrigger
        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
        aria-label="Select a currency"
      >
        <SelectValue placeholder="shells" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectItem value="USD" className="rounded-lg">
          USD 💵
        </SelectItem>
        <SelectItem value="shells" className="rounded-lg">
          Shells <Shell size={16} />
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
