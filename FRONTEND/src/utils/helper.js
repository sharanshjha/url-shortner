import { redirect } from "@tanstack/react-router";

import { getCurrentUser } from "../api/user.api";
import { clearUser, setUser } from "../store/slice/authSlice";

export const currentUserQuery = {
  queryKey: ["currentUser"],
  queryFn: async () => {
    const response = await getCurrentUser();
    return response.user;
  },
  retry: false,
  staleTime: 60_000,
};

export const checkAuth = async ({ context }) => {
  try {
    const user = await context.queryClient.ensureQueryData(currentUserQuery);
    context.store.dispatch(setUser(user));
    return true;
  } catch {
    context.store.dispatch(clearUser());
    throw redirect({ to: "/auth" });
  }
};
