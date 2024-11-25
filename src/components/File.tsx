import { FileInfo } from "basic-ftp";
import React from "react";
import { Button } from "./ui/button";
import { Delete, Download, Trash } from "lucide-react";
import { File as FileIcon, Folder } from "lucide-react";
import { downloadFtpFile, deleteFtpFile, listFtpDirectory } from "@/helpers/ftp_helpers";
import { toast } from "sonner";

interface FileProps {
  file: FileInfo;
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
}

const path = "/"

export function File({ file, setFiles }: FileProps) {
  const fileName = React.useMemo(() => {
    return file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name;
  }, [file.name]);

  

  const fileSize = React.useMemo(() => {
    return formatFileSize(file.size);
  }, [file.size]);

  const handleDownload = async () => {
    const [success, message] = await downloadFtpFile(`${path}/${file.name}`);
    if (!success) {
      toast.error(message);
      return;
    }

    toast.success("File saved in Downloads folder");

  }

  const handleDelete = async () => {
    const res = confirm("Are you sure you want to delete this file?");
    if (!res) return;
    const [success, message] = await deleteFtpFile(`${path}/${file.name}`);
    if (!success) {
      toast.error(message);
      return;
    }

    setFiles((prev) => prev.filter((f) => f.name !== file.name));
    toast.success("File deleted successfully");
  }





  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-end justify-end gap-2">
        <div>{file.type === 1 ? <FileIcon size={24} /> : <Folder size={24} />}</div>
        <h3 className="font-bold">{fileName}</h3>
        {file.type === 1 && <p>{fileSize}</p>}
      </div>
      <div>
        {file.type === 1 && (
          <div className="flex flex-row gap-2">
            <Button title="Delete"
              onClick={handleDelete}
              variant={"destructive"}
            >
              <Trash size={24} />
            </Button>
            <Button title="Download"
              onClick={handleDownload}
              variant={"outline"}
            >
              <Download size={24} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
};
