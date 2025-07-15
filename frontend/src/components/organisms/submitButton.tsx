import { useNavigate } from "react-router-dom";

interface SubmitButtonProps {
    label: string;
    path: string;
}

const SubmitButton = ({ label, path }: SubmitButtonProps) => {
    const navigate = useNavigate();

    return (
        <div className="w-80">
            <button
                className="px-4 h-9 bg-[#21A089] text-[#fff] rounded-[5px]"
                onClick={() => navigate(path)}
            >
                {label}
            </button>
        </div>
    );
};

export { SubmitButton };
