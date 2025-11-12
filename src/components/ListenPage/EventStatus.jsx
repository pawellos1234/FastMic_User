export function EventStatus({ status, translations }) {
  if (status === "ended") {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
        {translations.eventEnded}
      </div>
    );
  }

  if (status === "paused") {
    return (
      <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6">
        {translations.eventPaused}
      </div>
    );
  }

  return null;
}
