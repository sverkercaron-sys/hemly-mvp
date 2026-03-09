"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useLocale } from "@/hooks/use-locale";
import { pick } from "@/lib/i18n";

export function AuthControls() {
  const locale = useLocale();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(Boolean(data.user)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSignOut() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setBusy(false);
    window.location.href = "/";
  }

  if (!isLoggedIn) {
    return (
      <Link href="/auth" className="button-secondary">
        {pick(locale, { sv: "Logga in", ar: "تسجيل الدخول", fi: "Kirjaudu", bcs: "Prijava", en: "Sign in" })}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/profile" className="button-secondary">
        {pick(locale, { sv: "Profil", ar: "الملف", fi: "Profiili", bcs: "Profil", en: "Profile" })}
      </Link>
      <button type="button" onClick={onSignOut} className="button-secondary" disabled={busy}>
        {pick(locale, { sv: "Logga ut", ar: "تسجيل الخروج", fi: "Kirjaudu ulos", bcs: "Odjava", en: "Sign out" })}
      </button>
    </div>
  );
}

