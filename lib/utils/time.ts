export function createStartEndDateTimes(
  date: Date,
  startTime: string,
  endTime: string
) {
  // split startTime and endTime strings into hours and minutes
  const { hours: startHours, minutes: startMinutes } = americanStringToMilitaryNumbers(startTime)
  const { hours: endHours, minutes: endMinutes } = americanStringToMilitaryNumbers(endTime)

  // create valid Date objects by combining the selected date with the start and end times
  const startDate = new Date(date);
  const endDate = new Date(date);

  // set the correct hours and minutes for start and end times
  startDate.setHours(startHours, startMinutes, 0, 0);
  endDate.setHours(endHours, endMinutes, 0, 0);

  return {
    startTimeObject: startDate,
    endTimeObject: endDate,
  };
}

function americanStringToMilitaryNumbers(timeString: string) {
  const [timePart, period] = timeString.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return {
    hours,
    minutes,
  };
}
