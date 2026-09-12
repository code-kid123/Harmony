"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import PropertyQuizModal from "@/components/quiz/PropertyQuizModal";

function QuizContent() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <PropertyQuizModal
        open={open}
        onClose={() => {
          setOpen(false);
          router.push("/");
        }}
      />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-[60vh] items-center justify-center" />}
    >
      <QuizContent />
    </Suspense>
  );
}