// src/app/admin/layout.tsx
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <AdminSidebar />
      <div className="flex-1 bg-canvas">{children}</div>
    </div>
  );
}
