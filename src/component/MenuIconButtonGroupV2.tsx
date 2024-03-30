import React from "react";
import * as Constants from "./constant/ModelConstants";
import { Box, IconButton, Tooltip, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CreateIcon from "@mui/icons-material/Create";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import clsx from "clsx";
import ClearIcon from "@mui/icons-material/Clear";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
  groupsIcon: {
    // display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "350px",
    borderRadius: "12px",
    marginTop: "9px",
    flexWrap: "nowrap",
    margin: "auto",
    alignItems: "center",
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
    },
    backgroundColor: theme.palette.background.default,
  },
  "@keyframes zoomInButtonAnimation": {
    "0%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  animationHover: {
    "&:hover": {
      "& .MuiSvgIcon-root": {
        cursor: "pointer",
        color: theme.palette.primary.main,
        height: "44px",
        width: "44px",
      },
      // background: " radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
      animation: "$zoomInButtonAnimation 0.8s ease-in-out",
    },
  },
  fileButton: {
    height: 40,
    display: "inline-block",
    padding: "unset",
    borderRadius: "100%",
    minWidth: 25,
    fontWeight: 600,
    marginTop: "5px",
    textTransform: "none",
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
      color: theme.palette.primary.main,
      height: "35px",
      width: "35px",
    },
  },
}));

const MenuIconButtonGroup = (props: any) => {
  const { classes, cx } = useStyles();
  const { handleInputImport, handleInputExport } = props;
  // setShowVideoPlayerDialog, setShowClearConfirmationDialog, handleTabSelection, setShowConfirmationDialog,

  return (
    <Box display="flex" alignItems="center" className={classes.groupsIcon}>
      <IconButton
        sx={{ padding: "0px 3px 3px 3px" }}
        className={cx(classes.animationHover, classes.fileButton)}
        // onClick={() => handleTabSelection(Constants.INPUT_TYPE_MENU, Constants.PVT_INPUTS, true)}
      >
        <Tooltip
          title={Constants.INPUTS}
          placement="bottom"
          arrow
          enterDelay={100}
        >
          <CreateIcon />
        </Tooltip>
      </IconButton>
      <IconButton
        sx={{ padding: "0px 3px 3px 3px" }}
        className={cx(classes.animationHover, classes.fileButton)}
        // onClick={() => setShowConfirmationDialog(true)}
      >
        <Tooltip title="Reset" placement="bottom" arrow enterDelay={100}>
          <RestartAltIcon />
        </Tooltip>
      </IconButton>
      <Button
        variant="outlined"
        component="label"
        className={cx(classes.animationHover, classes.fileButton)}
      >
        <Tooltip
          title={Constants.IMPORT_INPUT}
          placement="bottom"
          arrow
          enterDelay={100}
        >
          <UploadFileIcon />
        </Tooltip>
        <input
          type="file"
          accept={".json"}
          hidden
          onChange={handleInputImport}
        />
      </Button>
      <IconButton
        sx={{ padding: "0px 3px 3px 3px" }}
        className={cx(classes.animationHover, classes.fileButton)}
        onClick={handleInputExport}
      >
        <Tooltip
          title={Constants.EXPORT_INPUT}
          placement="bottom"
          arrow
          enterDelay={100}
        >
          <FileDownloadIcon />
        </Tooltip>
      </IconButton>
      <IconButton
        sx={{ padding: "0px 3px 3px 3px" }}
        className={cx(classes.animationHover, classes.fileButton)}
        // onClick={() => setShowClearConfirmationDialog(true)}
      >
        <Tooltip
          title={Constants.CLEAR_INPUT}
          placement="bottom"
          arrow
          enterDelay={100}
        >
          <ClearIcon />
        </Tooltip>
      </IconButton>
      <IconButton
        sx={{ padding: "0px 3px 3px 3px" }}
        className={cx(classes.animationHover, classes.fileButton)}
        // onClick={() => setShowVideoPlayerDialog(true)}
      >
        <Tooltip
          title={Constants.VIDEO_PLAYER}
          placement="bottom"
          arrow
          enterDelay={100}
        >
          <PlayCircleOutlineIcon />
        </Tooltip>
      </IconButton>
    </Box>
  );
};

export default MenuIconButtonGroup;
