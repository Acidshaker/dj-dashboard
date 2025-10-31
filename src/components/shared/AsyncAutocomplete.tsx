import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, RegisterOptions } from "react-hook-form";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

interface AsyncAutocompleteProps {
  name: string;
  label: string;
  control: any;
  errors: any;
  isMultiple?: boolean;
  rules?: RegisterOptions;
  fetchFn: (params: {
    search: string;
    offset: number;
    limit: number;
    page: number;
    is_active: boolean;
  }) => Promise<any>;
  onAddClick?: () => void;
}

export interface AsyncAutocompleteRef {
  reload: () => void;
}

const AsyncAutocomplete = forwardRef<
  AsyncAutocompleteRef,
  AsyncAutocompleteProps
>(({ name, label, control, errors, rules, fetchFn, onAddClick }, ref) => {
  const [options, setOptions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);

  const limit = 10;

  const loadOptions = async (
    searchValue: string,
    pageValue: number,
    append = false
  ) => {
    setLoading(true);
    try {
      const offset = (pageValue - 1) * limit;
      const res = await fetchFn({
        search: searchValue,
        offset,
        limit,
        page: pageValue,
        is_active: true,
      });

      const results = res.data.data.results;
      const total = res.data.data.totalPages;
      setTotalPages(total);

      const newItems = results.map((item: any) => ({
        label: item.name,
        value: item.id,
        ...item,
      }));

      setOptions((prev) => {
        const cleanedPrev = append ? prev.filter((o) => !o.isLoadMore) : [];
        const merged = append ? [...cleanedPrev, ...newItems] : newItems;

        if (pageValue < total) {
          merged.push({ label: "Ver más...", value: null, isLoadMore: true });
        }

        return merged;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputOpen) {
      loadOptions(search, 1);
    }
  }, [search, inputOpen]);

  useImperativeHandle(ref, () => ({
    reload: () => {
      setPage(1);
      setSearch("");
      setOptions([]);
      loadOptions("", 1);
    },
  }));

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box flex={1}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState }) => {
            // Mostrar valor si es objeto o buscar en options
            const selectedOption =
              field.value && typeof field.value === "object"
                ? {
                    label: field.value?.name || "",
                    value: field.value?.id,
                    ...field.value,
                  }
                : options.find((opt) => opt.value === field.value) || null;

            return (
              <Autocomplete
                options={options}
                noOptionsText="Sin resultados"
                getOptionLabel={(option) => option.label || ""}
                loading={loading}
                value={selectedOption}
                onOpen={() => {
                  setInputOpen(true);
                  if (field.value) loadOptions("", 1);
                }}
                onClose={() => {
                  setInputOpen(false);
                  setSearch("");
                  setPage(1);
                }}
                onChange={(_, value) => {
                  if (!value) {
                    field.onChange(null);
                    return;
                  }

                  if (value.isLoadMore) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadOptions(search, nextPage, true);
                    return;
                  }

                  field.onChange(value);
                  setSearch("");
                }}
                onInputChange={(_, value, reason) => {
                  if (reason === "input") {
                    setSearch(value);
                    setPage(1);
                  }
                }}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;

                  if (option.isLoadMore) {
                    return (
                      <Box
                        key={key}
                        component="li"
                        {...rest}
                        sx={{
                          textAlign: "center",
                          cursor: "pointer",
                          color: "primary.main",
                          fontWeight: 500,
                        }}
                        onClick={() => {
                          const nextPage = page + 1;
                          setPage(nextPage);
                          loadOptions(search, nextPage, true);
                        }}
                      >
                        Ver más...
                      </Box>
                    );
                  }

                  return (
                    <Box key={key} component="li" {...rest}>
                      {option.label}
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
            );
          }}
        />
      </Box>

      {onAddClick && (
        <IconButton
          onClick={onAddClick}
          color="primary"
          size="small"
          sx={{ alignSelf: "flex-start", mt: 0.3 }}
        >
          <AddIcon />
        </IconButton>
      )}
    </Box>
  );
});

export default AsyncAutocomplete;
