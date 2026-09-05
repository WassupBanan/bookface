import AppBar from
  "@mui/material/AppBar";

import Box from
  "@mui/material/Box";

import Button from
  "@mui/material/Button";

import Container from
  "@mui/material/Container";

import MenuItem from
  "@mui/material/MenuItem";

import Toolbar from
  "@mui/material/Toolbar";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import logo from
  "../logo.svg";

import {
  useUser,
  useUsersModal,
} from "../utils/context";

import BfAvatar from
  "./BfAvatar";

import {
  SearchBar,
} from "./SearchBar";

import {
  StyledLink,
} from "./StyledLink";

import {
  config,
} from "../config";

import {
  useApi,
} from "../utils/api";

const logoStyle = {
  width: "auto",
  height: "65px",
  marginLeft: "8px",
  cursor: "pointer",
};

export default function AppAppBar() {
  const navigate =
    useNavigate();

  const apiRequest =
    useApi();

  const {
    user,
    setUser,
  } = useUser();

  const {
    setIsOpen,
    setUsers,
  } = useUsersModal();

  const [
    searchValue,
    setSearchValue,
  ] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function searchUsers() {
      const query =
        searchValue.trim();

      if (!query) {
        setUsers([]);
        setIsOpen(false);
        return;
      }

      try {
        setIsOpen(true);

        const response =
          await apiRequest(
            `${config.backendUrl}/user/all?q=${encodeURIComponent(
              query
            )}`
          );

        if (!response.ok) {
          return;
        }

        const users =
          await response.json();

        if (!cancelled) {
          setUsers(users);
        }
      } catch (error) {
        console.error(
          error
        );
      }
    }

    const timeout =
      setTimeout(
        searchUsers,
        250
      );

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [
    searchValue,
    apiRequest,
    setIsOpen,
    setUsers,
  ]);

  const handleLogout =
    useCallback(
      async () => {
        try {
          await apiRequest(
            `${config.backendUrl}/auth/logout`,
            {
              method: "POST",
            }
          );
        } finally {
          setUser(null);

          navigate(
            "/login",
            {
              replace: true,
            }
          );
        }
      },
      [
        apiRequest,
        navigate,
        setUser,
      ]
    );

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor:
          "transparent",
        backgroundImage:
          "none",
        mt: 2,
      }}
    >
      <Container
        maxWidth="lg"
      >
        <Toolbar
          sx={(theme) => ({
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",

            borderRadius:
              "999px",

            bgcolor:
              theme.palette
                .mode ===
              "light"
                ? "rgba(255,255,255,0.75)"
                : "rgba(0,0,0,0.4)",

            backdropFilter:
              "blur(24px)",

            border:
              "1px solid",

            borderColor:
              "divider",

            minHeight:
              "64px !important",

            gap: 1,
          })}
        >
          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
            }}
          >
            <img
              src={logo}
              style={logoStyle}
              alt="BookFace"
              onClick={() =>
                navigate(
                  "/feed"
                )
              }
            />

            <MenuItem
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              <StyledLink to="/feed">
                Home
              </StyledLink>
            </MenuItem>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "block",
              },
              maxWidth: 600,
            }}
          >
            <SearchBar
              setValue={
                setSearchValue
              }
              value={
                searchValue
              }
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems:
                "center",
            }}
          >
            {user && (
              <BfAvatar
                user={user}
              />
            )}

            <Button
              onClick={
                handleLogout
              }
              sx={{
                fontSize:
                  "0.8rem",
              }}
            >
              Sign out
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
