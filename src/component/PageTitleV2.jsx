import React, { memo, useMemo } from "react";
import clsx from "clsx";

// Material UI
import { Typography, Divider, Box, Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";

// shared
// import FusionSelect from "../components/SelectTransparent";
// Cache
// import { useLocalVarHooks } from "../vars/localVar/localHooks";
// import { setLocalAsset } from "../vars/localVar/localAction";

// Style
const useStyles = makeStyles()((theme) => ({
  header: {
    margin: 0,
    display: "flex",
    maxWidth: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 8,
    // marginLeft: 8,
    minHeight: "55px",
  },
  pageTitleV1: {
    "&.MuiTypography-h1": {
      // fontFamily: "Poppins",
      // fontStyle: "normal",
      // fontWeight: "bold",
      // fontSize: 26,
      // lineHeight: "53px",
      // fontSize: "1.3125rem",
      // fontWeight: "bold", //600,
      // letterSpacing: "-.02em",

      // Theme
      color: theme.palette.primary.main,

      "& .highlight": {
        // Theme
        color: theme.palette.background.default,
      },

      "& .tiny": {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: 16,
        lineHeight: "20px",
        position: "relative",
        top: "-18px",

        // Theme
        color: theme.palette.grey[900],
      },
    },
  },
  pageTitleV2: {
    color: theme.palette.grey[800],
  },
  divider: {
    height: 24,
    borderWidth: 0,
    width: 0.1,
    marginLeft: 16,
    marginRight: 16,
    color: theme.palette.grey[800],
    backgroundColor: theme.palette.grey[800],
  },
  assetName: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.004em",
    color: "black",
  },
  wellSelector: {
    width: "160px",
    height: "25px !important",
  },
  wellSelectorHeight: {
    height: "25px !important",
  },
}));

const PageTitleV2 = memo(
  ({
    regularText,
    highlightText,
    assets = [],
    selectedAssets = [],
    onChangeAssets: setAssets = () => {},
    onChangeAssetsForAPI: setAssetsForAPI = () => {},
  }) => {
    const { classes } = useStyles();
    // const localVars = useLocalVarHooks();
    // const { localAsset } = localVars;

    // const handleSelectedAssetsChange = useCallback(
    //     (e) => {
    //         const value = assets.filter((asset) => e.target.value.includes(asset));
    //         setAssets(value);
    //         setAssetsForAPI(value);
    //         // setLocalAsset(value[0]);
    //     },
    //     [assets, setAssets, setAssetsForAPI]
    // );

    const singleSelectAssetsTemplate = useMemo(
      () => (
        <Grid
          container
          direction="column"
          width="130px"
          className={clsx("wellSelectorContainer", classes.card)}
        >
          {/* <FusionSelect
                        name="assets-selector"
                        className={clsx(classes.wellSelector)}
                        selectClass={clsx(classes.wellSelectorHeight)}
                        onChange={handleSelectedAssetsChange}
                        options={assets.map((asset) => ({ label: asset, value: asset }))}
                        value={localAsset || selectedAssets[0] || ""}
                    /> */}
        </Grid>
      ),
      // eslint-disable-next-line
      [assets, selectedAssets]
    );

    return (
      <Box className={classes.header}>
        <Typography variant="h1" className={classes.pageTitleV1}>
          {regularText} <span className="highlight">{highlightText}</span>
        </Typography>
        {assets?.length && singleSelectAssetsTemplate ? (
          <>
            <Divider orientation="vertical" className={classes.divider} />
            {singleSelectAssetsTemplate}
          </>
        ) : null}
      </Box>
    );
  }
);

export default PageTitleV2;
