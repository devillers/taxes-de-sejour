//app/components/CSVUploader.jsx

'use client';
import { useState } from 'react';

export default function CSVUploader({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const processFile = (file) => {
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${
        dragActive ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      <p className="mb-2">Glissez un fichier CSV ici ou cliquez pour sélectionner</p>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleChange}
        id="csv-input"
        className="hidden"
      />
      <label htmlFor="csv-input" className="cursor-pointer inline-block px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100">
        Choisir un fichier
      </label>
      {fileName && <p className="mt-2 text-sm">{fileName}</p>}
    </div>
  );
}
