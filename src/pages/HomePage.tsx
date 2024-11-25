import React from "react";
import { FTPConnectForm } from "@/components/FTPConnectForm";
import { FileList } from "@/components/FileList";
import { useWindowDimensions } from "@/hooks/useWindowsDimensions";
import { FileInput } from "@/components/FileInput";

export default function HomePage() {
  const [connInfo, setConnInfo] = React.useState({
    host: "",
    port: 21,
    user: "",
  });
  const { height } = useWindowDimensions();

  return (
    <>
      <div className={`flex flex-col gap-4 p-4`} style={{ height: `calc(${height}px - 3rem)` }}>
        <div>
          <FTPConnectForm setConnInfo={setConnInfo} connInfo={connInfo} />
        </div>
        <div className="flex-1">
          <FileList connInfo={connInfo} />
        </div>
      </div>
    </>
  );
}
