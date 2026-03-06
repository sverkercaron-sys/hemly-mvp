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
    <form action={onSubmit} className="card space-y-3 p-4">
      <h3 className="text-lg font-semibold">Contact agent</h3>
      <input name="email" type="email" required placeholder="Your email" className="w-full rounded-xl border p-2" />
      <textarea name="message" required rows={4} placeholder="I am interested in this property..." className="w-full rounded-xl border p-2" />
      <button className="button-primary" type="submit">
        Send inquiry
      </button>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
