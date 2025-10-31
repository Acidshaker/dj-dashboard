import { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

type AlertType = "success" | "error" | "warning";

interface AlertOptions {
  title?: string;
  description?: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (checkboxValue?: boolean) => Promise<any>;
  onCancel?: () => Promise<any>;
  showCancel?: boolean;
  showCheckbox?: boolean;
  checkboxLabel?: string;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({});
  const [checkboxValue, setCheckboxValue] = useState(false);

  const showAlert = (opts: AlertOptions) => {
    setOptions(opts);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpen(false);
    if (options.onConfirm) await options.onConfirm(checkboxValue);
  };

  const handleCancel = async () => {
    setOpen(false);
    if (options.onCancel) await options.onCancel();
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>{options.title || "Atención"}</DialogTitle>
        <DialogContent>
          <Typography>{options.description}</Typography>
          {options.showCheckbox && (
            <FormControlLabel
              sx={{ marginTop: 2 }}
              control={
                <Checkbox
                  size="small"
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                />
              }
              label={options.checkboxLabel || "Confirmar"}
            />
          )}
        </DialogContent>
        <DialogActions>
          {options.showCancel && (
            <Button
              onClick={handleCancel}
              color="secondary"
              className="alert-btn cancel"
            >
              {options.cancelText || "Cancelar"}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            color="primary"
            className="alert-btn confirm"
          >
            {options.confirmText || "Aceptar"}
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};
