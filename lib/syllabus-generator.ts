export type LearnerProfile = {
  language: string;
  points: number;
  hearts: number;
  lessonCompletion: number;
  hasActiveSubscription: boolean;
};

export type SyllabusWeek = {
  week: number;
  goal: string;
  focus: string[];
  estimatedMinutes: number;
};

export type GeneratedSyllabus = {
  title: string;
  level: "Beginner" | "Elementary" | "Intermediate";
  modelVersion: string;
  recommendations: string[];
  weeks: SyllabusWeek[];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const inferLevel = (points: number): GeneratedSyllabus["level"] => {
  if (points < 150) return "Beginner";
  if (points < 500) return "Elementary";

  return "Intermediate";
};

const getWeekFocus = (language: string, level: GeneratedSyllabus["level"]) => {
  if (level === "Beginner") {
    return [
      ["Foundational vocabulary", `${language} pronunciation basics`],
      ["Simple sentence patterns", "Daily conversation starters"],
      ["Listening and word recall", "Reading short phrases"],
      ["Speaking confidence", "Mini review and reinforcement"],
    ];
  }

  if (level === "Elementary") {
    return [
      ["Grammar in context", "Useful travel and life scenarios"],
      ["Comprehension drills", "Question and answer fluency"],
      ["Conversation expansion", "Verb usage accuracy"],
      ["Applied review", "Mixed challenge simulations"],
    ];
  }

  return [
    ["Complex sentence construction", "Topic-based vocabulary"],
    ["Listening under speed", "Contextual inference skills"],
    ["Writing and correction loops", "Conversation naturalness"],
    ["Performance review", "Weakness-targeted reinforcement"],
  ];
};

export const generateAdaptiveSyllabus = (
  profile: LearnerProfile
): GeneratedSyllabus => {
  const level = inferLevel(profile.points);
  const intensity = clamp(
    Math.round((profile.points / 100) * 15 + profile.lessonCompletion),
    20,
    90
  );

  const focusByWeek = getWeekFocus(profile.language, level);
  const weeklyBaseMinutes = profile.hasActiveSubscription ? 130 : 90;

  const weeks = focusByWeek.map((focus, index) => ({
    week: index + 1,
    goal: `Week ${index + 1}: ${level} progression milestone`,
    focus,
    estimatedMinutes: weeklyBaseMinutes + Math.round(intensity / 2) + index * 10,
  }));

  const recommendations = [
    profile.hearts <= 2
      ? "Keep sessions shorter (10-15 min) and prioritize review to preserve hearts."
      : "Use one challenge streak per day to accelerate retention.",
    profile.lessonCompletion < 50
      ? "Replay difficult lessons before unlocking new ones to stabilize fundamentals."
      : "Maintain momentum with 1 new lesson + 1 review loop daily.",
    profile.hasActiveSubscription
      ? "Enable unlimited-practice blocks for pronunciation and listening drills."
      : "Use free practice windows to revisit mistakes and maximize XP efficiency.",
  ];

  return {
    title: `${profile.language} AI Study Syllabus`,
    level,
    modelVersion: "lingo-syllabus-v1",
    recommendations,
    weeks,
  };
};
