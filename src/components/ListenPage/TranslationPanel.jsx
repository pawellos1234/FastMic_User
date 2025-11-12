import { Globe } from "lucide-react";

export function TranslationPanel({ liveSession, language, translations }) {
  return (
    <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {translations.translation}
            </h3>
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "Polish Translation"
                : "Tłumaczenie Angielskie"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
            {language === "en" ? "PL" : "EN"}
          </span>
        </div>
      </div>

      <div className="bg-white/70 rounded-2xl p-6 min-h-[200px] max-h-96 overflow-y-auto">
        {liveSession &&
        (language === "en"
          ? liveSession.translation_pl
          : liveSession.translation_en) ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-800 leading-relaxed text-lg">
              {language === "en"
                ? liveSession.translation_pl
                : liveSession.translation_en}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 italic">
                {translations.noTranscription}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
