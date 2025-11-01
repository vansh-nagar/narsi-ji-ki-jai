"use client";

import ContactSection from "@/components/contact";
import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const PageInner = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const hasQuery = searchParams.toString().length > 0;
    if (hasQuery) toast.success("Your message has been sent ✅");
  }, [searchParams]);

  return (
    <>
      <ContactSection />
    </>
  );
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageInner />
    </Suspense>
  );
}
