'use client'

import { usePathname } from 'next/navigation'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === '/login' || pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <>{children}</>;
}
