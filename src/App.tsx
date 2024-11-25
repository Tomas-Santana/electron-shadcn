import React from "react";
import { createRoot } from "react-dom/client";
import DragWindowRegion from "./components/DragWindowRegion";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";


export default function App() {

    return (
        <>
            <DragWindowRegion title="Simple FTP Client" />
            <hr />
            <HomePage></HomePage>
            <Toaster />
        </>
    );
}

const root = createRoot(document.getElementById("app")!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
