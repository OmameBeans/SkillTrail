import { CurrentUserProvider } from "../../features/current-user";
import { Router } from "../router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
        },
    },
});

export const App = () => {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <CurrentUserProvider>
                    <Router />
                </CurrentUserProvider>
            </QueryClientProvider>
        </>
    );
}