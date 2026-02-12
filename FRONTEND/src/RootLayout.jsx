import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import { useDispatch } from "react-redux";

import Navbar from "./components/NavBar";
import { clearUser, setUser } from "./store/slice/authSlice";
import { currentUserQuery } from "./utils/helper";

const RootLayout = () => {
  const dispatch = useDispatch();
  const { data, isError } = useQuery({
    ...currentUserQuery,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
      return;
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [data, dispatch, isError]);

  return (
    <div className="min-h-screen pb-10">
      <Navbar />
      <main className="shell pt-8 md:pt-10">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
