import { useState } from "react";
import { Outlet } from "react-router-dom";

import "./App.css";

import UserSearchModal from "./components/UserSearchModal";

import {
  UserContext,
  UsersModalContext,
} from "./utils/context";

function App() {
  const [user, setUser] =
    useState(null);

  const [isOpen, setIsOpen] =
    useState(false);

  const [users, setUsers] =
    useState([]);

  return (
    <UsersModalContext.Provider
      value={{
        isOpen,
        setIsOpen,
        users,
        setUsers,
      }}
    >
      <UserContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        <Outlet />

        <UserSearchModal />
      </UserContext.Provider>
    </UsersModalContext.Provider>
  );
}

export default App;
