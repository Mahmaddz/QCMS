import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Toaster from "../utils/helper/Toaster";
import { resetPassword } from "../services/Auth/resetPassword.service";
import { useNavigate } from "react-router";
import { refreshTokens } from "../services/Auth/refreshToken.service";

const ResetPassword = () => {

    const navigate = useNavigate();
    
    (async () => {
        await refreshTokens()
    })()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const newPassword = data.get("newPassword");
        const currentPassword = data.get("currentPassword");
        const confirmPassword = data.get("confirmPassword");

        if (currentPassword===newPassword || currentPassword===confirmPassword) {
            Toaster(`"Current Password" cannot be the New Password`)
            return;
        }

        if (newPassword !== confirmPassword) {
            Toaster(`"New Password" and "Confirmed Password" must be same`)
            return;
        }

        const response = await resetPassword(newPassword as string, currentPassword as string);
        if (response.success) {
            await refreshTokens()
            navigate("/");
        }
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #4DA8DA 30%, #0077B6 90%)", // Lighter blue gradient
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                width: "100vw",
                height: "100vh",
            }}
        >
            <Box
                sx={{
                    boxShadow: 6,
                    borderRadius: 3,
                    px: 5,
                    py: 6,
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "90%",
                    maxWidth: 480,
                    "@media (max-width: 600px)": {
                        px: 3,
                        py: 4,
                        width: "95%",
                    },
                }}
            >
                <Avatar sx={{ m: "auto", bgcolor: "#0077B6" }}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography
                    component="h1"
                    variant="h5"
                    color="primary"
                    sx={{
                        mt: 1,
                        fontWeight: 500,
                        "@media (max-width: 600px)": {
                            fontSize: "1.6rem",
                        },
                    }}
                >
                    Reset Your Password
                </Typography>

                <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 3, textAlign: "center" }}
                >
                    Enter your new password below
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="currentPassword"
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        variant="outlined"
                        InputLabelProps={{ style: { color: "#666" } }}
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                            borderColor: "#0077B6",
                            },
                        },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="newPassword"
                        label="New Password"
                        name="newPassword"
                        type="password"
                        variant="outlined"
                        InputLabelProps={{ style: { color: "#666" } }}
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                            borderColor: "#0077B6",
                            },
                        },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        variant="outlined"
                        InputLabelProps={{ style: { color: "#666" } }}
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                            borderColor: "#0077B6",
                            },
                        },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        backgroundColor: "#0077B6",
                        "&:hover": {
                            backgroundColor: "#005f8b",
                        },
                        textTransform: "none",
                        fontSize: "1.1rem",
                        "@media (max-width: 600px)": {
                            mt: 2,
                            mb: 1.5,
                            py: 1,
                        },
                        }}
                    >
                        Reset Password
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPassword;
