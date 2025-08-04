import Header from "../../components/Header";
import Calendar from "../../components/ui/Calendar";
import { useState, useEffect, useRef } from "react";
import AddEventDialog from "../../components/ui/AddEventDialog";

const SchoolEvents = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);


  const openDialog = () => {
    dialogRef.current?.showModal();
  }
  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <div className="bg-bg w-full">
      <Header title="School Events" />
      <div className="px-6 py-6">
        <div className="max-w-4xl">
          <Calendar
            showAddEventButton
            onAddEvent={openDialog}
          />
        </div>
      </div>
      <AddEventDialog
        dialogRef={dialogRef as React.RefObject<HTMLDialogElement>}
      />
    </div>
  );
};

export default SchoolEvents;
