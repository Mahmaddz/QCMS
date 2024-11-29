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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false); // Step 1: Add loading state

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            Toaster('Email is not valid', "error");
            return;
        }

        if (password !== confirmPassword) {
            Toaster("Password & Confirmed-Password must be same")
            return;
        }

        setLoading(true);
        const res = await registerUser(email, password, confirmPassword);

        if (res?.isError) {
            setLoading(false);
            return;
        }
        
        if (res.success) {
            setLoading(false);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
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
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputLabelProps={{
                            style: { color: "#666" },
                        }}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputLabelProps={{
                            style: { color: "#666" },
                        }}
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputLabelProps={{
                            style: { color: "#666" },
                        }}
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
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            backgroundColor: "#4285f4",
                            "&:hover": {
                                backgroundColor: "#2c6adf",
                            },
                            textTransform: "none",
                            fontSize: "1.1rem",
                            position: "relative", // Add position relative
                            "@media (max-width: 600px)": {
                                mt: 2,
                                mb: 1.5,
                                py: 1,
                            },
                        }}
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ position: "absolute", color: "#fff" }} /> // Loader
                        ) : (
                            "Register"
                        )}
                    </Button>
                    <Grid
                        container
                        justifyContent="center"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        <Grid item>
                            <Typography variant="body2">
                                Already have an account? {' '}
                                <Link href="/login" sx={{ color: "#4285f4" }}>
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
