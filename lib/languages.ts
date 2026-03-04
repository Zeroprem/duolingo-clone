export type SupportedLanguage = {
  code: string;
  name: string;
  imageSrc: string;
  locale: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "es", name: "Spanish", imageSrc: "/es.svg", locale: "es-ES" },
  { code: "fr", name: "French", imageSrc: "/fr.svg", locale: "fr-FR" },
  { code: "it", name: "Italian", imageSrc: "/it.svg", locale: "it-IT" },
  { code: "jp", name: "Japanese", imageSrc: "/jp.svg", locale: "ja-JP" },
  { code: "hr", name: "Croatian", imageSrc: "/hr.svg", locale: "hr-HR" },
];
