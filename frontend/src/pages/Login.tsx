import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Toaster from "../utils/helper/Toaster";
import { useNavigate } from "react-router";
import { login } from "../services/Auth/login.service";
import { useAuth } from "../context/Auth/useAuth";
import { validateEmail } from "../utils/functions/validateEmail";

const theme = createTheme();

export default function SignIn() {

  const navigate = useNavigate();
  const {setUser, setUserRole} = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!validateEmail(data.get('email') as string)) {
      Toaster('Email is not valid', "error");
      return;
    }

    const response = await login(data.get('email') as string, data.get('password') as string);
    
    if (response.success) {
      // STORING TOKENS FOR FUTURE USE
      localStorage.setItem('accessToken', response.tokens?.access.token || "");
      localStorage.setItem('refreshToken', response.tokens?.refresh.token || "");

      // SETTING USER AND ROLE GLOBALLY
      setUserRole(response.user?.roleID || 0);
      setUser(response?.user)

      // NAVIGATE TO THE HOMEPAGE
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    }
    else {
      console.log("ni chla")
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
            boxShadow: 6,
            borderRadius: 3,
            px: 5,
            py: 6,
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%", // Make responsive
            maxWidth: 480,
            "@media (max-width: 600px)": {
              px: 3, // Reduce padding on mobile
              py: 4,
              width: "95%", // Increase width slightly for small screens
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
                fontSize: "1.8rem", // Smaller title for mobile
              },
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Please sign in to your account
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
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
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              checked
              sx={{
                color: "#666",
                mb: 2,
                "@media (max-width: 600px)": {
                  mb: 1,
                },
              }}
            /> */}
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
                  py: 1, // Smaller button height on mobile
                },
              }}
            >
              Sign In
            </Button>
            <Grid
              container
              justifyContent="center"
              sx={{ mt: 2, textAlign: "center" }}
            >
              <Grid item>
                <Typography variant="body2">
                  Don't have an account? {' '}
                  <Link href="/register" sx={{ color: "#4285f4" }}>
                    Register
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="center"
              sx={{ mt: 2, textAlign: "center" }}
            >
              <Grid item>
                <Typography variant="body2">
                  <Link href="/forgot-password" sx={{ color: "#4285f4" }}>
                    Forgot Password ?
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
