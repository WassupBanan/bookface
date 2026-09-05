import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

import BfAvatar from
  "../../components/BfAvatar";

export default function Post({
  post,
}) {
  if (!post?.author) {
    return null;
  }

  const author =
    post.author;

  return (
    <Card
      sx={{
        margin: 5,
        boxShadow:
          "0px 2px 4px rgba(0, 0, 0, 0.25)",
        border:
          "1px solid #E0E0E0",
        borderRadius: 2,
      }}
    >
      <CardHeader
        avatar={
          <BfAvatar
            user={author}
          />
        }
        subheader={
          `${author.firstName} ${author.lastName}`
        }
      />

      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace:
              "pre-line",
          }}
        >
          {post.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
