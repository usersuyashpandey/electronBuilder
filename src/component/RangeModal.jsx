import React, { memo, useState } from "react";

// Material
import { Box, Dialog, Grid, DialogContentText } from "@mui/material";
// import { makeStyles } from "@mui/styles";
import { styled } from "@mui/system";

// Shared
import FusionButton from "./Button";
import FusionInput from "./Input";
import Label from "./Label";

// Style
const useStyles = styled((theme) => ({
  dialogWrapper: {
    position: "absolute",
    maxWidth: 600,
    minWidth: 550,
    margin: "auto",
    minHeight: 270,
    maxHeight: 420,
  },
  btnWrapper: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingTop: 62,
  },
  actionWrapper: {
    height: "90%",
    display: "flex",
    // justifyContent: "flex-end",
    flexDirection: "column",
  },
}));

const RangePopupModal = memo(
  ({ open, handleClose, handleConfirm, showXAxisInputs = false }) => {
    const classes = useStyles();
    const [rangeData, setRangeData] = useState({ ...open.data });

    const handleInputChange = (e, name) => {
      const value = e.target.value;
      setRangeData({ ...rangeData, [name]: Number(value) });
    };

    const handleReset = () => {
      setRangeData({ ...open.data });
    };

    return (
      <>
        <Dialog
          maxWidth="md"
          open={Boolean(open.open)}
          onClose={handleClose}
          classes={{ paper: classes.dialogWrapper }}
        >
          <Grid className={classes.actionWrapper}>
            <Grid display="flex" justifyContent={"space-between"}>
              <DialogContentText
                px={2}
                mt={2}
                sx={{ fontSize: "20px", fontWeight: 500 }}
              >
                Update Y-Axis Range
              </DialogContentText>
            </Grid>
            <Grid
              pl={2}
              display="flex"
              justifyContent="space-between"
              mt={2}
              sx={{
                fontSize: "18px",
                fontWeight: 500,
                textAlign: "center",
                paddingRight: "26px",
              }}
            >
              <Box
                display={"flex"}
                alignItems="baseAlign"
                width={"48%"}
                flexDirection={"column"}
              >
                <Grid item className={classes.inputLabel}>
                  <Label className={classes.label} text="Min Value"></Label>
                </Grid>
                <Grid item>
                  <FusionInput
                    type="number"
                    name="minY"
                    value={rangeData?.minY}
                    onChange={(e) => handleInputChange(e, "minY")}
                    medium
                    style={{ width: "100%" }}
                  />
                </Grid>
              </Box>
              <Box
                display={"flex"}
                alignItems="baseAlign"
                width={"48%"}
                flexDirection={"column"}
              >
                <Grid item className={classes.inputLabel}>
                  <Label className={classes.label} text="Max Value"></Label>
                </Grid>
                <Grid item>
                  <FusionInput
                    type="number"
                    name="maxY"
                    value={rangeData?.maxY}
                    onChange={(e) => handleInputChange(e, "maxY")}
                    medium
                    style={{ width: "100%" }}
                  />
                </Grid>
              </Box>
            </Grid>

            {showXAxisInputs && (
              <>
                <Grid display="flex" justifyContent={"space-between"}>
                  <DialogContentText
                    px={2}
                    mt={2}
                    sx={{ fontSize: "20px", fontWeight: 500 }}
                  >
                    Update X-Axis Range
                  </DialogContentText>
                </Grid>
                <Grid
                  pl={2}
                  display="flex"
                  justifyContent="space-between"
                  mt={2}
                  sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    textAlign: "center",
                    paddingRight: "26px",
                  }}
                >
                  <Box
                    display={"flex"}
                    alignItems="baseAlign"
                    width={"48%"}
                    flexDirection={"column"}
                  >
                    <Grid item className={classes.inputLabel}>
                      <Label className={classes.label} text="Min Value"></Label>
                    </Grid>
                    <Grid item>
                      <FusionInput
                        type="number"
                        name="minX"
                        value={rangeData?.minX}
                        onChange={(e) => handleInputChange(e, "minX")}
                        medium
                        style={{ width: "100%" }}
                      />
                    </Grid>
                  </Box>
                  <Box
                    display={"flex"}
                    alignItems="baseAlign"
                    width={"48%"}
                    flexDirection={"column"}
                  >
                    <Grid item className={classes.inputLabel}>
                      <Label className={classes.label} text="Max Value"></Label>
                    </Grid>
                    <Grid item>
                      <FusionInput
                        type="number"
                        name="maxX"
                        value={rangeData?.maxX}
                        onChange={(e) => handleInputChange(e, "maxX")}
                        medium
                        style={{ width: "100%" }}
                      />
                    </Grid>
                  </Box>
                </Grid>
              </>
            )}

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
                  text={"Reset"}
                  onClick={handleReset}
                  disabled={!rangeData?.minY || !rangeData?.maxY}
                />

                <FusionButton
                  text={"Apply"}
                  onClick={() => handleConfirm(rangeData)}
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

export default RangePopupModal;
