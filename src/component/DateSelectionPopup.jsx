import React, { memo, useState, useEffect } from "react";
import {
  Box,
  Dialog,
  Grid,
  DialogContentText,
  Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import FusionButton from "./Button";
import DatePickerV1 from "./DateTimePicker";
import moment from "moment";

// Style
const useStyles = makeStyles()((theme) => ({
  dialogWrapper: {
    position: "absolute",
    maxWidth: 500,
    minWidth: 500,
    margin: "auto",
    height: "220px",
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
  dateTimeStyle: {
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ConfirmationPopup = memo(
  ({
    open,
    handleClose,
    handleConfirm,
    action,
    warnMessage,
    steps,
    prevdate,
  }) => {
    const { classes } = useStyles();
    const [configDate, setConfigDate] = useState(new Date());

    const handleDateChange = (newDate) => {
      const date = moment(newDate).utc();
      setConfigDate(date);
    };

    useEffect(() => {
      if (prevdate) {
        const defaultDate = new Date(prevdate);
        defaultDate.setDate(defaultDate.getDate() + 1);

        setConfigDate(defaultDate);
      }
    }, [prevdate]);

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
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="body3Large">Date : </Typography>
                <DatePickerV1
                  className={classes.dateTimeStyle}
                  date={configDate}
                  value={configDate.toISOString().split("T")[0]}
                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                  marginLeft="0rem"
                  marginRight="0rem"
                  flexDirection="row-reverse"
                  type="date"
                />
              </Box>
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
                  onClick={() => handleConfirm(configDate)}
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
