import { toast as rtToast, type ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Show an info toast. Use in React components or any TS file.
 * @example toastInfo("Profile updated")
 */
export function toastInfo(message: string, options?: ToastOptions): ReturnType<typeof rtToast.info> {
  return rtToast.info(message, { ...defaultOptions, ...options });
}

/**
 * Show a warning toast.
 * @example toastWarning("Unsaved changes")
 */
export function toastWarning(message: string, options?: ToastOptions): ReturnType<typeof rtToast.warning> {
  return rtToast.warning(message, { ...defaultOptions, ...options });
}

/**
 * Show an error toast.
 * @example toastError("Failed to save")
 */
export function toastError(message: string, options?: ToastOptions): ReturnType<typeof rtToast.error> {
  return rtToast.error(message, { ...defaultOptions, ...options });
}

/**
 * Show a success toast.
 * @example toastSuccess("Saved successfully")
 */
export function toastSuccess(message: string, options?: ToastOptions): ReturnType<typeof rtToast.success> {
  return rtToast.success(message, { ...defaultOptions, ...options });
}

/** Re-export the underlying toast for advanced use (dismiss, update, etc.). */
export { rtToast as toast };
