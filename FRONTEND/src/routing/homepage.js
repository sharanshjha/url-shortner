import { createRoute } from "@tanstack/react-router";

import HomePage from "../pages/HomePage";
import { rootRoute } from "./rootRoute";

export const homePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
