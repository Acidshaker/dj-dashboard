import { Box, Chip } from "@mui/material";
import api from "./api";
import { events, groups, packages } from "./endpoints";
// import {
//   units,
//   users,
//   clients,
//   suppliers,
//   supplies,
//   sales,
//   purchases,
// } from "./endpoints";

export interface TableHeader {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableConfigItem {
  getData: (params: Record<string, any>) => Promise<any>;
  headers: TableHeader[];
  deleteFunction?: (id: string) => Promise<any>;
  reactiveFunction?: (id: string) => Promise<any>;
}

const formattedDate = (date: string) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const chipColor = (value: string) => {
  switch (value) {
    case "active":
      return "success";
    case "not_started":
      return "info";
    default:
      return "error";
  }
};

const eventLabel = (value: string) => {
  switch (value) {
    case "active":
      return "En curso";
    case "not_started":
      return "No iniciado";
    default:
      return "Finalizado";
  }
};

const typeLabel = (value: string) => {
  switch (value) {
    case "song":
      return "Canción 🎵";
    case "mention":
      return "Mención 🎙️";
    default:
      return "Cualquiera";
  }
};

export const tableConfig: Record<string, TableConfigItem> = {
  packages: {
    getData: (params) => packages.getPackages(params),
    headers: [
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "type",
        label: "Tipo",
        align: "center",
        sortable: true,
        render: (value) => typeLabel(value),
      },
      {
        key: "tip",
        label: "Precio",
        align: "center",
        sortable: true,
        render: (value) => `$${value.toFixed(2)}`,
      },
    ],
  },
  groups: {
    getData: (params) => groups.getGroups(params),
    headers: [
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
    ],
  },
  events: {
    getData: (params) => events.getEvents(params),
    headers: [
      {
        key: "date",
        label: "Fecha",
        align: "center",
        sortable: true,
        render: (value) => formattedDate(value),
      },
      {
        key: "name",
        label: "Nombre",
        align: "center",
        sortable: true,
        render: (value) => value,
      },
      {
        key: "status",
        label: "Estado",
        align: "center",
        sortable: true,
        render: (value) => (
          <Chip label={eventLabel(value)} color={chipColor(value)} />
        ),
      },
    ],
  },
  // users: {
  //   getData: (params) => users.getUsers(params),
  //   headers: [
  //     {
  //       key: "firstName",
  //       label: "Nombre(s)",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "lastName",
  //       label: "Apellido(s)",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "email",
  //       label: "Correo electrónico",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "role",
  //       label: "Rol",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //   ],
  //   deleteFunction: (id) => users.deleteUser(id),
  //   reactiveFunction: (id) => users.reactiveUser(id),
  // },
  // units: {
  //   getData: (params) => units.getUnits(params),
  //   headers: [
  //     {
  //       key: "name",
  //       label: "Nombre",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "equivalence",
  //       label: "Equivalencia",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "description",
  //       label: "Descripción",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //   ],
  //   deleteFunction: (id) => units.deleteUnit(id),
  //   reactiveFunction: (id) => units.reactiveUnit(id),
  // },
  // clients: {
  //   getData: (params) => clients.getClients(params),
  //   headers: [
  //     {
  //       key: "name",
  //       label: "Nombre o razón social",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "email",
  //       label: "Correo electrónico",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "phone",
  //       label: "Teléfono",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //   ],
  //   deleteFunction: (id) => clients.deleteClient(id),
  //   reactiveFunction: (id) => clients.reactiveClient(id),
  // },
  // suppliers: {
  //   getData: (params) => suppliers.getSuppliers(params),
  //   headers: [
  //     {
  //       key: "name",
  //       label: "Nombre o razón social",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "email",
  //       label: "Correo electrónico",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "phone",
  //       label: "Teléfono",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //   ],
  // },
  // supplies: {
  //   getData: (params) => supplies.getSupplies(params),
  //   headers: [
  //     {
  //       key: "supplyImage",
  //       label: "Imagen",
  //       align: "center",
  //       render: (value) => (
  //         <Box
  //           component="img"
  //           src={value}
  //           alt="imagen"
  //           sx={{
  //             width: 48,
  //             height: 48,
  //             objectFit: "cover",
  //             borderRadius: 1,
  //           }}
  //         />
  //       ),
  //     },
  //     {
  //       key: "name",
  //       label: "Nombre",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "unit",
  //       label: "Unidad",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => " Kg",
  //     },
  //     // {
  //     //   key: "cost",
  //     //   label: "Costo",
  //     //   align: "center",
  //     //   sortable: true,
  //     //   render: (value) => "$ " + value,
  //     // },
  //     // {
  //     //   key: "price",
  //     //   label: "Precio de venta",
  //     //   align: "center",
  //     //   sortable: true,
  //     //   render: (value) => "$ " + value,
  //     // },
  //   ],
  //   deleteFunction: (id) => supplies.deleteSupply(id),
  //   reactiveFunction: (id) => supplies.reactiveSupply(id),
  // },
  // sales: {
  //   getData: (params) => sales.getSales(params),
  //   headers: [
  //     {
  //       key: "date",
  //       label: "Fecha",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => formattedDate(value),
  //     },
  //     {
  //       key: "folio",
  //       label: "Folio",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "client",
  //       label: "Cliente",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "status",
  //       label: "Estado",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => <Chip label={value} color={chipColor(value)} />,
  //     },
  //     {
  //       key: "total",
  //       label: "Total",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => "$ " + value,
  //     },
  //   ],
  //   deleteFunction: (id) => sales.deleteSale(id),
  //   reactiveFunction: (id) => sales.reactiveSale(id),
  // },
  // purchases: {
  //   getData: (params) => purchases.getPurchases(params),
  //   headers: [
  //     {
  //       key: "date",
  //       label: "Fecha",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => formattedDate(value),
  //     },
  //     {
  //       key: "folio",
  //       label: "Folio",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "supplier",
  //       label: "Proveedor",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => value,
  //     },
  //     {
  //       key: "status",
  //       label: "Estado",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => <Chip label={value} color={chipColor(value)} />,
  //     },
  //     {
  //       key: "total",
  //       label: "Total",
  //       align: "center",
  //       sortable: true,
  //       render: (value) => "$ " + value,
  //     },
  //   ],
  //   deleteFunction: (id) => purchases.deletePurchase(id),
  //   reactiveFunction: (id) => purchases.reactivePurchase(id),
  // },
};
