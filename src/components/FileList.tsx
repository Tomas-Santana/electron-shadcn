import React from "react";
import { FtpConfig } from "@/helpers/ipc/ftp/lib/FtpConfig";
import { FileInfo } from "basic-ftp";
import { listFtpDirectory } from "@/helpers/ftp_helpers";
import { File } from "./File";
import { Button } from "./ui/button";
import { useWindowDimensions } from "@/hooks/useWindowsDimensions";
import { FileInput } from "./FileInput";

interface FileListProps {
  connInfo: Omit<FtpConfig, "password">;
}

export function FileList({ connInfo }: FileListProps) {
  const [files, setFiles] = React.useState<FileInfo[]>([]);

  const listFiles = async () => {
    const files = await listFtpDirectory();
    setFiles(files);
  };

  // onlylist root directory
  React.useEffect(() => {
    if (connInfo.host) {
      listFiles();
      return;
    }
    setFiles([]);
  }, [connInfo.host]);

  const sortedFiles = React.useMemo(() => {
    // directories first
    return files.sort((a, b) => {
      if (a.type === b.type) return 0;
      if (a.type === 1) return 1;
      return -1;
    });
  }, [files]);

  return (
    <div className={`flex h-full w-full flex-col justify-start gap-4`}>
      <FileInput connInfo={connInfo} setFiles={setFiles} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {connInfo.host ? `Connected to ${connInfo.host}` : "No connection"}
        </h1>
        <Button onClick={listFiles} variant={"outline"} disabled={!connInfo.host}>
          Refresh
        </Button>
      </div>
      {files.length === 0 && <p>No files</p>}

      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-4 overflow-y-scroll rounded border p-4">
          {files.map((file) => (
            <File key={file.name} file={file} setFiles={setFiles} />
          ))}
        </div>
      )}
    </div>
  );
}
