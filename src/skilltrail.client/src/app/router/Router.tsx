import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "../layout/Layout";
import { AutoRedirectPage } from "../../pages/auto-redirect";
import { AdminPage } from "../../pages/admin";
import { AdminTrainingsPage } from "../../pages/admin-training";
import { AdminPhasePage } from "../../pages/admin-phase";
import { AdminTaskPage } from "../../pages/admin-task/ui/AdminTaskPage";

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
                            path: "trainings",
                            element: <AdminTrainingsPage />
                        },
                        {
                            path: "phase",
                            element: <AdminPhasePage />
                        },
                        {
                            path: "task",
                            element: <AdminTaskPage />
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