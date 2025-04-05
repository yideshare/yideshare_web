export function createStartEndDateTimes(
  date: Date,
  startTime: string,
  endTime: string
) {
  
  console.log("FIRST INPUT")
  console.log(startTime, endTime)
  // split startTime and endTime strings into hours and minutes
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  console.log("INPUT")
  console.log(startHours, startMinutes)
  console.log(endHours, endMinutes)

  // create valid Date objects by combining the selected date with the start and end times
  const startDate = new Date(date);
  const endDate = new Date(date);

  // set the correct hours and minutes for start and end times
  startDate.setHours(startHours, startMinutes, 0, 0);
  endDate.setHours(endHours, endMinutes, 0, 0);

  console.log("RETURNING")
  console.log(startDate)
  console.log(endDate)

  return {
    startTimeObject: startDate,
    endTimeObject: endDate,
  };
}
