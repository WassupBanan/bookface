import {
  Box,
  CircularProgress,
  Container,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import AppAppBar from "./components/AppAppBar";

import {
  useUser,
} from "./utils/context";

import {
  useApi,
} from "./utils/api";

import {
  config,
} from "./config";

function MainApp() {
  const {
    user,
    setUser,
  } = useUser();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const apiRequest =
    useApi();

  const [
    checkingAuth,
    setCheckingAuth,
  ] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function validateToken() {
      try {
        const response =
          await apiRequest(
            `${config.backendUrl}/user`
          );

        if (!response.ok) {
          if (!cancelled) {
            navigate(
              "/login",
              {
                replace: true,
              }
            );
          }

          return;
        }

        const data =
          await response.json();

        if (!cancelled) {
          setUser(data);
        }
      } catch (error) {
        console.error(
          error
        );

        if (!cancelled) {
          navigate(
            "/login",
            {
              replace: true,
            }
          );
        }
      } finally {
        if (!cancelled) {
          setCheckingAuth(false);
        }
      }
    }

    validateToken();

    return () => {
      cancelled = true;
    };
  }, [
    apiRequest,
    navigate,
    setUser,
  ]);

  if (checkingAuth) {
    return (
      <Container
        sx={{
          minHeight:
            "100vh",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Container>
      <AppAppBar />

      <Box
        sx={{
          mt: "80px",
        }}
      />

      <Outlet />
    </Container>
  );
}

export default MainApp;
