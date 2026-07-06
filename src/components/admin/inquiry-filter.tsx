"use client";

import { useRouter } from "next/navigation";
import { NativeSelect } from "@/components/ui/native-select";
import { INQUIRY_STATUSES } from "@/lib/constants";

export function InquiryFilter({ value }: { value: string }) {
  const router = useRouter();
  return (
    <NativeSelect
      className="max-w-[220px]"
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        router.push(v ? `/admin/inquiries?status=${v}` : "/admin/inquiries");
      }}
    >
      <option value="">All statuses</option>
      {INQUIRY_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </NativeSelect>
  );
}
