import { render } from "@testing-library/react";
import { Theme, ThemeContext } from "../context/ThemeContext";
import { MemoryRouter } from "react-router-dom";

export function customRender(ui: React.ReactElement, { route = "/" }: { route?: string } = {}) {
    return render(ui, {
        wrapper: ({ children }) => (
            <MemoryRouter initialEntries={[route]}>
                <ThemeContext.Provider value={{
                    theme: Theme.Blue,
                    setTheme: () => { },
                    getThemeClasses: () => "bg-blue-900 text-white border-white",
                }}>
                    {children}
                </ThemeContext.Provider>
            </MemoryRouter>
        )
    });
}