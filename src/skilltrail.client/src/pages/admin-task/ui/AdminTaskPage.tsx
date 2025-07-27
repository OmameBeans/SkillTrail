import { Box, CircularProgress } from "@mui/material";
import { Suspense } from "react";
import Split from "react-split";
import "./AdminTaskPage.css";
import { TaskCategoryEditTree } from "../../../features/task-category-edit-tree";
import { TaskEditList } from "../../../features/task";

export const AdminTaskPage = () => {
    return (
        <Box sx={{
            height: "100%",
            width: "100%",
        }}>
            <Split
                sizes={[30, 70]}
                minSize={200}
                expandToMin={false}
                gutterSize={3}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
                style={{
                    display: "flex",
                    height: "100%",
                }}
            >
                <Box
                    className="task-category-edit-tree"
                    sx={{
                        borderRight: "1px solid var(--var-border-color)",
                        height: "100%",
                        overflow: "auto",
                    }}>
                    <Suspense fallback={
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    }>
                        <TaskCategoryEditTree />
                    </Suspense>
                </Box>
                <Box sx={{
                    height: "100%",
                    overflow: "auto",
                }}>
                    <Suspense fallback={
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    }>
                        <TaskEditList />
                    </Suspense>
                </Box>
            </Split>
        </Box>
    );
}