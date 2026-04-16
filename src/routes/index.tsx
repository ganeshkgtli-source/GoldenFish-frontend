// import { createFileRoute } from "@tanstack/react-router";
// import App from "../App";

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/register",
    });
  },
});