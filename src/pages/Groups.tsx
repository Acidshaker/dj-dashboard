import { GroupForm } from "@/components/groups/GroupForm";
import { PackageForm } from "@/components/groups/PackageForm";
import BaseTable from "@/components/shared/Table";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { ReactNode, SyntheticEvent, useRef, useState } from "react";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ flexGrow: 1 }}
    >
      {value === index && (
        <Box sx={{ p: 3, height: "100%" }}>
          <Typography sx={{ height: "100%" }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const tableRef = useRef<{ reloadData: () => void }>(null);
  const tableRefGroup = useRef<{ reloadData: () => void }>(null);
  const [item, setItem] = useState<Record<string, any> | null>(null);
  const [itemGroup, setItemGroup] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditGroup, setIsEditGroup] = useState(false);
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

  const closeModal = () => {
    setIsModalOpen(false);
    tableRef.current?.reloadData();
  };

  const openGroupModal = (data?: Record<string, any>) => {
    if (data) {
      setItemGroup(data);
      setIsEditGroup(true);
    } else {
      setItemGroup(null);
      setIsEditGroup(false);
    }
    setIsGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
    tableRefGroup.current?.reloadData();
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Tabs
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Grupos" {...a11yProps(0)} />
        <Tab label="Paquetes" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <BaseTable
          ref={tableRefGroup}
          action="groups"
          title="Grupos"
          addLabel="Agregar grupo"
          isView={true}
          isEdit={true}
          isDelete={true}
          onAddClick={openGroupModal}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BaseTable
          ref={tableRef}
          action="packages"
          title="Paquetes"
          addLabel="Agregar paquete"
          isView={true}
          isEdit={true}
          isDelete={true}
          onAddClick={openModal}
        />
      </TabPanel>

      <PackageForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}
      />

      <GroupForm
        open={isGroupModalOpen}
        handleClose={closeGroupModal}
        data={itemGroup}
        isEdit={isEditGroup}
      />
      {/* <SaleForm
        open={isModalOpen}
        handleClose={closeModal}
        data={item}
        isEdit={isEdit}
      /> */}
    </Box>
  );
};
