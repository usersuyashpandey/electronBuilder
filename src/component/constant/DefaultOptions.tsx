import * as Constants from "./ModelConstants";
import React from "react";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";

interface OptionType {
  value: string;
  label: string;
}

interface MenuIconType {
  menuType: string;
  text: string;
  icon: React.ReactNode;
  showError: boolean;
}

export const xAxisTypeOptions = [
  { value: Constants.CHART, label: Constants.CHART },
  { value: Constants.TABLE, label: Constants.TABLE },
];

export const defaultWellOptions: OptionType[] = [
  { value: "well1", label: "Well 1" },
  { value: "well2", label: "Well 2" },
  { value: "well3", label: "Well 3" },
  { value: "well4", label: "Well 4" },
  { value: "well5", label: "Well 5" },
];

export const menuIconList_PVT: MenuIconType[] = [
  {
    menuType: Constants.INPUT_TYPE_MENU,
    text: Constants.PVT_INPUTS,
    icon: <ThermostatIcon />,
    showError: true,
  },
  {
    menuType: Constants.INPUT_TYPE_MENU,
    text: Constants.PVT_CORRELATIONS,
    icon: <SettingsEthernetIcon />,
    showError: false,
  },
  // { menuType: Constants.OUTPUT_TYPE_MENU, text: Constants.RESULT, icon: <PreviewIcon />, showError: false }
];
export const menuIconList_BHP = [
  {
    menuType: Constants.INPUT_TYPE_MENU,
    text: Constants.BHP_Inputs,
    icon: <ThermostatIcon />,
    showError: true,
  },
  {
    menuType: Constants.INPUT_TYPE_MENU,
    text: Constants.BHP_Correlations,
    icon: <SettingsEthernetIcon />,
    showError: false,
  },
  {
    menuType: Constants.INPUT_TYPE_MENU,
    text: Constants.BHP_Production,
    icon: <SettingsEthernetIcon />,
    showError: false,
  },
  {
    menuType: Constants.INPUT_TYPE_MENU,
    text: Constants.BHP_WellboreConfig,
    icon: <SettingsEthernetIcon />,
    showError: false,
  },
  // { menuType: Constants.INPUT_TYPE_MENU, text: Constants.BHP_Survey, icon: <SettingsEthernetIcon />, showError: false },
  // { menuType: Constants.INPUT_TYPE_MENU, text: Constants.BHP_Geothermal, icon: <SettingsEthernetIcon />, showError: false },
  // { menuType: Constants.OUTPUT_TYPE_MENU, text: Constants.RESULT, icon: <PreviewIcon />, showError: false }
];
