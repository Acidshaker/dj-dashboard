import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Backdrop, CircularProgress } from "@mui/material";

const Loader = () => {
  const active = useSelector((state: RootState) => state.ui.loading);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
      open={active}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
