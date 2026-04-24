import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {children}
    </div>
  );
}
