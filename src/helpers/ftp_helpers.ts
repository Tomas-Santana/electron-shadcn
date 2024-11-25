import { FtpConfig } from "./ipc/ftp/lib/FtpConfig";
import type { FileInfo } from "basic-ftp";

interface ElectronFtp {
  connect: (ftpConfig: FtpConfig) => Promise<boolean>;
  disconnect: () => void;
  list: (path?: string) => Promise<FileInfo[]>;
  download: (remotePath: string) => Promise<[boolean, string]>;
  upload: (remotePath: string) => Promise<[boolean, string]>;
  delete: (remotePath: string) => Promise<[boolean, string]>;
}

declare global {
    interface Window {
        electronFtp: ElectronFtp;
    }
}

export async function connectToFtpServer(ftpConfig: FtpConfig): Promise<boolean> {
    return await window.electronFtp.connect(ftpConfig);
}

export async function disconnectFromFtpServer(): Promise<void> {
    return await window.electronFtp.disconnect();
}

export async function listFtpDirectory(path?: string): Promise<FileInfo[]> {
    return await window.electronFtp.list(path);
}

export async function downloadFtpFile(remotePath: string): Promise<[boolean, string]> {
    return await window.electronFtp.download(remotePath);
}

export async function uploadFileToFtp( remotePath: string): Promise<[boolean, string]> {
    return await window.electronFtp.upload( remotePath);
}

export async function deleteFtpFile(remotePath: string): Promise<[boolean, string]> {
    return await window.electronFtp.delete(remotePath);
}

