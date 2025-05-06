import { createBrowserRouter, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { List } from "../pages/List";
import { CompanyInfo } from "../pages/CompanyInfo";
import { Layout } from "../components/Layout";

export function useRouter() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "",
                    element: <Home />
                },
                {
                    path: "list",
                    element: <List />
                }
            ]
        },
        {
            path: "company/*",
            element: <Layout isThemeActive={false} />,
            children: [
                {
                    path: "info",
                    element: <CompanyInfo />
                },
                {
                    path: "*",
                    element: <Navigate to="/company/info" />
                }
            ]
        },
        {
            path: "*",
            element: <Navigate to="/" />
        }
    ]);

    return router;
}