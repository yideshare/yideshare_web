import { format } from "date-fns";
import { DayPicker } from "react-day-picker";

interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  mounted: boolean;
}

export default function DatePicker({
  date,
  setDate,
  showCalendar,
  setShowCalendar,
  mounted,
}: DatePickerProps) {
  return (
    <div className="flex flex-col relative">
      <label className="block text-sm font-medium">Date</label>
      {mounted ? (
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="border rounded-md p-2 w-full text-sm bg-muted/50 text-foreground"
        >
          {date ? format(date, "yyyy-MM-dd") : "Select a date"}
        </button>
      ) : (
        <div className="border rounded-md p-2 w-full text-sm bg-muted/50 text-foreground">
          Loading...
        </div>
      )}
      {showCalendar && mounted && (
        <div className="absolute z-10 bg-white p-2 shadow-lg rounded-md">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
              }
              setShowCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
