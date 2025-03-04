import React, { useState } from "react";
import { Fab, Menu, MenuItem, Checkbox, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface CheckboxMenuProps {
    checkedItems: { [key: string]: boolean };
    setCheckedItems: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const CheckboxMenu: React.FC<CheckboxMenuProps> = ({ checkedItems, setCheckedItems }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToggle = (option: string) => {
        setCheckedItems((prev) => ({
        ...prev,
        [option]: !prev[option],
        }));
    };

    return (
        <>
        <Fab
            color="primary"
            size="small"
            sx={{
                position: "fixed",
                bottom: 100,
                right: 50,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease",
                "&:hover": {
                    transform: "scale(1.1)",
                },
            }}
            onClick={handleClick}
        >
            <MoreVertIcon />
        </Fab>

        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
        >
            {Object.keys(checkedItems).map((option) => (
                <MenuItem key={option} onClick={() => handleToggle(option)}>
                    <Checkbox checked={checkedItems[option]} />
                    <ListItemText primary={option} />
                </MenuItem>
            ))}
        </Menu>
        </>
    );
};

export default CheckboxMenu;
