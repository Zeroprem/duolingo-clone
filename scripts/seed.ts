import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import * as schema from "@/db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

type VocabularySet = {
  man: string;
  woman: string;
  boy: string;
  girl: string;
  zombie: string;
  robot: string;
};

const vocabularyByLanguage: Record<string, VocabularySet> = {
  es: {
    man: "el hombre",
    woman: "la mujer",
    boy: "el chico",
    girl: "la niña",
    zombie: "el zombie",
    robot: "el robot",
  },
  fr: {
    man: "l'homme",
    woman: "la femme",
    boy: "le garçon",
    girl: "la fille",
    zombie: "le zombie",
    robot: "le robot",
  },
  it: {
    man: "l'uomo",
    woman: "la donna",
    boy: "il ragazzo",
    girl: "la ragazza",
    zombie: "lo zombie",
    robot: "il robot",
  },
  jp: {
    man: "otoko",
    woman: "onna",
    boy: "shounen",
    girl: "shoujo",
    zombie: "zombie",
    robot: "robotto",
  },
  hr: {
    man: "muškarac",
    woman: "žena",
    boy: "dječak",
    girl: "djevojčica",
    zombie: "zombi",
    robot: "robot",
  },
};

const createAudioSrc = (languageCode: string, word: keyof VocabularySet) => {
  if (languageCode !== "es") return undefined;

  const fileMap: Record<keyof VocabularySet, string> = {
    man: "/es_man.mp3",
    woman: "/es_woman.mp3",
    boy: "/es_boy.mp3",
    girl: "/es_girl.mp3",
    zombie: "/es_zombie.mp3",
    robot: "/es_robot.mp3",
  };

  return fileMap[word];
};

const main = async () => {
  try {
    console.log("Seeding database...");

    await Promise.all([
      db.delete(schema.challengeProgress),
      db.delete(schema.challengeOptions),
      db.delete(schema.challenges),
      db.delete(schema.lessons),
      db.delete(schema.units),
      db.delete(schema.userProgress),
      db.delete(schema.userSubscription),
      db.delete(schema.courses),
    ]);

    const courses = await db
      .insert(schema.courses)
      .values(
        SUPPORTED_LANGUAGES.map((language) => ({
          title: language.name,
          imageSrc: language.imageSrc,
        }))
      )
      .returning();

    for (const course of courses) {
      const language = SUPPORTED_LANGUAGES.find((item) => item.name === course.title);
      if (!language) continue;

      const vocabulary = vocabularyByLanguage[language.code];

      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unit 1",
            description: `Learn the basics of ${course.title}`,
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2",
            description: `Learn intermediate ${course.title}`,
            order: 2,
          },
        ])
        .returning();

      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "Nouns", order: 1 },
            { unitId: unit.id, title: "Verbs", order: 2 },
            { unitId: unit.id, title: "Adjectives", order: 3 },
            { unitId: unit.id, title: "Phrases", order: 4 },
            { unitId: unit.id, title: "Sentences", order: 5 },
          ])
          .returning();

        for (const lesson of lessons) {
          const challenges = await db
            .insert(schema.challenges)
            .values([
              { lessonId: lesson.id, type: "SELECT", question: 'Which one of these is "the man"?', order: 1 },
              { lessonId: lesson.id, type: "SELECT", question: 'Which one of these is "the woman"?', order: 2 },
              { lessonId: lesson.id, type: "SELECT", question: 'Which one of these is "the boy"?', order: 3 },
              { lessonId: lesson.id, type: "ASSIST", question: '"the man"', order: 4 },
              { lessonId: lesson.id, type: "SELECT", question: 'Which one of these is "the zombie"?', order: 5 },
              { lessonId: lesson.id, type: "SELECT", question: 'Which one of these is "the robot"?', order: 6 },
              { lessonId: lesson.id, type: "SELECT", question: 'Which one of these is "the girl"?', order: 7 },
              { lessonId: lesson.id, type: "ASSIST", question: '"the zombie"', order: 8 },
            ])
            .returning();

          for (const challenge of challenges) {
            if (challenge.order === 1) {
              await db.insert(schema.challengeOptions).values([
                { challengeId: challenge.id, correct: true, text: vocabulary.man, imageSrc: "/man.svg", audioSrc: createAudioSrc(language.code, "man") },
                { challengeId: challenge.id, correct: false, text: vocabulary.woman, imageSrc: "/woman.svg", audioSrc: createAudioSrc(language.code, "woman") },
                { challengeId: challenge.id, correct: false, text: vocabulary.boy, imageSrc: "/boy.svg", audioSrc: createAudioSrc(language.code, "boy") },
              ]);
            }

            if (challenge.order === 2) {
              await db.insert(schema.challengeOptions).values([
                { challengeId: challenge.id, correct: true, text: vocabulary.woman, imageSrc: "/woman.svg", audioSrc: createAudioSrc(language.code, "woman") },
                { challengeId: challenge.id, correct: false, text: vocabulary.boy, imageSrc: "/boy.svg", audioSrc: createAudioSrc(language.code, "boy") },
                { challengeId: challenge.id, correct: false, text: vocabulary.man, imageSrc: "/man.svg", audioSrc: createAudioSrc(language.code, "man") },
              ]);
            }

            if (challenge.order === 3) {
              await db.insert(schema.challengeOptions).values([
                { challengeId: challenge.id, correct: false, text: vocabulary.woman, imageSrc: "/woman.svg", audioSrc: createAudioSrc(language.code, "woman") },
                { challengeId: challenge.id, correct: false, text: vocabulary.man, imageSrc: "/man.svg", audioSrc: createAudioSrc(language.code, "man") },
                { challengeId: challenge.id, correct: true, text: vocabulary.boy, imageSrc: "/boy.svg", audioSrc: createAudioSrc(language.code, "boy") },
              ]);
            }

            if (challenge.order === 4) {
              await db.insert(schema.challengeOptions).values([
                { challengeId: challenge.id, correct: false, text: vocabulary.woman, audioSrc: createAudioSrc(language.code, "woman") },
                { challengeId: challenge.id, correct: true, text: vocabulary.man, audioSrc: createAudioSrc(language.code, "man") },
                { challengeId: challenge.id, correct: false, text: vocabulary.boy, audioSrc: createAudioSrc(language.code, "boy") },
              ]);
            }

            if (challenge.order === 5) {
              await db.insert(schema.challengeOptions).values([
                { challengeId: challenge.id, correct: false, text: vocabulary.man, imageSrc: "/man.svg", audioSrc: createAudioSrc(language.code, "man") },
                { challengeId: challenge.id, correct: false, text: vocabulary.woman, imageSrc: "/woman.svg", audioSrc: createAudioSrc(language.code, "woman") },
                { challengeId: challenge.id, correct: true, text: vocabulary.zombie, imageSrc: "/zombie.svg", audioSrc: createAudioSrc(language.code, "zombie") },
              ]);
            }

            if (challenge.order === 6) {
              await db.insert(schema.challengeOptions).values([
                { challengeId: challenge.id, correct: true, text: vocabulary.robot, imageSrc: "/robot.svg", audioSrc: createAudioSrc(language.code, "robot") },
                { challengeId: challenge.id, correct: false, text: vocabulary.zombie, imageSrc: "/zombie.svg", audioSrc: createAudioSrc(language.code, "zombie") },
                { challengeId: challenge.id, correct: false, text: vocabulary.boy, imageSrc: "/boy.svg", audioSrc: createAudioSrc(language.code, "boy") },
              ]);
            }

            if (challenge.order === 7) {
              await db.insert(schema.challengeOptions).values([
                { challengeId: challenge.id, correct: true, text: vocabulary.girl, imageSrc: "/girl.svg", audioSrc: createAudioSrc(language.code, "girl") },
                { challengeId: challenge.id, correct: false, text: vocabulary.zombie, imageSrc: "/zombie.svg", audioSrc: createAudioSrc(language.code, "zombie") },
                { challengeId: challenge.id, correct: false, text: vocabulary.man, imageSrc: "/man.svg", audioSrc: createAudioSrc(language.code, "man") },
              ]);
            }

            if (challenge.order === 8) {
              await db.insert(schema.challengeOptions).values([
                { challengeId: challenge.id, correct: false, text: vocabulary.woman, audioSrc: createAudioSrc(language.code, "woman") },
                { challengeId: challenge.id, correct: true, text: vocabulary.zombie, audioSrc: createAudioSrc(language.code, "zombie") },
                { challengeId: challenge.id, correct: false, text: vocabulary.boy, audioSrc: createAudioSrc(language.code, "boy") },
              ]);
            }
          }
        }
      }
    }

    console.log(`Database seeded successfully with ${SUPPORTED_LANGUAGES.length} courses.`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
