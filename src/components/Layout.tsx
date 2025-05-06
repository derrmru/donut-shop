import { Outlet } from "react-router-dom";
import { Theme, useThemeContext } from "../context/ThemeContext";
import { IOSSwitch } from "./IOSSwitch";
import { Menu } from "./Menu";

type LayoutProps = { isThemeActive?: boolean };

export function Layout({ isThemeActive = true }: LayoutProps) {
    const { theme, setTheme, getThemeClasses } = useThemeContext();

    const effectiveTheme = isThemeActive ? theme : Theme.Blue; // Default to blue if isThemeActive is false
    const isBlueTheme = effectiveTheme === Theme.Blue;
    const themeClasses = getThemeClasses(effectiveTheme);

    return (
        <>
            <nav className={`${themeClasses} color-blue-900 w-full p-8 flex justify-between items-center border-b-1 sticky top-0 z-10`}>
                <Menu theme={effectiveTheme} />
                {
                    isThemeActive && (
                        <IOSSwitch
                            value={isBlueTheme}
                            onClick={(newValue) => setTheme(newValue ? Theme.Blue : Theme.Pink)}
                            label={isBlueTheme ? "Blue Mode" : "Pink Mode"}
                        />
                    )
                }
            </nav>
            <div className={`min-h-screen ${themeClasses}`}>
                <Outlet />
            </div>
        </>
    );
}