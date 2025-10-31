import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BaseTable from "@/components/shared/Table";
import { useRef, useState } from "react";
import { EventForm } from "@/components/events/EventForm";
import { set } from "date-fns";
import { QrModal } from "@/components/events/QrModal";

const Events = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [openQr, setOpenQr] = useState(false);
  const [qrData, setQrData] = useState<{
    name: string;
    url: string;
    companyDataId: string | null;
  } | null>(null);

  const navigate = useNavigate();
  const handleOpenQr = (item: any) => {
    setQrData({
      name: item.name,
      url: item.qr_url,
      companyDataId: item.companyDataId,
    });
    setOpenQr(true);
  };
  const handleCloseQr = () => {
    setOpenQr(false);
    setTimeout(() => setQrData(null), 300);
  };

  const openModal = (data?: Record<string, any>) => {
    if (data) {
      setItem(data);
      setIsEdit(true);
    } else {
      setItem(null);
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const openDashboard = (item: any) => {
    navigate("/events/" + item.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    tableRef.current?.reloadData();
  };

  return (
    <Box sx={{ height: "100%" }}>
      <BaseTable
        ref={tableRef}
        action="events"
        title="Eventos"
        addLabel="Agregar evento"
        isQr
        isDashboard
        onAddClick={openModal}
        onQrClick={(item: any) => {
          handleOpenQr(item);
        }}
        onDashboardClick={openDashboard}
      />
      <EventForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}
      />
      <QrModal
        open={openQr}
        handleClose={handleCloseQr}
        url={qrData?.url}
        name={qrData?.name}
        companyDatId={qrData?.companyDataId}
      />
    </Box>
  );
};

export default Events;
