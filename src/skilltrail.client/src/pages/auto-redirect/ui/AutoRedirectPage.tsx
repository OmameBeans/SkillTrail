import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { role } from "../../../entities/user";
import { useCurrentUser } from "../../../features/current-user";
import { Box } from "@mui/material";

export const AutoRedirectPage = () => {
    const navigate = useNavigate();

    const { currentUser } = useCurrentUser();

    useEffect(() => {
        const r = currentUser.role;
        if (r === role.ADMIN) {
            navigate("/admin");
        } else if (r === role.TRAINEE) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    return (
        <Box sx={{ p: "10px" }}>
            <h1>ページ遷移</h1>
            <p>このページは自動的にリダイレクトされます。</p>
        </Box>
    );
}