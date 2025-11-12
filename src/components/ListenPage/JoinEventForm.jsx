import { QrCode, Keyboard, Sparkles } from "lucide-react";

export function JoinEventForm({
  eventCode,
  setEventCode,
  onJoin,
  onScanQR,
  translations,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl max-w-md w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {translations.joinEvent}
        </h2>
        <p className="text-gray-600 text-sm">
          {translations.enterCode || "Enter your event code to get started"}
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-6 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder={translations.enterCode}
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && onJoin()}
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-center text-xl font-bold tracking-wider transition-all duration-200 hover:border-gray-300"
            maxLength="10"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Keyboard className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Join Button */}
        <button
          onClick={onJoin}
          disabled={!eventCode.trim()}
          className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
            eventCode.trim()
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {translations.joinEvent}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-gray-500 font-medium">
              {translations.or || "or"}
            </span>
          </div>
        </div>

        {/* QR Scan Button */}
        <button
          onClick={onScanQR}
          className="w-full bg-gradient-to-r from-white/90 to-gray-50/90 text-gray-700 py-4 px-8 rounded-2xl font-semibold hover:from-white hover:to-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-gray-200 hover:border-blue-300 transform hover:scale-105 hover:shadow-lg group"
        >
          <div className="bg-blue-100 p-2 rounded-xl group-hover:bg-blue-200 transition-colors">
            <QrCode className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-lg">{translations.scanQR}</span>
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          {translations.helpText ||
            "Need help? Ask your event organizer for the code"}
        </p>
      </div>
    </div>
  );
}
