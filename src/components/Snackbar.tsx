import { AnimatePresence, motion } from "framer-motion";
import { useThemeContext } from "../context/ThemeContext";

export function Snackbar({ message, open = false, onClose, closeMessage = "Close" }: { message: string; open: boolean; onClose: () => void; closeMessage: string }) {
    const { theme, getThemeClasses } = useThemeContext();

    const themeClasses = getThemeClasses(theme);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className={`${themeClasses} border fixed z-40 bottom-4 left-4 px-4 py-2 rounded shadow-lg max-w-11/12 grid grid-cols-[1fr_auto] items-center gap-4`}
                >
                    <span>{message}</span>
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">
                        {closeMessage}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}