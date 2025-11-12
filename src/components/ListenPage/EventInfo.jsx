import { Headphones } from "lucide-react";

export function EventInfo({ event, language, translations }) {
  return (
    <div className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
          <Headphones className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {translations.eventInfo}
          </h3>
          <p className="text-sm text-gray-600">
            {language === "en" ? "Event Details" : "Szczegóły Wydarzenia"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {event.title}
          </h4>
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/70 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              {language === "en" ? "Event Code" : "Kod Wydarzenia"}
            </p>
            <p className="text-lg font-bold text-blue-600">{event.code}</p>
          </div>

          <div className="bg-white/70 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              {language === "en" ? "Status" : "Status"}
            </p>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  event.status === "active"
                    ? "bg-green-500"
                    : event.status === "paused"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-sm font-medium capitalize ${
                  event.status === "active"
                    ? "text-green-600"
                    : event.status === "paused"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {event.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            {language === "en" ? "Organizer" : "Organizator"}
          </p>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">
                {event.organizer_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {event.organizer_name}
              </p>
              <p className="text-xs text-gray-500">{event.organizer_email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
