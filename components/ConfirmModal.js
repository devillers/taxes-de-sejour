'use client';

import { useState } from 'react';

export default function ConfirmModal({ onConfirm, label = 'Supprimer', message = 'Êtes-vous sûr de vouloir supprimer ce logement ?' }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="text-xs text-white bg-red-500 hover:bg-red-700  rounded-3xl w-full px-2 py-1"
      >
        {label}
      </button>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">{message}</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  setShow(false);
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
