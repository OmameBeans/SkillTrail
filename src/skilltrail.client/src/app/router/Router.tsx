import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout } from "../layout/Layout";
import { AdminPage } from "../../pages/admin";
import { AdminHomePage } from "../../pages/admin-home";
import { AdminTaskPage } from "../../pages/admin-task/ui/AdminTaskPage";
import { AdminUserPage } from "../../pages/admin-user";
import { AdminGroupPage } from "../../pages/admin-group";
import { TraineePage } from "../../pages/trainee/ui/Trainee";
import { TraineeHomePage } from "../../pages/trainee-home";
import { TraineeProgressPage } from "../../pages/trainee-progress";
import { AdminProgressPage } from "../../pages/admin-progress";
import { FeedbackPage } from "../../pages/feedback";

export const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "feedback",
                    element: <FeedbackPage />
                },
                {
                    path: "trainee",
                    element: <TraineePage />,
                    children: [
                        {
                            index: true,
                            element: <TraineeHomePage />
                        },
                        {
                            path: "progress",
                            element: <TraineeProgressPage />
                        }
                    ]
                },
                {
                    path: "admin",
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
                            path: "group",
                            element: <AdminGroupPage />
                        },
                        {
                            path: "progress",
                            element: <AdminProgressPage />
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