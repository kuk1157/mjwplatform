const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-80 pointer-events-none">
            <div className="w-[50px] h-[50px] border-[6px] border-t-[#333] border-gray-300 rounded-full animate-spin" />
        </div>
    );
};

export default LoadingSpinner;
