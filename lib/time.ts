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

  let endDateTime = DateTime.fromFormat(
    `${dateStr} ${endTime}`,
    'yyyy-MM-dd h:mm a',
    { zone: timeZone }
  );

  // if end time is earlier than start time then ride goes into the next day
  if (endDateTime < startDateTime) {
    endDateTime = endDateTime.plus({ days: 1 });
  }

  return {
    startTimeObject: startDateTime.toJSDate(), 
    endTimeObject: endDateTime.toJSDate(),
  };
}

// helper function to determine if a time would go to the next day for a start time
export function isNextDay(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false;
  
  const timeZone = 'America/New_York';
  const baseDate = '2024-01-01'; // arbitrary using this date for comparison
  
  const startDateTime = DateTime.fromFormat(
    `${baseDate} ${startTime}`,
    'yyyy-MM-dd h:mm a',
    { zone: timeZone }
  );

  const endDateTime = DateTime.fromFormat(
    `${baseDate} ${endTime}`,
    'yyyy-MM-dd h:mm a',
    { zone: timeZone }
  );

  return endDateTime < startDateTime;
}

export function encodeDate(date: Date): string {
  return date.toISOString();
}

export function decodeDate(dateString: string): Date {
  const parsed = new Date(dateString);
  return parsed;
}