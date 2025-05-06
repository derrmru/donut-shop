type IOSSwitchProps = {
    value: boolean;
    onClick: (value: boolean) => void;
    disabled?: boolean;
    label?: string;
};

export function IOSSwitch({ value, onClick, disabled = false, label }: IOSSwitchProps) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) {
            onClick(!value);
        }
    };

    return (
        <div className="flex items-center">
            {label && (
                <label className="mr-2" id="ios-switch-label">
                    {label}
                </label>
            )}
            <div
                role="switch"
                aria-checked={value}
                aria-labelledby={label ? "ios-switch-label" : undefined}
                tabIndex={disabled ? -1 : 0}
                onClick={() => !disabled && onClick(!value)}
                onKeyDown={handleKeyDown}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${disabled ? "bg-gray-500 cursor-not-allowed" : value ? "bg-blue-500" : "bg-gray-300"}`}
            >
                <span
                    className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${value ? "translate-x-6" : "translate-x-0"} ${disabled ? "bg-gray-400" : "bg-white"}`}
                />
            </div>
        </div>
    );
}