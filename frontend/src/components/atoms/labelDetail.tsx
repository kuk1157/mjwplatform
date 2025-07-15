// components/atoms/labelDetail.tsx
interface LabelDetailProps {
    label: string;
    value?: string | number;
    editable?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    type?: string;
    readOnly?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

// 상세보기 데이터 영역
export function LabelDetail({
    label,
    value,
    editable = false,
    onChange,
    name,
    type = "text",
}: LabelDetailProps) {
    return (
        <div className="flex items-center text-base text-gray-700 space-x-4">
            <label className="w-32 font-semibold">{label}:</label>
            {editable ? (
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className="border border-gray-300 rounded px-3 py-1 w-full max-w-sm"
                />
            ) : (
                <span>{value || "-"}</span>
            )}
        </div>
    );
}
