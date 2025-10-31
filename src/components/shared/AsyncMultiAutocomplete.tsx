import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, RegisterOptions } from "react-hook-form";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";

interface AsyncMultiAutocompleteProps {
  name: string;
  label: string;
  control: any;
  errors: any;
  rules?: RegisterOptions;
  fetchFn: (params: {
    search: string;
    offset: number;
    limit: number;
    page: number;
  }) => Promise<any>;
  valueModel?: (value: any) => any;
  onAddClick?: () => void;
  maxSelections?: number;
  renderChipLabel?: (item: any) => string;
  disableSelected?: boolean;
}

export interface AsyncMultiAutocompleteRef {
  reload: () => void;
}

const AsyncMultiAutocomplete = forwardRef<
  AsyncMultiAutocompleteRef,
  AsyncMultiAutocompleteProps
>(
  (
    {
      name,
      label,
      control,
      errors,
      maxSelections,
      rules,
      renderChipLabel,
      disableSelected,
      fetchFn,
      onAddClick,
      valueModel,
    },
    ref
  ) => {
    const [options, setOptions] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const limit = 10;

    const loadOptions = async (
      searchValue: string,
      pageValue: number,
      append = false
    ) => {
      setLoading(true);
      try {
        const offsetValue = (pageValue - 1) * limit;
        const res = await fetchFn({
          search: searchValue,
          offset: offsetValue,
          limit,
          page: pageValue,
        });

        const results = res.data.data.results ?? [];
        const newItems = results.map((item: any) => ({
          label: item.name,
          value: item.id,
          ...item,
        }));

        // Filtrar el "Ver más..." anterior si existía
        const prev = append ? options.filter((o) => !o.isLoadMore) : [];

        // Combinar resultados
        let finalList = [...prev, ...newItems];

        // Agregar "Ver más..." solo si hay más páginas
        if (pageValue < res.data.data.totalPages) {
          finalList.push({
            label: "Ver más...",
            value: null,
            isLoadMore: true,
          });
        }

        setOptions(finalList);
        setTotalPages(res.data.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // 🔁 Cargar datos iniciales o tras cambiar búsqueda
    useEffect(() => {
      setPage(1);
      loadOptions(search, 1, false);
    }, [search]);

    useImperativeHandle(ref, () => ({
      reload: () => {
        setPage(1);
        setOptions([]);
        loadOptions(search, 1, false);
      },
    }));

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Box flex={1}>
          <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
              <Autocomplete
                multiple
                inputValue={search}
                options={options}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) =>
                  renderChipLabel ? renderChipLabel(option) : option.label
                }
                value={Array.isArray(field.value) ? field.value : []}
                onChange={(_, value, reason) => {
                  const filtered = value.filter((v) => !v?.isLoadMore);
                  if (maxSelections && filtered.length > maxSelections) {
                    toast.info(
                      `Solo se pueden agregar un máximo de ${maxSelections} elementos`
                    );
                    return;
                  }

                  field.onChange(
                    valueModel
                      ? filtered.map(valueModel)
                      : filtered.map((v) => v)
                  );

                  // 🧹 Limpiar el input al seleccionar un valor
                  if (reason === "selectOption") {
                    setSearch("");
                  }
                }}
                onBlur={field.onBlur}
                onInputChange={(_, value, reason) => {
                  // Solo cambiar el search cuando el usuario escribe o limpia
                  if (reason === "input" || reason === "clear") {
                    setSearch(value);
                  }
                }}
                loading={loading}
                renderTags={(value: any[], getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option.id ?? index}
                      label={
                        renderChipLabel ? renderChipLabel(option) : option.label
                      }
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderOption={(props, option, { selected }) => {
                  if (option.isLoadMore) {
                    return (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          textAlign: "center",
                          cursor: "pointer",
                          color: "primary.main",
                          fontWeight: 500,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextPage = page + 1;
                          setPage(nextPage);
                          loadOptions(search, nextPage, true);
                        }}
                      >
                        Ver más...
                      </Box>
                    );
                  }

                  const isAlreadySelected = selected;

                  return (
                    <Box
                      component="li"
                      {...props}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: isAlreadySelected
                          ? "action.selected"
                          : "inherit",
                      }}
                    >
                      <span style={{ flexGrow: 1 }}>{option.label}</span>
                      {isAlreadySelected && (
                        <CheckIcon fontSize="small" color="primary" />
                      )}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || " "}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
        </Box>

        <IconButton
          onClick={onAddClick}
          color="primary"
          size="small"
          sx={{
            alignSelf: "flex-start",
            mt: 0.3,
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    );
  }
);

export default AsyncMultiAutocomplete;
