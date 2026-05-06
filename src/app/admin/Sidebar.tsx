"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, Package, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>PackAdmin (管理后台)</h2>
        </div>
        <nav className="admin-nav">
          <Link href="/admin" className={`nav-item ${pathname === "/admin" ? "active" : ""}`}>
            <LayoutDashboard size={20} />
            <span>概览看板</span>
          </Link>
          <Link href="/admin/inquiries" className={`nav-item ${pathname?.startsWith("/admin/inquiries") ? "active" : ""}`}>
            <Inbox size={20} />
            <span>询价单管理</span>
          </Link>
          <Link href="/admin/products" className={`nav-item ${pathname?.startsWith("/admin/products") ? "active" : ""}`}>
            <Package size={20} />
            <span>产品管理</span>
          </Link>
          <Link href="/admin/settings" className={`nav-item ${pathname?.startsWith("/admin/settings") ? "active" : ""}`}>
            <Settings size={20} />
            <span>系统设置</span>
          </Link>
        </nav>
        <div className="admin-footer">
          <button className="logout-btn">
            <LogOut size={20} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      <style jsx>{`
        .admin-sidebar {
          width: 260px;
          background: #0f4c5c;
          color: white;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
        }
        .admin-brand {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .admin-brand h2 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .admin-nav {
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          transition: all 0.2s;
          font-weight: 500;
        }
        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }
        .nav-item.active {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .admin-footer {
          padding: 24px 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          font-weight: 500;
          text-align: left;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}</style>
    </>
  );
}
