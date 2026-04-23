const MAX_HISTORY = 12;

class PlanStore {
  constructor() {
    this.plans = [];
  }

  savePlan(plan) {
    const existingIndex = this.plans.findIndex((item) => item.id === plan.id);

    if (existingIndex >= 0) {
      this.plans.splice(existingIndex, 1);
    }

    this.plans.unshift({
      ...plan,
      isFavorite: false
    });

    this.plans = this.plans.slice(0, MAX_HISTORY);
    return this.plans[0];
  }

  listHistory() {
    return this.plans;
  }

  listFavorites() {
    return this.plans.filter((item) => item.isFavorite);
  }

  getById(id) {
    return this.plans.find((item) => item.id === id);
  }

  toggleFavorite(id) {
    const plan = this.getById(id);

    if (!plan) {
      return null;
    }

    plan.isFavorite = !plan.isFavorite;
    return plan;
  }
}

export const planStore = new PlanStore();
