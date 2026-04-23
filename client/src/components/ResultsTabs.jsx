import {
  BadgeAlert,
  BookOpenText,
  HeartPulse,
  Image as ImageIcon,
  ShieldAlert,
  Stethoscope
} from "lucide-react";

const tabs = [
  { id: "medical", label: "Medical Care Plan", icon: HeartPulse },
  { id: "nursing", label: "Nursing Care Plan", icon: BadgeAlert },
  { id: "education", label: "Patient Education", icon: BookOpenText }
];

export function ResultsTabs({ plan, activeTab, onTabChange }) {
  const tabContent = {
    medical: <MedicalTab plan={plan} />,
    nursing: <NursingTab plan={plan} />,
    education: <EducationTab plan={plan} />
  };

  return (
    <div className="mt-4 min-w-0">
      <div className="flex min-w-0 flex-wrap gap-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex min-w-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-panel-soft transition duration-200 ${
                selected
                  ? "bg-clinic-700 text-white shadow-button-focus"
                  : "border border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-clinic-300 hover:text-clinic-700 hover:shadow-panel dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
              }`}
            >
              <Icon className="h-5 w-5 flex-none" />
              <span className="whitespace-normal break-words text-left">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <ReportShell plan={plan}>{tabContent[activeTab]}</ReportShell>
    </div>
  );
}

function ReportShell({ plan, children }) {
  return (
    <div id="care-planner-report" className="mt-5 min-w-0 space-y-5">
      <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(140deg,rgba(248,250,252,0.96),rgba(236,253,245,0.55)_45%,rgba(255,255,255,0.96))] p-5 shadow-panel-soft dark:border-white/10 dark:bg-[linear-gradient(140deg,rgba(15,23,42,0.9),rgba(19,78,74,0.35)_45%,rgba(15,23,42,0.88))] sm:p-6">
        <div className="min-w-0 space-y-5">
          <div className="min-w-0 space-y-4">
            <div className="flex min-w-0 flex-wrap gap-2">
              <ReportBadge label={`Mode: ${friendlyMode(plan.intakeMode)}`} />
              <ReportBadge label={`Confidence: ${plan.confidenceLabel || "Low"}`} tone="accent" />
              <ReportBadge label={sourceLabel(plan.intakeMode)} tone="soft" />
            </div>

            <div className="min-w-0">
              <h3 className="break-words text-2xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-3xl">
                {plan.condition}
              </h3>
              <p className="mt-1 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                Generated {plan.meta.generatedOn} | Source: {plan.meta.source}
              </p>
            </div>

            <p className="max-w-3xl break-words text-base leading-7 text-slate-700 dark:text-slate-200">
              {plan.overview}
            </p>
          </div>

          <InsightCardsRow plan={plan} />

          <div className="min-w-0">
            <div className="w-full rounded-3xl border border-amber-300 bg-[linear-gradient(180deg,rgba(255,251,235,1),rgba(255,244,214,0.96))] px-5 py-5 text-left text-sm leading-relaxed text-amber-950 shadow-sm dark:border-amber-400/30 dark:bg-[linear-gradient(180deg,rgba(120,53,15,0.18),rgba(120,53,15,0.12))] dark:text-amber-50">
              <div className="flex min-w-0 items-start gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
                <div className="min-w-0">
                  <div className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-200">Clinical Review Required</div>
                  <div className="mt-2 whitespace-normal break-words">{plan.disclaimer}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">{children}</div>
        <aside className="min-w-0 space-y-4">
          <SectionCard title="Possible Conditions" tone="accent">
            <ConditionStack items={plan.possibleConditions || []} />
          </SectionCard>

          <SectionCard title="Patient Summary">
            <DetailRow label="Mode" value={friendlyMode(plan.patientSummary.mode)} />
            <DetailRow label="Age" value={plan.patientSummary.age} />
            <DetailRow label="Gender" value={plan.patientSummary.gender} />
            <DetailRow label="Severity" value={plan.patientSummary.severityLevel} />
            <DetailRow label="Symptoms" value={plan.patientSummary.symptoms} />
            <DetailRow label="Duration" value={plan.patientSummary.duration} />
            <DetailRow label="History" value={plan.patientSummary.comorbidities} />
            <DetailRow label="Allergies" value={plan.patientSummary.allergies} />
            <DetailRow label="Vitals" value={plan.patientSummary.vitals} />
            <DetailRow label="Image" value={plan.patientSummary.imageName} />
          </SectionCard>

          <SectionCard title="Clinical Draft Note">
            <p className="break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
              {plan.meta.note}
            </p>
          </SectionCard>
        </aside>
      </section>
    </div>
  );
}

function InsightCardsRow({ plan }) {
  const cards = [
    {
      id: "possible-match",
      icon: modeIcon(plan.intakeMode),
      title: "Possible Match",
      body: plan.condition
    },
    {
      id: "clinical-reasoning",
      icon: Stethoscope,
      title: "Clinical Reasoning",
      body: plan.reasoningSummary
    },
    {
      id: "safety-position",
      icon: ShieldAlert,
      title: "Safety Position",
      body: "Educational clinical-support draft only. Requires licensed professional review."
    }
  ];

  return (
    <section className="min-w-0">
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <InsightCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            body={card.body}
          />
        ))}
      </div>
    </section>
  );
}

function InsightCard({ icon: Icon, title, body }) {
  return (
    <article className="relative w-full min-w-[260px] overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 p-5 text-left shadow-panel transition duration-200 hover:-translate-y-0.5 hover:shadow-panel-hover dark:border-white/10 dark:bg-slate-900/45 dark:backdrop-blur-sm">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-clinic-100 text-clinic-700 dark:bg-clinic-900/40 dark:text-clinic-100">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 whitespace-normal break-words text-left">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
            {title}
          </div>
          <p className="mt-3 text-base leading-7 text-slate-800 whitespace-normal break-words dark:text-slate-100">
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}

function MedicalTab({ plan }) {
  const section = plan.medicalCarePlan;

  return (
    <div className="min-w-0 space-y-4">
      <SectionCard title="Overview">
        <p className="break-words text-sm leading-7 text-slate-700 dark:text-slate-200">{plan.overview}</p>
      </SectionCard>
      <SectionCard title="Reasoning Summary">
        <p className="break-words text-sm leading-7 text-slate-700 dark:text-slate-200">{plan.reasoningSummary}</p>
      </SectionCard>
      <SectionCard title="Key Findings">
        <PremiumList items={plan.keyFindings} />
      </SectionCard>
      {plan.keyVisualFindings?.length ? (
        <SectionCard title="Key Visual Findings" tone="accent">
          <PremiumList items={plan.keyVisualFindings} tone="accent" />
        </SectionCard>
      ) : null}
      <SectionCard title="Differential Considerations">
        <PremiumList items={plan.differentialConsiderations} />
      </SectionCard>
      <SectionCard title="Recommended Medical Evaluation">
        <PremiumList items={section.recommendedMedicalEvaluation || section.diagnosticInvestigations} />
      </SectionCard>
      <SectionCard title="Medical Management">
        <PremiumList items={section.medicalManagement} />
      </SectionCard>
      <SectionCard title="Monitoring Parameters">
        <PremiumList items={section.monitoringParameters} />
      </SectionCard>
      <SectionCard title="Emergency Red Flags" tone="danger">
        <PremiumList items={section.redFlagEmergencySigns} tone="danger" />
      </SectionCard>
    </div>
  );
}

function NursingTab({ plan }) {
  const section = plan.nursingCarePlan;

  return (
    <div className="min-w-0 space-y-4">
      <SectionCard title="Nursing Diagnoses">
        <PremiumList items={section.nursingDiagnoses} />
      </SectionCard>
      <SectionCard title="Nursing Interventions with Rationales" tone="accent">
        <div className="space-y-3">
          {(section.nursingInterventions || []).map((item) => (
            <InterventionCard key={`${item.intervention}-${item.rationale}`} item={item} />
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Suggested Next Steps">
        <PremiumList items={plan.suggestedNextSteps || []} />
      </SectionCard>
    </div>
  );
}

function EducationTab({ plan }) {
  const section = plan.patientEducationPlan;

  return (
    <div className="min-w-0 space-y-4">
      <SectionCard title="Patient Education">
        <PremiumList items={section.patientEducation} />
      </SectionCard>
      <SectionCard title="Diet / Lifestyle Advice">
        <PremiumList items={section.dietAndLifestyleAdvice} />
      </SectionCard>
      <SectionCard title="Monitoring Parameters">
        <PremiumList items={section.monitoringAtHome} />
      </SectionCard>
      <SectionCard title="Discharge Planning / Follow-Up">
        <PremiumList items={section.followUpAdvice} />
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, children, tone = "default" }) {
  const toneClass =
    tone === "danger"
      ? "border-rose-200/80 dark:border-rose-500/20"
      : tone === "accent"
        ? "border-clinic-200/80 dark:border-clinic-500/20"
        : "border-slate-200 dark:border-white/10";

  return (
    <section className={`min-w-0 w-full overflow-hidden rounded-3xl border bg-white p-5 text-left shadow-panel-soft transition duration-200 hover:shadow-panel dark:bg-slate-950 ${toneClass}`}>
      <h4 className="whitespace-normal break-words text-lg font-semibold leading-snug text-slate-950 dark:text-white">{title}</h4>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

function ConditionStack({ items = [] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item.name}-${index}`}
          className="min-w-0 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left shadow-panel-soft dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 break-words text-sm font-semibold text-slate-900 dark:text-white">{item.name}</div>
            <span className="inline-flex max-w-full items-center self-start rounded-full bg-clinic-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-clinic-700 dark:bg-clinic-900/40 dark:text-clinic-100">
              {item.likelihood}
            </span>
          </div>
          {item.summary ? (
            <p className="mt-2 whitespace-normal break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.summary}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PremiumList({ items = [], tone = "default" }) {
  const className =
    tone === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100"
      : tone === "accent"
        ? "border-clinic-200 bg-clinic-50/70 text-slate-800 dark:border-clinic-500/20 dark:bg-clinic-900/10 dark:text-slate-100"
        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200";

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className={`min-w-0 w-full overflow-hidden rounded-2xl border px-4 py-3 text-left text-sm leading-relaxed ${className}`}>
          <span className="block whitespace-normal break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InterventionCard({ item }) {
  return (
    <div className="min-w-0 rounded-2xl border border-clinic-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(240,249,255,0.95))] p-4 shadow-panel-soft dark:border-clinic-500/20 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(34,197,94,0.04))]">
      <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">{item.intervention}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
        Rationale: {item.rationale}
      </p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="min-w-0 border-b border-slate-200 py-2 last:border-b-0 dark:border-white/10">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-1 break-words text-sm leading-6 text-slate-700 dark:text-slate-200">{value || "Not provided"}</div>
    </div>
  );
}

function ReportBadge({ label, tone = "default" }) {
  const className =
    tone === "accent"
      ? "bg-clinic-100 text-clinic-700 dark:bg-clinic-900/40 dark:text-clinic-100"
      : tone === "soft"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100"
        : "bg-white/80 text-slate-700 dark:bg-white/10 dark:text-slate-200";

  return (
    <span className={`inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${className}`}>
      <span className="break-words">{label}</span>
    </span>
  );
}

function friendlyMode(mode) {
  const lookup = {
    condition: "Condition Name",
    "condition-basic": "Condition Name",
    "condition-detailed": "Condition Name",
    image: "Image Analysis",
    symptom: "Symptom Description"
  };

  return lookup[mode] || mode || "Not provided";
}

function sourceLabel(mode) {
  if (mode === "image") {
    return "Visual support";
  }

  if (mode === "symptom") {
    return "Symptom support";
  }

  return "Condition support";
}

function modeIcon(mode) {
  if (mode === "image") {
    return ImageIcon;
  }

  if (mode === "symptom") {
    return Stethoscope;
  }

  return HeartPulse;
}
