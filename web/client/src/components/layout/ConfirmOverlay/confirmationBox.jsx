function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;