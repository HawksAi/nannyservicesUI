import { calendarApi } from '../__fake-api__/customercalendar-api';
import { slice } from '../slices/calendar';

export const getEvents = () => async (dispatch) => {
  const response = await calendarApi.getEvents();

  dispatch(slice.actions.getEvents(response));
};

export const createEvent = (params) => async (dispatch) => {
  const response = await calendarApi.createEvent(params);

  dispatch(slice.actions.createEvent(response));
};
export const createRecurrentEvent = (params) => async (dispatch) => {
  const response = await calendarApi.createRecurrentEvent(params);

  dispatch(slice.actions.createRecurrentEvent(response));
};

export const updateEvent = (params) => async (dispatch) => {
  const response = await calendarApi.updateEvent(params);

  dispatch(slice.actions.updateEvent(response));
};
export const getEvent = (params) => async (dispatch) => {
  const response = await calendarApi.getEvent(params);

  dispatch(slice.actions.getEvent(response));
};

export const deleteEvent = (params) => async (dispatch) => {
  await calendarApi.deleteEvent(params);

  dispatch(slice.actions.deleteEvent(params.eventId));
};
