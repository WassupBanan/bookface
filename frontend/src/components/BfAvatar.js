import {
  Avatar,
} from "@mui/material";

import {
  useCallback,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

export default function BfAvatar({
  user,
  onClick,
}) {
  const navigate =
    useNavigate();

  const handleClick =
    useCallback(() => {
      if (onClick) {
        onClick();
      }

      navigate(
        `/profile/${user.id}`
      );
    }, [
      navigate,
      onClick,
      user.id,
    ]);

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

  return (
    <Avatar
      sx={{
        cursor: "pointer",
      }}
      src={user.avatarUrl}
      alt={`${user.firstName} ${user.lastName}`}
      onClick={
        handleClick
      }
    >
      {initials}
    </Avatar>
  );
}
