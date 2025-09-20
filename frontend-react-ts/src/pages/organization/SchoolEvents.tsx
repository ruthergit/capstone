import Header from "../../components/Header";
import ViewEventDialog from "../../components/ui/ViewEventDialog";
import {
  getMyEvents,
  createEvent as createEventService,
  type Event,
} from "../../services/event";
import { useRef, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DraggableCarousel from "../../components/DraggableCarousel";
import AddEventDialog from "../../components/ui/AddEventDialog";

const SchoolEvents = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [myEvents, setMyEvents] = useState<any[]>([]);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const openDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setSelectedEvent(null);
    setIsDetailsOpen(false);
  };

  const fetchMyEvents = async () => {
    try {
      const res = await getMyEvents();
      setMyEvents(res);
      console.log(res);
    } catch (err) {
      console.error("Error fetching myEvents:", err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const createEvent = async (formData: FormData) => {
    try {
      await createEventService(formData); // call backend
      await fetchMyEvents(); // refresh events list
      dialogRef.current?.close(); // close modal
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // Handle event update callback
  const handleEventUpdated = (updatedEvent: Event) => {
    console.log("Handling event update:", updatedEvent);

    // Update the event in your myEvents array
    setMyEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );

    // Also update the selectedEvent if it's currently being viewed
    if (selectedEvent && selectedEvent.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent);
    }
  };

  return (
    <div className="bg-bg w-full font-nunito overflow-x-hidden">
      <Header title="School Events" />

      <div className="px-6 py-3 flex justify-between items-start h-[calc(100vh-60px)] overflow-hidden">
        <div className="flex flex-col gap-3 w-full h-full min-h-0">
          {/* Pending Events */}
          <div className="bg-white shadow-md rounded h-1/2 p-6 flex flex-col w-full max-w-full overflow-hidden">
            <div className="flex justify-between mb-3">
              <h1 className="font-semibold">Pending Events</h1>
              <button
                className="flex px-2 py-1 mr-2 text-xs font-semibold rounded focus:outline-none text-green-700 bg-green-100 hover:bg-green-200 items-center cursor-pointer"
                onClick={openDialog}
              >
                <Plus className="w-4 h-5 mr-1 mb-0.5" />
                Add Event
              </button>
            </div>

            <DraggableCarousel>
              {myEvents.map((event) => (
                <div
                  key={event.id}
                  className="card w-72 flex-shrink-0 bg-green-50 rounded shadow p-4 flex flex-col h-56"
                >
                  <h2 className="font-semibold text-base">{event.name}</h2>
                  <p className="text-base text-gray-600 mb-2">
                    {event.short_description}
                  </p>

                  <div className="text-sm text-gray-900 flex-1 space-y-0.5">
                    <p>
                      <span className="font-medium">Type:</span> {event.type}
                    </p>
                    {event.location && (
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {event.location}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {event.final_date || event.proposed_date}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`${
                          event.status === "approved"
                            ? "text-green-600"
                            : event.status === "pending"
                            ? "text-yellow-600"
                            : event.status === "rejected"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {event.status}
                      </span>
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => openDetails(event)}
                      className="text-center rounded focus:outline-none text-green-700 bg-green-100 hover:bg-green-200 w-full cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </DraggableCarousel>
          </div>

          {/* Approved Events */}
          <div className="bg-white shadow-md rounded h-1/2 p-6 overflow-hidden">
            <h1>Approved Events</h1>
          </div>
        </div>
      </div>

      <AddEventDialog
        dialogRef={dialogRef as React.RefObject<HTMLDialogElement>}
        onSubmit={createEvent}
      />
      <ViewEventDialog
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default SchoolEvents;
