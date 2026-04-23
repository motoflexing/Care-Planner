export function createPlanId() {
  return `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date());
}

export function createReferenceText(condition) {
  return `Placeholder references for ${condition}: consult up-to-date local protocols, nursing standards, and society guidelines before clinical use.`;
}
