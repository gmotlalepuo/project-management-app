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
      <SidebarInset className="bg-secondary">
        {/* Header */}
        {header && (
          <header className="rounded-bl-lg rounded-br-lg bg-background shadow md:rounded-none md:shadow-none">
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-6 md:p-6">
              <SidebarTrigger />
              <div className="flex-1">{header}</div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
