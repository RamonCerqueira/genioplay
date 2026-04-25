import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import StudyPlayer from "@/components/study/StudyPlayer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { StudyExplorer } from "@/components/dashboard/student/StudyExplorer";

export default async function StudyPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <StudyExplorer />
    </div>
  );
}
