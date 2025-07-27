import type { PropsWithChildren } from "react";
import { useCurrentUser } from "../../../entities/user";
import { CurrentUserContext } from "../model/CurrentUserContext";

export const CurrentUserProvider = (props: PropsWithChildren) => {

    const { data: currentUser } = useCurrentUser();

    return (
        <CurrentUserContext value={{ currentUser: currentUser }}>
            {props.children}
        </CurrentUserContext>
    );
}