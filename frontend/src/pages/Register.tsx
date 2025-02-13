import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import { registerUser } from "../services/Auth/register.service";
import Toaster from "../utils/helper/Toaster";
import { validateEmail } from "../utils/functions/validateEmail";

export default function Register() {
    const [userData, setUserData] = useState<{email: string, password: string; confirmPassword: string; username: string}>({email: "", password: "", confirmPassword: "", username: ""});
    const [loading, setLoading] = useState(false); 
    
    const handleSetUserData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!(userData.confirmPassword && userData.email && userData.password && userData.username)) {
            Toaster('Empty Fields Detected', "error");
            return;
        }

        if (!validateEmail(userData.email)) {
            Toaster('Email is not valid', "error");
            return;
        }

        if (userData?.password !== userData?.confirmPassword) {
            Toaster("Password & Confirmed-Password must be same")
            return;
        }

        setLoading(true);
        const res = await registerUser(userData.email, userData.password, userData.confirmPassword, userData.username);

        if (res?.isError) {
            setLoading(false);
            return;
        }
        
        if (res.success) {
            setLoading(false);
            setUserData({email: "", password: "", confirmPassword: "", username: ""});
        }
    };

    return (
        <Container
            component="main"
            maxWidth={false}
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #1a73e8 30%, #4285f4 90%)", // Blue background
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
                <Typography
                    component="h1"
                    variant="h4"
                    color="primary"
                    gutterBottom
                    sx={{
                        "@media (max-width: 600px)": {
                            fontSize: "1.8rem",
                        },
                    }}
                >
                    Create an Account
                </Typography>
                <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ mb: 3, textAlign: "center" }}
                >
                    Please fill in the details to register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        variant="outlined"
                        value={userData.username}
                        onChange={handleSetUserData}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                    borderColor: "#4285f4",
                                },
                            },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        variant="outlined"
                        value={userData.email}
                        onChange={handleSetUserData}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                    borderColor: "#4285f4",
                                },
                            },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        value={userData.password}
                        onChange={handleSetUserData}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                    borderColor: "#4285f4",
                                },
                            },
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        variant="outlined"
                        value={userData.confirmPassword}
                        onChange={handleSetUserData}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": {
                                    borderColor: "#4285f4",
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
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
                        {loading ? <CircularProgress size={24} sx={{ ml: 2 }} /> : "Register"}
                    </Button>
                    <Grid
                        container
                        justifyContent="center"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        <Grid item>
                            <Typography variant="body2">
                                Already have an account? {' '}
                                <Link href={loading ? "#" : "/login"} sx={{ color: loading ? "gray" : "#4285f4" }}>
                                    Sign in
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
