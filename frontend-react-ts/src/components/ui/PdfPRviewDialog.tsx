import React, { useRef } from "react";

interface PdfPreviewDialogProps {
  fileUrl: string | null;
  onClose: () => void;
}

const PdfPreviewDialog: React.FC<PdfPreviewDialogProps> = ({ fileUrl, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  React.useEffect(() => {
    if (fileUrl) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [fileUrl]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded p-4 shadow-xl backdrop:bg-black/50 focus:outline-none bg-white w-full max-w-5xl font-nunito"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">PDF Preview</h2>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>

      {fileUrl ? (
        <iframe
          src={fileUrl}
          className="w-full h-[80vh] border rounded"
        />
      ) : (
        <p className="text-gray-600">No file selected</p>
      )}
    </dialog>
  );
};

export default PdfPreviewDialog;
