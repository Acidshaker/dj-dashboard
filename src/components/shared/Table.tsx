import {
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  Tooltip,
  Typography,
  ListItemText,
  useTheme,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Fade,
} from "@mui/material";
import Table from "@mui/material/Table";
import { useAlerts } from "../../utils/alerts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CachedIcon from "@mui/icons-material/Cached";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import FilterListIcon from "@mui/icons-material/FilterList";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  useState,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { showLoading, hideLoading, setParams } from "../../store/uiSlice";
import { tableConfig } from "../../services/tableConfig";
import { toast } from "react-toastify";
import { eventMusic } from "@/services/endpoints";

interface Props {
  action: string;
  title: string;
  addLabel?: string;
  isView?: boolean;
  isEdit?: boolean;
  isReactive?: boolean;
  isQr?: boolean;
  isDashboard?: boolean;
  isDelete?: boolean;
  isOnlyTable?: boolean;
  isPlay?: boolean;
  hasActions?: boolean;
  extraParams?: Record<string, any>;
  onAddClick: (data?: Record<string, any>) => void;
  onQrClick?: (data?: Record<string, any>) => void;
  onDashboardClick?: (data?: Record<string, any>) => void;
}

const BaseTable = forwardRef(
  (
    {
      action,
      title,
      addLabel,
      isView,
      isEdit,
      isQr,
      isDashboard,
      isDelete,
      isPlay,
      hasActions = true,
      isReactive = true,
      isOnlyTable = false,
      extraParams,
      onAddClick,
      onQrClick,
      onDashboardClick,
    }: Props,
    ref
  ) => {
    const dispatch = useDispatch();
    const params = useSelector((state: RootState) => state.ui.params);
    const loading = useSelector((state: RootState) => state.ui.loading);

    const [data, setData] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [headers, setHeaders] = useState<any[]>([]);
    const [localSearch, setLocalSearch] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [orderBy, setOrderBy] = useState<string | null>(null);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (key: string) => {
      if (orderBy === key) {
        setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setOrderBy(key);
        setOrderDirection("asc");
      }
    };

    const sortedData = useMemo(() => {
      if (!orderBy) return data;
      return [...data].sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return orderDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        return orderDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }, [data, orderBy, orderDirection]);

    const theme = useTheme();

    const { confirmationAlert, showConfirmationAlertWithCheckbox } =
      useAlerts();

    // Mantener localSearch sincronizado con la store
    useEffect(() => {
      if ((params?.search || "") !== localSearch) {
        setLocalSearch(params?.search || "");
      }
    }, [params?.search]);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    const paginationOptions = {
      rowsPerPageText: "Filas por página",
      rangeSeparatorText: "de",
      noRowsPerPage: false,
      selectAllRowsItem: true,
      selectAllRowsItemText: "Todos",
    };

    // getData ahora acepta params opcionales para evitar leer params "viejos"
    const getData = async (overrideParams?: any) => {
      setOrderBy(null);
      setOrderDirection("asc");
      const p = overrideParams ?? params;
      if (!tableConfig[action]) return;
      dispatch(showLoading());
      try {
        const res = await tableConfig[action].getData({ ...p, ...extraParams });
        setData(res.data.data.results);
        setCount(res.data.data.count);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(hideLoading());
      }
    };

    const deleteItem = async (id: string) => {
      const foo = async () => {
        dispatch(showLoading());
        try {
          if (tableConfig[action]?.deleteFunction) {
            await tableConfig[action]?.deleteFunction(id);
            // refrescar usando los params actuales
            getData();
            toast.success("Elemento eliminado con éxito");
          }
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(hideLoading());
        }
      };
      confirmationAlert(foo, "¿Seguro que deseas eliminar este elemento?");
    };

    const reactiveItem = async (id: string) => {
      const foo = async () => {
        dispatch(showLoading());
        try {
          if (tableConfig[action]?.reactiveFunction) {
            await tableConfig[action]?.reactiveFunction(id);
            isActiveFilter(true)();
            toast.success("Elemento activado con éxito");
          }
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(hideLoading());
        }
      };
      confirmationAlert(foo, "¿Seguro que deseas reactivar este elemento?");
    };

    const onPlayClick = (data: any) => {
      if (data.is_paid) {
        const foo = async () => {
          dispatch(showLoading());
          try {
            const res = await eventMusic.completeEventMusic({
              eventMusicId: data.id,
            });
            console.log(res.data.data);
            toast.success("Solicitud completada con éxito");
            await getData();
          } catch (err) {
            console.log(err);
          } finally {
            dispatch(hideLoading());
          }
        };
        confirmationAlert(foo, "¿Seguro que deseas completar esta solicitud?");
      } else {
        const foo = async (checkboxValue: boolean) => {
          const body = {
            eventMusicId: data.id,
            isPaid: checkboxValue,
          };
          dispatch(showLoading());
          try {
            const res = await eventMusic.completeEventMusic(body);
            console.log(res.data.data);
            toast.success("Solicitud completada con éxito");
            await getData();
          } catch (err) {
            console.log(err);
          } finally {
            dispatch(hideLoading());
          }
        };
        showConfirmationAlertWithCheckbox(
          foo,
          "Marcar como pagada",
          "¿Seguro que deseas completar esta solicitud?"
        );
      }
    };

    const changeToPaid = (data: any) => {
      const foo = async () => {
        dispatch(showLoading());
        try {
          const res = await eventMusic.changeToPaid({
            eventMusicId: data.id,
          });
          console.log(res.data.data);
          toast.success("Solicitud actualizada con éxito");
          await getData();
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(hideLoading());
        }
      };
      confirmationAlert(
        foo,
        "¿Deseas marcar esta solicitud como pagada? esta acción es irreversible"
      );
    };

    // montaje inicial: setParams con initialParams y llamar getData(initialParams)
    useEffect(() => {
      const initialParams = {
        page: 1,
        limit: 10,
        offset: 0,
        search: "",
        is_active: true,
      };
      dispatch(setParams(initialParams));

      const baseHeaders = tableConfig[action]?.headers || [];
      const actionColumn = {
        key: "actions",
        label: "Acciones",
        align: "center",
        render: (_, row: any) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            {isPlay && (
              <Tooltip title="Reproducir">
                <IconButton onClick={() => onPlayClick(row)} color="success">
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>
            )}
            {isQr && row.is_active && (
              <Tooltip title="Visualizar QR">
                <IconButton onClick={() => onQrClick(row)} color="success">
                  <QrCodeIcon />
                </IconButton>
              </Tooltip>
            )}
            {isDashboard && row.is_active && (
              <Tooltip title="Ir al tablero">
                <IconButton onClick={() => onDashboardClick(row)} color="info">
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            )}
            {isEdit &&
            row?.is_active &&
            action !== "purchases" &&
            action !== "sales" ? (
              <Tooltip title="Editar">
                <IconButton onClick={() => onAddClick(row)} color="info">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {isEdit &&
            row?.is_active &&
            row.status === "Pendiente" &&
            (action === "purchases" || action === "sales") ? (
              <Tooltip title="Editar">
                <IconButton onClick={() => onAddClick(row)} color="info">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {isEdit &&
            row?.is_active &&
            row.status !== "Pendiente" &&
            (action === "purchases" || action === "sales") ? (
              <Tooltip title="Visualizar">
                <IconButton onClick={() => console.log(row)} color="success">
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {isEdit &&
            row?.is_active &&
            (action === "purchases" || action === "sales") ? (
              <Tooltip title="Actualizar estado">
                <IconButton onClick={() => console.log(row)} color="primary">
                  <PublishedWithChangesIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {row?.is_active &&
            row.status !== "Cancelado" &&
            action === "sales" &&
            !row.isBilled ? (
              <Tooltip title="Facturar">
                <IconButton onClick={() => console.log(row)} color="warning">
                  <RequestQuoteIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {row?.is_active &&
            row.status !== "Cancelado" &&
            action === "sales" &&
            row.isBilled ? (
              <Tooltip title="Descargar factura">
                <IconButton onClick={() => console.log(row)} color="secondary">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {row?.is_active &&
            row.status !== "Cancelado" &&
            action === "purchases" &&
            row.billFile ? (
              <Tooltip title="Descargar factura">
                <IconButton onClick={() => console.log(row)} color="secondary">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            ) : null}

            {isDelete && row.is_active && (
              <Tooltip title="Eliminar">
                <IconButton onClick={() => deleteItem(row.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            {isReactive && !row.is_active && action !== "musicRequests" && (
              <Tooltip title="Reactivar">
                <IconButton
                  onClick={() => reactiveItem(row.id)}
                  color="warning"
                >
                  <SettingsBackupRestoreIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
      };

      setHeaders([...baseHeaders, hasActions ? actionColumn : {}]);

      getData(initialParams);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      reloadData: () => getData(),
      getItems: () => data,
    }));

    // filtro Activos/Inactivos — construir newParams y usarlo
    const isActiveFilter = (value: boolean) => () => {
      const newParams = {
        ...params,
        is_active: value,
        page: 1,
        offset: 0,
      };
      dispatch(setParams(newParams));
      setResetPaginationToggle((old) => !old);
      handleCloseMenu();
      getData(newParams);
    };

    return (
      <Fade in timeout={500}>
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              px: 2,
              py: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {!isOnlyTable && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Buscar..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const newParams = {
                        ...params,
                        search: localSearch,
                        page: 1,
                        offset: 0,
                      };
                      dispatch(setParams(newParams));
                      getData(newParams);
                      setHasSearched(true);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: hasSearched && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setLocalSearch("");
                            const newParams = {
                              ...params,
                              search: "",
                              page: 1,
                              offset: 0,
                            };
                            dispatch(setParams(newParams));
                            getData(newParams);
                            setHasSearched(false);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Tooltip title="Filtros">
                  <IconButton onClick={handleOpenMenu}>
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={isActiveFilter(true)}>
                    <Checkbox checked={params.is_active === true} />
                    <ListItemText primary="Activos" />
                  </MenuItem>
                  <MenuItem onClick={isActiveFilter(false)}>
                    <Checkbox checked={params.is_active === false} />
                    <ListItemText primary="Inactivos" />
                  </MenuItem>
                </Menu>

                <Tooltip title="Refrescar">
                  <IconButton onClick={() => getData()}>
                    <CachedIcon />
                  </IconButton>
                </Tooltip>

                {addLabel && (
                  <Button
                    variant="contained"
                    onClick={() => onAddClick()}
                    endIcon={<AddIcon />}
                  >
                    {addLabel}
                  </Button>
                )}
              </Box>
            )}
          </Box>
          <TableContainer
            sx={{ flex: 1, overflow: "auto", position: "relative" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell
                      key={header.key}
                      align={header.align ?? "center"}
                      onClick={() => header.sortable && handleSort(header.key)}
                      sx={{
                        cursor: header.sortable ? "pointer" : "default",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={0.5}
                      >
                        {header.label}
                        {header.sortable &&
                          orderBy === header.key &&
                          (orderDirection === "asc" ? (
                            <ArrowDropUpIcon fontSize="small" />
                          ) : (
                            <ArrowDropDownIcon fontSize="small" />
                          ))}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {!loading &&
                  sortedData.map((row, idx) => (
                    <Fade in timeout={400} key={idx}>
                      <TableRow>
                        {headers.map((header) => (
                          <TableCell
                            align={header.align}
                            key={header.key}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {header.render ? (
                              header.key === "is_paid" && !row[header.key] ? (
                                <Box
                                  onClick={() => changeToPaid(row)}
                                  sx={{
                                    cursor: "pointer",
                                    display: "inline-block",
                                  }}
                                >
                                  {header.render(row[header.key], row)}
                                </Box>
                              ) : (
                                header.render(row[header.key], row)
                              )
                            ) : (
                              row[header.key]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </Fade>
                  ))}
                {/* <-- NO pongas fila vacía aquí */}
              </TableBody>
            </Table>

            {/* Overlay de “sin resultados” que ocupa TODO el alto */}
            {!loading && data.length === 0 && (
              <Fade in timeout={400}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0, // top/right/bottom/left: 0
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    opacity: 0.7,
                    p: 2,
                    pointerEvents: "none", // no bloquea clicks en header/scroll
                  }}
                >
                  <SentimentVeryDissatisfiedIcon fontSize="large" />
                  <Typography variant="body1">
                    No se encontraron resultados
                  </Typography>
                </Box>
              </Fade>
            )}
          </TableContainer>

          <TablePagination
            component="div"
            count={count}
            page={params.page - 1}
            rowsPerPage={params.limit}
            onPageChange={(_, newPage) => {
              const newParams = {
                ...params,
                page: newPage + 1,
                offset: newPage * params.limit,
              };
              dispatch(setParams(newParams));
              getData(newParams);
            }}
            onRowsPerPageChange={(e) => {
              const newParams = {
                ...params,
                limit: parseInt(e.target.value),
                page: 1,
                offset: 0,
              };
              dispatch(setParams(newParams));
              getData(newParams);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Elementos por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
          />
        </Paper>
      </Fade>
    );
  }
);

export default BaseTable;
