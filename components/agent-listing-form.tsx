"use client";

import { useState } from "react";

export function AgentListingForm() {
  const [status, setStatus] = useState("");

  async function onSubmit(formData: FormData) {
    setStatus("Submitting...");

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title") ?? ""),
        price: Number(formData.get("price") ?? 0),
        monthly_fee: Number(formData.get("monthly_fee") ?? 0),
        size: Number(formData.get("size") ?? 0),
        rooms: Number(formData.get("rooms") ?? 0),
        description: String(formData.get("description") ?? ""),
        address: String(formData.get("address") ?? ""),
        city: String(formData.get("city") ?? ""),
        area: String(formData.get("area") ?? ""),
        property_type: String(formData.get("property_type") ?? "apartment"),
        image_urls: String(formData.get("images") ?? "")
          .split("\n")
          .map((value) => value.trim())
          .filter(Boolean)
      })
    });

    setStatus(res.ok ? "Listing submitted for moderation" : "Submission failed");
  }

  return (
    <form action={onSubmit} className="card grid gap-3 p-4 md:grid-cols-2">
      <input className="rounded-xl border p-2" name="title" placeholder="Title" required />
      <input className="rounded-xl border p-2" name="price" type="number" placeholder="Price" required />
      <input className="rounded-xl border p-2" name="monthly_fee" type="number" placeholder="Monthly fee" required />
      <input className="rounded-xl border p-2" name="size" type="number" placeholder="Size" required />
      <input className="rounded-xl border p-2" name="rooms" type="number" placeholder="Rooms" required />
      <input className="rounded-xl border p-2" name="property_type" placeholder="Property type" defaultValue="apartment" required />
      <input className="rounded-xl border p-2 md:col-span-2" name="address" placeholder="Address" required />
      <input className="rounded-xl border p-2" name="city" placeholder="City" required />
      <input className="rounded-xl border p-2" name="area" placeholder="Area" required />
      <textarea className="rounded-xl border p-2 md:col-span-2" name="description" placeholder="Description" rows={5} required />
      <textarea className="rounded-xl border p-2 md:col-span-2" name="images" placeholder="Image URLs (one per line)" rows={3} />
      <div className="md:col-span-2 flex items-center gap-3">
        <button className="button-primary">Create listing</button>
        <p className="text-sm text-slate-600">{status}</p>
      </div>
    </form>
  );
}
