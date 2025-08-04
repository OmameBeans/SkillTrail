import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "../layout/Layout";
import { AutoRedirectPage } from "../../pages/auto-redirect";
import { AdminPage } from "../../pages/admin";
import { AdminHomePage } from "../../pages/admin-home";
import { AdminTaskPage } from "../../pages/admin-task/ui/AdminTaskPage";
import { AdminUserPage } from "../../pages/admin-user";
import { EvaluationPage } from "../../pages/evaluation";

export const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <AutoRedirectPage />
                },
                {
                    path: "/admin",
                    element: <AdminPage />,
                    children: [
                        {
                            index: true,
                            element: <AdminHomePage />
                        },
                        {
                            path: "task",
                            element: <AdminTaskPage />
                        },
                        {
                            path: "user",
                            element: <AdminUserPage />
                        },
                        {
                            path: "evaluation/:userId",
                            element: <EvaluationPage />
                        }
                    ]
                }
            ]
        }
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}