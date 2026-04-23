import { jsPDF } from "jspdf";
import { Copy, Download, FileJson, Printer } from "lucide-react";

export function PlanActions({ plan }) {
  async function handleCopy() {
    if (!plan) return;
    await navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
  }

  function handlePrint() {
    if (!plan) return;
    window.print();
  }

  function handleExportJson() {
    if (!plan) return;

    const blob = new Blob([JSON.stringify(plan, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${plan.condition.toLowerCase().replace(/\s+/g, "-")}-care-planner-report.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleExportPdf() {
    if (!plan) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const lines = doc.splitTextToSize(buildPdfText(plan), 520);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${plan.condition} Care Planner Report`, 40, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(lines, 40, 76);
    doc.save(`${plan.condition.toLowerCase().replace(/\s+/g, "-")}-care-planner-report.pdf`);
  }

  const disabled = !plan;

  return (
    <div className="flex min-w-0 flex-wrap gap-2">
      <ActionButton onClick={handleCopy} icon={Copy} label="Copy" disabled={disabled} />
      <ActionButton onClick={handlePrint} icon={Printer} label="Print" disabled={disabled} />
      <ActionButton onClick={handleExportPdf} icon={Download} label="Export PDF" disabled={disabled} />
      <ActionButton onClick={handleExportJson} icon={FileJson} label="Export JSON" disabled={disabled} />
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, label, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-panel-soft transition duration-200 hover:-translate-y-0.5 hover:border-clinic-300 hover:text-clinic-700 hover:shadow-panel disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
    >
      <Icon className="h-5 w-5 flex-none" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function buildPdfText(plan) {
  const blocks = [
    `Disclaimer: ${plan.disclaimer}`,
    `Possible Condition: ${plan.condition}`,
    `Confidence: ${plan.confidenceLabel || "Low"}`,
    `Overview: ${plan.overview}`,
    `Reasoning Summary: ${plan.reasoningSummary}`,
    `Key Findings: ${(plan.keyFindings || []).join("; ")}`,
    `Differential Considerations: ${(plan.differentialConsiderations || []).join("; ")}`,
    `Recommended Medical Evaluation: ${(plan.medicalCarePlan.recommendedMedicalEvaluation || []).join("; ")}`,
    `Medical Management: ${plan.medicalCarePlan.medicalManagement.join("; ")}`,
    `Nursing Diagnoses: ${plan.nursingCarePlan.nursingDiagnoses.join("; ")}`,
    `Nursing Interventions: ${plan.nursingCarePlan.nursingInterventions
      .map((item) => `${item.intervention} Rationale: ${item.rationale}`)
      .join("; ")}`,
    `Monitoring Parameters: ${plan.medicalCarePlan.monitoringParameters.join("; ")}`,
    `Red-Flag Signs: ${plan.medicalCarePlan.redFlagEmergencySigns.join("; ")}`,
    `Patient Education: ${plan.patientEducationPlan.patientEducation.join("; ")}`,
    `Diet and Lifestyle: ${plan.patientEducationPlan.dietAndLifestyleAdvice.join("; ")}`,
    `Discharge Planning: ${plan.patientEducationPlan.followUpAdvice.join("; ")}`
  ];

  return blocks.join("\n\n");
}
