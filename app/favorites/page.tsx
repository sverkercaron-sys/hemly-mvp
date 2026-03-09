import { FavoritesPanel } from "@/components/favorites-panel";

export default function FavoritesPage() {
  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">Saved homes</p>
        <h1 className="section-title mt-1" style={{ fontFamily: "var(--font-display)" }}>
          Favorites
        </h1>
      </div>
      <FavoritesPanel />
    </section>
  );
}
