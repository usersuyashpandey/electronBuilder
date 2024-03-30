import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/system";

interface ElectronExposed {
  quitAndInstall(): unknown;
  getAppVersion: () => Promise<string>;
  onUpdateAvailable: (callback: () => void) => void;
  onUpdateDownloaded: (callback: () => void) => void;
  // onDownloadProgress: (callback: (progressObj: any) => void) => void;
  removeListeners: () => void;
  // showMessageBox: (options: any) => Promise<any>;
}

declare global {
  interface Window {
    electron: ElectronExposed;
  }
}

const Layout: React.FC = () => {
  const theme = useTheme();
  // useEffect(() => {
  //   if (window.process !== undefined) {
  //     window.electron.onUpdateAvailable(() => {
  //       toast.info("A new update is available. Downloading now...");
  //     });

  //     window.electron.onUpdateDownloaded(() => {
  //       toast.success(
  //         "Update downloaded. Restart the app to apply the update."
  //       );
  //       window.electron
  //         .showMessageBox({
  //           type: "info",
  //           title: "Update Ready",
  //           message:
  //             "The update has been downloaded. Restart the application to apply the update.",
  //           buttons: ["Restart Now", "Later"],
  //         })
  //         .then(({ response }) => {
  //           if (response === 0) {
  //             window.electron.quitAndInstall();
  //           }
  //         });
  //     });

  //     window.electron.onDownloadProgress((progressObj) => {
  //       console.log(`Download progress: ${progressObj.percent.toFixed(2)}%`);
  //       // Update a progress bar or display the download progress
  //     });

  //     return () => {
  //       window.electron.removeListeners();
  //     };
  //   }
  // }, []);

  return (
    <Box
      height="100vh"
      overflow="hidden"
      bgcolor={theme.palette.background?.screen}
      width={"100vw"}
    >
      <Outlet />
    </Box>
  );
};

export default Layout;
