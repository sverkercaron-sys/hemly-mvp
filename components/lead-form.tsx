"use client";

import { useState } from "react";

export function LeadForm({ propertyId }: { propertyId: string }) {
  const [status, setStatus] = useState<string>("");

  async function onSubmit(formData: FormData) {
    setStatus("Sending...");
    const payload = {
      property_id: propertyId,
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? "")
    };

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setStatus(res.ok ? "Message sent to agent" : "Could not send message");
  }

  return (
    <form action={onSubmit} className="card h-fit space-y-3 p-5">
      <p className="kicker">Direct contact</p>
      <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
        Contact agent
      </h3>
      <input name="email" type="email" required placeholder="Your email" className="input-shell" />
      <textarea name="message" required rows={5} placeholder="I am interested in this property..." className="input-shell" />
      <button className="button-primary w-full" type="submit">
        Send inquiry
      </button>
      {status ? <p className="text-sm text-[var(--muted)]">{status}</p> : null}
    </form>
  );
}
