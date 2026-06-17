const STORAGE_KEY = "goal-tracker-goals-v1";
const DAILY_STORAGE_KEY = "goal-tracker-daily-top-3-v1";
const goalCategories = ["Money", "Music", "Fitness", "Business", "Faith", "Personal"];
const priorityWeight = {
  High: 3,
  Medium: 2,
  Low: 1,
};
const starterGoal = {
  name: "Lose 20 pounds",
  priority: "High",
  current: 0,
  target: 20,
  unit: "pounds",
  category: "Fitness",
  smallGoals: ["Change diet", "Go to gym", "Cut extra sugar"],
};

const elements = {
  newGoalButton: document.querySelector("#newGoalButton"),
  emptyCreateButton: document.querySelector("#emptyCreateButton"),
  exampleGoalButton: document.querySelector("#exampleGoalButton"),
  goalCount: document.querySelector("#goalCount"),
  statTotalGoals: document.querySelector("#statTotalGoals"),
  statCompletedGoals: document.querySelector("#statCompletedGoals"),
  statAverageProgress: document.querySelector("#statAverageProgress"),
  dailyDate: document.querySelector("#dailyDate"),
  dailyTopList: document.querySelector("#dailyTopList"),
  sortGoals: document.querySelector("#sortGoals"),
  goalList: document.querySelector("#goalList"),
  emptyState: document.querySelector("#emptyState"),
  goalDetail: document.querySelector("#goalDetail"),
  detailName: document.querySelector("#detailName"),
  detailPriority: document.querySelector("#detailPriority"),
  detailCategory: document.querySelector("#detailCategory"),
  detailMetric: document.querySelector("#detailMetric"),
  checklistPercent: document.querySelector("#checklistPercent"),
  checklistFill: document.querySelector("#checklistFill"),
  currentMetric: document.querySelector("#currentMetric"),
  metricForm: document.querySelector("#metricForm"),
  editGoalButton: document.querySelector("#editGoalButton"),
  deleteGoalButton: document.querySelector("#deleteGoalButton"),
  smallGoalSummary: document.querySelector("#smallGoalSummary"),
  smallGoalForm: document.querySelector("#smallGoalForm"),
  smallGoalInput: document.querySelector("#smallGoalInput"),
  smallGoalList: document.querySelector("#smallGoalList"),
  goalDialog: document.querySelector("#goalDialog"),
  goalForm: document.querySelector("#goalForm"),
  dialogMode: document.querySelector("#dialogMode"),
  dialogTitle: document.querySelector("#dialogTitle"),
  closeDialogButton: document.querySelector("#closeDialogButton"),
  cancelGoalButton: document.querySelector("#cancelGoalButton"),
  saveGoalButton: document.querySelector("#saveGoalButton"),
  goalName: document.querySelector("#goalName"),
  goalPriority: document.querySelector("#goalPriority"),
  goalCategory: document.querySelector("#goalCategory"),
  goalCurrent: document.querySelector("#goalCurrent"),
  goalTarget: document.querySelector("#goalTarget"),
  goalUnit: document.querySelector("#goalUnit"),
};

let goals = loadGoals();
let selectedGoalId = goals[0]?.id ?? null;
let dailyTop3 = loadDailyTop3();
let editingGoalId = null;
let editingSmallGoalId = null;
let recentlyCompletedSmallGoalId = null;

function loadGoals() {
  try {
    const savedGoals = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(savedGoals) ? savedGoals.map(normalizeGoal) : [];
  } catch {
    return [];
  }
}

function normalizeGoal(goal) {
  return {
    id: goal.id ?? createId(),
    name: String(goal.name ?? "Untitled Goal"),
    priority: ["High", "Medium", "Low"].includes(goal.priority) ? goal.priority : "Medium",
    category: goalCategories.includes(goal.category) ? goal.category : "Personal",
    current: Number.isFinite(Number(goal.current)) ? Number(goal.current) : 0,
    target: Number.isFinite(Number(goal.target)) && Number(goal.target) > 0 ? Number(goal.target) : 1,
    unit: String(goal.unit ?? "").trim(),
    createdAt: Number.isFinite(Number(goal.createdAt)) ? Number(goal.createdAt) : Date.now(),
    smallGoals: Array.isArray(goal.smallGoals)
      ? goal.smallGoals.map((smallGoal) => ({
          id: smallGoal.id ?? createId(),
          title: String(smallGoal.title ?? "Step"),
          completed: Boolean(smallGoal.completed),
        }))
      : [],
  };
}

function createId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveGoals() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

function createStarterGoal() {
  const newGoal = {
    id: createId(),
    name: starterGoal.name,
    priority: starterGoal.priority,
    category: starterGoal.category,
    current: starterGoal.current,
    target: starterGoal.target,
    unit: starterGoal.unit,
    createdAt: Date.now(),
    smallGoals: starterGoal.smallGoals.map((title) => ({
      id: createId(),
      title,
      completed: false,
    })),
  };

  goals.push(newGoal);
  selectedGoalId = newGoal.id;
  saveGoals();
  render();
}

function getSelectedGoal() {
  return goals.find((goal) => goal.id === selectedGoalId) ?? null;
}

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function formatTodayLabel() {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date());
}

function createBlankDailyTop3() {
  return {
    date: getTodayKey(),
    priorities: Array.from({ length: 3 }, () => ({ text: "", completed: false })),
  };
}

function loadDailyTop3() {
  try {
    const savedDaily = JSON.parse(localStorage.getItem(DAILY_STORAGE_KEY) ?? "null");
    if (!savedDaily || savedDaily.date !== getTodayKey() || !Array.isArray(savedDaily.priorities)) {
      return createBlankDailyTop3();
    }

    return {
      date: savedDaily.date,
      priorities: Array.from({ length: 3 }, (_, index) => ({
        text: String(savedDaily.priorities[index]?.text ?? ""),
        completed: Boolean(savedDaily.priorities[index]?.completed),
      })),
    };
  } catch {
    return createBlankDailyTop3();
  }
}

function saveDailyTop3() {
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(dailyTop3));
}

function getSortedGoals() {
  const sortMode = elements.sortGoals.value;
  return [...goals].sort((first, second) => {
    if (sortMode === "priority") {
      return priorityWeight[second.priority] - priorityWeight[first.priority] || first.createdAt - second.createdAt;
    }

    if (sortMode === "progress") {
      return getGoalProgress(second) - getGoalProgress(first);
    }

    if (sortMode === "name") {
      return first.name.localeCompare(second.name);
    }

    return second.createdAt - first.createdAt;
  });
}

function getChecklistProgress(goal) {
  if (goal.smallGoals.length === 0) {
    return 0;
  }

  const completed = goal.smallGoals.filter((smallGoal) => smallGoal.completed).length;
  return Math.round((completed / goal.smallGoals.length) * 100);
}

function getMetricProgress(goal) {
  return Math.min(100, Math.round((goal.current / goal.target) * 100));
}

function getGoalProgress(goal) {
  const metricProgress = getMetricProgress(goal);

  if (goal.smallGoals.length === 0) {
    return metricProgress;
  }

  return Math.round((getChecklistProgress(goal) + metricProgress) / 2);
}

function getProgressTone(progress) {
  if (progress >= 100) {
    return "complete";
  }

  if (progress >= 75) {
    return "near";
  }

  if (progress >= 40) {
    return "mid";
  }

  if (progress > 0) {
    return "early";
  }

  return "empty";
}

function formatProgressLabel(progress) {
  return progress >= 100 ? "Goal complete" : `${progress}% goal progress`;
}

function formatMetric(goal) {
  const unit = goal.unit ? ` ${goal.unit}` : "";
  return `${goal.current} / ${goal.target}${unit}`;
}

function render() {
  const sortedGoals = getSortedGoals();

  if (!goals.some((goal) => goal.id === selectedGoalId)) {
    selectedGoalId = sortedGoals[0]?.id ?? null;
  }

  renderDashboardStats();
  renderDailyTop3();
  renderGoalList(sortedGoals);
  renderGoalDetail();
}

function renderDashboardStats() {
  const totalGoals = goals.length;
  const completedGoals = goals.filter((goal) => getGoalProgress(goal) >= 100).length;
  const averageProgress = totalGoals
    ? Math.round(goals.reduce((sum, goal) => sum + getGoalProgress(goal), 0) / totalGoals)
    : 0;

  elements.statTotalGoals.textContent = totalGoals;
  elements.statCompletedGoals.textContent = completedGoals;
  elements.statAverageProgress.textContent = `${averageProgress}%`;
}

function renderDailyTop3() {
  elements.dailyDate.textContent = formatTodayLabel();
  elements.dailyTopList.replaceChildren();

  dailyTop3.priorities.forEach((priority, index) => {
    const row = document.createElement("div");
    row.className = `daily-item${priority.completed ? " completed" : ""}`;

    const checkLabel = document.createElement("label");
    checkLabel.className = "daily-check";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = priority.completed;
    checkbox.dataset.dailyAction = "toggle";
    checkbox.dataset.dailyIndex = index;
    checkbox.ariaLabel = `Mark daily priority ${index + 1} complete`;

    const checkVisual = document.createElement("span");
    checkVisual.className = "checkbox-visual";
    checkVisual.setAttribute("aria-hidden", "true");

    const input = document.createElement("input");
    input.className = "daily-input";
    input.type = "text";
    input.value = priority.text;
    input.placeholder = `Priority ${index + 1}`;
    input.dataset.dailyAction = "text";
    input.dataset.dailyIndex = index;
    input.autocomplete = "off";

    checkLabel.append(checkbox, checkVisual);
    row.append(checkLabel, input);
    elements.dailyTopList.append(row);
  });
}

function renderGoalList(sortedGoals) {
  elements.goalCount.textContent = `${goals.length} ${goals.length === 1 ? "goal" : "goals"}`;
  elements.goalList.replaceChildren();

  if (goals.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-list-message";
    emptyMessage.textContent = "Your goals will appear here.";
    elements.goalList.append(emptyMessage);
    return;
  }

  sortedGoals.forEach((goal) => {
    const progress = getGoalProgress(goal);
    const goalCard = document.createElement("button");
    goalCard.className = `goal-card${goal.id === selectedGoalId ? " active" : ""}`;
    goalCard.type = "button";
    goalCard.dataset.goalId = goal.id;

    const titleRow = document.createElement("div");
    titleRow.className = "goal-card-title";

    const title = document.createElement("strong");
    title.textContent = goal.name;

    const priority = document.createElement("span");
    priority.className = `priority-pill priority-${goal.priority.toLowerCase()}`;
    priority.textContent = goal.priority;

    titleRow.append(title, priority);

    const category = document.createElement("span");
    category.className = "category-pill";
    category.textContent = goal.category;

    const metric = document.createElement("p");
    metric.className = "metric-text";
    metric.textContent = `Success metric: ${formatMetric(goal)}`;

    const miniProgress = document.createElement("div");
    miniProgress.className = "mini-progress";

    const miniProgressLabel = document.createElement("span");
    miniProgressLabel.textContent = formatProgressLabel(progress);

    const progressTrack = document.createElement("div");
    progressTrack.className = "progress-track";

    const progressFill = document.createElement("div");
    progressFill.className = `progress-fill progress-${getProgressTone(progress)}`;
    progressFill.style.width = `${progress}%`;

    progressTrack.append(progressFill);
    miniProgress.append(miniProgressLabel, progressTrack);
    goalCard.append(titleRow, category, metric, miniProgress);
    elements.goalList.append(goalCard);
  });
}

function renderGoalDetail() {
  const selectedGoal = getSelectedGoal();

  elements.emptyState.classList.toggle("hidden", Boolean(selectedGoal));
  elements.goalDetail.classList.toggle("hidden", !selectedGoal);

  if (!selectedGoal) {
    return;
  }

  const metricProgress = getMetricProgress(selectedGoal);
  const goalProgress = getGoalProgress(selectedGoal);

  elements.detailName.textContent = selectedGoal.name;
  elements.detailPriority.className = `priority-pill priority-${selectedGoal.priority.toLowerCase()}`;
  elements.detailPriority.textContent = selectedGoal.priority;
  elements.detailCategory.textContent = selectedGoal.category;
  elements.detailMetric.textContent = `Success metric: ${formatMetric(selectedGoal)} (${metricProgress}%)`;
  elements.checklistPercent.textContent = `${goalProgress}%`;
  elements.checklistPercent.className = `progress-percent progress-${getProgressTone(goalProgress)}`;
  elements.checklistFill.className = `progress-fill checklist-fill progress-${getProgressTone(goalProgress)}`;
  elements.checklistFill.style.width = `${goalProgress}%`;
  elements.currentMetric.value = selectedGoal.current;

  renderSmallGoals(selectedGoal);
}

function renderSmallGoals(goal) {
  const completeCount = goal.smallGoals.filter((smallGoal) => smallGoal.completed).length;
  elements.smallGoalSummary.textContent =
    goal.smallGoals.length === 0
      ? "No steps yet"
      : `${completeCount} of ${goal.smallGoals.length} complete`;
  elements.smallGoalList.replaceChildren();

  if (goal.smallGoals.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-list-message";
    emptyMessage.textContent = "Add a step to start building momentum.";
    elements.smallGoalList.append(emptyMessage);
    return;
  }

  goal.smallGoals.forEach((smallGoal) => {
    const row = document.createElement("div");
    row.className = [
      "small-goal-item",
      smallGoal.completed ? "completed" : "",
      recentlyCompletedSmallGoalId === smallGoal.id ? "celebrate" : "",
    ]
      .filter(Boolean)
      .join(" ");
    row.dataset.smallGoalId = smallGoal.id;

    if (editingSmallGoalId === smallGoal.id) {
      const editWrap = document.createElement("div");
      editWrap.className = "small-goal-edit";

      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = smallGoal.title;
      editInput.ariaLabel = "Edit step";

      const saveButton = document.createElement("button");
      saveButton.className = "secondary-action";
      saveButton.type = "button";
      saveButton.dataset.action = "save-small-goal";
      saveButton.textContent = "Save";

      const cancelButton = document.createElement("button");
      cancelButton.className = "secondary-action";
      cancelButton.type = "button";
      cancelButton.dataset.action = "cancel-small-goal";
      cancelButton.textContent = "Cancel";

      editWrap.append(editInput, saveButton, cancelButton);
      row.append(editWrap);
      elements.smallGoalList.append(row);
      editInput.focus();
      return;
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = smallGoal.completed;
    checkbox.ariaLabel = `Mark ${smallGoal.title} complete`;
    checkbox.dataset.action = "toggle-small-goal";

    const checkVisual = document.createElement("span");
    checkVisual.className = "checkbox-visual";
    checkVisual.setAttribute("aria-hidden", "true");

    const title = document.createElement("span");
    title.className = `small-goal-title${smallGoal.completed ? " done" : ""}`;
    title.textContent = smallGoal.title;

    const checkLabel = document.createElement("label");
    checkLabel.className = "small-goal-check";
    checkLabel.append(checkbox, checkVisual, title);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const editButton = document.createElement("button");
    editButton.className = "secondary-action";
    editButton.type = "button";
    editButton.dataset.action = "edit-small-goal";
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.className = "danger-action";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete-small-goal";
    deleteButton.textContent = "Delete";

    actions.append(editButton, deleteButton);
    row.append(checkLabel, actions);
    elements.smallGoalList.append(row);
  });

  if (recentlyCompletedSmallGoalId) {
    const completedId = recentlyCompletedSmallGoalId;
    window.setTimeout(() => {
      const row = elements.smallGoalList.querySelector(`[data-small-goal-id="${completedId}"]`);
      row?.classList.remove("celebrate");
      if (recentlyCompletedSmallGoalId === completedId) {
        recentlyCompletedSmallGoalId = null;
      }
    }, 520);
  }
}

function openGoalDialog(goal = null) {
  editingGoalId = goal?.id ?? null;
  elements.dialogMode.textContent = goal ? "Edit Goal" : "New Goal";
  elements.dialogTitle.textContent = goal ? "Update this main goal" : "Create a main goal";
  elements.saveGoalButton.textContent = goal ? "Update Goal" : "Save Goal";
  elements.goalName.value = goal?.name ?? "";
  elements.goalPriority.value = goal?.priority ?? "High";
  elements.goalCategory.value = goal?.category ?? "Personal";
  elements.goalCurrent.value = goal?.current ?? 0;
  elements.goalTarget.value = goal?.target ?? 1;
  elements.goalUnit.value = goal?.unit ?? "";
  elements.goalDialog.showModal();
  elements.goalName.focus();
}

function closeGoalDialog() {
  editingGoalId = null;
  elements.goalDialog.close();
}

function handleGoalSubmit(event) {
  event.preventDefault();

  const name = elements.goalName.value.trim();
  const current = Math.max(0, Number(elements.goalCurrent.value));
  const target = Math.max(1, Number(elements.goalTarget.value));

  if (!name || !Number.isFinite(current) || !Number.isFinite(target)) {
    return;
  }

  if (editingGoalId) {
    const goal = goals.find((item) => item.id === editingGoalId);
    if (goal) {
      goal.name = name;
      goal.priority = elements.goalPriority.value;
      goal.category = elements.goalCategory.value;
      goal.current = current;
      goal.target = target;
      goal.unit = elements.goalUnit.value.trim();
      selectedGoalId = goal.id;
    }
  } else {
    const newGoal = {
      id: createId(),
      name,
      priority: elements.goalPriority.value,
      category: elements.goalCategory.value,
      current,
      target,
      unit: elements.goalUnit.value.trim(),
      createdAt: Date.now(),
      smallGoals: [],
    };
    goals.push(newGoal);
    selectedGoalId = newGoal.id;
  }

  saveGoals();
  closeGoalDialog();
  render();
}

function handleMetricSubmit(event) {
  event.preventDefault();
  const selectedGoal = getSelectedGoal();
  const current = Math.max(0, Number(elements.currentMetric.value));

  if (!selectedGoal || !Number.isFinite(current)) {
    return;
  }

  selectedGoal.current = current;
  saveGoals();
  render();
}

function handleSmallGoalSubmit(event) {
  event.preventDefault();
  const selectedGoal = getSelectedGoal();
  const title = elements.smallGoalInput.value.trim();

  if (!selectedGoal || !title) {
    return;
  }

  selectedGoal.smallGoals.push({
    id: createId(),
    title,
    completed: false,
  });

  elements.smallGoalInput.value = "";
  saveGoals();
  render();
}

function handleSmallGoalAction(event) {
  const action = event.target.dataset.action;
  const row = event.target.closest("[data-small-goal-id]");

  if (!action || !row) {
    return;
  }

  if (action === "toggle-small-goal" && event.type !== "change") {
    return;
  }

  if (action !== "toggle-small-goal" && event.type !== "click") {
    return;
  }

  const selectedGoal = getSelectedGoal();
  const smallGoal = selectedGoal?.smallGoals.find((item) => item.id === row.dataset.smallGoalId);

  if (!selectedGoal || !smallGoal) {
    return;
  }

  if (action === "toggle-small-goal") {
    smallGoal.completed = event.target.checked;
    recentlyCompletedSmallGoalId = smallGoal.completed ? smallGoal.id : null;
  }

  if (action === "edit-small-goal") {
    editingSmallGoalId = smallGoal.id;
  }

  if (action === "save-small-goal") {
    const input = row.querySelector("input[type='text']");
    const title = input.value.trim();
    if (!title) {
      input.focus();
      return;
    }
    smallGoal.title = title;
    editingSmallGoalId = null;
  }

  if (action === "cancel-small-goal") {
    editingSmallGoalId = null;
  }

  if (action === "delete-small-goal") {
    selectedGoal.smallGoals = selectedGoal.smallGoals.filter((item) => item.id !== smallGoal.id);
  }

  saveGoals();
  render();
}

function handleDailyTopAction(event) {
  const action = event.target.dataset.dailyAction;
  const index = Number(event.target.dataset.dailyIndex);

  if (!action || !Number.isInteger(index) || !dailyTop3.priorities[index]) {
    return;
  }

  if (action === "text") {
    dailyTop3.priorities[index].text = event.target.value;
  }

  if (action === "toggle") {
    if (event.type !== "change") {
      return;
    }
    dailyTop3.priorities[index].completed = event.target.checked;
    renderDailyTop3();
  }

  saveDailyTop3();
}

function handleDeleteGoal() {
  const selectedGoal = getSelectedGoal();

  if (!selectedGoal || !window.confirm(`Delete "${selectedGoal.name}"?`)) {
    return;
  }

  goals = goals.filter((goal) => goal.id !== selectedGoal.id);
  selectedGoalId = null;
  editingSmallGoalId = null;
  saveGoals();
  render();
}

elements.newGoalButton.addEventListener("click", () => openGoalDialog());
elements.emptyCreateButton.addEventListener("click", () => openGoalDialog());
elements.exampleGoalButton.addEventListener("click", createStarterGoal);
elements.closeDialogButton.addEventListener("click", closeGoalDialog);
elements.cancelGoalButton.addEventListener("click", closeGoalDialog);
elements.goalForm.addEventListener("submit", handleGoalSubmit);
elements.sortGoals.addEventListener("change", render);
elements.metricForm.addEventListener("submit", handleMetricSubmit);
elements.smallGoalForm.addEventListener("submit", handleSmallGoalSubmit);
elements.smallGoalList.addEventListener("click", handleSmallGoalAction);
elements.smallGoalList.addEventListener("change", handleSmallGoalAction);
elements.dailyTopList.addEventListener("input", handleDailyTopAction);
elements.dailyTopList.addEventListener("change", handleDailyTopAction);
elements.deleteGoalButton.addEventListener("click", handleDeleteGoal);
elements.editGoalButton.addEventListener("click", () => {
  const selectedGoal = getSelectedGoal();
  if (selectedGoal) {
    openGoalDialog(selectedGoal);
  }
});
elements.goalList.addEventListener("click", (event) => {
  const goalCard = event.target.closest("[data-goal-id]");
  if (!goalCard) {
    return;
  }
  selectedGoalId = goalCard.dataset.goalId;
  editingSmallGoalId = null;
  render();
});

render();
