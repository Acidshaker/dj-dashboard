import { useAlert } from "@/providers/AlertProvider";

export const useAlerts = () => {
  const { showAlert } = useAlert();

  const deleteAlert = async (text: string, foo: () => Promise<any>) => {
    showAlert({
      title: "Atención",
      description: text,
      type: "warning",
      showCancel: true,
      confirmText: "Continuar",
      cancelText: "Cancelar",
      onConfirm: foo,
    });
  };

  const confirmationAlert = async (
    foo: () => Promise<any>,
    description?: string
  ) => {
    showAlert({
      title: "Atención",
      description: description || "¿Seguro que deseas realizar esta acción?",
      type: "warning",
      showCancel: true,
      confirmText: "Continuar",
      cancelText: "Cancelar",
      onConfirm: foo,
    });
  };

  const confirmationAlert2 = async (
    foo: () => Promise<any>,
    cancelFoo: () => Promise<any>,
    description?: string
  ) => {
    showAlert({
      title: "Atención",
      description: description || "¿Seguro que deseas realizar esta acción?",
      type: "warning",
      showCancel: true,
      confirmText: "Continuar",
      cancelText: "Cancelar",
      onConfirm: foo,
      onCancel: cancelFoo,
    });
  };

  const errorAlert = (description: string) => {
    showAlert({
      title: "Atención",
      description,
      type: "error",
      showCancel: false,
    });
  };

  const successAlert = (description: string, foo?: () => Promise<any>) => {
    showAlert({
      title: "Atención",
      description,
      type: "success",
      showCancel: false,
      onConfirm: foo,
    });
  };

  return {
    deleteAlert,
    confirmationAlert,
    confirmationAlert2,
    errorAlert,
    successAlert,
  };
};
