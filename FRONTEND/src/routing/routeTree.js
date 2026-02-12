import { authRoute } from "./auth.route";
import { dashboardRoute } from "./dashboard";
import { homePageRoute } from "./homepage";
import { rootRoute } from "./rootRoute";

export const routeTree = rootRoute.addChildren([homePageRoute, authRoute, dashboardRoute]);
