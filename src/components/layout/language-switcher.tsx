import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n/locales";
import { cn } from "@/lib/utils";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = SUPPORTED_LANGUAGES.find(
    (language) => language.code === (i18n.resolvedLanguage ?? i18n.language),
  );
  const activeLanguage = currentLanguage ?? SUPPORTED_LANGUAGES.find((language) => language.code === DEFAULT_LANGUAGE)!;

  const changeLanguage = (language: SupportedLanguage) => {
    void i18n.changeLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative" onKeyDown={(event) => event.key === "Escape" && setIsOpen(false)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 min-w-16 justify-between px-2 text-xs"
        aria-label="Language"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{activeLanguage.label}</span>
        <ChevronDown className={cn("size-3 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
      </Button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          role="listbox"
        >
          {SUPPORTED_LANGUAGES.map((language) => {
            const isActive = activeLanguage.code === language.code;

            return (
              <button
                key={language.code}
                type="button"
                className={cn(
                  "flex h-8 w-full items-center justify-between rounded-sm px-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground",
                )}
                role="option"
                aria-selected={isActive}
                onClick={() => changeLanguage(language.code)}
              >
                <span>{language.name}</span>
                {isActive ? <Check className="size-4" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
