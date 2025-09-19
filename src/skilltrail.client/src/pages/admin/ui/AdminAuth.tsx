import { useLayoutEffect, useState, type PropsWithChildren } from "react";
import { useCurrentUser } from "../../../features/current-user";
import { role } from "../../../entities/user";

export const AdminAuth = (props: PropsWithChildren) => {
    const { children } = props;
    const { currentUser } = useCurrentUser();
    const [isAdmin, setIsAdmin] = useState(false);

    useLayoutEffect(() => {

        if (currentUser.role === role.ADMIN) setIsAdmin(true);

        if (currentUser.role !== role.ADMIN) {
            setIsAdmin(false);
            throw new Error("管理者権限がありません");
        }
    }, []);

    if (!isAdmin) return <></>;
    else return (
        <>{children}</>
    );
}