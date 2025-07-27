import { Outlet } from "react-router-dom";
import styles from "./Layout.module.scss";
import { SnackbarProvider } from "notistack";
import { Header } from "../../shared/ui";

export const Layout = () => {
    return (
        <div className={styles.app}>
            <div className={styles.header} >
                <Header />
            </div>
            <div className={styles.main}>
                <SnackbarProvider>
                    <div className={styles.outlet}>
                        <Outlet />
                    </div>
                </SnackbarProvider>
            </div>
        </div>
    );
}