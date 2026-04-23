import { useState } from "react";
import { Heart, History, Search } from "lucide-react";

export function SidebarPanels({ history, favorites, onSelectPlan }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredHistory = history.filter((plan) =>
    plan.condition.toLowerCase().includes(normalizedQuery)
  );
  const filteredFavorites = favorites.filter((plan) =>
    plan.condition.toLowerCase().includes(normalizedQuery)
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
      <section className="rounded-[2rem] border border-white/50 bg-white/85 p-5 shadow-panel backdrop-blur transition duration-200 hover:shadow-panel-hover dark:border-white/10 dark:bg-slate-900/80">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Search saved plans
          </span>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find by condition name"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-panel-soft outline-none transition placeholder:text-slate-400 focus:border-clinic-400 focus:ring-2 focus:ring-clinic-100 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </label>
      </section>

      <Panel
        title="Recent Plans"
        icon={History}
        emptyText="No plans yet. Generate one to populate recent history."
        items={filteredHistory}
        onSelectPlan={onSelectPlan}
      />
      <Panel
        title="Favorite Plans"
        icon={Heart}
        emptyText="No favorites yet. Save a generated plan to keep it handy."
        items={filteredFavorites}
        onSelectPlan={onSelectPlan}
      />
    </div>
  );
}

function Panel({ title, icon: Icon, emptyText, items, onSelectPlan }) {
  return (
    <section className="rounded-[2rem] border border-white/50 bg-white/85 p-5 shadow-panel backdrop-blur transition duration-200 hover:shadow-panel-hover dark:border-white/10 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-clinic-100 p-2.5 text-clinic-700 dark:bg-clinic-900/40 dark:text-clinic-100">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
      </div>

      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:border-clinic-300 hover:bg-clinic-50/70 hover:shadow-panel dark:border-white/10 dark:bg-white/5 dark:hover:bg-clinic-900/20"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {plan.condition}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {plan.patientSummary.mode}
                  </div>
                </div>
                {plan.isFavorite ? (
                  <Heart className="h-5 w-5 fill-current text-rose-500" />
                ) : null}
              </div>
            </button>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm leading-6 text-slate-500 dark:border-white/10 dark:text-slate-400">
            {emptyText}
          </p>
        )}
      </div>
    </section>
  );
}
