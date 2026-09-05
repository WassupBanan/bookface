import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useUser,
} from "../../utils/context";

import Posts from "../feed/Posts";

import {
  config,
} from "../../config";

import {
  useApi,
} from "../../utils/api";

export default function Profile() {
  const {
    userId,
  } = useParams();

  const navigate =
    useNavigate();

  const apiRequest =
    useApi();

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const {
    user:
      loggedInUser,
  } = useUser();

  const loadUser =
    useCallback(
      async () => {
        if (
          !userId ||
          !/^\d+$/.test(
            userId
          )
        ) {
          navigate(
            "/feed",
            {
              replace: true,
            }
          );

          return;
        }

        setLoading(true);
        setError("");

        try {
          const response =
            await apiRequest(
              `${config.backendUrl}/user/${userId}`
            );

          if (!response.ok) {
            if (
              response.status ===
              404
            ) {
              navigate(
                "/feed",
                {
                  replace: true,
                }
              );

              return;
            }

            throw new Error(
              await response.text()
            );
          }

          const data =
            await response.json();

          setUser(data);
        } catch (error) {
          console.error(
            error
          );

          setError(
            "Unable to load profile."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        apiRequest,
        navigate,
        userId,
      ]
    );

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const isLoggedInProfile =
    useMemo(
      () =>
        user?.id ===
        loggedInUser?.id,
      [
        user,
        loggedInUser,
      ]
    );

  async function handleAddFriend() {
    if (
      !user ||
      user.isFriend
    ) {
      return;
    }

    try {
      const response =
        await apiRequest(
          `${config.backendUrl}/friend/addFriend`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              friendId:
                user.id,
            }),
          }
        );

      if (!response.ok) {
        setError(
          await response.text()
        );

        return;
      }

      await loadUser();
    } catch (error) {
      console.error(
        error
      );

      setError(
        "Unable to send friend request."
      );
    }
  }

  async function handleRemoveFriend() {
    if (!user) {
      return;
    }

    try {
      const response =
        await apiRequest(
          `${config.backendUrl}/friend/deleteFriend`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              otherId:
                user.id,
            }),
          }
        );

      if (!response.ok) {
        setError(
          await response.text()
        );

        return;
      }

      await loadUser();
    } catch (error) {
      console.error(
        error
      );

      setError(
        "Unable to remove friend."
      );
    }
  }

  async function handleUpdateProfileImage() {
    const avatarUrl =
      window.prompt(
        "Enter the URL of your new profile picture:",
        user?.avatarUrl ||
          ""
      );

    if (
      avatarUrl ===
      null
    ) {
      return;
    }

    try {
      const response =
        await apiRequest(
          `${config.backendUrl}/user/avatar`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              avatarUrl:
                avatarUrl.trim(),
            }),
          }
        );

      if (!response.ok) {
        setError(
          await response.text()
        );

        return;
      }

      await loadUser();
    } catch (error) {
      console.error(
        error
      );

      setError(
        "Unable to update profile picture."
      );
    }
  }

  const [
    postContent,
    setPostContent,
  ] = useState("");

  const [
    posting,
    setPosting,
  ] = useState(false);

  async function handleCreatePost() {
    if (
      !postContent.trim() ||
      posting
    ) {
      return;
    }

    setPosting(true);
    setError("");

    try {
      const response =
        await apiRequest(
          `${config.backendUrl}/post`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              content:
                postContent.trim(),
            }),
          }
        );

      if (!response.ok) {
        setError(
          await response.text()
        );

        return;
      }

      setPostContent("");

      // Reload the profile
      // so the new post appears.
      await loadUser();

      window.location.reload();
    } catch (error) {
      console.error(
        error
      );

      setError(
        "Unable to create post."
      );
    } finally {
      setPosting(false);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "center",
          pt: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: 4,
      }}
    >
      {error && (
        <Typography
          color="error"
          align="center"
          sx={{ mb: 2 }}
        >
          {error}
        </Typography>
      )}

      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Box>
            <Avatar
              src={user.avatarUrl}
              sx={{
                width: 180,
                height: 180,
                mx: "auto",
              }}
            />

            <Typography
              variant="h5"
              align="center"
              gutterBottom
            >
              {user.firstName}{" "}
              {user.lastName}
            </Typography>

            {!isLoggedInProfile &&
              !user.isFriend && (
                <Box
                  display="flex"
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      handleAddFriend
                    }
                  >
                    Add Friend
                  </Button>
                </Box>
              )}

            {!isLoggedInProfile &&
              user.isFriend && (
                <Box
                  display="flex"
                  justifyContent="center"
                  gap={1}
                >
                  <Button
                    variant="contained"
                    disabled
                  >
                    Friend
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={
                      handleRemoveFriend
                    }
                  >
                    Remove
                  </Button>
                </Box>
              )}

            {isLoggedInProfile && (
              <Box
                display="flex"
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={
                    handleUpdateProfileImage
                  }
                >
                  Update Profile Image
                </Button>
              </Box>
            )}
          </Box>

          <Box mt="24px">
            <Paper
              sx={{
                padding: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
              >
                Profile Information
              </Typography>

              <Grid
                container
                spacing={1}
              >
                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    First Name:
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    {user.firstName}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    Last Name:
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    {user.lastName}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    Username:
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    @{user.username}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    Gender:
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={6}
                >
                  <Typography>
                    {user.gender ||
                      "Not specified"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={8}
        >
          {(user.isFriend ||
            isLoggedInProfile) && (
            <Box>
              {isLoggedInProfile && (
                <Box
                  px={{
                    xs: 0,
                    md: 8,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                    >
                      Add a Post
                    </Typography>

                    <TextField
                      label="Post Content"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      value={
                        postContent
                      }
                      onChange={(
                        event
                      ) =>
                        setPostContent(
                          event.target
                            .value
                        )
                      }
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      disabled={
                        posting ||
                        !postContent.trim()
                      }
                      onClick={
                        handleCreatePost
                      }
                      sx={{
                        mt: 2,
                      }}
                    >
                      {posting
                        ? "Posting..."
                        : "Post"}
                    </Button>
                  </Paper>
                </Box>
              )}

              <Typography
                variant="h5"
                align="center"
                sx={{
                  mt: 3,
                }}
              >
                Posts by{" "}
                {user.firstName}:
              </Typography>

              <Posts
                author={user}
              />
            </Box>
          )}

          {!user.isFriend &&
            !isLoggedInProfile && (
              <Typography
                variant="h5"
                align="center"
              >
                You need to be friends
                to see posts
              </Typography>
            )}
        </Grid>
      </Grid>
    </Box>
  );
}
