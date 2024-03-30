import {
  Box,
  Card,
  CardMedia,
  Dialog,
  IconButton,
  Tooltip,
} from "@mui/material";
import React from "react";
import { makeStyles } from "tss-react/mui";
import ClearIcon from "@mui/icons-material/Clear";
import clsx from "clsx";

const useStyles = makeStyles()((theme) => ({
  dialogWrapper: {
    height: "calc(100vh - 140px)",
    position: "absolute",
    maxWidth: 2000,
    minWidth: 550,
    margin: "auto",
    backgroundColor: theme.palette.background.header,
    width: "calc(100vw - 250px)",
    borderRadius: 15,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end", // Align items to the right
  },
  animationHover: {
    "&:hover": {
      "& .MuiSvgIcon-root": {
        cursor: "pointer",
        color: theme.palette.primary.main,
        height: "44px",
        width: "44px",
      },
      animation: "$zoomInButtonAnimation 0.8s ease-in-out",
    },
  },
  fileButton: {
    height: 40,
    display: "inline-block",
    padding: "unset",
    borderRadius: "100%",
    marginTop: "5px",
    minWidth: 25,
    fontWeight: 600,
    textTransform: "none",
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
      color: theme.palette.primary.main,
      height: "35px",
      width: "35px",
    },
  },
  card: {
    height: "100%",
    border: "none",
    backgroundColor: theme.palette.background.header,
  },
  cardMedia: {
    border: "none",
    backgroundColor: theme.palette.background.header,
  },
}));

const VideoPlayer = ({ videoUrl, open, handleClose }) => {
  const videoId = extractVideoId(videoUrl);
  const { classes } = useStyles();

  return (
    <Dialog
      open={Boolean(open)}
      onClose={handleClose}
      classes={{ paper: classes.dialogWrapper }}
    >
      <Box className={classes.container}>
        <IconButton
          sx={{ p: 1, mr: 1 }}
          className={clsx(classes.animationHover, classes.fileButton)}
          onClick={() => handleClose()}
        >
          <Tooltip title={"Cancel"} placement="bottom" arrow enterDelay={100}>
            <ClearIcon />
          </Tooltip>
        </IconButton>
      </Box>
      <Card className={classes.card}>
        <CardMedia
          className={classes.cardMedia}
          component="iframe"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube Video Player"
          height="100%"
          allowFullScreen
        />
      </Card>
    </Dialog>
  );
};

const extractVideoId = (url) => {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let match;
  while ((match = regex.exec(url)) !== null) {
    if (match[1] === "v") {
      return match[2];
    }
  }
  return "";
};

export default VideoPlayer;
