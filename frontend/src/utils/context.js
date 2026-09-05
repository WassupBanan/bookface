import {
  createContext,
  useContext,
} from "react";

export const UserContext =
  createContext(null);

export function useUser() {
  const context =
    useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used within UserContext.Provider"
    );
  }

  return context;
}

export const UsersModalContext =
  createContext(null);

export function useUsersModal() {
  const context =
    useContext(
      UsersModalContext
    );

  if (!context) {
    throw new Error(
      "useUsersModal must be used within UsersModalContext.Provider"
    );
  }

  return context;
}
