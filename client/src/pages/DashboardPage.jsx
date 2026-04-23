import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardPlus,
  FileImage,
  Heart,
  History,
  LogOut,
  Moon,
  Search,
  Stethoscope,
  Sun,
  Syringe
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { PlanForm } from "../components/PlanForm.jsx";
import { ResultsTabs } from "../components/ResultsTabs.jsx";
import { PlanActions } from "../components/PlanActions.jsx";
import { SidebarPanels } from "../components/SidebarPanels.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { fetchFavorites, fetchHistory, fetchSamples, generatePlan, toggleFavoritePlan } from "../services/api.js";
import { DEFAULT_FORM, SAMPLE_PROMPTS, STORAGE_KEYS } from "../lib/constants.js";
import { loadFromStorage, saveToStorage } from "../lib/storage.js";

export function DashboardPage() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [currentPlan, setCurrentPlan] = useState(() => loadFromStorage(STORAGE_KEYS.currentPlan, null));
  const [history, setHistory] = useState(() => loadFromStorage(STORAGE_KEYS.history, []));
  const [favorites, setFavorites] = useState(() => loadFromStorage(STORAGE_KEYS.favorites, []));
  const [samples, setSamples] = useState([]);
  const [activeTab, setActiveTab] = useState("medical");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => loadFromStorage(STORAGE_KEYS.darkMode, false));
  const authMessage = location.state?.authMessage || "";

  useEffect(() => {
    document.title = "Care Planner";
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    saveToStorage(STORAGE_KEYS.darkMode, darkMode);
  }, [darkMode]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.currentPlan, currentPlan);
  }, [currentPlan]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.history, history);
  }, [history]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [historyData, favoritesData, sampleData] = await Promise.all([
          fetchHistory(),
          fetchFavorites(),
          fetchSamples()
        ]);

        setHistory(historyData);
        setFavorites(favoritesData);
        setSamples(sampleData);
      } catch (_bootstrapError) {
        setError("The application could not load saved content. You can still generate a new plan.");
      }
    }

    bootstrap();
  }, []);

  const quickSamples = useMemo(() => {
    if (samples.length) {
      return samples.map((sample) => sample.condition);
    }

    return SAMPLE_PROMPTS;
  }, [samples]);

  async function handleSubmit(payload) {
    setLoading(true);
    setError("");

    try {
      const plan = await generatePlan(payload);
      setCurrentPlan(plan);
      setActiveTab("medical");
      const updatedHistory = await fetchHistory();
      const updatedFavorites = await fetchFavorites();
      setHistory(updatedHistory);
      setFavorites(updatedFavorites);
    } catch (submitError) {
      setError(buildSubmitErrorMessage(payload.intakeMode, submitError.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleFavoriteToggle(planId) {
    try {
      const updated = await toggleFavoritePlan(planId);
      setCurrentPlan((previous) =>
        previous?.id === updated.id ? updated : previous
      );
      const updatedHistory = await fetchHistory();
      const updatedFavorites = await fetchFavorites();
      setHistory(updatedHistory);
      setFavorites(updatedFavorites);
    } catch (_favoriteError) {
      setError("The plan could not be updated. Please try again.");
    }
  }

  function handleSampleClick(condition) {
    setFormData((previous) => ({
      ...previous,
      intakeMode: "condition",
      condition,
      basicMode: true
    }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(65,121,128,0.35),_transparent_32%),linear-gradient(135deg,_#f7f4ef,_#dce7e7_48%,_#f4efe8)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(94,151,156,0.18),_transparent_28%),linear-gradient(135deg,_#0f1719,_#182427_40%,_#22353b)]" />
      <div className="absolute inset-0 -z-10 bg-medical-grid bg-[size:28px_28px] opacity-20 dark:opacity-10" />

      <main className="mx-auto flex min-h-screen max-w-7xl min-w-0 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="mb-6 min-w-0 rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-panel backdrop-blur transition duration-200 hover:shadow-panel-hover dark:border-white/10 dark:bg-slate-900/80 sm:p-7">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-clinic-200 bg-clinic-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-clinic-700 dark:border-clinic-700/50 dark:bg-clinic-900/40 dark:text-clinic-100">
                <ClipboardPlus className="h-4 w-4" />
                Care Planner
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-4xl leading-tight text-slate-950 dark:text-white sm:text-5xl">
                  Structured medical and nursing care planning with safety-first drafting.
                </h1>
                <p className="mt-4 max-w-2xl break-words text-base leading-7 text-slate-700 dark:text-slate-300">
                  Enter a condition name, describe symptoms, or upload a condition-related image to create a clinical-support draft. Every result includes disclaimers, emergency warning signs, and clinician-review reminders.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard icon={Syringe} title="Medical + Nursing" detail="Three-tab output with organized care planning sections." />
                <StatCard icon={AlertTriangle} title="Safety Guardrails" detail="Urgent-care warnings and non-final advice framing built in." />
                <StatCard icon={Search} title="Three Intake Modes" detail="Condition, image, and symptom analysis stay within one dashboard." />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row lg:w-[18rem] lg:flex-col">
              <div className="min-w-0 rounded-3xl border border-slate-200/80 bg-white px-4 py-4 text-sm shadow-panel-soft dark:border-white/10 dark:bg-slate-950/90">
                <div className="font-semibold text-slate-900 dark:text-white">{currentUser?.fullName}</div>
                <div className="mt-1 break-words text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {currentUser?.email}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDarkMode((previous) => !previous)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:border-clinic-300 hover:text-clinic-700 hover:shadow-button-focus dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {darkMode ? "Light mode" : "Dark mode"}
              </button>

              {currentPlan ? (
                <button
                  type="button"
                  onClick={() => handleFavoriteToggle(currentPlan.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-button-focus dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
                >
                  <Heart className={`h-5 w-5 ${currentPlan.isFavorite ? "fill-current" : ""}`} />
                  {currentPlan.isFavorite ? "Favorited" : "Add Favorite"}
                </button>
              ) : null}

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:border-clinic-300 hover:text-clinic-700 hover:shadow-button-focus dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="grid min-w-0 flex-1 gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6">
            <PlanForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
              sampleConditions={quickSamples}
              onSampleClick={handleSampleClick}
            />

            <SidebarPanels
              history={history}
              favorites={favorites}
              onSelectPlan={setCurrentPlan}
            />
          </div>

          <div className="min-w-0 space-y-6">
            <div className="min-w-0 rounded-[2rem] border border-white/50 bg-white/85 p-5 shadow-panel backdrop-blur transition duration-200 hover:shadow-panel-hover dark:border-white/10 dark:bg-slate-900/80 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                    Care Planner Report
                  </h2>
                  <p className="mt-1 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                    Clean, printable output for educational and clinician-reviewed drafting support.
                  </p>
                </div>
                <PlanActions plan={currentPlan} />
              </div>

              {error ? (
                <ErrorPanel message={error} mode={formData.intakeMode} />
              ) : null}

              {authMessage ? (
                <div className="mt-4 min-w-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                  {authMessage}
                </div>
              ) : null}

              {loading ? (
                <LoadingPanel mode={formData.intakeMode} />
              ) : currentPlan ? (
                <ResultsTabs
                  plan={currentPlan}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              ) : (
                <EmptyState mode={formData.intakeMode} />
              )}
            </div>

            <section className="grid gap-4 md:grid-cols-3">
              <InfoTile icon={AlertTriangle} title="Drafting Use Only" text="This output is not a substitute for licensed medical or nursing judgment." />
              <InfoTile icon={History} title="Signed-In Workspace" text="Users stay logged in on refresh with local session persistence and protected routing." />
              <InfoTile icon={Heart} title="Saved Access" text="Favorites and recent reports remain easy to reopen inside Care Planner." />
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, title, detail }) {
  return (
    <div className="min-w-0 rounded-3xl border border-slate-200/80 bg-slate-50/75 p-4 shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:border-clinic-200 hover:shadow-panel dark:border-white/10 dark:bg-white/5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-2xl bg-clinic-100 p-2.5 text-clinic-700 dark:bg-clinic-900/50 dark:text-clinic-100">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, title, text }) {
  return (
    <div className="min-w-0 rounded-3xl border border-white/50 bg-white/80 p-5 shadow-panel transition duration-200 hover:-translate-y-0.5 hover:shadow-panel-hover dark:border-white/10 dark:bg-slate-900/75">
      <div className="flex min-w-0 items-start gap-3">
        <div className="rounded-2xl bg-amber-100 p-2.5 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="break-words text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingPanel({ mode }) {
  const label =
    mode === "image"
      ? "Running image analysis and drafting clinician-review sections..."
      : mode === "symptom"
        ? "Analyzing symptoms and drafting likely-condition support..."
        : "Generating structured medical and nursing care planning support...";

  return (
    <div className="min-w-0 space-y-5 py-8">
      <div className="min-w-0">
        <div className="h-5 w-56 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        <p className="mt-3 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">{label}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <ProgressTile title="Input Review" detail={mode === "image" ? "Preview and context notes" : mode === "symptom" ? "Symptoms, duration, and vitals" : "Condition and patient context"} />
        <ProgressTile title="Safety Framing" detail="Possible matches, not final diagnosis" />
        <ProgressTile title="Report Assembly" detail="Medical, nursing, and education sections" />
      </div>
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-3xl bg-slate-100 dark:bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ mode }) {
  const content = {
    image: {
      icon: FileImage,
      title: "Image analysis results will appear here",
      text:
        "Upload a clear condition-related image, add context, and Care Planner will draft possible findings, care guidance, education, and red-flag warnings."
    },
    symptom: {
      icon: Stethoscope,
      title: "Symptom-based suggestions will appear here",
      text:
        "Describe symptoms, duration, severity, and history to generate a polished clinical-support draft with likely matches and evaluation guidance."
    },
    condition: {
      icon: ClipboardPlus,
      title: "No care plan generated yet",
      text:
        "Start with a condition name, symptom description, or image upload on the left. Care Planner will generate a structured clinical-support draft with medical, nursing, safety, and patient-education sections."
    }
  };

  const item = content[mode] || content.condition;
  const Icon = item.icon;

  return (
    <div className="min-w-0 py-10">
      <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(145deg,rgba(248,250,252,0.95),rgba(236,253,245,0.45),rgba(255,255,255,0.98))] p-8 shadow-panel-soft dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.9),rgba(20,83,45,0.18),rgba(15,23,42,0.88))]">
        <div className="mx-auto min-w-0 max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-clinic-100 text-clinic-700 shadow-panel-soft dark:bg-clinic-900/40 dark:text-clinic-100">
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            {item.title}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl break-words text-base leading-7 text-slate-700 dark:text-slate-300">
            {item.text}
          </p>
          <div className="mt-6 grid gap-3 text-left md:grid-cols-3">
            <EmptyStateCard title="Possible Conditions" text="See likely matches and differential considerations with cautious confidence labels." />
            <EmptyStateCard title="Care Guidance" text="Review medical management, nursing interventions, monitoring, and education." />
            <EmptyStateCard title="Safety First" text="Every output keeps clinician-review reminders and urgent red-flag warnings visible." />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressTile({ title, detail }) {
  return (
    <div className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</div>
      <div className="mt-2 break-words text-sm leading-6 text-slate-700 dark:text-slate-200">{detail}</div>
    </div>
  );
}

function EmptyStateCard({ title, text }) {
  return (
    <div className="min-w-0 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-panel-soft dark:border-white/10 dark:bg-white/5">
      <div className="break-words text-base font-semibold text-slate-900 dark:text-white">{title}</div>
      <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function ErrorPanel({ message, mode }) {
  const detail =
    mode === "image"
      ? "Try a supported image type, confirm the file is 5 MB or smaller, and add short context notes if needed."
      : mode === "symptom"
        ? "Check the required symptom field, then review duration, vitals, and other details for obvious typos or omissions."
        : "Review the entered condition and patient context, then try generating the draft again.";

  return (
    <div className="mt-4 min-w-0 rounded-3xl border border-rose-200 bg-[linear-gradient(180deg,rgba(255,241,242,0.98),rgba(255,228,230,0.88))] px-4 py-4 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
      <div className="flex min-w-0 items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none" />
        <div className="min-w-0">
          <div className="break-words font-semibold">Care Planner could not complete this draft</div>
          <div className="mt-1 break-words leading-6">{message}</div>
          <div className="mt-2 text-xs uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300">What to check</div>
          <div className="mt-1 break-words leading-6">{detail}</div>
        </div>
      </div>
    </div>
  );
}

function buildSubmitErrorMessage(mode, rawMessage) {
  if (rawMessage) {
    return rawMessage;
  }

  if (mode === "image") {
    return "The image analysis draft could not be generated right now.";
  }

  if (mode === "symptom") {
    return "The symptom analysis draft could not be generated right now.";
  }

  return "The care plan could not be generated.";
}
