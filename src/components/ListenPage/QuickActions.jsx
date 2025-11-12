import { Settings, MessageSquare, Mic, Share, Heart } from "lucide-react";

export function QuickActions({
  event,
  language,
  isLiked,
  onAskQuestion,
  onJoinVoice,
  onShare,
  onToggleLike,
  translations,
}) {
  return (
    <div className="bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {translations.quickActions}
          </h3>
          <p className="text-sm text-gray-600">
            {language === "en"
              ? "Participate & Interact"
              : "Uczestniczość i Interakcje"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onAskQuestion}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 hover:shadow-lg"
        >
          <MessageSquare className="h-5 w-5" />
          <span>{translations.askQuestion}</span>
        </button>

        <button
          onClick={onJoinVoice}
          className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 hover:shadow-lg"
        >
          <Mic className="h-5 w-5" />
          <span>{translations.joinVoice}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onShare}
            className="bg-white/70 text-gray-700 py-3 px-4 rounded-2xl font-medium hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
          >
            <Share className="h-4 w-4" />
            <span className="text-sm">{translations.shareEvent}</span>
          </button>

          <button
            onClick={onToggleLike}
            className={`py-3 px-4 rounded-2xl font-medium transition-colors flex items-center justify-center space-x-2 ${
              isLiked
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-white/70 text-gray-700 hover:bg-white/90"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm">
              {isLiked
                ? language === "en"
                  ? "Liked"
                  : "Polubiono"
                : language === "en"
                  ? "Like"
                  : "Polub"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
