import moment from "moment";
import SAMPLING_MASTER_LIST from "./SamplingMasterList";
import * as toast from "./toast";

export const SamplingCalculator = (startDate, endDate, samplingValue) => {
  const diff = moment(endDate).diff(moment(startDate)) / 1000;
  const sampling = SAMPLING_MASTER_LIST.find((t) => t.maxSeconds >= diff);
  if (!samplingValue) {
    return sampling.samplingSeconds;
  }

  if (samplingValue >= sampling.samplingSeconds) {
    return samplingValue;
  } else {
    // TODO alert users
    toast.toastWarningMessage(
      `Requested frequency (${samplingValue}) is not available for the selected time range`
    );
    return sampling.samplingSeconds;
  }
};

export const GetUpdatedTimePickerObject = (
  startDate,
  endDate,
  timePickerObject
) => {
  let timePickerClone = { ...timePickerObject };
  timePickerClone.startDateTime = moment(startDate).toDate();
  timePickerClone.endDateTime = moment(endDate).toDate();
  timePickerClone.relativeTimeSelected = "";
  timePickerClone.samplingValue = SamplingCalculator(startDate, endDate, null);
  return timePickerClone;
};
