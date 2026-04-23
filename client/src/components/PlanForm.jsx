import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Camera,
  ChevronDown,
  FileImage,
  ImagePlus,
  Images,
  Info,
  Loader2,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  UploadCloud,
  X
} from "lucide-react";
import { validatePlanForm } from "../lib/validation.js";

const CONDITION_FIELDS = [
  { name: "age", label: "Patient age", placeholder: "e.g. 56" },
  { name: "gender", label: "Gender", placeholder: "e.g. Female" },
  { name: "severityLevel", label: "Severity level", placeholder: "e.g. Moderate" },
  { name: "symptoms", label: "Symptoms", placeholder: "e.g. fever, cough, dyspnea" },
  { name: "comorbidities", label: "Comorbidities", placeholder: "e.g. CKD, asthma" },
  { name: "allergies", label: "Allergies", placeholder: "e.g. penicillin" },
  { name: "vitals", label: "Vitals", placeholder: "e.g. BP 150/96, HR 102, SpO2 92%" },
  { name: "labFindings", label: "Lab findings", placeholder: "e.g. WBC elevated, HbA1c 9.2%" },
  { name: "specialNotes", label: "Special notes", placeholder: "e.g. pregnancy, frailty, poor oral intake" }
];

const SYMPTOM_FIELDS = [
  { name: "symptoms", label: "Symptoms", placeholder: "Describe the symptoms in detail", textarea: true },
  { name: "duration", label: "Duration", placeholder: "e.g. 4 days" },
  { name: "severityLevel", label: "Severity", placeholder: "e.g. Moderate to severe" },
  { name: "age", label: "Age", placeholder: "e.g. 67" },
  { name: "gender", label: "Gender", placeholder: "e.g. Male" },
  { name: "medicalHistory", label: "Relevant medical history", placeholder: "e.g. diabetes, asthma", textarea: true },
  { name: "allergies", label: "Allergies", placeholder: "e.g. sulfa" },
  { name: "vitals", label: "Vitals if known", placeholder: "e.g. Temp 38.7 C, SpO2 91%", textarea: true },
  { name: "specialNotes", label: "Free-text notes", placeholder: "Anything else relevant", textarea: true }
];

const MODES = [
  {
    id: "condition",
    label: "Condition Name Mode",
    eyebrow: "Established workflow",
    description: "Keep the existing disease-name flow with optional patient context for a more tailored draft.",
    icon: Sparkles
  },
  {
    id: "image",
    label: "Image Analysis Mode",
    eyebrow: "Visual review",
    description: "Upload a condition-related image and let Care Planner draft a cautious image-supported summary.",
    icon: ImagePlus
  },
  {
    id: "symptom",
    label: "Symptom Description Mode",
    eyebrow: "Clinical intake",
    description: "Describe symptoms, duration, severity, history, and vitals to generate likely-condition suggestions.",
    icon: Stethoscope
  }
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const EXTENSION_MIME_MAP = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif"
};

export function PlanForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  sampleConditions,
  onSampleClick
}) {
  const errors = validatePlanForm(formData);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadChooserOpen, setUploadChooserOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (formData.imagePreviewUrl) {
        URL.revokeObjectURL(formData.imagePreviewUrl);
      }
    };
  }, [formData.imagePreviewUrl]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setUploadChooserOpen(false);
      }
    }

    if (!uploadChooserOpen) {
      return undefined;
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [uploadChooserOpen]);

  useEffect(() => {
    if (!uploadChooserOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [uploadChooserOpen]);

  function updateForm(next) {
    setFormData((previous) => ({
      ...previous,
      ...next
    }));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    updateForm({
      [name]: type === "checkbox" ? checked : value
    });
  }

  function handleModeChange(mode) {
    setUploadError("");
    setUploadChooserOpen(false);
    updateForm({
      intakeMode: mode,
      basicMode: mode === "condition" ? formData.basicMode : false
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (Object.keys(errors).length > 0) {
      return;
    }

    onSubmit(formData);
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        resolve(result.split(",")[1] || "");
      };
      reader.onerror = () => reject(new Error("Unable to read the selected image."));
      reader.readAsDataURL(file);
    });
  }

  async function applyImageFile(file) {
    if (!file) {
      return;
    }

    const resolvedMimeType = resolveImageMimeType(file);

    if (!resolvedMimeType) {
      setUploadError("Use a supported image file such as JPG, PNG, WEBP, or HEIC.");
      clearImageSelection();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Use an image that is 5 MB or smaller.");
      clearImageSelection();
      return;
    }

    setUploadError("");

    if (formData.imagePreviewUrl) {
      URL.revokeObjectURL(formData.imagePreviewUrl);
    }

    try {
      const imageBase64 = await fileToBase64(file);

      updateForm({
        intakeMode: "image",
        imageFile: file,
        imagePreviewUrl: URL.createObjectURL(file),
        imageName: file.name,
        imageMimeType: resolvedMimeType,
        imageBase64
      });
    } catch (_error) {
      setUploadError("The image could not be read. Try a different file or re-upload it.");
      clearImageSelection();
    }
  }

  function clearInputElements() {
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  }

  function clearImageSelection() {
    if (formData.imagePreviewUrl) {
      URL.revokeObjectURL(formData.imagePreviewUrl);
    }

    clearInputElements();
    updateForm({
      imageFile: null,
      imagePreviewUrl: "",
      imageName: "",
      imageMimeType: "",
      imageBase64: ""
    });
  }

  function handleFileInput(event) {
    const [file] = Array.from(event.target.files || []);
    applyImageFile(file).catch(() => {
      setUploadError("The selected image could not be processed.");
    });
  }

  function handleRemoveImage() {
    setUploadError("");
    setUploadChooserOpen(false);
    clearImageSelection();
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);
    const [file] = Array.from(event.dataTransfer.files || []);
    applyImageFile(file).catch(() => {
      setUploadError("The dropped image could not be processed.");
    });
  }

  function openGalleryPicker() {
    setUploadError("");
    setUploadChooserOpen(false);
    galleryInputRef.current?.click();
  }

  function openCameraPicker() {
    setUploadError("");
    setUploadChooserOpen(false);
    cameraInputRef.current?.click();
  }

  function openUploadChooser() {
    setUploadError("");
    setUploadChooserOpen(true);
  }

  const imageModeSubmitDisabled = formData.intakeMode === "image" && !formData.imageBase64;

  return (
    <section className="min-w-0 rounded-[2rem] border border-white/50 bg-white/85 p-5 shadow-panel backdrop-blur transition duration-200 hover:shadow-panel-hover dark:border-white/10 dark:bg-slate-900/80 sm:p-6">
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden="true"
        onChange={handleFileInput}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        aria-hidden="true"
        onChange={handleFileInput}
      />
      {uploadChooserOpen ? (
        <UploadChooserModal
          onClose={() => setUploadChooserOpen(false)}
          onOpenGallery={openGalleryPicker}
          onOpenCamera={openCameraPicker}
        />
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Patient Intake
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-300">
            Choose a mode and build a clinician-reviewed educational draft with clear safety framing.
          </p>
        </div>
        {formData.intakeMode === "condition" ? (
          <label className="inline-flex shrink-0 items-center gap-2 rounded-full border border-clinic-200 bg-clinic-50 px-3 py-2 text-sm font-medium text-clinic-700 dark:border-clinic-800 dark:bg-clinic-900/30 dark:text-clinic-100">
            <input
              type="checkbox"
              name="basicMode"
              checked={formData.basicMode}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-clinic-600 focus:ring-clinic-500"
            />
            Basic mode
          </label>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const selected = formData.intakeMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => handleModeChange(mode.id)}
              className={`min-w-0 rounded-3xl border p-5 text-left shadow-panel-soft transition duration-200 ${
                selected
                  ? "border-clinic-400 bg-[linear-gradient(145deg,rgba(228,244,244,0.95),rgba(255,255,255,0.95))] shadow-panel dark:border-clinic-500/40 dark:bg-[linear-gradient(145deg,rgba(19,60,64,0.45),rgba(15,23,42,0.7))]"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-clinic-300 hover:shadow-panel dark:border-white/10 dark:bg-slate-950"
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-2xl bg-clinic-100 p-2.5 text-clinic-700 dark:bg-clinic-900/40 dark:text-clinic-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-500">
                    {mode.eyebrow}
                  </div>
                  <div className="mt-1 break-words text-base font-semibold text-slate-950 dark:text-white">{mode.label}</div>
                  <div className="mt-1 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">{mode.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <ModeGuidanceCard mode={formData.intakeMode} />

      {formData.intakeMode === "condition" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {sampleConditions.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => onSampleClick(condition)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:border-clinic-300 hover:text-clinic-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              {condition}
            </button>
          ))}
        </div>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {formData.intakeMode === "condition" ? (
          <ConditionMode
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        ) : null}

        {formData.intakeMode === "image" ? (
          <ImageMode
            formData={formData}
            errors={errors}
            uploadError={uploadError}
            handleChange={handleChange}
            handleDrop={handleDrop}
            dragActive={dragActive}
            onRemoveImage={handleRemoveImage}
            onDragStateChange={setDragActive}
            onOpenUploadChooser={openUploadChooser}
          />
        ) : null}

        {formData.intakeMode === "symptom" ? (
          <SymptomMode
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        ) : null}

        <SafetyBanner mode={formData.intakeMode} />

        <button
          type="submit"
          disabled={loading || imageModeSubmitDisabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-clinic-700 px-4 py-3.5 text-sm font-semibold text-white shadow-button-focus transition duration-200 hover:-translate-y-0.5 hover:bg-clinic-800 hover:shadow-panel disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-clinic-300 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          {loading ? loadingLabel(formData.intakeMode) : submitLabel(formData.intakeMode)}
        </button>
      </form>
    </section>
  );
}

function ConditionMode({ formData, errors, handleChange }) {
  return (
    <>
      <Field
        label="Disease / condition"
        name="condition"
        value={formData.condition}
        onChange={handleChange}
        placeholder="Enter disease or condition"
        error={errors.condition}
        required
      />

      {!formData.basicMode ? (
        <div className="grid gap-4">
          {CONDITION_FIELDS.map((field) => (
            <Field
              key={field.name}
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              error={errors[field.name]}
              textarea={field.name !== "age" && field.name !== "gender" && field.name !== "severityLevel"}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}

function ImageMode({
  formData,
  errors,
  uploadError,
  handleChange,
  handleDrop,
  dragActive,
  onRemoveImage,
  onDragStateChange,
  onOpenUploadChooser
}) {
  const hasImage = Boolean(formData.imagePreviewUrl);

  return (
    <div className="min-w-0 space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          onDragStateChange(true);
        }}
        onDragLeave={() => onDragStateChange(false)}
        className={`min-w-0 rounded-[1.75rem] border border-dashed p-5 transition ${
          dragActive
            ? "border-clinic-500 bg-clinic-50 shadow-inner dark:bg-clinic-900/20"
            : "border-slate-300 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.85))] dark:border-white/15 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
        }`}
      >
        {!hasImage ? (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-clinic-100 text-clinic-700 shadow-sm dark:bg-clinic-900/40 dark:text-clinic-100">
              <UploadCloud className="h-7 w-7" />
            </div>
            <div className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              Upload a condition-related image
            </div>
            <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              Add a clear photo from your gallery or use the camera where supported. Care Planner will draft possible findings, suggested next steps, red flags, and education content.
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <UploadChip label="Preview before submit" />
              <UploadChip label="5 MB max" />
              <UploadChip label="No final diagnosis" />
            </div>
            <div className="mt-5 flex justify-center">
              <PrimaryUploadButton label="Upload Image" onClick={onOpenUploadChooser} />
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start">
            <div className="relative self-start">
              <img
                src={formData.imagePreviewUrl}
                alt="Uploaded preview"
                className="h-40 w-40 rounded-3xl border border-slate-200 object-cover shadow-sm dark:border-white/10"
              />
              <div className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-2 py-1 text-[11px] font-semibold text-white">
                Ready for review
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-2xl bg-clinic-100 p-2 text-clinic-700 dark:bg-clinic-900/40 dark:text-clinic-100">
                  <FileImage className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                    {formData.imageName}
                  </div>
                  <div className="mt-1 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Preview confirmed. You can replace the image, switch input source, or remove it before analysis.
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <PrimaryUploadButton label="Replace Image" onClick={onOpenUploadChooser} />
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100"
                >
                  <X className="h-4 w-4" />
                  Remove image
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <HelperPill label="Image-only review is limited" tone="warning" />
                <HelperPill label="Add notes to improve context" tone="neutral" />
              </div>
            </div>
          </div>
        )}
      </div>

      {errors.image || uploadError ? (
        <InlineFeedback tone="error" icon={AlertTriangle} message={errors.image || uploadError} />
      ) : (
        <InlineFeedback
          tone="info"
          icon={Info}
          message="Images alone may be insufficient. Consider adding onset, symptoms, location, spread, pain, itch, or exposure notes."
        />
      )}

      <div className="grid gap-4">
        <Field
          label="Context / notes"
          name="contextNotes"
          value={formData.contextNotes}
          onChange={handleChange}
          placeholder="e.g. itchy rash on forearm for 3 days after using a new cream"
          textarea
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g. 34"
            error={errors.age}
          />
          <Field
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="e.g. Female"
          />
        </div>
        <Field
          label="Additional notes"
          name="specialNotes"
          value={formData.specialNotes}
          onChange={handleChange}
          placeholder="e.g. painful, spreading, no fever"
          textarea
        />
      </div>
    </div>
  );
}

function SymptomMode({ formData, errors, handleChange }) {
  const hasData = Boolean(
    formData.symptoms ||
      formData.duration ||
      formData.severityLevel ||
      formData.medicalHistory ||
      formData.vitals
  );

  return (
    <div className="min-w-0 space-y-4">
      {!hasData ? (
        <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(255,255,255,0.92))] p-5 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
          <div className="flex min-w-0 items-start gap-3">
            <div className="rounded-2xl bg-clinic-100 p-2 text-clinic-700 dark:bg-clinic-900/40 dark:text-clinic-100">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="break-words text-sm font-semibold text-slate-900 dark:text-white">
                Build a stronger symptom intake
              </h3>
              <p className="mt-1 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                Start with the main symptoms, then add duration, severity, medical history, allergies, and vitals if you know them. More context helps Care Planner draft safer, more useful suggestions.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <HelperPill label="Symptoms required" tone="neutral" />
                <HelperPill label="Vitals improve urgency guidance" tone="neutral" />
                <HelperPill label="Not a diagnosis" tone="warning" />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4">
        {SYMPTOM_FIELDS.map((field) => (
          <Field
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            error={errors[field.name]}
            textarea={field.textarea}
            required={field.name === "symptoms"}
          />
        ))}
      </div>

      <InlineFeedback
        tone={errors.symptoms ? "error" : "info"}
        icon={errors.symptoms ? AlertTriangle : Info}
        message={
          errors.symptoms ||
          "Symptom overlap is common. Use this mode for educational drafting and follow up with a licensed healthcare professional for clinical evaluation."
        }
      />
    </div>
  );
}

function ModeGuidanceCard({ mode }) {
  const content = {
    condition: {
      title: "Condition-guided planning",
      detail:
        "Best when you already know the working condition and want organized medical and nursing planning support."
    },
    image: {
      title: "Image-assisted review",
      detail:
        "Best for visible findings such as rashes, wounds, or swelling when you want a cautious image-supported draft."
    },
    symptom: {
      title: "Symptom-assisted reasoning",
      detail:
        "Best when the condition is unclear and you need possible matches, differential considerations, and evaluation guidance."
    }
  };

  const item = content[mode] || content.condition;

  return (
      <div className="mt-5 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-panel-soft dark:border-white/10 dark:bg-white/5">
        <div className="flex min-w-0 items-start gap-3">
        <div className="rounded-2xl bg-white p-2.5 text-clinic-700 shadow-panel-soft dark:bg-slate-950 dark:text-clinic-100">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="break-words text-base font-semibold text-slate-900 dark:text-white">{item.title}</div>
          <div className="mt-1 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">{item.detail}</div>
        </div>
      </div>
    </div>
  );
}

function UploadChooserModal({ onClose, onOpenGallery, onOpenCamera }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Choose image source"
    >
      <button
        type="button"
        aria-label="Close upload chooser"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-[1.8rem] border border-white/40 bg-[linear-gradient(160deg,rgba(255,255,255,0.97),rgba(236,253,245,0.92),rgba(241,245,249,0.97))] p-5 shadow-[0_28px_90px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.97),rgba(16,63,63,0.92),rgba(15,23,42,0.98))]">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300/80 dark:bg-white/15 sm:hidden" />
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
              Image Source
            </div>
            <h3 className="mt-1 break-words text-lg font-semibold text-slate-900 dark:text-white">
              Upload for Image Analysis
            </h3>
            <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
              Choose a source for your image. Care Planner will use it only to create a clinician-reviewed educational draft.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-clinic-300 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <UploadActionButton
            icon={Images}
            title="Choose from Gallery"
            detail="Browse saved photos and select an image file"
            onClick={onOpenGallery}
          />
          <UploadActionButton
            icon={Camera}
            title="Use Camera"
            detail="Capture a new image where camera input is supported"
            onClick={onOpenCamera}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-amber-200/90 bg-[linear-gradient(180deg,rgba(255,251,235,0.98),rgba(255,243,205,0.92))] px-4 py-3 text-xs leading-6 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          <div className="flex min-w-0 items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
            <div className="min-w-0 break-words">
              Images alone may be insufficient. Final interpretation requires clinical examination and licensed professional review.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function resolveImageMimeType(file) {
  if (file?.type && ACCEPTED_TYPES.includes(file.type)) {
    return file.type;
  }

  const extension = file?.name?.split(".").pop()?.toLowerCase() || "";
  return EXTENSION_MIME_MAP[extension] || "";
}

function PrimaryUploadButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl bg-clinic-700 px-4 py-3 text-sm font-semibold text-white shadow-button-focus transition duration-200 hover:-translate-y-0.5 hover:bg-clinic-800 hover:shadow-panel focus:outline-none focus:ring-2 focus:ring-clinic-300 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
    >
      <UploadCloud className="h-5 w-5 flex-none" />
      <span>{label}</span>
      <ChevronDown className="h-5 w-5 flex-none opacity-80" />
    </button>
  );
}

function SafetyBanner({ mode }) {
  const detail =
    mode === "image"
      ? "Image analysis drafts possible matches only. Lighting, angle, and missing clinical context can change interpretation."
      : mode === "symptom"
        ? "Symptom analysis drafts likely patterns only. Many serious and minor conditions can share the same symptoms."
        : "Condition-based outputs remain educational drafts that should still be reviewed and adapted by a licensed professional.";

  return (
    <div className="rounded-2xl border border-amber-300 bg-[linear-gradient(180deg,rgba(255,251,235,1),rgba(255,244,214,0.96))] px-4 py-4 text-sm leading-6 text-amber-950 shadow-sm dark:border-amber-400/30 dark:bg-[linear-gradient(180deg,rgba(120,53,15,0.18),rgba(120,53,15,0.12))] dark:text-amber-50">
      <div className="flex min-w-0 items-start gap-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 flex-none" />
        <div className="min-w-0">
          <div className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-200">Educational Clinical-Support Draft Only</div>
          <div className="mt-2 break-words">
            Care Planner may suggest possible or likely conditions, but it does not provide a final diagnosis, does not replace examination, and urgent symptoms should prompt emergency evaluation. {detail}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadActionButton({ icon: Icon, title, detail, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:border-clinic-300 hover:bg-clinic-50/60 hover:shadow-panel focus:outline-none focus:ring-2 focus:ring-clinic-300 focus:ring-offset-2 dark:border-white/10 dark:bg-slate-950 dark:hover:bg-white/5 dark:focus:ring-offset-slate-900"
    >
      <div className="rounded-2xl bg-clinic-100 p-2.5 text-clinic-700 dark:bg-clinic-900/40 dark:text-clinic-100">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="break-words text-base font-semibold text-slate-900 dark:text-white">{title}</div>
        <div className="mt-1 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">{detail}</div>
      </div>
    </button>
  );
}

function UploadChip({ label }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-slate-950">
      {label}
    </span>
  );
}

function HelperPill({ label, tone = "neutral" }) {
  const className =
    tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
      : "border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`}>{label}</span>;
}

function InlineFeedback({ tone = "info", icon: Icon, message }) {
  const className =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"
      : "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${className}`}>
      <div className="flex min-w-0 items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 flex-none" />
        <div className="min-w-0 break-words leading-6">{message}</div>
      </div>
    </div>
  );
}

function submitLabel(mode) {
  if (mode === "image") {
    return "Analyze Image";
  }

  if (mode === "symptom") {
    return "Analyze Symptoms";
  }

  return "Generate Care Plan";
}

function loadingLabel(mode) {
  if (mode === "image") {
    return "Analyzing image...";
  }

  if (mode === "symptom") {
    return "Analyzing symptoms...";
  }

  return "Generating care plan...";
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  textarea = false,
  required = false
}) {
  const baseClassName =
    "mt-1.5 block w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-panel-soft outline-none transition duration-200 placeholder:text-slate-400 focus:border-clinic-400 focus:ring-2 focus:ring-clinic-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-clinic-500 dark:focus:ring-clinic-900/30";

  return (
    <label className="block min-w-0">
      <span className="block break-words text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
        {required ? " *" : ""}
      </span>
      {textarea ? (
        <textarea
          rows={3}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClassName}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClassName}
        />
      )}
      {error ? (
        <span className="mt-1 block break-words text-xs leading-5 text-rose-600 dark:text-rose-300">{error}</span>
      ) : null}
    </label>
  );
}
