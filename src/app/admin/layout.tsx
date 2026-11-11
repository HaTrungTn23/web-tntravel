import Link from "next/link";
import { ArrowLeft, Settings2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-shell">
    <header className="admin-header"><Link href="/" className="admin-back"><ArrowLeft /> Về website</Link><div><Settings2 /><b>Quản trị nội dung</b></div></header>
    {children}
  </div>;
}
