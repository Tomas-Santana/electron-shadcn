import {
  FTP_CONNECT_CHANNEL,
  FTP_DISCONNECT_CHANNEL,
  FTP_DOWNLOAD_CHANNEL,
  FTP_LIST_CHANNEL,
  FTP_UPLOAD_CHANNEL,
  FTP_DELETE_CHANNEL
} from "./ftp-channels";
import { app, ipcMain, webUtils } from "electron";
import { FtpConfig } from "./lib/FtpConfig";
import { Client, FTPResponse } from "basic-ftp";
import { dialog } from "electron";

// get path to download folder

export function addFtpEventListeners() {
  const ftpClient = new Client();
  ftpClient.ftp.verbose = true;
  ipcMain.handle(FTP_CONNECT_CHANNEL, async (event, config: FtpConfig) => {
    try {
      await ftpClient.access({ ...config });
      return true;
    } catch (error) {
      return false;
    }
  });

  ipcMain.handle(FTP_DISCONNECT_CHANNEL, async (event) => {
    ftpClient.close();
  });

  ipcMain.handle(FTP_LIST_CHANNEL, async (event, path?: string) => {
    // List files on the FTP server
    return await ftpClient.list(path);
  });

  ipcMain.handle(FTP_UPLOAD_CHANNEL, async (event, remotePath: string) => {
    const filePaths = dialog.showOpenDialogSync({properties: ['openFile']});

    if (!filePaths) {
      return [false, "No file selected"];
    }

    // get remote path
    const fullRemotePath = remotePath + filePaths[0].split("\\").pop();
    console.log(fullRemotePath);
    
    const res = await ftpClient.uploadFrom(filePaths[0], fullRemotePath);
    return handleFtpResponse(res);
  });

  ipcMain.handle(FTP_DOWNLOAD_CHANNEL, async (event, remotePath: string) => {
    const downloadFolder = app.getPath("downloads");

    const fileName = remotePath.split("/").pop();

    const res = await ftpClient.downloadTo(`${downloadFolder}/${fileName}`, remotePath);

    return handleFtpResponse(res);
  });

  // delete
    ipcMain.handle(FTP_DELETE_CHANNEL, async (event, remotePath: string) => {
        const res = await ftpClient.remove(remotePath);
    
        return handleFtpResponse(res);
    });

}

const handleFtpResponse = (response: FTPResponse): [boolean, string] => {
  if (response.code >= 200 && response.code < 300) {
    return [true, response.message];
  } else {
    return [false, response.message];
  }
};

