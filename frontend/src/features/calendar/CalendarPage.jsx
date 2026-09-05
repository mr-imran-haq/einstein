import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { getEvents, createEvent, deleteEvent } from "../../api/events";
import { getDaysInMonth, getLocalDateString } from "../../utils/date";
import Card from "../../components/Card";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(today));
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("12:00");

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const days = getDaysInMonth(viewYear, viewMonth);

  function eventsOnDate(dateStr) {
    return events.filter((e) => e.event_datetime.startsWith(dateStr));
  }

  function changeMonth(delta) {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({
      title,
      event_datetime: `${selectedDate}T${time}:00`,
    });
    setTitle("");
  }

  const selectedEvents = eventsOnDate(selectedDate);

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="font-display text-xl text-ink">Calendar</h2>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="text-muted hover:text-ink">
            <ChevronLeft size={18} />
          </button>
          <p className="font-medium text-ink">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </p>
          <button onClick={() => changeMonth(1)} className="text-muted hover:text-ink">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (day === null) return <div key={i} />;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasEvents = eventsOnDate(dateStr).length > 0;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square rounded-md text-sm flex flex-col items-center justify-center relative ${
                  isSelected ? "bg-accent text-white" : "hover:bg-black/5 text-ink"
                }`}
              >
                {day}
                {hasEvents && (
                  <span
                    className={`w-1 h-1 rounded-full absolute bottom-1 ${
                      isSelected ? "bg-white" : "bg-accent"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title={`Events on ${selectedDate}`}>
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-border rounded-md px-2 py-2 text-sm"
          />
          <button type="submit" className="bg-accent text-white rounded-md px-3 py-2 text-sm">
            <Plus size={16} />
          </button>
        </form>

        {selectedEvents.length === 0 ? (
          <p className="text-sm text-muted">No events on this date.</p>
        ) : (
          <ul className="space-y-2">
            {selectedEvents.map((event) => (
              <li key={event.id} className="flex items-center justify-between text-sm">
                <span className="text-ink">
                  {event.event_datetime.split("T")[1]?.slice(0, 5)} — {event.title}
                </span>
                <button
                  onClick={() => deleteMutation.mutate(event.id)}
                  className="text-muted hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}