import { useMemo } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { addMinutes } from 'date-fns';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Trash as TrashIcon } from '../../../icons/trash';
import { useDispatch } from '../../../store';
import { getEvents, createEvent, deleteEvent, updateEvent, createRecurrentEvent } from '../../../thunks/calendar';

export const CalendarEventDialog = (props) => {
  const { event, onAddComplete, onClose, onDeleteComplete, onEditComplete, open, range } = props;
  const dispatch = useDispatch();
  const initialValues = useMemo(() => {
    if (event) {
      return {
        allDay: event.allDay || false,
        recurrent: event.recurrent || false,
        color: event.color || '',
        description: event.description || '',
        end: event.end ? new Date(event.end) : addMinutes(new Date(), 30),
        start: event.start ? new Date(event.start) : new Date(),
        title: event.title || '',
        submit: null
      };
    }

    if (range) {
      return {
        allDay: false,
        recurrent: false,
        color: '',
        description: '',
        end: new Date(range.end),
        start: new Date(range.start),
        title: '',
        submit: null
      };
    }

    return {
      allDay: false,
      recurrent: false,
      color: '',
      description: '',
      end: addMinutes(new Date(), 30),
      start: new Date(),
      title: '',
      submit: null
    };
  }, [event, range]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      allDay: Yup.bool(),
      recurrent: Yup.bool(),
      description: Yup.string().max(5000),
      end: Yup.date(),
      start: Yup.date(),
      title: Yup
        .string()
        .max(255)
        .required('Title is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const data = {
          allDay: values.allDay,
          description: values.description,
          days: values.weeklyRecurrence,
          end: values.end.getTime(),
          start: values.start.getTime(),
          title: values.title
        };

        if (event) {
          await dispatch(updateEvent({
            eventId: event.id,
            update: {color: "green"}
          }));
          toast.success('¡Te has apuntado a la clase!');
        } else { if (values.recurrent) {
          await dispatch(createRecurrentEvent(data))
          dispatch(getEvents())
          toast.success('Clase periodica creada en la agenda!');
        } else {
          await dispatch(createEvent(data));
          toast.success('Clase creada en la agenda!');
          }
        }

        if (!event && onAddComplete) {
          onAddComplete();
        }

        if (event && onEditComplete) {
          onEditComplete();
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleStartDateChange = (date) => {
    formik.setFieldValue('start', date);

    // Prevent end date to be before start date
    if (formik.values.end && date && date > formik.values.end) {
      formik.setFieldValue('end', date);
    }
  };

  const handleEndDateChange = (date) => {
    formik.setFieldValue('end', date);

    // Prevent start date to be after end date
    if (formik.values.start && date && date < formik.values.start) {
      formik.setFieldValue('start', date);
    }
  };

  const handleDelete = async () => {
    try {
      if (!event) {
        return;
      }

      await dispatch(updateEvent({
        eventId: event.id,
        update: {color: '#D14343'}
      }));
      toast.success('Te has desapuntado correctamente de la clase');
      onDeleteComplete?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={!!open}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ p: 3 }}>
          <Typography
            align="center"
            gutterBottom
            variant="h5"
          >
            {event
              ? 'Edit Event'
              : 'Add Event'}
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <TextField
            error={Boolean(formik.touched.title && formik.errors.title)}
            fullWidth
            helperText={formik.touched.title && formik.errors.title}
            label="Title"
            name="title"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              error={Boolean(formik.touched.description && formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Description"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={(
                <Switch
                  checked={formik.values.allDay}
                  name="allDay"
                  onChange={formik.handleChange}
                />
              )}
              label="All day"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={(
                <Switch
                  checked={formik.values.recurrent}
                  name="recurrent"
                  onChange={formik.handleChange}
                />
              )}
              label="Periodico"
            />
          </Box>
          {formik.values.recurrent && (
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Lunes')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value={1}
              />
              )}
              label="Lun"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Martes')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value={2}
              />
              )}
              label="Mar"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Miercoles')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="3"
              />
              )}
              label="Mie"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Jueves')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="4"
              />
              )}
              label="Jue"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Viernes')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="5"
              />
              )}
              label="Vie"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Sabado')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="6"
              />
              )}
              label="Sab"
            />
              <FormControlLabel
              control={(
            <Checkbox
              checked={formik.values.weeklyRecurrence?.includes('Domingo')}
              onChange={formik.handleChange}
              name="weeklyRecurrence"
              value="7"
              />
              )}
              label="Dom"
            />
          </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <DateTimePicker
              label="Start date"
              onChange={handleStartDateChange}
              renderInput={(inputProps) => (
                <TextField
                  fullWidth
                  {...inputProps} />
              )}
              value={formik.values.start}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <DateTimePicker
              label="End date"
              onChange={handleEndDateChange}
              renderInput={(inputProps) => (
                <TextField
                  fullWidth
                  {...inputProps} />
              )}
              value={formik.values.end}
            />
          </Box>
          {Boolean(formik.touched.end && formik.errors.end) && (
            <Box sx={{ mt: 2 }}>
              <FormHelperText error>
                {formik.errors.end}
              </FormHelperText>
            </Box>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            p: 2
          }}
        >
          {event && (
            <IconButton onClick={() => handleDelete()}>
              <TrashIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={formik.isSubmitting}
            sx={{ ml: 1 }}
            type="submit"
            variant="contained"
          >
            Confirm
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

CalendarEventDialog.propTypes = {
  event: PropTypes.object,
  onAddComplete: PropTypes.func,
  onClose: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  open: PropTypes.bool,
  range: PropTypes.object
};
