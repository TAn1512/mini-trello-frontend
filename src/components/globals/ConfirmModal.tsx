export default function ConfirmModal({ title, message, confirmLabel, cancelLabel = "Cancel", confirmColor = "bg-red-600 hover:bg-red-500", onConfirm, onCancel }: any) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />
            <div className="relative bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 text-white">
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <p className="text-sm text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm">
                        {cancelLabel}
                    </button>
                    <button onClick={onConfirm} className={`px-4 py-2 rounded text-sm ${confirmColor}`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}