// src/pages/AuthCallback.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase-client";

export default function AuthCallback() {
  const called = useRef(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (called.current) return
    called.current = true;

    (async () => {
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("No session after OAuth redirect", sessionError);
        return;
      }

      // hand it off to your backend so it can set its JWT cookie
      const res = await fetch("/api/auth/oauth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",             // so backend can set cookie
        body: JSON.stringify({ 
          access_token: session.access_token 
        }),
      });
      if (!res.ok) {
        console.error("Backend OAuth callback failed", await res.text());
        return;
      }

      navigate("/");
    })();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Finishing Authentication…</p>
    </div>
  );
}
