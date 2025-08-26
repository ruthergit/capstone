import React from "react";

interface PdfPreviewLinkProps {
  path: string;
  name: string;
  onPreview: (url: string) => void;
}

const PdfPreviewLink: React.FC<PdfPreviewLinkProps> = ({ path, name, onPreview }) => {
  console.log("path from API:", path);

  return (
    <span
      onClick={() => onPreview(path)} 
      className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded cursor-pointer"
    >
      {name}
    </span>
  );
};

export default PdfPreviewLink;
