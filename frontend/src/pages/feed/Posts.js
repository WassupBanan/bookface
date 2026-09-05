import {
  Container,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useState,
} from "react";

import Post from "./Post";

import {
  config,
} from "../../config";

import {
  useApi,
} from "../../utils/api";

export default function Posts({
  author,
}) {
  const [
    posts,
    setPosts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const apiRequest =
    useApi();

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      setLoading(true);
      setError("");

      try {
        const query =
          author
            ? `?userId=${author.id}`
            : "";

        const response =
          await apiRequest(
            `${config.backendUrl}/post${query}`
          );

        if (!response.ok) {
          throw new Error(
            await response.text()
          );
        }

        const data =
          await response.json();

        if (!cancelled) {
          setPosts(data);
        }
      } catch (error) {
        console.error(
          error
        );

        if (!cancelled) {
          setError(
            "Unable to load posts."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, [
    author,
    apiRequest,
  ]);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent:
            "center",
          pt: 4,
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ pt: 4 }}>
        <Typography
          color="error"
          align="center"
        >
          {error}
        </Typography>
      </Container>
    );
  }

  const orderedPosts =
    [...posts].sort(
      (a, b) =>
        b.id - a.id
    );

  return (
    <Container
      sx={{ pt: "16px" }}
    >
      {orderedPosts.length ===
      0 ? (
        <Typography
          align="center"
          sx={{ mt: 4 }}
        >
          No posts yet.
        </Typography>
      ) : (
        orderedPosts.map(
          (post) => (
            <Post
              key={post.id}
              post={post}
            />
          )
        )
      )}
    </Container>
  );
}
