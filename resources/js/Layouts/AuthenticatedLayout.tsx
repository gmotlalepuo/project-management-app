import { PropsWithChildren, ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/main-sidebar/AppSidebar";

export default function AuthenticatedLayout({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="relative flex min-h-screen w-full flex-col bg-secondary">
        {/* Header */}
        {header && (
          <header className="sticky top-0 z-50 border-b bg-background/85 shadow backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-6 md:p-6">
              <SidebarTrigger />
              <div className="flex-1">{header}</div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <SidebarInset className="flex-1 overflow-x-auto bg-secondary">
          <main>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
