// validations.ts

// ✅ Campo requerido
export const required = (fieldName: string) => `${fieldName} es obligatorio`;

// ✅ Email con regex
export const isEmail = (value: string): true | string =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : "Formato de email inválido";

// ✅ Código postal con regex
export const postalCode = (value: string): true | string =>
  /^[0-9]{5}$/.test(value) ? true : "Formato de Código Postal inválido";

// ✅ Contraseña básica (mínimo 6 caracteres)
export const isPassword = (value: string): true | string =>
  value.length >= 6 ? true : "La contraseña debe tener al menos 6 caracteres";

// ✅ Contraseña fuerte (mayúscula, minúscula, número, símbolo)
export const strongPassword = (value: string): true | string =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
    ? true
    : "Debe incluir mayúsculas, minúsculas, números y símbolos";

// ✅ Mínimo de caracteres
export const minLength =
  (length: number) =>
  (value: string): true | string =>
    value.length >= length ? true : `Debe tener al menos ${length} caracteres`;

// ✅ Máximo de caracteres
export const maxLength =
  (length: number) =>
  (value: string): true | string =>
    value.length <= length ? true : `Debe tener máximo ${length} caracteres`;

// ✅ Número entero
export const isIntNumber = (value: string): true | string =>
  /^\d+$/.test(value) ? true : "Debe ser un número entero";

export const isNumber = (value: string): true | string =>
  /^-?\d+(\.\d+)?$/.test(value) ? true : "Debe ser un número válido";

export const noNegative = (value: number | string) => {
  const num = Number(value);
  return (!isNaN(num) && num >= 0) || "No se permiten números negativos";
};

export const minValue =
  (min: number) =>
  (value: string): true | string => {
    const num = parseFloat(value);
    return isNaN(num)
      ? "Debe ser un número válido"
      : num >= min
      ? true
      : `Debe ser mayor o igual a ${min}`;
  };

// ✅ Número con decimales limitados
export const decimalsLength =
  (maxDecimals: number) =>
  (value: number): true | string => {
    const stringValue = value.toString();
    const match = stringValue.match(/^(\d+)(\.(\d+))?$/);
    if (!match) return "Debe ser un número válido";
    const decimals = match[3] || "";
    return decimals.length <= maxDecimals
      ? true
      : `Máximo ${maxDecimals} decimales permitidos`;
  };

// ✅ Comparar contraseñas
export const samePassword =
  (password: string) =>
  (value: string): true | string =>
    value === password ? true : "Las contraseñas no coinciden";

// ✅ Números
export const onlyNumbers = (value: string): true | string =>
  /^\d+$/.test(value) ? true : "Solo se permiten números";

// ✅ Sin espacios
export const noTrimSpaces = (value: string): true | string =>
  value.trim() === value ? true : "No se permiten espacios al inicio o final";
