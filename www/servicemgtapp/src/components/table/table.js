import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, PersonAddAlt1 } from "@mui/icons-material";
import { makeData } from "./makedata";
// import { data, states } from './makeData';

const ReactTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(() => makeData(5));
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    console.log(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !alert(`Are you sure you want to delete ${row.getValue("Full Name")}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      // {
      //   accessorKey: 'avarta',
      //   header: 'Photo',
      //   // enableColumnOrdering: false,
      //   // enableEditing: false, //disable editing on this column
      //   // enableSorting: false,
      //   size: 80,
      // },
      {
        accessorFn: (row) =>
          `${row.lastName} ${row.middleName} ${row.firstName}`,
        accessorKey: "Full Name",
        header: "Full Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "email",
        header: "Email",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "userType",
        header: "Role",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          // children: states.map((state) => (
          //   <MenuItem key={state} value={state}>
          //     {state}
          //   </MenuItem>
          // )),
        },
      },
      // {
      //   accessorKey: "status",
      //   header: "Status",
      //   muiTableBodyCellEditTextFieldProps: {
      //     select: true, //change to select for a dropdown
      //     // children: states.map((state) => (
      //     //   <MenuItem key={state} value={state}>
      //     //     {state}
      //     //   </MenuItem>
      //     // )),
      //   },
      //    Cell: ({ cell }) => {
      //   const value = cell.row.original.status;

      //   const chipColor =
      //     value === "blocked"
      //       ? "error"
      //       : value === "active"
      //       ? "success"
      //       : value === "inactive"
      //       ? "primary"
      //       : value === "suspended"
      //       ? "secondary"
      //       : "default";

      //   const getStatusLabel = (status) => {
      //     if (status === "blocked") {
      //       return "Blocked";
      //     }
      //     if (status === "inactive") {
      //       return "Inactive";
      //     }
      //     if (status === "active") {
      //       return "Active";
      //     }
      //     if (status === "suspended") {
      //       return "Suspended";
      //     }
      //     return "Unknown";
      //   };

      //   const label = getStatusLabel(value);

      //   return <Chip label={label} color={chipColor} size="small" />;
      // },
      // },
      {
        accessorFn: (row) => row.status,
        accessorKey: "status",
        header: "Status",
        muiTableBodyCellEditTextFieldProps: {
          select: true, // change to select for a dropdown
          // children: states.map((state) => (
          //   <MenuItem key={state} value={state}>
          //     {state}
          //   </MenuItem>
          // )),
        },
        Cell: ({ cell }) => {
          const value = cell.row.original.status;

          const chipColor =
            value === "blocked"
              ? "error"
              : value === "active"
              ? "success"
              : value === "inactive"
              ? "primary"
              : value === "suspended"
              ? "secondary"
              : "default";

          const getStatusLabel = (status) => {
            if (status === "blocked") {
              return "Blocked";
            }
            if (status === "inactive") {
              return "Inactive";
            }
            if (status === "active") {
              return "Active";
            }
            if (status === "suspended") {
              return "Suspended";
            }
            return "Unknown";
          };

          const label = getStatusLabel(value);

          return <Chip label={label} color={chipColor} size="small" />;
        },
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        enableEditing
        editingMode="modal" //default
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1px" }}>
            <Tooltip arrow placement="right-end" title="Modify">
              <IconButton size="small" onClick={() => table.setEditingRow(row)}>
                <Edit size="small" />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteRow(row)}
              >
                <Delete size="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        enableTopToolbar
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
            disableElevation
            endIcon={<PersonAddAlt1 />}
            sx={{ m: 1 }}
          >
            Add User
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle fontSize={18} textAlign="center">
        Create New User
      </DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) =>
              column.header === "Status" ? null : column.header === "Role" ? (
                <FormControl key={column.accessorKey}>
                  <InputLabel>{column.header}</InputLabel>
                  <Select
                    value={values[column.accessorKey] || ""}
                    name={column.accessorKey}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="support">Support</MenuItem>
                    <MenuItem value="reviewer">Reviewer</MenuItem>
                    <MenuItem value="qa">Qa</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) => {
                    if (e.target.name === "Full Name") {
                      const [firstName = "", lastName = "", middleName = ""] =
                        e.target.value.split(" ");
                      return setValues({
                        ...values,
                        firstName,
                        lastName,
                        middleName,
                        [e.target.name]: e.target.value,
                      });
                    }
                    setValues({ ...values, [e.target.name]: e.target.value });
                  }}
                />
              )
            )}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default ReactTable;
