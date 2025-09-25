import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import clsx from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar } from "lucide-react";
import {
  type Event as EventType,
  getApprovedEvents,
} from "../../services/event";
import PdfPreviewLink from "./PdfPreviewLink";
import PdfPreviewDialog from "../../components/ui/PdfPRviewDialog";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarProps {
  showAddEventButton?: boolean;
  onAddEvent?: () => void;
  triggerLabel?: string;
  showApprovals?: boolean; 
  showFiles?: boolean;     
}

const CalendarDialog: React.FC<CalendarProps> = ({
  showAddEventButton = false,
  onAddEvent,
  triggerLabel = "Events Calendar",
  showApprovals = true, 
  showFiles = true,    
}) => {
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.startOf("week");
  const endDay = endOfMonth.endOf("week");
  const today = dayjs();

  useEffect(() => {
    if (open) {
      getApprovedEvents().then((data) => {
        setEvents(data);
      });
    }
  }, [open]);

  const generateCalendar = () => {
    const calendar: Dayjs[][] = [];
    let date = startDay;

    while (date.isBefore(endDay, "day") || date.isSame(endDay, "day")) {
      const week: Dayjs[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(date);
        date = date.add(1, "day");
      }
      calendar.push(week);
    }
    return calendar;
  };

  const calendar = generateCalendar();
  const goToPreviousMonth = () =>
    setCurrentDate(currentDate.subtract(1, "month"));
  const goToNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  // ✅ Helper to check if an event falls on a date
  const getEventsForDate = (date: Dayjs) => {
    return events.filter((event) =>
      dayjs(event.final_date ?? event.proposed_date).isSame(date, "day")
    );
  };

  const backendUrl = "http://127.0.0.1:8000";
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <>
      {/* Main Calendar Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="flex px-2 py-1 mr-2 text-xs font-semibold rounded focus:outline-none text-green-700 bg-green-100 hover:bg-green-200 items-center cursor-pointer">
            <Calendar className="h-5 mr-1 mb-0.5" size={15} />
            <p className="text-sm">{triggerLabel}</p>
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />

          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
            <Dialog.Title className="mb-4 text-2xl font-bold">
              Events Calendar
            </Dialog.Title>

            <div className="w-full rounded font-nunito">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={goToPreviousMonth}
                  className="text-base px-3 py-1 rounded bg-green-100 text-green hover:bg-green-200 transition"
                >
                  ← Prev
                </button>
                <h2 className="text-2xl font-bold">
                  {currentDate.format("MMMM YYYY")}
                </h2>
                <button
                  onClick={goToNextMonth}
                  className="text-base px-3 py-1 rounded bg-green-100 text-green hover:bg-green-200 transition"
                >
                  Next →
                </button>
              </div>

              {showAddEventButton && (
                <div className="mb-3 text-right">
                  <button
                    onClick={() => onAddEvent?.()}
                    className="bg-green text-white px-3 py-1 rounded hover:bg-green-600 transition outline-none"
                  >
                    + Add Event
                  </button>
                </div>
              )}

              {/* Days of Week */}
              <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-lg">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 text-center">
                {calendar.map((week, wi) =>
                  week.map((date, di) => {
                    const isToday = date.isSame(today, "day");
                    const isCurrentMonth = date.month() === currentDate.month();
                    const dayEvents = getEventsForDate(date);

                    return (
                      <div
                        key={`${wi}-${di}`}
                        className={clsx(
                          "h-[90px] p-1 flex flex-col items-start text-left border border-gray-200 transition-all overflow-hidden",
                          isToday && "bg-green-100 text-green-900 font-bold",
                          !isCurrentMonth && "text-gray-400 bg-gray-50",
                          isCurrentMonth &&
                            !isToday &&
                            "text-gray-800 bg-white hover:bg-green-50"
                        )}
                      >
                        <div className="font-bold text-sm mb-1">
                          {date.date()}
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                          {dayEvents.map((ev) => (
                            <button
                              key={ev.id}
                              className="text-xs truncate rounded px-1 py-0.5 bg-green-500 text-white cursor-pointer hover:bg-green-600"
                              title={ev.short_description}
                              onClick={() => setSelectedEvent(ev)}
                            >
                              {ev.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <Dialog.Close asChild>
              <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
                ✕
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ✅ Event Details Modal using Radix */}
      <Dialog.Root
        open={!!selectedEvent}
        onOpenChange={(o) => !o && setSelectedEvent(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none">
            {selectedEvent && (
              <>
                <Dialog.Title className="text-xl font-bold mb-2">
                  {selectedEvent.name}
                </Dialog.Title>
                <p className="text-gray-600 mb-4">
                  {selectedEvent.short_description}
                </p>

                <div className="space-y-3">
                  <div>
                    <p>Org: {selectedEvent.student_org?.name}</p>
                    <p>
                      Event Date:{" "}
                      {dayjs(selectedEvent.final_date).format("MMM D, YYYY")}
                    </p>
                    <p>Event Type: {selectedEvent.type}</p>
                    <p>Event Location: {selectedEvent.location ?? "NA"}</p>
                  </div>

                  {/* ✅ Conditionally render Approvals */}
                  {showApprovals && (
                    <div>
                      <h3 className="font-semibold">Approvals</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedEvent.approvals?.map((ap) => (
                          <li key={ap.id}>
                            <span className="font-medium">{ap.role}</span> –{" "}
                            {ap.status} by {ap.approver.name}
                            {ap.remarks && (
                              <span className="italic text-gray-500">
                                {" "}
                                (“{ap.remarks}”)
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ✅ Conditionally render Files */}
                  {showFiles && (
                    <div>
                      <h3 className="font-semibold">Files</h3>
                      {selectedEvent.files?.map((file) => (
                        <PdfPreviewLink
                          key={file.id}
                          path={`${backendUrl}/storage/${file.file_path}`}
                          name={file.original_name}
                          onPreview={(url) => setPreviewUrl(url)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <Dialog.Close asChild>
                  <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-800">
                    ✕
                  </button>
                </Dialog.Close>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
        <PdfPreviewDialog
          fileUrl={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      </Dialog.Root>
    </>
  );
};

export default CalendarDialog;
