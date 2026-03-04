import { generateAdaptiveSyllabus } from "@/lib/syllabus-generator";

type Props = {
  language: string;
  points: number;
  hearts: number;
  lessonCompletion: number;
  hasActiveSubscription: boolean;
};

export const SyllabusPlan = ({
  language,
  points,
  hearts,
  lessonCompletion,
  hasActiveSubscription,
}: Props) => {
  const syllabus = generateAdaptiveSyllabus({
    language,
    points,
    hearts,
    lessonCompletion,
    hasActiveSubscription,
  });

  return (
    <div className="space-y-4 rounded-xl border-2 p-4">
      <div>
        <h3 className="text-lg font-bold">AI Syllabus</h3>
        <p className="text-xs text-neutral-500">
          {syllabus.title} · {syllabus.level} · {syllabus.modelVersion}
        </p>
      </div>

      <div className="space-y-2">
        {syllabus.recommendations.map((recommendation) => (
          <p key={recommendation} className="text-sm text-neutral-700">
            • {recommendation}
          </p>
        ))}
      </div>

      <div className="space-y-3">
        {syllabus.weeks.map((week) => (
          <div key={week.week} className="rounded-lg border p-3">
            <p className="text-sm font-semibold text-neutral-800">{week.goal}</p>
            <p className="text-xs text-neutral-600">
              Focus: {week.focus.join(" • ")}
            </p>
            <p className="text-xs text-neutral-500">{week.estimatedMinutes} min/week</p>
          </div>
        ))}
      </div>
    </div>
  );
};
