"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useLocale } from "@/hooks/use-locale";
import { pick } from "@/lib/i18n";

export function AuthPanel() {
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        setStatus(error.message);
        return;
      }
      window.location.href = "/bostader";
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    setBusy(false);
    setStatus(
      error
        ? error.message
        : pick(locale, {
            sv: "Konto skapat. Kontrollera din e-post om verifiering krävs.",
            ar: "تم إنشاء الحساب. تحقق من بريدك إذا طُلب التحقق.",
            fi: "Tili luotu. Tarkista sähköposti, jos vahvistus vaaditaan.",
            bcs: "Nalog kreiran. Provjeri email ako je potrebna verifikacija.",
            en: "Account created. Check your email if verification is enabled."
          })
    );
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto grid max-w-xl gap-3 p-6">
      <h1 className="section-title text-3xl">
        {mode === "signin"
          ? pick(locale, { sv: "Logga in", ar: "تسجيل الدخول", fi: "Kirjaudu", bcs: "Prijava", en: "Sign in" })
          : pick(locale, { sv: "Skapa konto", ar: "إنشاء حساب", fi: "Luo tili", bcs: "Kreiraj nalog", en: "Create account" })}
      </h1>

      {mode === "signup" ? (
        <input className="input-shell" value={name} onChange={(e) => setName(e.target.value)} placeholder={pick(locale, { sv: "Namn", ar: "الاسم", fi: "Nimi", bcs: "Ime", en: "Name" })} />
      ) : null}

      <input className="input-shell" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input className="input-shell" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={pick(locale, { sv: "Lösenord", ar: "كلمة المرور", fi: "Salasana", bcs: "Lozinka", en: "Password" })} required />

      <button className="button-primary" type="submit" disabled={busy}>
        {busy
          ? pick(locale, { sv: "Vänta...", ar: "انتظر...", fi: "Odota...", bcs: "Sačekaj...", en: "Please wait..." })
          : mode === "signin"
            ? pick(locale, { sv: "Logga in", ar: "تسجيل الدخول", fi: "Kirjaudu", bcs: "Prijava", en: "Sign in" })
            : pick(locale, { sv: "Skapa konto", ar: "إنشاء حساب", fi: "Luo tili", bcs: "Kreiraj nalog", en: "Create account" })}
      </button>

      <button type="button" className="button-secondary" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
        {mode === "signin"
          ? pick(locale, { sv: "Har du inget konto? Skapa ett", ar: "ليس لديك حساب؟ أنشئ حسابًا", fi: "Ei tiliä? Luo tili", bcs: "Nemaš nalog? Kreiraj", en: "No account? Create one" })
          : pick(locale, { sv: "Har du redan konto? Logga in", ar: "لديك حساب؟ سجل الدخول", fi: "Onko tili? Kirjaudu", bcs: "Imaš nalog? Prijavi se", en: "Already have an account? Sign in" })}
      </button>

      {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}
    </form>
  );
}

