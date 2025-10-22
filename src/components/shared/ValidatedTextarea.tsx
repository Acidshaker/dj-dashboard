import { TextField, TextFieldProps } from "@mui/material";
import { useFormContext, RegisterOptions } from "react-hook-form";

interface ValidatedTextAreaProps extends Omit<TextFieldProps, "name"> {
  name: string;
  label: string;
  rules?: RegisterOptions;
  rows?: number;
}

export const ValidatedTextArea = ({
  name,
  label,
  rules,
  rows = 4,
  ...rest
}: ValidatedTextAreaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <TextField
      label={label}
      multiline
      rows={rows}
      fullWidth
      {...register(name, rules)}
      error={!!error}
      helperText={typeof error?.message === "string" ? error.message : " "}
      {...rest}
    />
  );
};
