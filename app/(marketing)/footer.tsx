import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full gap-2">
        {SUPPORTED_LANGUAGES.map((language) => (
          <Button key={language.code} size="lg" variant="ghost" className="w-full">
            <Image
              src={language.imageSrc}
              alt={language.name}
              height={32}
              width={40}
              className="mr-4 rounded-md"
            />
            {language.name}
          </Button>
        ))}
      </div>
    </footer>
  );
};
