import React, { useState } from "react";

interface AddEventDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({ dialogRef }) => {
  const [eventType, setEventType] = useState("Online");

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-6 shadow-xl backdrop:bg-black/50 focus:outline-none bg-white w-full max-w-md font-nunito"
    >
      <h2 className="text-xl font-bold mb-4">Add Event</h2>
      <form className="space-y-4">
        {/* Event Name */}
        <div className="space-y-2">
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Short Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        {/* Type of Event */}
        <div className="space-y-2">
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
            Type of Event
          </label>
          <select
            id="eventType"
            name="eventType"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="Online">Online</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>

        {/* Location Dropdown if Onsite */}
        {eventType === "Onsite" && (
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Choose Location
            </label>
            <select
              id="location"
              name="location"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
              required
            >
              <option value="">Select Location</option>
              <option value="Auditorium">GYM 1</option>
              <option value="Gymnasium">GYM 2</option>
              <option value="Classroom">Classroom main blg</option>
              <option value="Classroom">Classroom BCH</option>
              <option value="Classroom">Cafeteria</option>
              <option value="Classroom">Comlab</option>
              {/* Add more as needed */}
            </select>
          </div>
        )}

        {/* Proposed Date */}
        <div className="space-y-2">
          <label htmlFor="proposedDate" className="block text-sm font-medium text-gray-700">
            Proposed Date
          </label>
          <input
            type="date"
            id="proposedDate"
            name="proposedDate"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
            required
          />
        </div>

        {/* Optional Date */}
        <div className="space-y-2">
          <label htmlFor="optionalDate" className="block text-sm font-medium text-gray-700">
            Optional Date
          </label>
          <input
            type="date"
            id="optionalDate"
            name="optionalDate"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green"
          />
        </div>

        {/* Letter Upload */}
        <div className="space-y-2">
          <label htmlFor="letter" className="block text-sm font-medium text-gray-700">
            Upload Letter (PDF or Word)
          </label>
          <input
            type="file"
            id="letter"
            name="letter"
            accept=".pdf,.doc,.docx"
            className="w-full text-sm"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green rounded hover:bg-green-700 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default AddEventDialog;
