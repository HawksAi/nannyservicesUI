import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { MobileDatePicker } from '@mui/x-date-pickers';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  FormHelperText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { wait } from '../../utils/wait';
import { getActivitys} from "../../slices/gym";
import { useEffect } from "react";

// TODO: estos valores deberían estar en el store(Copiar la lógica de create form)

export const SubscriptionEditForm = (props) => {
  const buyers = [{name: 'Fabio Capello',
                id: 1234, },
                {name: 'Marco Van Basten',
                id: 1235, },
                {name: 'Ruud Gullit',
                id: 1236, },
                {name: 'Stefano',
                id: 1335, },
                {name: 'Juan',
                id: 1246, },
                {name: 'Hugo',
                id: 5335, },
                {name: 'Silvia',
                id: 5246, },]
  const groups = [
                  {
                    id: '5e887ac47eed253091be10cb',
                    name: 'Grupo de mañana',
                  },
                  {
                    id: '5e887b209c28ac3dd97f6db5',
                    name: 'Grupos de tarde',
                  },
                ];

  const dispatch = useDispatch()
  const {activities} = useSelector((state) => state.gym);
  useEffect(() => {
    dispatch(getActivitys())
  },[dispatch])

  const { subscription, ...other } = props;

  const formik = useFormik({
    initialValues: {
      buyer: subscription.buyer || '',
      activities: subscription.activities || [],
      groups: subscription.groups || [],
      price: subscription.price || 0,
      is_active: subscription.is_active || false,
      first_rate_defferal: subscription.first_rate_defferal || false,
      valid_from: subscription.valid_from || new Date('2022-01-11T12:41:50'),
      submit: null,
    },
    validationSchema: Yup.object({
      buyer: Yup.string().required(),
      price: Yup.number().min(0).required(),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        toast.success(`Cuota para el cliente"${values.buyer}" modificada`);
        // router.push('/dashboard/products').catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error('No se ha podido modificar la cuota');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("valid_from", newValue);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <Typography variant="h6">
                Datos generales
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <Box sx={{ mt: 4 }}>
              <TextField
                error={Boolean(formik.touched.buyer && formik.errors.buyer)}
                fullWidth
                label="Cliente"
                name="buyer"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                select
                value={formik.values.buyer}
              >
                {buyers.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.name}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              </Box>
              {Boolean(formik.touched.buyer && formik.errors.buyer) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {formik.errors.buyer}
                  </FormHelperText>
                </Box>
              )}
              <Box sx={{ mt: 4 }}>
              <Autocomplete
                id="activities"
                options={activities}
                getOptionLabel= {(option) => option.name}
                fullWidth
                label="Actividades" 
                name="activities"
                onBlur={formik.handleBlur}
                onChange={(e, value) =>{
                  formik.setFieldValue("activities", value)
                }}
                multiple
                value={formik.values.activities}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    error={Boolean(formik.touched.activities && formik.errors.activities)}
                    label="Actividades"
                    placeholder="Añadir"
                  />
                  )} 
              >
              </Autocomplete>
              </Box>
              <Box sx={{ mt: 4 }}>
              <Autocomplete
                id="groups"
                options={groups}
                getOptionLabel= {(option) => option.name}
                fullWidth
                label="Grupo de Actividades" 
                name="groups"
                onBlur={formik.handleBlur}
                onChange={(e, value) =>{
                  formik.setFieldValue("groups", value)
                }}
                multiple
                value={formik.values.groups}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    error={Boolean(formik.touched.groups && formik.errors.groups)}
                    label="Grupo de Actividades"
                    placeholder="Añadir"
                  />
                  )} 
              >
              </Autocomplete>
              </Box>
              <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(formik.touched.price && formik.errors.price)}
                fullWidth
                helperText={formik.touched.price && formik.errors.price}
                label="Importe de la cuota"
                name="price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.price}
              />
              </Box>
              <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mt: 3
          }}
        >
          <MobileDatePicker
            error={Boolean(formik.touched.valid_from && formik.errors.valid_from)}
            label="Fecha inicio validez"
            inputFormat="dd/MM/yyyy"
            value={formik.values.valid_from}
            name="valid_from"
            onChange={handleStartDateChange}
            onBlur={formik.handleBlur}
            renderInput={(inputProps) => <TextField {...inputProps} />}
          />
        </Box>
        <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                {formik.values.is_active && "La cuota está activa."}
                {!formik.values.is_active && "La cuota no está activa."}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                {formik.values.is_active && "Desmarca esta opción para desactivar la cuota. El cliente no podrá usar los servicios del gimnasio hasta que la cuota esté activa."}
                {!formik.values.is_active && "Marca esta opción para activar la cuota. El cliente podrá disfrutar del plan que ha contratado."}
              </Typography>
            </div>
            <Switch
              checked={formik.values.is_active}
              color="primary"
              edge="start"
              name="is_active"
              onChange={formik.handleChange}
              value={formik.values.is_active}
            />
          </Box>
        <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                {formik.values.first_rate_defferal && "Primera cuota reducida."}
                {!formik.values.first_rate_defferal && "Primera cuota entera."}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
                sx={{ mt: 1 }}
              >
                {formik.values.first_rate_defferal && "Desmarca esta opción para que la primera cuota sea entera."}
                {!formik.values.first_rate_defferal && "Marca esta opción para calcular la primera cuota en base al número proporcionales de días que quedan en el mes."}
              </Typography>
            </div>
            <Switch
              checked={formik.values.first_rate_defferal}
              color="primary"
              edge="start"
              name="first_rate_defferal"
              onChange={formik.handleChange}
              value={formik.values.first_rate_defferal}
            />
          </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          mx: -1,
          mb: -1,
          mt: 3
        }}
      >
        <NextLink href='/subscriptions'>
        <Button
          sx={{ m: 1 }}
          variant="outlined"
        >
          Cancel
        </Button>
        </NextLink>
        <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
        >
          Update
        </Button>
      </Box>
    </form>
  );
};

SubscriptionEditForm.propTypes = {
  subscription: PropTypes.object.isRequired
};
