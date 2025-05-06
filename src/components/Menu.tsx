import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Theme } from "../context/ThemeContext";

const menuItems = [
    { to: "/", label: "Home" },
    { to: "/list", label: "Shop" },
    { to: "/company/info", label: "About" },
];

export function Menu({ theme }: { theme: Theme }) {
    const [isOpen, setIsOpen] = useState(true);

    const isMediumOrLarger = window.innerWidth >= 640;

    // we could debounce this resize event but for the sake of simplicity we will just use a simple resize event
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    return (
        <div className="relative w-6/12 sm:w-10/12">
            {!isMediumOrLarger && (
                <button
                    className="sm:hidden focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            )}

            {isMediumOrLarger ? (
                <div className={`${theme === Theme.Blue ? "bg-blue-900" : "bg-pink-900"} flex space-x-8 absolute w-8/12 left-0 sm:static bg-transparent z-20`}>
                    {menuItems.map((item) => (
                        <div
                            key={item.to}
                            className="block sm:inline-block w-11/12 sm:w-auto border-none"
                        >
                            <Link
                                to={item.to}
                                className="hover:underline p-2 sm:p-0 block"
                                aria-label={`Navigate to ${item.label}`}
                            >
                                {item.label}
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <AnimatePresence presenceAffectsLayout={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`${theme === Theme.Blue ? "bg-blue-900" : "bg-pink-900"} flex flex-col space-x-4 absolute left-0 sm:static z-20`}
                        >
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={item.to}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="w-full border-b-1 hover:bg-white hover:text-blue-900"
                                >
                                    <Link
                                        to={item.to}
                                        className="p-2 sm:p-0 block"
                                        aria-label={`Navigate to ${item.label}`}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}