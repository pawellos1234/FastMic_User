import { ArrowLeft, Mic, Globe } from "lucide-react";

export function Navigation({ title, language, onLanguageToggle, onBack }) {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>
              {language === "en" ? "Back to Home" : "Powrót do Strony Głównej"}
            </span>
          </button>
          <div className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">{title}</span>
          </div>
          <button
            onClick={onLanguageToggle}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language.toUpperCase()}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
