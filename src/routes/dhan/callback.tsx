/* eslint-disable react-refresh/only-export-components */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import api from "@/lib/api";

export const Route = createFileRoute(
  "/dhan/callback"
)({
  component: DhanCallbackPage,
});

function DhanCallbackPage() {

  const navigate = useNavigate();

  useEffect(() => {

    const consumeToken = async () => {

      try {

        // =========================================
        // GET TOKEN ID FROM URL
        // =========================================
        const params =
          new URLSearchParams(
            window.location.search
          );

        const tokenId =
          params.get("tokenId");

        // =========================================
        // GET LOGIN STATE
        // =========================================
        const loginState =
          sessionStorage.getItem(
            "login_state"
          );

        console.log(
          "TOKEN ID:",
          tokenId
        );

        console.log(
          "LOGIN STATE:",
          loginState
        );

        // =========================================
        // VALIDATION
        // =========================================
        if (!tokenId || !loginState) {

          console.error(
            "Missing tokenId or login_state"
          );

          navigate({
            to: "/signin",
            replace: true,
          });

          return;
        }

        // =========================================
        // CALL BACKEND CONSUME API
        // =========================================
        const res = await api.post(
          "/dhan/consume/",
          {
            tokenId,
            login_state: loginState,
          }
        );

        console.log(
          "DHAN CONSUME RESPONSE:",
          res.data
        );

        // =========================================
        // CLEANUP
        // =========================================
        sessionStorage.removeItem(
          "login_state"
        );

        // =========================================
        // REDIRECT
        // =========================================
        navigate({
          to: "/dashboard",
          replace: true,
        });

      } catch (err) {

        console.error(
          "DHAN CALLBACK ERROR:",
          err
        );

        sessionStorage.removeItem(
          "login_state"
        );

        navigate({
          to: "/signin",
          replace: true,
        });
      }
    };

    consumeToken();

  }, [navigate]);

  return (

    <div className="min-h-screen flex items-center justify-center bg-background">

      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />

        {/* Text */}
        <div className="text-center">

          <h1 className="text-xl font-semibold">
            Connecting Dhan...
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            Please wait while we authenticate your account.
          </p>

        </div>

      </div>

    </div>
  );
}