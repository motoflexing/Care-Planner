import { Activity, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthLayout({ title, subtitle, alternateText, alternateAction, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(65,121,128,0.4),_transparent_32%),linear-gradient(135deg,_#f6f3ee,_#dce7e7_50%,_#f1ece4)]" />
      <div className="absolute inset-0 -z-10 bg-medical-grid bg-[size:28px_28px] opacity-20" />

      <main className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-panel backdrop-blur transition duration-200 hover:shadow-panel-hover sm:p-7">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-clinic-200 bg-clinic-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-clinic-700">
              <Activity className="h-4 w-4" />
              Care Planner
            </div>

            <h1 className="mt-6 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
              Safer healthcare drafting with a calm, professional workflow.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
              Create structured medical and nursing care plans for educational and clinical-support drafting. Every plan includes review disclaimers, red-flag warnings, and organized handoff-friendly sections.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={ShieldCheck}
              title="Protected Access"
              detail="Session-backed login keeps the Care Planner dashboard behind authenticated access."
            />
            <FeatureCard
              icon={Activity}
              title="Clinical Structure"
              detail="Medical, nursing, and patient education tabs stay ready once you sign in."
            />
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-panel backdrop-blur transition duration-200 hover:shadow-panel-hover sm:p-7">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{subtitle}</p>
            </div>

            {children}

            <p className="mt-6 text-center text-sm text-slate-500">
              {alternateText}{" "}
              <Link className="font-semibold text-clinic-700 hover:text-clinic-800" to={alternateAction.to}>
                {alternateAction.label}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, detail }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-panel">
      <div className="w-fit rounded-2xl bg-clinic-100 p-2.5 text-clinic-700">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}
