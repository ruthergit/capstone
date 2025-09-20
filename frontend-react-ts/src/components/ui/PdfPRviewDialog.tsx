import React from "react";
import { X } from "lucide-react";

interface FilePreviewDialogProps {
  fileUrl: string | null;
  onClose: () => void;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ fileUrl, onClose }) => {
  if (!fileUrl) return null;

  const ext = fileUrl.split(".").pop()?.toLowerCase();

  const isPdf = ext === "pdf";
  const isImage = ["png", "jpg", "jpeg", "gif"].includes(ext || "");
  const isOffice = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext || "");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] h-[90%] relative">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="w-full h-full flex items-center justify-center p-4">
          {isPdf && (
            <iframe
              src={fileUrl}
              className="w-full h-full rounded"
              title="PDF Preview"
            />
          )}

          {isImage && (
            <img src={fileUrl} alt="Preview" className="max-h-full max-w-full rounded" />
          )}

          {isOffice && (
            <a
              href={fileUrl}
              download
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Download File
            </a>
          )}

          {!isPdf && !isImage && !isOffice && (
            <a
              href={fileUrl}
              download
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              Download File
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewDialog;
