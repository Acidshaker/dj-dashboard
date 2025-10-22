import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller } from "react-hook-form";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";

interface AsyncMultiAutocompleteProps {
  name: string;
  label: string;
  control: any;
  errors: any;
  fetchFn: (params: {
    search: string;
    offset: number;
    limit: number;
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

    const loadOptions = async (searchValue: string, pageValue: number) => {
      setLoading(true);
      try {
        const offsetValue = (pageValue - 1) * limit;
        const res = await fetchFn({
          search: searchValue,
          offset: offsetValue,
          limit,
        });
        const results = res.data.data.results;
        const newItems = results.map((item: any) => ({
          label: item.name,
          value: item.id,
          ...item,
        }));

        setOptions((prev) =>
          pageValue === 1
            ? newItems
            : [...prev.filter((o) => !o.isLoadMore), ...newItems]
        );
        setTotalPages(res.data.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadOptions(search, page);
    }, [search, page]);

    useEffect(() => {
      if (page < totalPages && !options.some((o) => o.label === "Ver más...")) {
        setOptions((prev) => [
          ...prev,
          { label: "Ver más...", value: null, isLoadMore: true },
        ]);
      }
    }, [options, page, totalPages]);

    useImperativeHandle(ref, () => ({
      reload: () => {
        setPage(1);
        setOptions([]);
        loadOptions(search, 1);
      },
    }));

    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Box flex={1}>
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
              <Autocomplete
                multiple
                options={options}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) =>
                  renderChipLabel ? renderChipLabel(option) : option.label
                }
                value={Array.isArray(field.value) ? field.value : []}
                onChange={(_, value) => {
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
                }}
                onBlur={field.onBlur}
                onInputChange={(_, value) => {
                  setSearch(value);
                  setPage(1);
                }}
                loading={loading}
                renderTags={(value: any[], getTagProps) =>
                  value.map((option, index) => (
                    <Chip
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
                        }}
                        onClick={() => setPage((prev) => prev + 1)}
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
