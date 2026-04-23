import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export function AuthForm({
  fields,
  formData,
  errors,
  message,
  messageTone = "neutral",
  onChange,
  onSubmit,
  submitLabel,
  loading
}) {
  const [visiblePasswords, setVisiblePasswords] = useState({});

  function togglePassword(name) {
    setVisiblePasswords((previous) => ({
      ...previous,
      [name]: !previous[name]
    }));
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {fields.map((field) => {
        const isPassword = field.type === "password";
        const isVisible = visiblePasswords[field.name];

        return (
          <label key={field.name} className="block">
            <span className="text-sm font-semibold text-slate-700">
              {field.label}
            </span>
            <div className="relative mt-1">
              <input
                name={field.name}
                type={isPassword && isVisible ? "text" : field.type}
                value={formData[field.name]}
                onChange={onChange}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-panel-soft outline-none transition duration-200 placeholder:text-slate-400 focus:ring-2 ${
                  errors[field.name]
                    ? "border-rose-300 focus:border-rose-300 focus:ring-rose-100"
                    : "border-slate-200 focus:border-clinic-400 focus:ring-clinic-100"
                } ${isPassword ? "pr-28" : ""}`}
              />
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => togglePassword(field.name)}
                  className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-slate-500 transition duration-200 hover:bg-slate-100 hover:text-slate-700"
                >
                  {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  {isVisible ? "Hide" : "Show"}
                </button>
              ) : null}
            </div>
            {errors[field.name] ? (
              <span className="mt-1 block text-xs text-rose-600">{errors[field.name]}</span>
            ) : null}
          </label>
        );
      })}

      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            messageTone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : messageTone === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-clinic-700 px-4 py-3.5 text-sm font-semibold text-white shadow-button-focus transition duration-200 hover:-translate-y-0.5 hover:bg-clinic-800 hover:shadow-panel disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {loading ? "Please wait..." : submitLabel}
      </button>
    </form>
  );
}
