import React from "react";
import { Input } from "./ui/input";
import { FtpConfig } from "@/helpers/ipc/ftp/lib/FtpConfig";
import { Button } from "./ui/button";
import { uploadFileToFtp, listFtpDirectory } from "@/helpers/ftp_helpers";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { FileInfo } from "basic-ftp";


interface FileInputProps {
  connInfo: Omit<FtpConfig, "password">;
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
}

export function FileInput(
  { connInfo, setFiles }: FileInputProps
) {

  const handleUpload = async () => {
    const [success, message] = await uploadFileToFtp("/");

    if (success) {
      const files = await listFtpDirectory();
      setFiles(files);
      toast.success("File uploaded successfully");
    } else {
      toast.error(`Failed to upload file: ${message}`);
    }


  }

  return (
    <div className="flex gap-2">
      <Button
        disabled={!connInfo.host}
      onClick={handleUpload}>
        <Upload size={24} className="mr-2" />
        Upload</Button>
    </div>
  );
}
