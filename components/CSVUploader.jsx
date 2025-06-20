//app/components/CSVUploader.jsx

'use client';
import { useCallback } from 'react';

export default function CSVUploader({ id, fileName, onFileSelect }) {
  const processFile = useCallback(
    (file) => {
      if (file && file.type === 'text/csv') onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed rounded-md p-8 text-center bg-white"
    >
      <p className="mb-2">
        Glissez un fichier CSV ici ou cliquez pour sélectionner
      </p>
      <input
        id={id}
        type="file"
        accept=".csv,text/csv"
        onChange={handleChange}
        className="hidden"
      />
      <label
        htmlFor={id}
        className="cursor-pointer inline-block px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100"
      >
        Choisir un fichier
      </label>
      {fileName && (
        <p className="mt-2 text-sm text-green-700 font-semibold">
          {fileName}
        </p>
      )}
    </div>
  );
}
