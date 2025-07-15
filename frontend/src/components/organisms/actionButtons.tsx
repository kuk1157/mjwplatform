interface ActionButtonProps {
    onBack: () => void;
    onSubmit: () => void;
    submitLabel: string;
}

const ActionButtons = ({
    onBack,
    onSubmit,
    submitLabel,
}: ActionButtonProps) => (
    <div className="flex justify-between items-center mt-12">
        <div>
            <button
                className="px-6 py-3 border border-gray-500 rounded text-gray-500 hover:bg-gray-500 hover:text-white transition"
                onClick={onBack}
            >
                ← 이전
            </button>
        </div>
        <div className="space-x-4">
            <button
                className="px-6 py-3 border border-blue-500 rounded text-blue-500 hover:bg-blue-600 hover:text-white transition"
                onClick={onSubmit}
            >
                {submitLabel}
            </button>
        </div>
    </div>
);

export { ActionButtons };
