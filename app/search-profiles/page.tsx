import { SearchProfilesPanel } from "@/components/search-profiles-panel";

export default function SearchProfilesPage() {
  return (
    <section className="space-y-4">
      <div className="soft-panel p-6">
        <p className="kicker">Alert engine</p>
        <h1 className="section-title mt-1" style={{ fontFamily: "var(--font-display)" }}>
          Search alerts
        </h1>
      </div>
      <SearchProfilesPanel />
    </section>
  );
}
