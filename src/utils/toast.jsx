import { ToastContainer, Slide, toast } from "react-toastify";

const genericToastProperties = {
  position: "bottom-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const toastWarningMessage = (message) => {
  // toast.warn(message, { ...genericToastProperties });
  toast.info(message, { ...genericToastProperties });
};

export const toastErrorMessage = (message) => {
  toast.error(message, { ...genericToastProperties });
};

export const toastSuccessMessage = (message) => {
  toast.success(message, { ...genericToastProperties });
};

export const toastCustomErrorMessage = (
  message,
  custom = {},
  autoClose = false
) => {
  toast.error(message, {
    ...genericToastProperties,
    theme: "colored",
    autoClose: autoClose,
    ...custom,
  });
};

export const toastCustomSuccessMessage = (message, custom = {}) => {
  toast.success(message, {
    ...genericToastProperties,
    theme: "colored",
    ...custom,
  });
};

export const toastInfoMessage = (message) => {
  toast.info(message, { ...genericToastProperties });
};

export { ToastContainer, Slide };
