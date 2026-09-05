import {
  useState,
} from "react";

import LockOutlinedIcon from
  "@mui/icons-material/LockOutlined";

import Avatar from
  "@mui/material/Avatar";

import Box from
  "@mui/material/Box";

import Button from
  "@mui/material/Button";

import Container from
  "@mui/material/Container";

import CssBaseline from
  "@mui/material/CssBaseline";

import Link from
  "@mui/material/Link";

import TextField from
  "@mui/material/TextField";

import Typography from
  "@mui/material/Typography";

import {
  useNavigate,
} from "react-router-dom";

import {
  config,
} from "../../../config";

import {
  useApi,
} from "../../../utils/api";

export default function SignIn() {
  const apiRequest =
    useApi();

  const navigate =
    useNavigate();

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const data =
      new FormData(
        event.currentTarget
      );

    try {
      const response =
        await apiRequest(
          `${config.backendUrl}/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              username:
                data.get(
                  "username"
                ),

              password:
                data.get(
                  "password"
                ),
            }),
          }
        );

      if (!response.ok) {
        const message =
          await response
            .text();

        setError(
          message ||
            "Invalid username or password"
        );

        return;
      }

      navigate("/feed", {
        replace: true,
      });
    } catch (error) {
      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
    >
      <CssBaseline />

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection:
            "column",
          alignItems:
            "center",
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor:
              "secondary.main",
          }}
        >
          <LockOutlinedIcon />
        </Avatar>

        <Typography
          component="h1"
          variant="h5"
        >
          Sign in
        </Typography>

        <Box
          component="form"
          onSubmit={
            handleSubmit
          }
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
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
          />

          {error && (
            <Typography
              color="error"
              sx={{ mt: 1 }}
            >
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
            }}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </Button>

          <Box
            display="flex"
            justifyContent="end"
          >
            <Link
              href="/register"
              variant="body2"
            >
              Don't have an account?
              {" "}
              Sign Up
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
