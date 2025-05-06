import { createContext, useState, useEffect, useContext } from "react";
import type { Nullable } from "../common/utils";

export enum Theme {
    Pink = "pink",
    Blue = "blue",
}

type ThemeType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    getThemeClasses: (theme: Theme) => string;
};

export const ThemeContext = createContext<ThemeType>({
    theme: Theme.Blue,
    setTheme: () => { },
    getThemeClasses: () => "",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check local storage or fallback to system preference
        const savedTheme = localStorage.getItem("theme") as Nullable<Theme>;
        if (savedTheme) return savedTheme;
        return window.matchMedia("(prefers-color-scheme: blue)").matches
            ? Theme.Blue
            : Theme.Pink;
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
        const root = document.documentElement;
        root.classList.remove(...Object.values(Theme));
        root.classList.add(theme);
    }, [theme]);

    const getThemeClasses = (theme: Theme) => {
        switch (theme) {
            case Theme.Blue:
                return "bg-blue-900 text-white border-white";
            case Theme.Pink:
                return "bg-pink-900 text-black border-black";
            default:
                return "";
        }
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, getThemeClasses }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}