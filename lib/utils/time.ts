export function createStartEndDateTimes(
  date: Date,
  startTime: string,
  endTime: string
) {
  // split startTime and endTime strings into hours and minutes
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // create valid Date objects by combining the selected date with the start and end times
  const startDate = date;
  const endDate = date;

  // set the correct hours and minutes for start and end times
  startDate.setHours(startHours, startMinutes, 0, 0);
  endDate.setHours(endHours, endMinutes, 0, 0);

  return {
    startTimeObject: startDate,
    endTimeObject: endDate,
  };
}
