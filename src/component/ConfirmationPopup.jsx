import React, { memo } from "react";
import { Box, Dialog, Grid, DialogContentText } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import FusionButton from "./Button";
// Style
const useStyles = makeStyles()((theme) => ({
  dialogWrapper: {
    position: "absolute",
    maxWidth: 550,
    minWidth: 550,
    margin: "auto",
    height: "250px",
    backgroundColor: theme.palette.background.header,
  },
  btnWrapper: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingTop: 52,
  },
  actionWrapper: {
    height: "90%",
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
  },
}));

const ConfirmationPopup = memo(
  ({ open, handleClose, handleConfirm, action, warnMessage }) => {
    const { classes } = useStyles();

    return (
      <>
        <Dialog
          maxWidth="md"
          open={Boolean(open)}
          onClose={handleClose}
          classes={{ paper: classes.dialogWrapper }}
        >
          <Grid className={classes.actionWrapper}>
            <DialogContentText
              px={2}
              mt={2}
              sx={{ fontSize: "18px", fontWeight: 500, textAlign: "center" }}
            >
              {warnMessage
                ? warnMessage
                : `Confirm that you want to ${action}, this action can't be undone.`}
            </DialogContentText>

            <Grid item px={2} pb={2} className={classes.btnWrapper}>
              <Box display={"flex"}>
                <FusionButton
                  text={"Cancel"}
                  template="transparent"
                  onClick={handleClose}
                  disabled={false}
                  mr={3}
                />
                <FusionButton
                  text={"Confirm"}
                  onClick={handleConfirm}
                  disabled={false}
                />
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      </>
    );
  }
);

export default ConfirmationPopup;
