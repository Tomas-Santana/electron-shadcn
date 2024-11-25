import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";
import { Toaster } from "@/components/ui/sonner"



export default function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <DragWindowRegion title="Simple FTP Client" />
            <hr />
            <main>{children}</main>
            <Toaster />
        </>
    );
}
