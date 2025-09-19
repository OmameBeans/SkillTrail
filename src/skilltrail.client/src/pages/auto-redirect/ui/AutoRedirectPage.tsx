import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { role } from "../../../entities/user";
import { useCurrentUser } from "../../../features/current-user";

export const AutoRedirectPage = () => {
    const navigate = useNavigate();

    const { currentUser } = useCurrentUser();

    useEffect(() => {
        const r = currentUser.role;
        if (r === role.TRAINEE) {
            navigate("/trainee");
        }
    }, [currentUser, navigate]);

    return (
        <></>
    );
}