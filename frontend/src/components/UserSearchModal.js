import {
  Card,
  Container,
  Dialog,
  Grid,
  Typography,
} from "@mui/material";

import {
  useUsersModal,
} from "../utils/context";

import BfAvatar from "./BfAvatar";

export default function UserSearchModal() {
  const {
    isOpen,
    setIsOpen,
    users,
  } = useUsersModal();

  return (
    <Dialog
      open={isOpen}
      onClose={() =>
        setIsOpen(false)
      }
      disableAutoFocus
    >
      <Card
        sx={{
          width: 400,
          maxWidth:
            "calc(100vw - 32px)",
          minHeight: 300,
          maxHeight:
            "70vh",
          overflowY: "auto",
          p: 2,
        }}
      >
        <Container>
          <Typography
            variant="h5"
          >
            Search Results
          </Typography>

          {users.length ===
            0 && (
            <Typography
              sx={{ mt: 3 }}
              color="text.secondary"
            >
              No users found.
            </Typography>
          )}

          <Grid
            container
            spacing={1}
            sx={{ mt: 1 }}
          >
            {users.map(
              (user) => (
                <Grid
                  container
                  item
                  xs={12}
                  spacing={1}
                  key={user.id}
                  alignItems="center"
                >
                  <Grid
                    item
                    xs={2}
                  >
                    <BfAvatar
                      user={user}
                      onClick={() =>
                        setIsOpen(
                          false
                        )
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={10}
                  >
                    <Typography>
                      {user.firstName}{" "}
                      {user.lastName}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      @{user.username}
                    </Typography>
                  </Grid>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Card>
    </Dialog>
  );
}
