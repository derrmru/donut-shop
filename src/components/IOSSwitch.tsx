type IOSSwitchProps = {
    value: boolean;
    onClick: (value: boolean) => void;
    disabled?: boolean;
    label?: string; // New prop to specify the mode label
};

export function IOSSwitch({ value, onClick, disabled = false, label }: IOSSwitchProps) {
    return (
        <div className="flex items-center">
            {label && <span className="mr-2">{label}</span>}
            <div
                onClick={() => !disabled && onClick(!value)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${disabled ? "bg-gray-500 cursor-not-allowed" : value ? "bg-white" : "bg-gray-300"}`}
            >
                <span
                    className={`w-4 h-4 ${disabled ? "bg-black" : "bg-black"} rounded-full shadow-md transform transition-transform duration-300 ${value ? "translate-x-6" : "translate-x-0"}`}
                />
            </div>
        </div>
    );
}