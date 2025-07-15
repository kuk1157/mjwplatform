interface DetailActionButtonsProps {
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
    backLabel: string;
    editLabel: string;
    deleteLabel: string;
}

const DetailActionButtons = ({
    onBack,
    onEdit,
    onDelete,
    backLabel,
    editLabel,
    deleteLabel,
}: DetailActionButtonsProps) => (
    <div className="flex justify-between items-center mt-12">
        <div>
            <button
                className="px-6 py-3 border border-gray-500 rounded text-gray-500 hover:bg-gray-500 hover:text-white transition"
                onClick={onBack}
            >
                ← {backLabel}
            </button>
        </div>
        <div className="space-x-4">
            <button
                className="px-6 py-3 border border-blue-500 rounded text-blue-500 hover:bg-blue-600 hover:text-white transition"
                onClick={onEdit}
            >
                {editLabel}
            </button>
            <button
                className="px-6 py-3 border border-red-500 rounded text-red-500 hover:bg-red-600 hover:text-white transition"
                onClick={onDelete}
            >
                {deleteLabel}
            </button>
        </div>
    </div>
);

export { DetailActionButtons };
