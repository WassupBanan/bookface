import { useUser } from "./context";

export function useApi() {
  const { setUser } =
    useUser();

  const apiRequest =
    async (
      url,
      options = {}
    ) => {
      try {
        const response =
          await fetch(
            url,
            {
              ...options,
              credentials:
                "include",
            }
          );

        if (
          response.status ===
          401
        ) {
          setUser(null);
        }

        return response;
      } catch (error) {
        console.error(
          "API request failed:",
          error
        );

        throw error;
      }
    };

  return apiRequest;
}
