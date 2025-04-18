import { DateTime } from 'luxon';

export function createStartEndDateTimes(
  date: Date,
  startTime: string,
  endTime: string
) {
  const timeZone = 'America/New_York';

  const dateStr = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd'); 
  const startDateTime = DateTime.fromFormat(
    `${dateStr} ${startTime}`,
    'yyyy-MM-dd h:mm a',
    { zone: timeZone }
  );

  const endDateTime = DateTime.fromFormat(
    `${dateStr} ${endTime}`,
    'yyyy-MM-dd h:mm a',
    { zone: timeZone }
  );

  return {
    startTimeObject: startDateTime.toJSDate(), // native JS Date in correct UTC time
    endTimeObject: endDateTime.toJSDate(),
  };
}