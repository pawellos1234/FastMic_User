import { Globe } from "lucide-react";

export function LanguageSettings({ language, onLanguageChange }) {
  return (
    <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
          <Globe className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {language === "en" ? "Preferences" : "Preferencje"}
          </h3>
          <p className="text-sm text-gray-600">
            {language === "en" ? "Language & Settings" : "Język i Ustawienia"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {language === "en" ? "Interface Language" : "Język Interfejsu"}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLanguageChange("en")}
              className={`py-2 px-4 rounded-xl font-medium transition-colors ${
                language === "en"
                  ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                  : "bg-white/70 text-gray-700 border-2 border-transparent hover:bg-white/90"
              }`}
            >
              🇺🇸 EN
            </button>
            <button
              onClick={() => onLanguageChange("pl")}
              className={`py-2 px-4 rounded-xl font-medium transition-colors ${
                language === "pl"
                  ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                  : "bg-white/70 text-gray-700 border-2 border-transparent hover:bg-white/90"
              }`}
            >
              🇵🇱 PL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
