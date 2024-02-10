import { useEffect, useState } from "react";
import NextLink from "next/link";
import numeral from "numeral";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import { ArrowRight as ArrowRightIcon } from "../../icons/arrow-right";
import { PencilAlt as PencilAltIcon } from "../../icons/pencil-alt";
import { getInitials } from "../../utils/get-initials";
import { Scrollbar } from "../scrollbar";
import { SeverityPill } from "../severity-pill";
// TODO Quitar toda referencia al customer y sustituir por los vouchers
export const VoucherListTable = (props) => {
  const {
    customers,
    customersCount,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    ...other
  } = props;
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  // Reset selected customers when customers change
  useEffect(
    () => {
      if (selectedCustomers.length) {
        setSelectedCustomers([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customers]
  );

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(
      event.target.checked ? customers.map((customer) => customer.id) : []
    );
  };

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) =>
        prevSelected.filter((id) => id !== customerId)
      );
    }
  };

  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers =
    selectedCustomers.length > 0 && selectedCustomers.length < customers.length;
  const selectedAllCustomers = selectedCustomers.length === customers.length;

  return (
    <div {...other}>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
          display: enableBulkActions ? "block" : "none",
          px: 2,
          py: 0.5,
        }}
      >
        <Checkbox
          checked={selectedAllCustomers}
          indeterminate={selectedSomeCustomers}
          onChange={handleSelectAllCustomers}
        />
        <Button size="small" 
        sx={{ ml: 2 }}>
          Delete
        </Button>
        <Button size="small" 
        sx={{ ml: 2 }}>
          Edit
        </Button>
      </Box>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead
            sx={{ visibility: enableBulkActions ? "collapse" : "visible" }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllCustomers}
                  indeterminate={selectedSomeCustomers}
                  onChange={handleSelectAllCustomers}
                />
              </TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Importe del bono</TableCell>
              <TableCell>Válido desde</TableCell>
              <TableCell>Días totales del bono</TableCell>
              <TableCell>Cantidad de sesiones disponibles</TableCell>
              <TableCell>Es activo</TableCell>
              <TableCell>Dias restantes</TableCell>
              <TableCell>Valido hasta</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              const isCustomerSelected = selectedCustomers.includes(
                customer.id
              );

              return (
                <TableRow hover 
                key={customer.id} 
                selected={isCustomerSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isCustomerSelected}
                      onChange={(event) =>
                        handleSelectOneCustomer(event, customer.id)
                      }
                      value={isCustomerSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Box sx={{ ml: 1 }}>
                        <NextLink href={`/vouchers/${customer.id}`}
                        passHref>
                          <Link 
                          color="inherit" 
                          variant="subtitle2">
                            {customer.buyer}
                          </Link>
                        </NextLink>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography  
                    variant="subtitle2">
                      {`${customer.price} €`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography  
                    variant="subtitle2">
                      {`${customer.valid_from}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${customer.valid_for}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${customer.available_sessions}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={customer.is_active ? "success.main" : "error.main"} 
                    variant="subtitle2">
                      {customer.is_active && <DoneIcon></DoneIcon>}
                      {!customer.is_active && <ErrorIcon></ErrorIcon>}
                    </Typography>
                  </TableCell>{/* TODO: los colores deberían ser en función de si quedan días o no */}
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${customer.days_left}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" 
                    variant="subtitle2">
                      {`${customer.expire_on}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <NextLink href={`/vouchers/${customer.id}`} 
                    passHref>
                      <IconButton component="a">
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                    <NextLink href={`/vouchers/${customer.id}`} 
                    passHref>
                      <IconButton component="a">
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </NextLink>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={customersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

VoucherListTable.propTypes = {
  customers: PropTypes.array.isRequired,
  customersCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
