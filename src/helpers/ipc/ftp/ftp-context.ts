import { FTP_CONNECT_CHANNEL, FTP_DELETE_CHANNEL, FTP_DISCONNECT_CHANNEL, FTP_DOWNLOAD_CHANNEL, FTP_LIST_CHANNEL, FTP_UPLOAD_CHANNEL } from "./ftp-channels";

import { FtpConfig } from "./lib/FtpConfig";

export function exposeFtpContext() {
    const { contextBridge, ipcRenderer } = window.require("electron");
    contextBridge.exposeInMainWorld("electronFtp", {
        connect: (config: FtpConfig) => ipcRenderer.invoke(FTP_CONNECT_CHANNEL, config),
        disconnect: () => ipcRenderer.invoke(FTP_DISCONNECT_CHANNEL),
        list: (path?: string) => ipcRenderer.invoke(FTP_LIST_CHANNEL, path),
        upload: (localFile: ReadableStream, remotePath: string) => ipcRenderer.invoke(FTP_UPLOAD_CHANNEL, localFile, remotePath),
        download: (remotePath: string) => ipcRenderer.invoke(FTP_DOWNLOAD_CHANNEL, remotePath),
        delete: (remotePath: string) => ipcRenderer.invoke(FTP_DELETE_CHANNEL, remotePath)
    
    });
}