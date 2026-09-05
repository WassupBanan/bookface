import {
  useState,
} from "react";

import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import Link from
  "@mui/material/Link";

import {
  useNavigate,
} from "react-router-dom";

import {
  config,
} from "../../../config";

export default function Register() {
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
        await fetch(
          `${config.backendUrl}/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              firstName:
                data.get(
                  "firstName"
                ),

              lastName:
                data.get(
                  "lastName"
                ),

              username:
                data.get(
                  "username"
                ),

              password:
                data.get(
                  "password"
                ),

              gender:
                data.get(
                  "gender"
                ),

              avatarUrl:
                data.get(
                  "avatarUrl"
                ),
            }),
          }
        );

      if (!response.ok) {
        setError(
          await response.text()
        );

        return;
      }

      navigate("/login", {
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
      maxWidth="sm"
    >
      <Box
        component="form"
        onSubmit={
          handleSubmit
        }
        sx={{
          mt: 4,
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Create an account
        </Typography>

        <TextField
          name="firstName"
          label="First Name"
          required
          fullWidth
          margin="normal"
        />

        <TextField
          name="lastName"
          label="Last Name"
          required
          fullWidth
          margin="normal"
        />

        <TextField
          name="username"
          label="Username"
          required
          fullWidth
          margin="normal"
        />

        <TextField
          name="password"
          label="Password"
          type="password"
          required
          fullWidth
          margin="normal"
        />

        <TextField
          name="gender"
          label="Gender"
          select
          fullWidth
          margin="normal"
          defaultValue=""
        >
          <MenuItem value="">
            Prefer not to say
          </MenuItem>

          <MenuItem value="male">
            Male
          </MenuItem>

          <MenuItem value="female">
            Female
          </MenuItem>

          <MenuItem value="other">
            Other
          </MenuItem>
        </TextField>

        <TextField
          name="avatarUrl"
          label="Profile picture URL"
          fullWidth
          margin="normal"
          placeholder="https://..."
        />

        {error && (
          <Typography
            color="error"
            sx={{ mt: 2 }}
          >
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading
            ? "Creating account..."
            : "Create Account"}
        </Button>

        <Box
          sx={{
            mt: 2,
            textAlign: "center",
          }}
        >
          <Link
            href="/login"
            variant="body2"
          >
            Already have an account?
            {" "}
            Sign in
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
