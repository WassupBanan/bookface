import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import {
  createTheme,
  ThemeProvider,
} from "@mui/material";

import React from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  Link as RouterLink,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from "./App";
import MainApp from "./MainApp";

import Auth from "./pages/Auth";

import Login from "./pages/auth/login/login";
import Register from "./pages/auth/register/Register";

import Feed from "./pages/feed/Feed";
import Profile from "./pages/profile/Profile";

import "./index.css";

const LinkBehavior =
  React.forwardRef(
    function LinkBehavior(
      props,
      ref
    ) {
      const {
        href,
        ...other
      } = props;

      return (
        <RouterLink
          ref={ref}
          to={href}
          {...other}
        />
      );
    }
  );

const theme =
  createTheme({
    palette: {},

    components: {
      MuiLink: {
        defaultProps: {
          component:
            LinkBehavior,
        },
      },

      MuiButtonBase: {
        defaultProps: {
          LinkComponent:
            LinkBehavior,
        },
      },
    },
  });

const router =
  createBrowserRouter([
    {
      element: <App />,

      children: [
        {
          element: <MainApp />,

          children: [
            {
              path: "/",
              element: (
                <Navigate
                  to="/feed"
                  replace
                />
              ),
            },

            {
              path: "/feed",
              element: <Feed />,
            },

            {
              path: "/profile/:userId",
              element: <Profile />,
            },
          ],
        },

        {
          element: <Auth />,

          children: [
            {
              path: "/login",
              element: <Login />,
            },

            {
              path: "/register",
              element: <Register />,
            },
          ],
        },
      ],
    },
  ]);

const root =
  ReactDOM.createRoot(
    document.getElementById(
      "root"
    )
  );

root.render(
  <React.StrictMode>
    <ThemeProvider
      theme={theme}
    >
      <RouterProvider
        router={router}
      />
    </ThemeProvider>
  </React.StrictMode>
);
