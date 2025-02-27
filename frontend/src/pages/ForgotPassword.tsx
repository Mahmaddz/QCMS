import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { validateEmail } from "../utils/functions/validateEmail";
import Toaster from "../utils/helper/Toaster";
import { CircularProgress } from "@mui/material";

const ForgotPassword = () => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const data = new FormData(e.currentTarget);
        const email = data.get("email") as string;

        if (email.trim().length===0) {
            Toaster('Email field must not be empty', 'error');
            return;
        }

        if (!validateEmail(email)) {
            Toaster('Email is not valid', "error");
            return;
        }

        console.log("email =>", email);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <Container
            component="main"
            maxWidth={false}
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #00B4DB 30%, #0083B0 90%)",
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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "90%",
                    maxWidth: 480,
                    boxShadow: 6,
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    px: 5,
                    py: 6,
                    "@media (max-width: 600px)": {
                        px: 3,
                        py: 4,
                        width: "95%",
                    },
                }}
            >
                <Avatar
                sx={{
                    m: "auto",
                    bgcolor: "primary.main",
                    width: 56,
                    height: 56,
                }}
                >
                    <LockOutlinedIcon />
                </Avatar>

                <Typography
                    component="h1"
                    variant="h4"
                    color="primary"
                    gutterBottom
                    sx={{
                        mt: 2,
                        "@media (max-width: 600px)": {
                        fontSize: "1.8rem",
                        },
                    }}
                >
                    Forgot Password
                </Typography>

                <Typography variant="body1" color="textSecondary" sx={{ mb: 3, textAlign: "center" }}>
                    Enter your email to reset your password
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        variant="outlined"
                        InputLabelProps={{
                            style: { color: "#666" },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                borderColor: "#0083B0",
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
                            backgroundColor: "#0083B0",
                            "&:hover": {
                                backgroundColor: "#005f6b",
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
                        {isLoading ? <CircularProgress size={24} sx={{ ml: 2, color: 'white' }} /> : "Send Reset Password"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ForgotPassword;
