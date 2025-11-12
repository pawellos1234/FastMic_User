import { MessageSquare, Maximize } from "lucide-react";

export function LiveTranscription({
  liveSession,
  language,
  isFullscreen,
  onToggleFullscreen,
  translations,
}) {
  return (
    <div className="bg-gradient-to-br from-white/80 to-green-50/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {translations.transcription}
            </h3>
            <p className="text-sm text-gray-600">
              {language === "en"
                ? "Real-time speech-to-text"
                : "Mowa na tekst w czasie rzeczywistym"}
            </p>
          </div>
        </div>
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Maximize className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-white/70 rounded-2xl p-6 min-h-[200px] max-h-96 overflow-y-auto">
        {liveSession?.transcription ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-800 leading-relaxed text-lg">
              {liveSession.transcription}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin mx-auto mb-3"></div>
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
