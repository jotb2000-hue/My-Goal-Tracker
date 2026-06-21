/* =========================================================
   JAY OS — Personal Command Center
   Vanilla JS single-page app. localStorage persistence.
   ========================================================= */
(function () {
  "use strict";

  /* ----------------------------- Icons ----------------------------- */
  const I = {
    dashboard: '<svg viewBox="0 0 24 24"><path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z"/></svg>',
    goals: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></svg>',
    planner: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
    fitness: '<svg viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M4 8l-1 1 2 2m13 5l2 2 1-1m-9-9l4 4M7.5 7.5l-2-2-2 2 2 2m13 9l2-2-2-2-2 2"/></svg>',
    diet: '<svg viewBox="0 0 24 24"><path d="M5 3v8a3 3 0 0 0 6 0V3M8 3v18M19 3c-1.5 1-2 3-2 6s0 5 2 6v6"/></svg>',
    music: '<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
    vision: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 15 5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="9" r="1.4"/></svg>',
    coach: '<svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 0-5 5c0 1.6.8 3 2 4-.4.7-1.4 1-3 1.5C3.5 13.5 3 15 3 17v3h18v-3c0-2-.5-3.5-3-4.5-1.6-.5-2.6-.8-3-1.5 1.2-1 2-2.4 2-4a5 5 0 0 0-5-5Z"/></svg>',
    reminders: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 6.6 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 13.4H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 6.6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 4.6V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1A1.6 1.6 0 0 0 21 11h.1a2 2 0 1 1 0 4H21a1.6 1.6 0 0 0-1.6 1Z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    image: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>',
  };

  /* --------------------------- Constants --------------------------- */
  const NAV = [
    { id: "dashboard", label: "Dashboard", sub: "Your life at a glance.", icon: I.dashboard },
    { id: "goals", label: "Goals", sub: "Daily, weekly, monthly, yearly.", icon: I.goals },
    { id: "planner", label: "Weekly Planner", sub: "Plan and time-block your week.", icon: I.planner },
    { id: "fitness", label: "Fitness", sub: "148 → 180 lbs. Build the engine.", icon: I.fitness },
    { id: "diet", label: "Diet", sub: "Bulk smart. Eat with intention.", icon: I.diet },
    { id: "music", label: "Music", sub: "Build to $500/month.", icon: I.music },
    { id: "vision", label: "Vision Board", sub: "See it. Build it.", icon: I.vision },
    { id: "coach", label: "AI Coach", sub: "Your mentor and strategist.", icon: I.coach },
    { id: "reminders", label: "Reminders", sub: "Never drop the ball.", icon: I.reminders },
    { id: "settings", label: "Settings", sub: "Make it yours.", icon: I.settings },
  ];
  const MOBILE_NAV = ["dashboard", "goals", "planner", "fitness", "coach"];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const PRIORITIES = ["High", "Medium", "Low"];

  const QUOTES = [
    { q: "Discipline is choosing between what you want now and what you want most.", by: "Abraham Lincoln" },
    { q: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", by: "Aristotle" },
    { q: "The successful warrior is the average man, with laser-like focus.", by: "Bruce Lee" },
    { q: "Don't count the days. Make the days count.", by: "Muhammad Ali" },
    { q: "Hard work beats talent when talent doesn't work hard.", by: "Tim Notke" },
    { q: "The pain you feel today will be the strength you feel tomorrow.", by: "Unknown" },
    { q: "Success is the sum of small efforts repeated day in and day out.", by: "Robert Collier" },
    { q: "You don't have to be great to start, but you have to start to be great.", by: "Zig Ziglar" },
  ];

  /* --------------------------- Default data --------------------------- */
  function defaults() {
    const uid = () => Math.random().toString(36).slice(2, 9);
    return {
      profile: { name: "Joshua Collier", initials: "JC" },
      settings: { theme: "dark", accent: "#d8b15a", notifications: true },
      goals: {
        daily: [
          { id: uid(), title: "Practice piano (30 min)", priority: "High", due: "", notes: "Scales + one song.", done: false },
          { id: uid(), title: "Create music / make a beat", priority: "High", due: "", notes: "", done: false },
          { id: uid(), title: "Exercise or move", priority: "Medium", due: "", notes: "", done: false },
          { id: uid(), title: "Complete planned tasks", priority: "Medium", due: "", notes: "", done: false },
        ],
        weekly: [
          { id: uid(), title: "Upload 3 beats to website", priority: "High", due: "", notes: "", done: false },
          { id: uid(), title: "Improve fitness performance", priority: "Medium", due: "", notes: "Add weight or reps.", done: false },
          { id: uid(), title: "Complete content creation tasks", priority: "Medium", due: "", notes: "", done: false },
        ],
        monthly: [
          { id: uid(), title: "Reach income target ($500)", priority: "High", due: "", notes: "", done: false },
          { id: uid(), title: "Improve social media growth", priority: "Medium", due: "", notes: "", done: false },
          { id: uid(), title: "Complete a major project", priority: "Medium", due: "", notes: "", done: false },
        ],
        yearly: [
          { id: uid(), title: "Reach 180 lbs", priority: "High", due: "", notes: "Lean bulk, consistent training.", done: false },
          { id: uid(), title: "Grow music business", priority: "High", due: "", notes: "", done: false },
          { id: uid(), title: "Build stronger brand presence", priority: "Medium", due: "", notes: "", done: false },
          { id: uid(), title: "Increase monthly income", priority: "High", due: "", notes: "", done: false },
        ],
      },
      planner: {
        focus: "Stack consistent training, ship beats, stay on the bulk.",
        review: "",
        tasks: {
          Monday: [{ id: uid(), text: "Push day at Planet Fitness", time: "07:00", priority: "High", done: false }, { id: uid(), text: "Make 1 beat", time: "19:00", priority: "Medium", done: false }],
          Tuesday: [{ id: uid(), text: "Client outreach (5 DMs)", time: "10:00", priority: "High", done: false }],
          Wednesday: [{ id: uid(), text: "Pull day", time: "07:00", priority: "High", done: false }, { id: uid(), text: "Piano practice", time: "20:00", priority: "Medium", done: false }],
          Thursday: [{ id: uid(), text: "Content creation block", time: "11:00", priority: "Medium", done: false }],
          Friday: [{ id: uid(), text: "Leg day", time: "07:00", priority: "High", done: false }],
          Saturday: [{ id: uid(), text: "Upload beats + update website", time: "12:00", priority: "Medium", done: false }],
          Sunday: [{ id: uid(), text: "Weekly review + meal prep", time: "16:00", priority: "Medium", done: false }],
        },
      },
      fitness: {
        current: 148, target: 180, daysPerWeek: 3, gym: "Planet Fitness",
        logs: [],
        mastery: [
          { id: uid(), name: "Bench Press 225 lbs", desc: "Build a powerful, stable press. Brace hard, drive through the floor.",
            tips: ["Retract and depress shoulder blades", "Bar path slight arc to lower chest", "Leg drive without losing arch"],
            steps: [{ t: "Bench 135 for 5", done: true }, { t: "Bench 155 for 3", done: false }, { t: "Bench 185 for 1", done: false }, { t: "Bench 205 for 1", done: false }, { t: "Bench 225 for 1", done: false }] },
          { id: uid(), name: "Squat 315 lbs", desc: "Strong legs, strong base. Depth and bracing first, then load.",
            tips: ["Break at hips and knees together", "Knees track over toes", "Big breath into the belt, brace"],
            steps: [{ t: "Squat 135 x5", done: true }, { t: "Squat 185 x5", done: false }, { t: "Squat 225 x3", done: false }, { t: "Squat 275 x1", done: false }, { t: "Squat 315 x1", done: false }] },
          { id: uid(), name: "Pull-Ups", desc: "The foundation of upper-body calisthenics.",
            tips: ["Dead hang, full range", "Pull elbows to ribs", "Control the negative"],
            steps: [{ t: "Negatives 3x5", done: true }, { t: "Band-assisted 3x8", done: false }, { t: "First clean rep", done: false }, { t: "Strict 3x5", done: false }, { t: "Strict 3x10", done: false }] },
          { id: uid(), name: "Dips", desc: "Mass and strength for chest, shoulders, triceps.",
            tips: ["Lean forward for chest", "Lower to ~90°", "Lock out at top"],
            steps: [{ t: "Bench dips 3x12", done: true }, { t: "Assisted dips 3x8", done: false }, { t: "First bodyweight dip", done: false }, { t: "3x8 bodyweight", done: false }, { t: "Weighted dips", done: false }] },
          { id: uid(), name: "Muscle-Up", desc: "The crown of bar calisthenics — explosive pull into transition.",
            tips: ["Build strong pull-ups + dips first", "Explosive high pull to sternum", "Fast transition, lean over the bar"],
            steps: [{ t: "10 strict pull-ups", done: false }, { t: "10 straight-bar dips", done: false }, { t: "High pull-ups to chest", done: false }, { t: "Band muscle-ups", done: false }, { t: "First clean muscle-up", done: false }] },
          { id: uid(), name: "Handstand", desc: "Balance, control, and shoulder strength.",
            tips: ["Wall holds for time first", "Stack wrists, shoulders, hips", "Spread fingers and grip the floor"],
            steps: [{ t: "Pike hold 3x30s", done: false }, { t: "Wall handstand 30s", done: false }, { t: "Wall holds 60s", done: false }, { t: "Kick to balance", done: false }, { t: "Free handstand 10s", done: false }] },
        ],
        library: [
          { group: "Push", items: ["Barbell Bench Press", "Incline Dumbbell Press", "Overhead Press", "Dips", "Triceps Pushdown", "Lateral Raises"] },
          { group: "Pull", items: ["Pull-Ups", "Barbell Row", "Lat Pulldown", "Face Pulls", "Barbell Curl", "Hammer Curl"] },
          { group: "Legs", items: ["Back Squat", "Romanian Deadlift", "Leg Press", "Walking Lunges", "Leg Curl", "Calf Raises"] },
          { group: "Calisthenics", items: ["Pull-Ups", "Dips", "Push-Ups", "Pike Push-Ups", "Hanging Leg Raises", "Handstand Holds"] },
        ],
        program: [
          { day: "Day 1 — Push + Strength", focus: "Chest, shoulders, triceps",
            ex: [["Barbell Bench Press", "4", "5", "Heavy, build to 225"], ["Overhead Press", "3", "6", "Strength focus"], ["Incline DB Press", "3", "10", "Mass"], ["Dips", "3", "Max", "Calisthenics"], ["Lateral Raises", "3", "15", "Shoulders"], ["Triceps Pushdown", "3", "12", "Pump"]] },
          { day: "Day 2 — Pull + Calisthenics", focus: "Back, biceps, grip",
            ex: [["Pull-Ups", "4", "Max", "Toward muscle-up"], ["Barbell Row", "4", "6", "Heavy"], ["Lat Pulldown", "3", "10", "Width"], ["Face Pulls", "3", "15", "Health"], ["Barbell Curl", "3", "10", "Mass"], ["Hanging Leg Raises", "3", "12", "Core"]] },
          { day: "Day 3 — Legs + Power", focus: "Quads, hamstrings, glutes",
            ex: [["Back Squat", "4", "5", "Build to 315"], ["Romanian Deadlift", "3", "8", "Hamstrings"], ["Leg Press", "3", "12", "Volume"], ["Walking Lunges", "3", "10", "Athletic"], ["Calf Raises", "4", "15", "Calves"], ["Handstand Practice", "3", "60s", "Skill"]] },
        ],
      },
      diet: {
        mealsPerDay: 2,
        meals: [
          { id: uid(), slot: "Meal 1 — Breakfast", name: "Beef & Egg Power Bowl", cals: 850, protein: 55,
            ingredients: ["4 eggs", "150g ground beef", "1 cup oats", "1 banana", "1 tbsp olive oil", "Handful of spinach"],
            prep: "Brown the ground beef in olive oil. Scramble eggs alongside. Cook oats with banana mashed in. Plate together with spinach." },
          { id: uid(), slot: "Meal 2 — Dinner", name: "Beef Pasta + Potatoes", cals: 1100, protein: 60,
            ingredients: ["200g ground beef", "150g pasta", "2 medium potatoes", "Tomato sauce", "Cheese", "Garlic & olive oil"],
            prep: "Boil pasta. Roast or boil potatoes. Brown beef with garlic, add tomato sauce. Combine pasta and sauce, top with cheese, serve potatoes on the side." },
        ],
        grocery: {
          Protein: [{ t: "Ground beef (3 lbs)", done: false }, { t: "Eggs (2 dozen)", done: false }, { t: "Chicken thighs", done: false }, { t: "Greek yogurt", done: false }, { t: "Whey protein", done: false }],
          Carbohydrates: [{ t: "Pasta (2 boxes)", done: false }, { t: "Potatoes (5 lb bag)", done: false }, { t: "Oats", done: false }, { t: "Rice", done: false }, { t: "Bread", done: false }],
          Vegetables: [{ t: "Spinach", done: false }, { t: "Onions", done: false }, { t: "Garlic", done: false }, { t: "Frozen mixed veg", done: false }],
          Snacks: [{ t: "Peanut butter", done: false }, { t: "Trail mix", done: false }, { t: "Bananas", done: false }, { t: "Granola bars", done: false }],
          Drinks: [{ t: "Whole milk", done: false }, { t: "Orange juice", done: false }, { t: "Water (case)", done: false }],
        },
        bulking: [
          { name: "Pasta + Beef Batch", note: "Cook 1 lb pasta + 1 lb beef in sauce. ~4 meals. Cheap, ~900 cal/serving.", cost: "$8 total" },
          { name: "Potato + Egg Scramble", note: "Diced potatoes + 6 eggs + cheese. High calorie, very cheap.", cost: "$3 total" },
          { name: "Rice + Beef Bowls", note: "5 cups rice + 2 lbs beef + frozen veg. Meal-prep 5 containers.", cost: "$12 total" },
          { name: "Oats + PB + Banana", note: "Bulk breakfast. 1000+ cal, costs pennies per serving.", cost: "$1/serving" },
        ],
      },
      music: {
        targetIncome: 500,
        income: 0,
        categories: {
          "Beat Sales": [
            { id: uid(), title: "Upload 10 new beats", priority: "High", due: "", notes: "", done: false },
            { id: uid(), title: "Improve beat website / store", priority: "High", due: "", notes: "", done: false },
            { id: uid(), title: "Create 3 beat packs", priority: "Medium", due: "", notes: "", done: false },
            { id: uid(), title: "Reach out to 10 artists", priority: "High", due: "", notes: "", done: false },
          ],
          "Social Media Services": [
            { id: uid(), title: "Client outreach (20 leads)", priority: "High", due: "", notes: "", done: false },
            { id: uid(), title: "Build content creation system", priority: "Medium", due: "", notes: "", done: false },
            { id: uid(), title: "Design service packages", priority: "High", due: "", notes: "", done: false },
            { id: uid(), title: "Build portfolio", priority: "Medium", due: "", notes: "", done: false },
          ],
          "Website Development": [
            { id: uid(), title: "Build 2 demo websites", priority: "High", due: "", notes: "", done: false },
            { id: uid(), title: "Create landing page templates", priority: "Medium", due: "", notes: "", done: false },
            { id: uid(), title: "Client acquisition outreach", priority: "High", due: "", notes: "", done: false },
            { id: uid(), title: "Add portfolio projects", priority: "Medium", due: "", notes: "", done: false },
          ],
        },
      },
      vision: {
        Financial: [{ id: uid(), title: "$500/month music income", note: "Beats + services + websites.", img: "" }],
        Fitness: [{ id: uid(), title: "180 lbs, lean and strong", note: "Muscle-up, 225 bench, 315 squat.", img: "" }],
        Music: [{ id: uid(), title: "Recognized beat brand", note: "Artists seeking my sound.", img: "" }],
        Lifestyle: [{ id: uid(), title: "Freedom & discipline", note: "Own my time. Build daily.", img: "" }],
        "Personal Development": [{ id: uid(), title: "Faith, focus, consistency", note: "Become 1% better daily.", img: "" }],
      },
      reminders: [
        { id: uid(), title: "Morning protein shake", when: "08:00", repeat: "daily", done: false },
        { id: uid(), title: "Gym session", when: "07:00", repeat: "weekly", done: false },
        { id: uid(), title: "Upload beats", when: "12:00", repeat: "weekly", done: false },
      ],
      coach: [],
      dashChecklist: [
        { id: uid(), text: "Hit my protein target", done: false },
        { id: uid(), text: "Train or move my body", done: false },
        { id: uid(), text: "Work on music for 30 min", done: false },
        { id: uid(), text: "Complete top 3 priorities", done: false },
      ],
      activity: [],
      quoteIndex: 0,
    };
  }

  /* --------------------------- State + storage --------------------------- */
  const KEY = "jayos.v1";
  let state;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { state = Object.assign(defaults(), JSON.parse(raw)); return; }
    } catch (e) { /* ignore */ }
    state = defaults();
    save();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  const uid = () => Math.random().toString(36).slice(2, 9);

  function logActivity(text) {
    state.activity = state.activity || [];
    state.activity.unshift({ text, ts: Date.now() });
    state.activity = state.activity.slice(0, 12);
  }

  /* --------------------------- Helpers --------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function relTime(ts) {
    const d = Date.now() - ts, m = Math.floor(d / 60000);
    if (m < 1) return "just now";
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60); if (h < 24) return h + "h ago";
    return Math.floor(h / 24) + "d ago";
  }
  function isOverdue(due) {
    if (!due) return false;
    const t = new Date(due + "T23:59:59"); return t < new Date();
  }
  function prettyDate(d) {
    if (!d) return "";
    try { return new Date(d + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
    catch (e) { return d; }
  }

  function toast(msg) {
    const host = $("#toastHost");
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="tdot"></span><span>' + esc(msg) + "</span>";
    host.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 300); }, 2600);
  }

  /* --------------------------- Modal --------------------------- */
  function openModal(title, bodyHtml, onMount) {
    const overlay = $("#modalOverlay");
    const panel = $("#modalPanel");
    panel.innerHTML =
      '<div class="overlay-head"><h3>' + esc(title) + '</h3>' +
      '<button class="icon-btn" data-close type="button" aria-label="Close">&times;</button></div>' +
      bodyHtml;
    overlay.hidden = false;
    const close = () => { overlay.hidden = true; panel.innerHTML = ""; };
    panel.querySelector("[data-close]").onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    if (onMount) onMount(panel, close);
    const first = panel.querySelector("input, select, textarea, button");
    if (first) setTimeout(() => first.focus(), 50);
    return close;
  }

  function field(label, name, value, type) {
    return '<label class="field"><span>' + esc(label) + '</span>' +
      '<input name="' + name + '" type="' + (type || "text") + '" value="' + esc(value || "") + '" /></label>';
  }
  function priorityField(value) {
    return '<label class="field"><span>Priority</span><select name="priority">' +
      PRIORITIES.map((p) => '<option' + (p === value ? " selected" : "") + ">" + p + "</option>").join("") +
      "</select></label>";
  }
  function notesField(value) {
    return '<label class="field"><span>Notes</span><textarea name="notes" placeholder="Optional notes…">' + esc(value || "") + "</textarea></label>";
  }

  /* ============================ ROUTER ============================ */
  let current = "dashboard";
  const views = {};

  function navigate(id) {
    if (!views[id]) id = "dashboard";
    current = id;
    const meta = NAV.find((n) => n.id === id);
    $("#pageTitle").textContent = meta.label;
    $("#pageSubtitle").textContent = meta.sub;
    const view = $("#view");
    view.innerHTML = "";
    view.classList.remove("view-enter");
    void view.offsetWidth;
    view.classList.add("view-enter");
    views[id](view);
    $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.nav === id));
    $$(".mobile-bar button").forEach((n) => n.classList.toggle("active", n.dataset.nav === id));
    closeSidebar();
    view.focus();
    window.scrollTo(0, 0);
  }

  /* ============================ DASHBOARD ============================ */
  views.dashboard = function (root) {
    const g = state.goals;
    const allGoals = [].concat(g.daily, g.weekly, g.monthly, g.yearly);
    const doneCount = allGoals.filter((x) => x.done).length;
    const todayTasks = state.planner.tasks[DAYS[(new Date().getDay() + 6) % 7]] || [];
    const q = QUOTES[state.quoteIndex % QUOTES.length];
    const w = state.fitness;
    const pct = Math.max(0, Math.min(100, Math.round(((w.current - 148) / (w.target - 148)) * 100))) || 0;
    const topPriorities = allGoals.filter((x) => !x.done && x.priority === "High").slice(0, 4);

    root.innerHTML =
      '<section class="hero card" style="margin-bottom:18px">' +
        '<p class="eyebrow">' + greeting() + ', ' + esc(state.profile.name.split(" ")[0]) + '</p>' +
        "<h2>Let's build today. One disciplined rep at a time.</h2>" +
        "<p>You're " + (w.target - w.current) + " lbs from your target, tracking " + allGoals.length +
        " goals, and " + countOpenReminders() + " reminders are queued. Keep the streak alive.</p>" +
        '<div class="hero-stats">' +
          '<div class="hero-stat"><strong>' + doneCount + "/" + allGoals.length + "</strong><span>Goals done</span></div>" +
          '<div class="hero-stat"><strong>' + w.current + " lbs</strong><span>Current weight</span></div>" +
          '<div class="hero-stat"><strong>$' + (state.music.income || 0) + "</strong><span>Music income / mo</span></div>" +
          '<div class="hero-stat"><strong>' + completedToday() + "</strong><span>Checklist today</span></div>" +
        "</div>" +
      "</section>" +

      '<div class="grid cols-3" style="margin-bottom:18px">' +
        statCard("Today's tasks", todayTasks.length, todayTasks.filter((t) => t.done).length + " done") +
        statCard("Open goals", allGoals.filter((x) => !x.done).length, "across all horizons") +
        statCard("Weight to target", (w.target - w.current) + " lbs", pct + "% of the journey") +
      "</div>" +

      '<div class="grid cols-2">' +
        '<div class="grid" style="gap:18px">' +
          '<section class="card">' +
            '<div class="section-head"><div><p class="eyebrow">Today</p><h2>Top priorities</h2></div></div>' +
            '<div class="grid" style="gap:10px">' +
            (topPriorities.length ? topPriorities.map((t) => priorityRow(t)).join("") :
              '<p class="muted tiny">No high-priority goals open. Add some in the Goals tab.</p>') +
            "</div>" +
          "</section>" +
          '<section class="card">' +
            '<div class="section-head"><div><p class="eyebrow">Discipline</p><h2>Daily checklist</h2></div>' +
            '<button class="btn sm" data-add-check>' + I.plus + "Add</button></div>" +
            '<div class="grid" id="dashChecklist" style="gap:8px">' +
            state.dashChecklist.map(checkRow).join("") + "</div>" +
          "</section>" +
        "</div>" +

        '<div class="grid" style="gap:18px">' +
          '<section class="card quote"><p class="eyebrow">Fuel</p><p>“' + esc(q.q) + '”</p>' +
            '<div class="by">— ' + esc(q.by) + '</div>' +
            '<button class="btn sm ghost" data-new-quote style="margin-top:14px">New quote</button></section>' +
          '<section class="card">' +
            '<p class="eyebrow">Weekly focus</p><h2 style="font-size:1.05rem;margin:8px 0 6px">' + esc(state.planner.focus || "Set your focus") + "</h2>" +
            '<button class="btn sm" data-nav-to="planner">Open planner</button>' +
          "</section>" +
          '<section class="card">' +
            '<div class="section-head"><div><p class="eyebrow">Jump to</p><h2>Quick access</h2></div></div>' +
            '<div class="quick-grid">' + NAV.filter((n) => n.id !== "dashboard").map((n) =>
              '<button class="quick-tile" data-nav-to="' + n.id + '">' + n.icon + "<span>" + esc(n.label) + "</span></button>").join("") +
            "</div>" +
          "</section>" +
          '<section class="card">' +
            '<div class="section-head"><div><p class="eyebrow">Log</p><h2>Recent activity</h2></div></div>' +
            (state.activity && state.activity.length ?
              state.activity.map((a) => '<div class="activity-item"><span class="activity-dot"></span><div><div class="t">' + esc(a.text) + '</div><div class="ts">' + relTime(a.ts) + "</div></div></div>").join("") :
              '<p class="muted tiny">Your actions will show up here as you use JAY OS.</p>') +
          "</section>" +
        "</div>" +
      "</div>";

    root.querySelector("[data-new-quote]").onclick = () => { state.quoteIndex++; save(); navigate("dashboard"); };
    root.querySelector("[data-add-check]").onclick = () => {
      openModal("Add checklist item", '<form class="modal-form" id="f">' + field("Item", "text", "") +
        '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Add</button></div></form>',
        (panel, close) => {
          panel.querySelector("#f").onsubmit = (e) => {
            e.preventDefault();
            const v = e.target.text.value.trim(); if (!v) return;
            state.dashChecklist.push({ id: uid(), text: v, done: false }); save(); close(); navigate("dashboard");
          };
        });
    };
    $$("[data-nav-to]", root).forEach((b) => (b.onclick = () => navigate(b.dataset.navTo)));
    wireChecklist(root.querySelector("#dashChecklist"), state.dashChecklist, "dashboard");
    $$("[data-toggle-goal]", root).forEach((b) => (b.onclick = () => { toggleGoalById(b.dataset.toggleGoal); navigate("dashboard"); }));
  };

  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }
  function statCard(label, val, delta) {
    return '<article class="card stat-card hover"><span class="label">' + esc(label) + '</span>' +
      '<span class="val">' + esc(String(val)) + '</span><span class="delta">' + esc(delta) + "</span></article>";
  }
  function priorityRow(t) {
    return '<div class="check-row"><button class="checkbox" data-toggle-goal="' + t.id + '">' + I.check + '</button>' +
      '<div style="flex:1"><div class="check-label">' + esc(t.title) + '</div></div><span class="pri ' + t.priority + '">' + t.priority + "</span></div>";
  }
  function completedToday() { return state.dashChecklist.filter((c) => c.done).length + "/" + state.dashChecklist.length; }
  function countOpenReminders() { return state.reminders.filter((r) => !r.done).length; }
  function checkRow(item) {
    return '<div class="check-row' + (item.done ? " done" : "") + '" data-id="' + item.id + '">' +
      '<button class="checkbox" data-check>' + I.check + '</button>' +
      '<div class="check-label">' + esc(item.text) + "</div>" +
      '<div class="row-actions"><button class="mini-btn" data-del>' + I.trash + "</button></div></div>";
  }
  function wireChecklist(container, list, viewId) {
    if (!container) return;
    $$(".check-row", container).forEach((row) => {
      const item = list.find((x) => x.id === row.dataset.id);
      if (!item) return;
      row.querySelector("[data-check]").onclick = () => { item.done = !item.done; save(); navigate(viewId); };
      const del = row.querySelector("[data-del]");
      if (del) del.onclick = () => { const i = list.indexOf(item); list.splice(i, 1); save(); navigate(viewId); };
    });
  }
  function toggleGoalById(id) {
    const g = state.goals;
    [].concat(g.daily, g.weekly, g.monthly, g.yearly).forEach((x) => {
      if (x.id === id) { x.done = !x.done; if (x.done) logActivity("Completed goal: " + x.title); }
    });
    save();
  }

  /* ============================ GOALS ============================ */
  const goalTabs = [["daily", "Daily"], ["weekly", "Weekly"], ["monthly", "Monthly"], ["yearly", "Yearly"]];
  let goalsActive = "daily";

  views.goals = function (root) {
    const renderList = () => {
      const list = state.goals[goalsActive];
      const body = $("#goalBody", root);
      body.innerHTML = list.length
        ? '<div class="grid cols-3">' + list.map(goalCard).join("") + "</div>"
        : emptyState("No " + goalsActive + " goals yet", "Add your first one to start moving.");
      $$(".goal-card", body).forEach((card) => {
        const goal = list.find((x) => x.id === card.dataset.id);
        card.querySelector("[data-toggle]").onclick = () => { goal.done = !goal.done; if (goal.done) logActivity("Completed goal: " + goal.title); save(); renderList(); };
        card.querySelector("[data-edit]").onclick = () => editGoal(goalsActive, goal, renderList);
        card.querySelector("[data-del]").onclick = () => { const i = list.indexOf(goal); list.splice(i, 1); save(); renderList(); toast("Goal removed"); };
      });
    };

    root.innerHTML =
      '<div class="section-head"><div class="tabs">' +
      goalTabs.map(([id, label]) => '<button class="tab' + (id === goalsActive ? " active" : "") + '" data-gt="' + id + '">' + label +
        ' <span class="muted tiny">' + state.goals[id].filter((x) => !x.done).length + "</span></button>").join("") +
      '</div><button class="btn gold" data-add>' + I.plus + "New goal</button></div>" +
      '<div id="goalBody"></div>';

    $$("[data-gt]", root).forEach((t) => (t.onclick = () => { goalsActive = t.dataset.gt; navigate("goals"); }));
    root.querySelector("[data-add]").onclick = () => editGoal(goalsActive, null, renderList);
    renderList();
  };

  function goalCard(g) {
    const over = !g.done && isOverdue(g.due);
    return '<article class="card hover goal-card' + (g.done ? " done" : "") + '" data-id="' + g.id + '">' +
      '<div class="top"><button class="card-tick" data-toggle>' + I.check + "</button>" +
      "<h3>" + esc(g.title) + "</h3></div>" +
      (g.notes ? '<p class="notes">' + esc(g.notes) + "</p>" : "") +
      '<div class="foot"><span class="pri ' + g.priority + '">' + g.priority + "</span>" +
      (g.due ? '<span class="due' + (over ? " over" : "") + '">' + I.clock + " " + prettyDate(g.due) + "</span>" : "") +
      '<span style="margin-left:auto;display:flex;gap:6px" class="row-actions">' +
      '<button class="mini-btn" data-edit>' + I.edit + '</button><button class="mini-btn" data-del>' + I.trash + "</button></span></div></article>";
  }

  function editGoal(cat, goal, after) {
    const isNew = !goal;
    const g = goal || { title: "", priority: "Medium", due: "", notes: "" };
    openModal(isNew ? "New " + cat + " goal" : "Edit goal",
      '<form class="modal-form" id="f">' +
        field("Goal title", "title", g.title) +
        '<div class="field-row">' + priorityField(g.priority) +
        '<label class="field"><span>Due date</span><input name="due" type="date" value="' + esc(g.due) + '" /></label></div>' +
        notesField(g.notes) +
        '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button>' +
        '<button class="btn gold" type="submit">' + (isNew ? "Create goal" : "Save") + "</button></div></form>",
      (panel, close) => {
        panel.querySelector("#f").onsubmit = (e) => {
          e.preventDefault();
          const f = e.target;
          const title = f.title.value.trim(); if (!title) return;
          if (isNew) {
            state.goals[cat].push({ id: uid(), title, priority: f.priority.value, due: f.due.value, notes: f.notes.value.trim(), done: false });
            logActivity("Added goal: " + title);
          } else {
            g.title = title; g.priority = f.priority.value; g.due = f.due.value; g.notes = f.notes.value.trim();
          }
          save(); close(); after(); toast(isNew ? "Goal created" : "Goal updated");
        };
      });
  }

  function emptyState(title, sub) {
    return '<div class="card"><div class="empty">' + I.goals + "<h3>" + esc(title) + '</h3><p class="tiny">' + esc(sub) + "</p></div></div>";
  }

  /* ============================ WEEKLY PLANNER ============================ */
  views.planner = function (root) {
    const todayName = DAYS[(new Date().getDay() + 6) % 7];
    root.innerHTML =
      '<div class="grid cols-2" style="margin-bottom:18px">' +
        '<section class="card"><p class="eyebrow">Weekly focus</p>' +
        '<textarea id="focus" style="width:100%;margin-top:8px;min-height:70px;background:var(--surface);border:1px solid var(--line);border-radius:11px;padding:11px 13px;color:var(--text);font-family:inherit;font-size:0.9rem">' + esc(state.planner.focus) + "</textarea></section>" +
        '<section class="card"><p class="eyebrow">Weekly review</p>' +
        '<textarea id="review" placeholder="What went well? What to improve next week?" style="width:100%;margin-top:8px;min-height:70px;background:var(--surface);border:1px solid var(--line);border-radius:11px;padding:11px 13px;color:var(--text);font-family:inherit;font-size:0.9rem">' + esc(state.planner.review) + "</textarea></section>" +
      "</div>" +
      '<div class="section-head"><div><h2>The Week</h2><p class="sub">Drag tasks between days. Tap to edit. Time-block your day.</p></div></div>' +
      '<div class="planner" id="planner">' +
      DAYS.map((day) => {
        const tasks = state.planner.tasks[day] || [];
        return '<div class="day-col' + (day === todayName ? " today" : "") + '" data-day="' + day + '">' +
          '<div class="day-head"><span class="dname">' + day.slice(0, 3) + '</span>' +
          (day === todayName ? '<span class="dtoday">Today</span>' : '<span class="muted tiny">' + tasks.length + "</span>") + "</div>" +
          tasks.map(taskCard).join("") +
          '<button class="day-add" data-addtask="' + day + '">+ Add task</button></div>';
      }).join("") +
      "</div>";

    root.querySelector("#focus").onchange = (e) => { state.planner.focus = e.target.value; save(); toast("Focus saved"); };
    root.querySelector("#review").onchange = (e) => { state.planner.review = e.target.value; save(); toast("Review saved"); };
    $$("[data-addtask]", root).forEach((b) => (b.onclick = () => editTask(b.dataset.addtask, null)));
    wirePlanner(root);
  };

  function taskCard(t) {
    const color = t.priority === "High" ? "var(--danger)" : t.priority === "Medium" ? "var(--gold)" : "var(--good)";
    return '<div class="task' + (t.done ? " done" : "") + '" draggable="true" data-task="' + t.id + '">' +
      (t.time ? '<span class="ttime">' + esc(t.time) + "</span>" : "") +
      '<span class="ttext">' + esc(t.text) + "</span>" +
      '<div class="tbar"><span class="tdot" style="background:' + color + '"></span>' +
      '<span class="row-actions" style="display:flex;gap:4px"><button class="mini-btn" data-tdone title="Toggle done">' + I.check + '</button>' +
      '<button class="mini-btn" data-tedit>' + I.edit + '</button><button class="mini-btn" data-tdel>' + I.trash + "</button></span></div></div>";
  }

  function findTask(id) {
    for (const day of DAYS) {
      const arr = state.planner.tasks[day];
      const t = arr.find((x) => x.id === id);
      if (t) return { task: t, day, arr };
    }
    return null;
  }

  function wirePlanner(root) {
    $$(".task", root).forEach((el) => {
      const id = el.dataset.task;
      el.addEventListener("dragstart", (e) => { el.classList.add("dragging"); e.dataTransfer.setData("text/plain", id); });
      el.addEventListener("dragend", () => el.classList.remove("dragging"));
      el.querySelector("[data-tdone]").onclick = () => { const f = findTask(id); f.task.done = !f.task.done; save(); navigate("planner"); };
      el.querySelector("[data-tedit]").onclick = () => { const f = findTask(id); editTask(f.day, f.task); };
      el.querySelector("[data-tdel]").onclick = () => { const f = findTask(id); f.arr.splice(f.arr.indexOf(f.task), 1); save(); navigate("planner"); };
    });
    $$(".day-col", root).forEach((col) => {
      col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("dragover"); });
      col.addEventListener("dragleave", () => col.classList.remove("dragover"));
      col.addEventListener("drop", (e) => {
        e.preventDefault(); col.classList.remove("dragover");
        const id = e.dataTransfer.getData("text/plain");
        const f = findTask(id); if (!f) return;
        const target = col.dataset.day;
        if (target === f.day) return;
        f.arr.splice(f.arr.indexOf(f.task), 1);
        state.planner.tasks[target].push(f.task);
        save(); navigate("planner");
      });
    });
  }

  function editTask(day, task) {
    const isNew = !task;
    const t = task || { text: "", time: "", priority: "Medium" };
    openModal(isNew ? "Add task — " + day : "Edit task",
      '<form class="modal-form" id="f">' +
        field("Task", "text", t.text) +
        '<div class="field-row"><label class="field"><span>Time block</span><input name="time" type="time" value="' + esc(t.time) + '" /></label>' +
        priorityField(t.priority) + "</div>" +
        '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button>' +
        '<button class="btn gold" type="submit">' + (isNew ? "Add" : "Save") + "</button></div></form>",
      (panel, close) => {
        panel.querySelector("#f").onsubmit = (e) => {
          e.preventDefault(); const f = e.target;
          const text = f.text.value.trim(); if (!text) return;
          if (isNew) state.planner.tasks[day].push({ id: uid(), text, time: f.time.value, priority: f.priority.value, done: false });
          else { t.text = text; t.time = f.time.value; t.priority = f.priority.value; }
          save(); close(); navigate("planner");
        };
      });
  }

  /* ============================ FITNESS ============================ */
  views.fitness = function (root) {
    const w = state.fitness;
    const pct = Math.max(0, Math.min(100, Math.round(((w.current - 148) / (w.target - 148)) * 100))) || 0;
    root.innerHTML =
      '<section class="card" style="margin-bottom:18px">' +
        '<div class="section-head"><div><p class="eyebrow">Body</p><h2>The Mission: 148 → 180 lbs</h2>' +
        '<p class="sub">' + w.gym + " · " + w.daysPerWeek + " days/week · Muscle, strength, powerlifting, calisthenics</p></div>" +
        '<button class="btn" data-weight>' + I.edit + "Update weight</button></div>" +
        '<div class="grid cols-4">' +
          statPill("Current", w.current + " lbs") + statPill("Target", w.target + " lbs") +
          statPill("To gain", (w.target - w.current) + " lbs") + statPill("Progress", pct + "%") +
        "</div>" +
        '<div class="weight-track"><div class="weight-fill" style="width:' + pct + '%"></div></div>' +
      "</section>" +

      '<div class="grid cols-2" style="margin-bottom:18px">' +
        '<section class="card"><div class="section-head"><div><p class="eyebrow">Plan</p><h2>3-Day Training Split</h2></div></div>' +
        w.program.map((d) =>
          '<details style="margin-bottom:10px"><summary style="cursor:pointer;font-weight:600;padding:8px 0">' + esc(d.day) + '</summary>' +
          '<p class="tiny muted" style="margin:4px 0 8px">' + esc(d.focus) + '</p><table class="workout-table"><tr><th>Exercise</th><th>Sets</th><th>Reps</th><th>Note</th></tr>' +
          d.ex.map((e) => "<tr><td>" + esc(e[0]) + "</td><td>" + esc(e[1]) + "</td><td>" + esc(e[2]) + '</td><td class="muted tiny">' + esc(e[3]) + "</td></tr>").join("") +
          "</table></details>").join("") +
        "</section>" +
        '<section class="card"><div class="section-head"><div><p class="eyebrow">Library</p><h2>Workout Library</h2></div></div>' +
        w.library.map((cat) =>
          '<div style="margin-bottom:12px"><div class="grocery-cat"><h4>' + esc(cat.group) + "</h4></div>" +
          '<div style="display:flex;flex-wrap:wrap;gap:6px">' + cat.items.map((i) => '<span class="chip">' + esc(i) + "</span>").join("") + "</div></div>").join("") +
        "</section>" +
      "</div>" +

      '<section class="card" style="margin-bottom:18px">' +
        '<div class="section-head"><div><p class="eyebrow">Tracker</p><h2>Workout Tracker</h2><p class="sub">Log weight, reps, sets.</p></div>' +
        '<button class="btn gold" data-log>' + I.plus + "Log set</button></div>" +
        (w.logs.length ?
          '<div style="overflow-x:auto"><table class="workout-table"><tr><th>Date</th><th>Exercise</th><th>Weight</th><th>Reps</th><th>Sets</th><th>Notes</th><th></th></tr>' +
          w.logs.slice().reverse().map((l) =>
            "<tr><td>" + esc(l.date) + "</td><td>" + esc(l.exercise) + "</td><td>" + esc(l.weight) + "</td><td>" + esc(l.reps) + "</td><td>" + esc(l.sets) +
            '</td><td class="muted tiny">' + esc(l.notes || "") + '</td><td><button class="mini-btn" data-dellog="' + l.id + '">' + I.trash + "</button></td></tr>").join("") + "</table></div>" :
          '<p class="muted tiny">No sets logged yet. Hit "Log set" after your next lift.</p>') +
      "</section>" +

      '<section class="card"><div class="section-head"><div><p class="eyebrow">Skill</p><h2>Exercise Mastery</h2>' +
      '<p class="sub">Description, technique, and a progression roadmap for each.</p></div></div>' +
      '<div class="grid cols-2">' + w.mastery.map(masteryCard).join("") + "</div></section>";

    root.querySelector("[data-weight]").onclick = () => {
      openModal("Update body weight", '<form class="modal-form" id="f">' +
        '<div class="field-row">' + field("Current (lbs)", "current", w.current, "number") + field("Target (lbs)", "target", w.target, "number") + "</div>" +
        '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Save</button></div></form>',
        (panel, close) => { panel.querySelector("#f").onsubmit = (e) => { e.preventDefault(); w.current = +e.target.current.value || w.current; w.target = +e.target.target.value || w.target; logActivity("Updated weight: " + w.current + " lbs"); save(); close(); navigate("fitness"); }; });
    };
    root.querySelector("[data-log]").onclick = () => {
      openModal("Log a set", '<form class="modal-form" id="f">' + field("Exercise", "exercise", "") +
        '<div class="field-row">' + field("Weight", "weight", "", "text") + field("Reps", "reps", "", "number") + field("Sets", "sets", "", "number") + "</div>" +
        notesField("") +
        '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Log</button></div></form>',
        (panel, close) => { panel.querySelector("#f").onsubmit = (e) => { e.preventDefault(); const f = e.target; if (!f.exercise.value.trim()) return;
          w.logs.push({ id: uid(), date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }), exercise: f.exercise.value.trim(), weight: f.weight.value, reps: f.reps.value, sets: f.sets.value, notes: f.notes.value.trim() });
          logActivity("Logged " + f.exercise.value.trim()); save(); close(); navigate("fitness"); }; });
    };
    $$("[data-dellog]", root).forEach((b) => (b.onclick = () => { w.logs = w.logs.filter((l) => l.id !== b.dataset.dellog); save(); navigate("fitness"); }));
    $$("[data-mstep]", root).forEach((b) => (b.onclick = () => {
      const m = w.mastery.find((x) => x.id === b.dataset.mid); m.steps[+b.dataset.mstep].done = !m.steps[+b.dataset.mstep].done; save(); navigate("fitness");
    }));
  };

  function statPill(k, v) { return '<div class="stat-pill"><span class="k">' + esc(k) + '</span><span class="v">' + esc(v) + "</span></div>"; }
  function masteryCard(m) {
    return '<article class="card exercise-card"><h3>' + esc(m.name) + '</h3><p class="tiny muted">' + esc(m.desc) + "</p>" +
      '<div><p class="eyebrow" style="margin-bottom:6px">Technique</p>' +
      '<ul class="ing-list">' + m.tips.map((t) => "<li>" + esc(t) + "</li>").join("") + "</ul></div>" +
      '<div><p class="eyebrow" style="margin-bottom:6px">Roadmap</p><div class="roadmap">' +
      m.steps.map((s, i) => '<div class="roadmap-step' + (s.done ? " done" : "") + '"><button class="roadmap-node' + (s.done ? " done" : "") + '" data-mid="' + m.id + '" data-mstep="' + i + '"></button><span class="rs-text">' + esc(s.t) + "</span></div>").join("") +
      "</div></div></article>";
  }

  /* ============================ DIET ============================ */
  views.diet = function (root) {
    const d = state.diet;
    root.innerHTML =
      '<section class="card" style="margin-bottom:18px"><p class="eyebrow">Goal</p>' +
      '<h2 style="margin:6px 0">Bulk from 148 → 180 lbs · ' + d.mealsPerDay + ' meals/day</h2>' +
      '<p class="sub">Favorites: pasta, beef, potatoes. Focus: weight-gain, high protein, cheap meal prep.</p></section>' +

      '<div class="section-head"><div><h2>Meal Plans</h2></div><button class="btn gold" data-meal>' + I.plus + "Add meal</button></div>" +
      '<div class="grid cols-2" style="margin-bottom:22px">' + d.meals.map(mealCard).join("") + "</div>" +

      '<div class="grid cols-2">' +
        '<section class="card"><div class="section-head"><div><p class="eyebrow">Shopping</p><h2>Grocery List</h2></div></div>' +
        Object.keys(d.grocery).map((cat) =>
          '<div class="grocery-cat" style="margin-bottom:14px"><h4>' + esc(cat) + "</h4>" +
          d.grocery[cat].map((g, i) =>
            '<div class="check-row' + (g.done ? " done" : "") + '" style="margin-bottom:6px" data-gcat="' + esc(cat) + '" data-gi="' + i + '">' +
            '<button class="checkbox" data-gcheck>' + I.check + '</button><div class="check-label">' + esc(g.t) + "</div></div>").join("") +
          "</div>").join("") +
        "</section>" +
        '<section class="card"><div class="section-head"><div><p class="eyebrow">Budget</p><h2>Cheap Bulking</h2></div></div>' +
        d.bulking.map((b) =>
          '<div class="item-card" style="margin-bottom:10px;align-items:flex-start;flex-direction:column;gap:6px">' +
          '<div style="display:flex;width:100%;justify-content:space-between;gap:8px"><strong>' + esc(b.name) + '</strong><span class="chip gold">' + esc(b.cost) + "</span></div>" +
          '<p class="tiny muted">' + esc(b.note) + "</p></div>").join("") +
        "</section>" +
      "</div>";

    root.querySelector("[data-meal]").onclick = () => editMeal(null);
    $$("[data-gcheck]", root).forEach((b) => (b.onclick = () => {
      const row = b.closest("[data-gcat]"); d.grocery[row.dataset.gcat][+row.dataset.gi].done = !d.grocery[row.dataset.gcat][+row.dataset.gi].done; save(); navigate("diet");
    }));
    $$("[data-editmeal]", root).forEach((b) => (b.onclick = () => editMeal(d.meals.find((m) => m.id === b.dataset.editmeal))));
    $$("[data-delmeal]", root).forEach((b) => (b.onclick = () => { d.meals = d.meals.filter((m) => m.id !== b.dataset.delmeal); save(); navigate("diet"); }));
  };

  function mealCard(m) {
    return '<article class="card meal-card"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">' +
      '<div><p class="eyebrow">' + esc(m.slot) + '</p><h3 style="margin-top:4px">' + esc(m.name) + "</h3></div>" +
      '<span class="row-actions" style="display:flex;gap:6px"><button class="mini-btn" data-editmeal="' + m.id + '">' + I.edit + '</button><button class="mini-btn" data-delmeal="' + m.id + '">' + I.trash + "</button></span></div>" +
      '<div class="macro-row"><span class="macro"><b>' + esc(m.cals) + "</b> cal</span><span class=\"macro\"><b>" + esc(m.protein) + "</b>g protein</span></div>" +
      '<div><p class="eyebrow" style="margin-bottom:6px">Ingredients</p><ul class="ing-list">' + m.ingredients.map((i) => "<li>" + esc(i) + "</li>").join("") + "</ul></div>" +
      '<div><p class="eyebrow" style="margin-bottom:6px">Preparation</p><p class="tiny" style="color:var(--text-2);line-height:1.5">' + esc(m.prep) + "</p></div></article>";
  }
  function editMeal(meal) {
    const isNew = !meal;
    const m = meal || { slot: "Meal 1 — Breakfast", name: "", cals: "", protein: "", ingredients: [], prep: "" };
    openModal(isNew ? "Add meal" : "Edit meal",
      '<form class="modal-form" id="f">' + field("Slot / name", "slot", m.slot) + field("Meal name", "name", m.name) +
      '<div class="field-row">' + field("Calories", "cals", m.cals, "number") + field("Protein (g)", "protein", m.protein, "number") + "</div>" +
      '<label class="field"><span>Ingredients (one per line)</span><textarea name="ingredients">' + esc((m.ingredients || []).join("\n")) + "</textarea></label>" +
      '<label class="field"><span>Preparation</span><textarea name="prep">' + esc(m.prep) + "</textarea></label>" +
      '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Save</button></div></form>',
      (panel, close) => { panel.querySelector("#f").onsubmit = (e) => { e.preventDefault(); const f = e.target; if (!f.name.value.trim()) return;
        const data = { slot: f.slot.value.trim(), name: f.name.value.trim(), cals: +f.cals.value || 0, protein: +f.protein.value || 0, ingredients: f.ingredients.value.split("\n").map((s) => s.trim()).filter(Boolean), prep: f.prep.value.trim() };
        if (isNew) state.diet.meals.push(Object.assign({ id: uid() }, data)); else Object.assign(m, data);
        save(); close(); navigate("diet"); }; });
  }

  /* ============================ MUSIC ============================ */
  views.music = function (root) {
    const mu = state.music;
    const pct = Math.max(0, Math.min(100, Math.round((mu.income / mu.targetIncome) * 100))) || 0;
    const cats = Object.keys(mu.categories);
    root.innerHTML =
      '<section class="card" style="margin-bottom:18px"><div class="income-ring">' +
        '<div class="ring" style="--p:' + pct + '%"><div class="ring-inner">$' + mu.income + "</div></div>" +
        '<div><p class="eyebrow">Music Business</p><h2 style="margin:4px 0">Target: $' + mu.targetIncome + "/month</h2>" +
        '<p class="sub">Beat sales · social media services · website development</p>' +
        '<button class="btn sm" data-income style="margin-top:10px">' + I.edit + "Update income</button></div></div></section>" +

      cats.map((cat) => {
        const list = mu.categories[cat];
        return '<section class="card" style="margin-bottom:18px"><div class="section-head"><div><p class="eyebrow">' + esc(catEyebrow(cat)) + '</p><h2>' + esc(cat) + "</h2></div>" +
          '<button class="btn sm gold" data-addmusic="' + esc(cat) + '">' + I.plus + "Add</button></div>" +
          '<div class="grid cols-2">' + list.map((g) => musicTaskCard(cat, g)).join("") + "</div></section>";
      }).join("");

    root.querySelector("[data-income]").onclick = () => {
      openModal("Update monthly income", '<form class="modal-form" id="f">' + field("Current income ($)", "income", mu.income, "number") + field("Target ($)", "target", mu.targetIncome, "number") +
        '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Save</button></div></form>',
        (panel, close) => { panel.querySelector("#f").onsubmit = (e) => { e.preventDefault(); mu.income = +e.target.income.value || 0; mu.targetIncome = +e.target.target.value || mu.targetIncome; save(); close(); navigate("music"); }; });
    };
    $$("[data-addmusic]", root).forEach((b) => (b.onclick = () => editMusicTask(b.dataset.addmusic, null)));
    $$(".music-task", root).forEach((card) => {
      const cat = card.dataset.cat; const g = mu.categories[cat].find((x) => x.id === card.dataset.id);
      card.querySelector("[data-toggle]").onclick = () => { g.done = !g.done; if (g.done) logActivity("Music: " + g.title); save(); navigate("music"); };
      card.querySelector("[data-edit]").onclick = () => editMusicTask(cat, g);
      card.querySelector("[data-del]").onclick = () => { const arr = mu.categories[cat]; arr.splice(arr.indexOf(g), 1); save(); navigate("music"); };
    });
  };
  function catEyebrow(c) { return c === "Beat Sales" ? "Revenue" : c === "Social Media Services" ? "Services" : "Web Dev"; }
  function musicTaskCard(cat, g) {
    const over = !g.done && isOverdue(g.due);
    return '<article class="card hover goal-card music-task' + (g.done ? " done" : "") + '" data-cat="' + esc(cat) + '" data-id="' + g.id + '">' +
      '<div class="top"><button class="card-tick" data-toggle>' + I.check + '</button><h3>' + esc(g.title) + "</h3></div>" +
      (g.notes ? '<p class="notes">' + esc(g.notes) + "</p>" : "") +
      '<div class="foot"><span class="pri ' + g.priority + '">' + g.priority + "</span>" +
      (g.due ? '<span class="due' + (over ? " over" : "") + '">' + I.clock + " " + prettyDate(g.due) + "</span>" : "") +
      '<span style="margin-left:auto;display:flex;gap:6px" class="row-actions"><button class="mini-btn" data-edit>' + I.edit + '</button><button class="mini-btn" data-del>' + I.trash + "</button></span></div></article>";
  }
  function editMusicTask(cat, g) {
    const isNew = !g; const t = g || { title: "", priority: "Medium", due: "", notes: "" };
    openModal(isNew ? "Add to " + cat : "Edit task",
      '<form class="modal-form" id="f">' + field("Task", "title", t.title) +
      '<div class="field-row">' + priorityField(t.priority) + '<label class="field"><span>Deadline</span><input name="due" type="date" value="' + esc(t.due) + '" /></label></div>' +
      notesField(t.notes) +
      '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Save</button></div></form>',
      (panel, close) => { panel.querySelector("#f").onsubmit = (e) => { e.preventDefault(); const f = e.target; if (!f.title.value.trim()) return;
        const data = { title: f.title.value.trim(), priority: f.priority.value, due: f.due.value, notes: f.notes.value.trim() };
        if (isNew) state.music.categories[cat].push(Object.assign({ id: uid(), done: false }, data)); else Object.assign(t, data);
        save(); close(); navigate("music"); }; });
  }

  /* ============================ VISION BOARD ============================ */
  views.vision = function (root) {
    const v = state.vision; const cats = Object.keys(v);
    root.innerHTML =
      '<div class="section-head"><div><h2>Vision Board</h2><p class="sub">See it daily. Build it relentlessly. Add images and notes.</p></div>' +
      '<button class="btn gold" data-addvision>' + I.plus + "Add vision</button></div>" +
      cats.map((cat) =>
        '<section style="margin-bottom:24px"><p class="eyebrow" style="margin-bottom:12px">' + esc(cat) + "</p>" +
        (v[cat].length ? '<div class="vision-grid">' + v[cat].map((it) => visionItem(cat, it)).join("") + "</div>" :
          '<p class="muted tiny">Nothing here yet.</p>') + "</section>").join("");

    root.querySelector("[data-addvision]").onclick = () => editVision(cats[0], null);
    $$(".vision-item", root).forEach((card) => {
      const cat = card.dataset.cat; const it = v[cat].find((x) => x.id === card.dataset.id);
      card.querySelector("[data-vedit]").onclick = (e) => { e.stopPropagation(); editVision(cat, it); };
      card.querySelector("[data-vdel]").onclick = (e) => { e.stopPropagation(); v[cat].splice(v[cat].indexOf(it), 1); save(); navigate("vision"); };
    });
  };
  function visionItem(cat, it) {
    return '<div class="vision-item" data-cat="' + esc(cat) + '" data-id="' + it.id + '">' +
      (it.img ? '<img src="' + esc(it.img) + '" alt="' + esc(it.title) + '" />' : '<div class="vision-ph">' + I.image + "</div>") +
      '<div class="vbody"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><h4>' + esc(it.title) + "</h4>" +
      '<span class="row-actions" style="display:flex;gap:4px"><button class="mini-btn" data-vedit>' + I.edit + '</button><button class="mini-btn" data-vdel>' + I.trash + "</button></span></div>" +
      (it.note ? "<p>" + esc(it.note) + "</p>" : "") + "</div></div>";
  }
  function editVision(cat, it) {
    const isNew = !it; const v = it || { title: "", note: "", img: "" };
    const catOptions = Object.keys(state.vision).map((c) => '<option' + (c === cat ? " selected" : "") + ">" + esc(c) + "</option>").join("");
    openModal(isNew ? "Add vision" : "Edit vision",
      '<form class="modal-form" id="f">' +
      '<label class="field"><span>Section</span><select name="cat">' + catOptions + "</select></label>" +
      field("Title", "title", v.title) +
      '<label class="field"><span>Note</span><textarea name="note" placeholder="What does this represent?">' + esc(v.note) + "</textarea></label>" +
      '<label class="field"><span>Image upload</span><input name="imgfile" type="file" accept="image/*" /></label>' +
      '<p class="tiny muted">Or paste an image URL below.</p>' + field("Image URL", "img", v.img) +
      '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Save</button></div></form>',
      (panel, close) => {
        let dataUrl = v.img;
        panel.querySelector('[name="imgfile"]').onchange = (e) => {
          const file = e.target.files[0]; if (!file) return;
          const reader = new FileReader(); reader.onload = () => { dataUrl = reader.result; panel.querySelector('[name="img"]').value = ""; }; reader.readAsDataURL(file);
        };
        panel.querySelector("#f").onsubmit = (ev) => {
          ev.preventDefault(); const f = ev.target; if (!f.title.value.trim()) return;
          const targetCat = f.cat.value;
          const img = f.img.value.trim() || dataUrl || "";
          const data = { title: f.title.value.trim(), note: f.note.value.trim(), img };
          if (isNew) { state.vision[targetCat].push(Object.assign({ id: uid() }, data)); }
          else {
            Object.assign(v, data);
            if (targetCat !== cat) { state.vision[cat].splice(state.vision[cat].indexOf(v), 1); state.vision[targetCat].push(v); }
          }
          save(); close(); navigate("vision");
        };
      });
  }

  /* ============================ AI COACH ============================ */
  views.coach = function (root) {
    if (!state.coach.length) {
      state.coach.push({ who: "coach", text: coachIntro() }); save();
    }
    root.innerHTML =
      '<div class="coach"><div class="suggestions" id="sugg">' +
      ["Review my goals", "What should I do today?", "Motivate me", "Analyze my habits", "How's my fitness?", "Grow my music income"]
        .map((s) => '<button class="sugg">' + esc(s) + "</button>").join("") +
      '</div><div class="coach-stream" id="stream">' + state.coach.map(msgHtml).join("") + "</div>" +
      '<form class="coach-input" id="cf"><input id="cin" placeholder="Ask your coach anything…" autocomplete="off" />' +
      '<button class="btn gold" type="submit">' + I.send + "</button></form></div>";

    const stream = root.querySelector("#stream");
    stream.scrollTop = stream.scrollHeight;
    const send = (text) => {
      text = text.trim(); if (!text) return;
      state.coach.push({ who: "me", text });
      const reply = coachReply(text);
      state.coach.push({ who: "coach", text: reply });
      save();
      stream.insertAdjacentHTML("beforeend", msgHtml({ who: "me", text }) + msgHtml({ who: "coach", text: reply }));
      stream.scrollTop = stream.scrollHeight;
    };
    root.querySelector("#cf").onsubmit = (e) => { e.preventDefault(); const inp = root.querySelector("#cin"); send(inp.value); inp.value = ""; };
    $$("#sugg .sugg", root).forEach((b) => (b.onclick = () => send(b.textContent)));
  };
  function msgHtml(m) {
    return '<div class="msg ' + m.who + '"><div class="who">' + (m.who === "coach" ? "JC" : "You") + '</div><div class="bubble">' + (m.who === "me" ? esc(m.text) : m.text) + "</div></div>";
  }
  function coachIntro() {
    return "I'm your <strong>JAY OS Coach</strong> — part mentor, strategist, fitness coach, and business advisor. I can see your goals, training, and music targets. Ask me to review your goals, plan your day, analyze your habits, or push you when you need it. What are we attacking first?";
  }
  function coachReply(text) {
    const t = text.toLowerCase();
    const g = state.goals; const all = [].concat(g.daily, g.weekly, g.monthly, g.yearly);
    const open = all.filter((x) => !x.done); const high = open.filter((x) => x.priority === "High");
    const w = state.fitness; const toGain = w.target - w.current;
    const mu = state.music; const incomeGap = mu.targetIncome - mu.income;

    if (/motivat|inspir|push|hype|lazy|tired|give up/.test(t)) {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      return "Listen — you set out to hit <strong>180 lbs</strong> and build a real music business. That version of you is built in the boring reps nobody claps for.<br><br>“" + esc(q.q) + "” — " + esc(q.by) + "<br><br>You don't need motivation, you need one action. Pick the smallest thing on your list and do it in the next 10 minutes.";
    }
    if (/review|my goals|goal/.test(t)) {
      return "Here's your goal snapshot:<ul>" +
        "<li><strong>" + open.length + "</strong> open goals, <strong>" + high.length + "</strong> high-priority.</li>" +
        "<li>Daily: " + g.daily.filter((x) => !x.done).length + " open · Weekly: " + g.weekly.filter((x) => !x.done).length + " · Monthly: " + g.monthly.filter((x) => !x.done).length + " · Yearly: " + g.yearly.filter((x) => !x.done).length + "</li>" +
        (high.length ? "<li>Start with: <strong>" + esc(high[0].title) + "</strong></li>" : "<li>No high-priority goals open — set one so you have a clear target.</li>") +
        "</ul>My read: focus beats volume. Knock out your top 3 daily goals before noon and the week takes care of itself.";
    }
    if (/today|do today|next|what should/.test(t)) {
      const todayName = DAYS[(new Date().getDay() + 6) % 7];
      const tasks = (state.planner.tasks[todayName] || []).filter((x) => !x.done);
      return "Game plan for <strong>" + todayName + "</strong>:<ul>" +
        (high.length ? "<li>Priority goal: <strong>" + esc(high[0].title) + "</strong></li>" : "") +
        (tasks.length ? "<li>Planned: <strong>" + esc(tasks[0].text) + "</strong>" + (tasks[1] ? " then " + esc(tasks[1].text) : "") + "</li>" : "<li>No tasks planned — add 1-3 in the Weekly Planner.</li>") +
        "<li>Non-negotiables: hit your protein, move your body, 30 min on music.</li>" +
        "</ul>Win the morning, win the day.";
    }
    if (/fitness|weight|gym|lift|muscle|180|bulk/.test(t)) {
      const next = w.mastery.map((m) => ({ m, s: m.steps.find((s) => !s.done) })).filter((x) => x.s)[0];
      return "Fitness status: <strong>" + w.current + " lbs</strong>, " + toGain + " to your 180 target.<ul>" +
        "<li>Train " + w.daysPerWeek + "x/week and eat in a surplus — aim for +0.5 lb/week.</li>" +
        "<li>Log your sets so we can force progressive overload.</li>" +
        (next ? "<li>Next skill milestone: <strong>" + esc(next.s.t) + "</strong> toward " + esc(next.m.name) + "</li>" : "") +
        "</ul>" + (toGain > 0 ? "Eat like it's your job. The lifts will follow." : "You're at target — now it's about strength and composition.");
    }
    if (/music|beat|income|money|500|business|client/.test(t)) {
      const openMusic = Object.values(mu.categories).reduce((a, x) => a.concat(x), []).filter((x) => !x.done);
      return "Music business: <strong>$" + mu.income + "</strong> of $" + mu.targetIncome + "/mo (gap $" + incomeGap + ").<ul>" +
        "<li>Three engines: beat sales, social media services, websites. Cash comes fastest from <strong>services</strong> — they're sold, not found.</li>" +
        (openMusic.length ? "<li>Next move: <strong>" + esc(openMusic[0].title) + "</strong></li>" : "") +
        "<li>Daily: 5 outreach messages. 5/day = 150/month = clients.</li>" +
        "</ul>Revenue loves consistency. Outreach every single day.";
    }
    if (/habit|analyz|consisten|streak|progress/.test(t)) {
      const checkDone = state.dashChecklist.filter((c) => c.done).length;
      const logged = w.logs.length;
      return "Habit analysis:<ul>" +
        "<li>Daily checklist: " + checkDone + "/" + state.dashChecklist.length + " done today.</li>" +
        "<li>Workouts logged: " + logged + ". " + (logged < 3 ? "Log every session — what gets measured gets managed." : "Good logging habit — keep stacking data.") + "</li>" +
        "<li>Open vs done goals: " + open.length + " open, " + (all.length - open.length) + " done.</li>" +
        "</ul>Biggest lever right now: pick ONE keystone habit (training or daily outreach) and protect it for 30 days.";
    }
    return "I hear you. Here's how I'd frame it: tie it back to one of your big rocks — <strong>180 lbs</strong>, <strong>$500/mo music</strong>, or staying consistent. Tell me which area (fitness, music, goals, or habits) and I'll give you the next concrete move. Or tap a suggestion above.";
  }

  /* ============================ REMINDERS ============================ */
  views.reminders = function (root) {
    root.innerHTML =
      '<div class="section-head"><div><h2>Reminders</h2><p class="sub">Daily, weekly and one-off. ' +
      (notifPermission() ? "Notifications on." : "Enable notifications in Settings.") + '</p></div>' +
      '<button class="btn gold" data-addrem>' + I.plus + "New reminder</button></div>" +
      '<div class="grid" style="gap:10px">' +
      (state.reminders.length ? state.reminders.map(remCard).join("") :
        emptyState("No reminders", "Add one to stay on track.")) + "</div>";

    root.querySelector("[data-addrem]").onclick = () => editReminder(null);
    $$(".rem-item", root).forEach((card) => {
      const r = state.reminders.find((x) => x.id === card.dataset.id);
      card.querySelector("[data-rcheck]").onclick = () => { r.done = !r.done; save(); navigate("reminders"); };
      card.querySelector("[data-redit]").onclick = () => editReminder(r);
      card.querySelector("[data-rdel]").onclick = () => { state.reminders = state.reminders.filter((x) => x.id !== r.id); save(); navigate("reminders"); };
    });
  };
  function remCard(r) {
    const repeatLabel = r.repeat === "daily" ? "Every day" : r.repeat === "weekly" ? "Every week" : "One-time";
    return '<div class="item-card rem-item' + (r.done ? " done" : "") + '" data-id="' + r.id + '">' +
      '<button class="checkbox" data-rcheck style="' + (r.done ? "background:var(--gold);border-color:var(--gold)" : "") + '">' + I.check + "</button>" +
      '<div style="flex:1"><div class="check-label"' + (r.done ? ' style="text-decoration:line-through;opacity:.6"' : "") + ">" + esc(r.title) + "</div>" +
      '<div class="rem-when">' + esc(r.when || "anytime") + " · " + repeatLabel + "</div></div>" +
      '<div class="row-actions"><button class="mini-btn" data-redit>' + I.edit + '</button><button class="mini-btn" data-rdel>' + I.trash + "</button></div></div>";
  }
  function editReminder(r) {
    const isNew = !r; const rem = r || { title: "", when: "", repeat: "daily" };
    openModal(isNew ? "New reminder" : "Edit reminder",
      '<form class="modal-form" id="f">' + field("Reminder", "title", rem.title) +
      '<div class="field-row"><label class="field"><span>Time</span><input name="when" type="time" value="' + esc(rem.when) + '" /></label>' +
      '<label class="field"><span>Repeat</span><select name="repeat">' +
      [["once", "One-time"], ["daily", "Daily"], ["weekly", "Weekly"]].map(([v, l]) => '<option value="' + v + '"' + (v === rem.repeat ? " selected" : "") + ">" + l + "</option>").join("") +
      "</select></label></div>" +
      '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Save</button></div></form>',
      (panel, close) => { panel.querySelector("#f").onsubmit = (e) => { e.preventDefault(); const f = e.target; if (!f.title.value.trim()) return;
        const data = { title: f.title.value.trim(), when: f.when.value, repeat: f.repeat.value };
        if (isNew) { state.reminders.push(Object.assign({ id: uid(), done: false }, data)); logActivity("Added reminder: " + data.title); } else Object.assign(rem, data);
        save(); close(); navigate("reminders"); }; });
  }
  function notifPermission() { return typeof Notification !== "undefined" && Notification.permission === "granted"; }

  /* ============================ SETTINGS ============================ */
  views.settings = function (root) {
    const s = state.settings;
    root.innerHTML =
      '<div class="grid cols-2">' +
      '<section class="card"><div class="section-head"><div><p class="eyebrow">You</p><h2>Profile</h2></div></div>' +
      '<form class="modal-form" id="profileForm">' + field("Name", "name", state.profile.name) +
      '<button class="btn gold" type="submit">Save profile</button></form></section>' +

      '<section class="card"><div class="section-head"><div><p class="eyebrow">Appearance</p><h2>Theme</h2></div></div>' +
      '<div class="setting-row"><div class="info"><strong>Dark mode</strong><span>Premium dark interface (default).</span></div>' +
      '<button class="switch' + (s.theme === "dark" ? " on" : "") + '" id="themeSwitch"></button></div>' +
      '<div class="setting-row"><div class="info"><strong>Notifications</strong><span>Browser reminders.</span></div>' +
      '<button class="switch' + (s.notifications ? " on" : "") + '" id="notifSwitch"></button></div></section>' +

      '<section class="card"><div class="section-head"><div><p class="eyebrow">Your data</p><h2>Backup & Export</h2></div></div>' +
      '<p class="tiny muted" style="margin-bottom:14px">Everything is stored locally on this device. Export a backup file you can re-import anytime.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn gold" id="exportBtn">Export data</button>' +
      '<button class="btn" id="importBtn">Import data</button><input type="file" id="importFile" accept="application/json" hidden /></div></section>' +

      '<section class="card"><div class="section-head"><div><p class="eyebrow">Danger zone</p><h2>Reset</h2></div></div>' +
      '<p class="tiny muted" style="margin-bottom:14px">Restore JAY OS to its starting state. This wipes your data on this device.</p>' +
      '<button class="btn danger" id="resetBtn">Reset everything</button></section>' +
      "</div>";

    root.querySelector("#profileForm").onsubmit = (e) => {
      e.preventDefault(); state.profile.name = e.target.name.value.trim() || state.profile.name;
      const parts = state.profile.name.split(" "); state.profile.initials = ((parts[0][0] || "J") + (parts[1] ? parts[1][0] : "")).toUpperCase();
      save(); applyProfile(); toast("Profile saved");
    };
    root.querySelector("#themeSwitch").onclick = () => { s.theme = s.theme === "dark" ? "light" : "dark"; save(); applyTheme(); navigate("settings"); };
    root.querySelector("#notifSwitch").onclick = () => {
      if (!s.notifications && typeof Notification !== "undefined" && Notification.permission !== "granted") {
        Notification.requestPermission().then((p) => { s.notifications = p === "granted"; save(); navigate("settings"); if (p === "granted") toast("Notifications enabled"); });
      } else { s.notifications = !s.notifications; save(); navigate("settings"); }
    };
    root.querySelector("#exportBtn").onclick = exportData;
    root.querySelector("#importBtn").onclick = () => root.querySelector("#importFile").click();
    root.querySelector("#importFile").onchange = importData;
    root.querySelector("#resetBtn").onclick = () => {
      openModal("Reset everything?", '<p class="tiny muted">This permanently clears all your goals, plans, logs and settings on this device.</p>' +
        '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn danger" id="confirmReset">Yes, reset</button></div>',
        (panel, close) => { panel.querySelector("#confirmReset").onclick = () => { state = defaults(); save(); close(); applyAll(); navigate("dashboard"); toast("JAY OS reset"); }; });
    };
  };

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "jay-os-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click(); URL.revokeObjectURL(url); toast("Backup exported");
  }
  function importData(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { const data = JSON.parse(reader.result); state = Object.assign(defaults(), data); save(); applyAll(); navigate("dashboard"); toast("Data imported"); }
      catch (err) { toast("Invalid backup file"); }
    };
    reader.readAsText(file);
  }

  /* ============================ SEARCH ============================ */
  function buildSearchIndex() {
    const idx = [];
    const g = state.goals;
    ["daily", "weekly", "monthly", "yearly"].forEach((k) => g[k].forEach((x) => idx.push({ tag: "Goal", text: x.title, view: "goals" })));
    DAYS.forEach((d) => state.planner.tasks[d].forEach((t) => idx.push({ tag: "Task", text: t.text + " (" + d + ")", view: "planner" })));
    state.fitness.mastery.forEach((m) => idx.push({ tag: "Fitness", text: m.name, view: "fitness" }));
    state.diet.meals.forEach((m) => idx.push({ tag: "Meal", text: m.name, view: "diet" }));
    Object.keys(state.music.categories).forEach((c) => state.music.categories[c].forEach((x) => idx.push({ tag: "Music", text: x.title, view: "music" })));
    Object.keys(state.vision).forEach((c) => state.vision[c].forEach((x) => idx.push({ tag: "Vision", text: x.title, view: "vision" })));
    state.reminders.forEach((r) => idx.push({ tag: "Reminder", text: r.title, view: "reminders" }));
    return idx;
  }
  function runSearch(q) {
    q = q.trim().toLowerCase(); if (!q) return;
    const results = buildSearchIndex().filter((x) => x.text.toLowerCase().includes(q)).slice(0, 30);
    const overlay = $("#searchOverlay"); const box = $("#searchResults");
    box.innerHTML = results.length ? results.map((r) =>
      '<div class="search-res" data-view="' + r.view + '"><span class="stag">' + r.tag + '</span><span>' + esc(r.text) + "</span></div>").join("") :
      '<p class="muted tiny">No matches for “' + esc(q) + "”.</p>";
    overlay.hidden = false;
    $$(".search-res", box).forEach((el) => (el.onclick = () => { overlay.hidden = true; navigate(el.dataset.view); }));
  }

  /* ============================ QUICK ADD ============================ */
  function quickAdd() {
    openModal("Quick add",
      '<form class="modal-form" id="f"><label class="field"><span>What do you want to add?</span>' +
      '<select name="type"><option value="daily">Daily goal</option><option value="weekly">Weekly goal</option>' +
      '<option value="monthly">Monthly goal</option><option value="yearly">Yearly goal</option>' +
      '<option value="task">Today\'s task</option><option value="reminder">Reminder</option><option value="check">Daily checklist item</option></select></label>' +
      field("Text", "text", "") + priorityField("Medium") +
      '<div class="modal-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn gold" type="submit">Add</button></div></form>',
      (panel, close) => {
        panel.querySelector("#f").onsubmit = (e) => {
          e.preventDefault(); const f = e.target; const text = f.text.value.trim(); if (!text) return;
          const type = f.type.value; const pri = f.priority.value;
          if (["daily", "weekly", "monthly", "yearly"].indexOf(type) !== -1) {
            state.goals[type].push({ id: uid(), title: text, priority: pri, due: "", notes: "", done: false }); logActivity("Added goal: " + text);
          } else if (type === "task") {
            const day = DAYS[(new Date().getDay() + 6) % 7]; state.planner.tasks[day].push({ id: uid(), text, time: "", priority: pri, done: false });
          } else if (type === "reminder") {
            state.reminders.push({ id: uid(), title: text, when: "", repeat: "once", done: false });
          } else if (type === "check") {
            state.dashChecklist.push({ id: uid(), text, done: false });
          }
          save(); close(); navigate(type === "task" ? "planner" : type === "reminder" ? "reminders" : type === "check" ? "dashboard" : "goals"); toast("Added");
        };
      });
  }

  /* ============================ APPLY / INIT ============================ */
  function applyTheme() { document.documentElement.setAttribute("data-theme", state.settings.theme); }
  function applyProfile() {
    $("#userName").textContent = state.profile.name;
    $("#userAvatar").textContent = state.profile.initials || "JC";
  }
  function applyAll() { applyTheme(); applyProfile(); }

  function buildNav() {
    $("#primaryNav").innerHTML = NAV.map((n) =>
      '<button class="nav-item" data-nav="' + n.id + '">' + n.icon + "<span>" + esc(n.label) + "</span></button>").join("");
    $$("#primaryNav .nav-item").forEach((b) => (b.onclick = () => navigate(b.dataset.nav)));

    $("#mobileBar").innerHTML = MOBILE_NAV.map((id) => {
      const n = NAV.find((x) => x.id === id);
      return '<button data-nav="' + id + '">' + n.icon + "<span>" + esc(n.label.split(" ")[0]) + "</span></button>";
    }).join("");
    $$("#mobileBar button").forEach((b) => (b.onclick = () => navigate(b.dataset.nav)));
  }

  function openSidebar() { $("#sidebar").classList.add("open"); $("#sidebarScrim").hidden = false; }
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#sidebarScrim").hidden = true; }

  function wireChrome() {
    $("#menuToggle").onclick = openSidebar;
    $("#sidebarScrim").onclick = closeSidebar;
    $("#quickAddBtn").onclick = quickAdd;
    $$("[data-close-overlay]").forEach((b) => (b.onclick = () => { $("#searchOverlay").hidden = true; }));
    $("#searchOverlay").onclick = (e) => { if (e.target.id === "searchOverlay") e.currentTarget.hidden = true; };

    const search = $("#globalSearch");
    search.addEventListener("keydown", (e) => { if (e.key === "Enter") runSearch(search.value); if (e.key === "Escape") $("#searchOverlay").hidden = true; });
    search.addEventListener("input", () => { if (search.value.trim().length >= 2) runSearch(search.value); else $("#searchOverlay").hidden = true; });

    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") { e.preventDefault(); search.focus(); }
      if (e.key === "Escape") { $("#modalOverlay").hidden = true; $("#searchOverlay").hidden = true; closeSidebar(); }
    });
  }

  function scheduleReminderChecks() {
    if (typeof Notification === "undefined") return;
    setInterval(() => {
      if (!state.settings.notifications || Notification.permission !== "granted") return;
      const now = new Date(); const hhmm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
      state.reminders.forEach((r) => {
        if (r.when === hhmm && r._lastFired !== now.toDateString()) {
          r._lastFired = now.toDateString();
          try { new Notification("JAY OS Reminder", { body: r.title }); } catch (e) { /* ignore */ }
        }
      });
    }, 30000);
  }

  function init() {
    load();
    buildNav();
    applyAll();
    wireChrome();
    navigate("dashboard");
    scheduleReminderChecks();
    setTimeout(() => { const b = $("#boot"); if (b) { b.classList.add("hide"); setTimeout(() => b.remove(), 600); } }, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
