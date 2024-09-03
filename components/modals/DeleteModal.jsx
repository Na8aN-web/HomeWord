
import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-mont font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4 font-mont">Are you sure you want to delete your account? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            className="font-mont py-2 px-4 bg-gray-300 text-black rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="font-mont py-2 px-4 bg-red-600 text-white rounded"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
