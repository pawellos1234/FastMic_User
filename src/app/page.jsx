"use client";

import { useState, useEffect } from "react";
import {
  Mic,
  Users,
  Globe,
  QrCode,
  Play,
  ArrowRight,
  Headphones,
  MessageSquare,
  Settings,
  Sparkles,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const [eventCode, setEventCode] = useState("");
  const [language, setLanguage] = useState("en");
  const [isHovered, setIsHovered] = useState(null);

  // Add floating animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const elements = document.querySelectorAll(".floating");
      elements.forEach((el, index) => {
        el.style.transform = `translateY(${Math.sin(Date.now() * 0.001 + index) * 3}px)`;
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleJoinEvent = () => {
    if (!eventCode.trim()) {
      toast.error(
        language === "en"
          ? "Please enter an event code"
          : "Proszę wprowadzić kod wydarzenia",
      );
      return;
    }
    // Add loading toast
    const loadingToast = toast.loading(
      language === "en" ? "Joining event..." : "Dołączanie do wydarzenia...",
    );
    setTimeout(() => {
      toast.dismiss(loadingToast);
      window.location.href = `/listen?code=${eventCode.trim()}`;
    }, 800);
  };

  const handleDemoEvent = () => {
    const loadingToast = toast.loading(
      language === "en" ? "Loading demo..." : "Ładowanie demo...",
    );
    setTimeout(() => {
      toast.dismiss(loadingToast);
      window.location.href = "/listen?code=2025";
    }, 800);
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const translations = {
    en: {
      title: "FastMic",
      subtitle: "Join Live Events & Ask Questions",
      description:
        "Get real-time transcription with live translation and participate with interactive Q&A.",
      joinEvent: "Join Event",
      enterCode: "Enter event code",
      tryDemo: "Try Demo (Code: 2025)",
      features: "What You Can Do",
      liveTranscription: "Live Text",
      liveTranscriptionDesc:
        "Real-time speech transcription with instant text display",
      qa: "Ask Questions",
      qaDesc: "Submit your questions and see them answered live",
      translation: "Multi-Language",
      translationDesc: "Get live translations in Polish and English",
      quickAccess: "Choose Your Experience",
      listener: "Read Only",
      listenerDesc: "Join and read event transcription",
      participant: "Read & Participate",
      participantDesc: "Read transcription and ask questions",
      howItWorks: "How It Works",
      step1: "Enter Event Code",
      step1Desc: "Get the code from your event organizer",
      step2: "Choose Your Mode",
      step2Desc: "Read only or participate with questions",
      step3: "Enjoy the Event",
      step3Desc: "Real-time transcription with live translations",
    },
    pl: {
      title: "FastMic",
      subtitle: "Dołącz do Wydarzeń Na Żywo i Zadawaj Pytania",
      description:
        "Otrzymuj transkrypcję na żywo z tłumaczeniem w czasie rzeczywistym i uczestniczaj w interaktywnych Q&A.",
      joinEvent: "Dołącz do Wydarzenia",
      enterCode: "Wprowadź kod wydarzenia",
      tryDemo: "Wypróbuj Demo (Kod: 2025)",
      features: "Co Możesz Robić",
      liveTranscription: "Tekst Na Żywo",
      liveTranscriptionDesc:
        "Transkrypcja mowy w czasie rzeczywistym z natychmiastowym wyświetlaniem tekstu",
      qa: "Zadawaj Pytania",
      qaDesc: "Składaj pytania i obserwuj odpowiedzi na żywo",
      translation: "Wielojęzyczność",
      translationDesc:
        "Otrzymuj tłumaczenia na żywo w języku polskim i angielskim",
      quickAccess: "Wybierz Swoje Doświadczenie",
      listener: "Tylko Czytaj",
      listenerDesc: "Dołącz i czytaj transkrypcję wydarzenia",
      participant: "Czytaj i Uczestniczność",
      participantDesc: "Czytaj transkrypcję i zadawaj pytania",
      howItWorks: "Jak To Działa",
      step1: "Wprowadź Kod Wydarzenia",
      step1Desc: "Otrzymaj kod od organizatora wydarzenia",
      step2: "Wybierz Tryb",
      step2Desc: "Tylko czytaj lub uczestniczność z pytaniami",
      step3: "Ciesz Się Wydarzeniem",
      step3Desc: "Transkrypcja w czasie rzeczywistym z tłumaczeniem na żywo",
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Mic className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">{t.title}</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === "en" ? "pl" : "en")}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language.toUpperCase()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating absolute top-20 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="floating absolute top-40 right-20 w-32 h-32 bg-purple-400/10 rounded-full blur-xl"></div>
          <div className="floating absolute bottom-20 left-20 w-24 h-24 bg-green-400/10 rounded-full blur-xl"></div>
          <div className="floating absolute bottom-40 right-10 w-28 h-28 bg-orange-400/10 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Enhanced Title with Animation */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 mr-2 floating" />
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {language === "en" ? "Now Live" : "Teraz Na Żywo"}
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-4 floating">
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.description}
          </p>

          {/* Enhanced Join Event Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl max-w-md mx-auto mb-8 floating">
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.enterCode}
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleJoinEvent()}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-center text-lg font-medium transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <button
                onClick={handleJoinEvent}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 hover:shadow-xl group"
              >
                <Headphones className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="text-lg">{t.joinEvent}</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDemoEvent}
                className="w-full bg-gradient-to-r from-white/80 to-gray-50/80 text-gray-700 py-4 px-8 rounded-2xl font-medium hover:from-white hover:to-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 border border-gray-200 hover:border-gray-300 transform hover:scale-105 hover:shadow-lg group"
              >
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform text-blue-600" />
                <span>{t.tryDemo}</span>
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-gray-600 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>{language === "en" ? "Secure" : "Bezpieczne"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span>{language === "en" ? "Instant" : "Natychmiastowe"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>
                {language === "en" ? "Real-time" : "Czas rzeczywisty"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.features}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {language === "en"
                ? "Everything you need for professional live events in one powerful platform"
                : "Wszystko czego potrzebujesz do profesjonalnych wydarzeń na żywo w jednej potężnej platformie"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/30 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
              onMouseEnter={() => setIsHovered("audio")}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <Headphones className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t.liveTranscription}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.liveTranscriptionDesc}
              </p>
            </div>

            <div
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/30 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
              onMouseEnter={() => setIsHovered("qa")}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <MessageSquare className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t.qa}</h3>
              <p className="text-gray-600 leading-relaxed">{t.qaDesc}</p>
            </div>

            <div
              className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/30 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
              onMouseEnter={() => setIsHovered("translation")}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <Globe className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t.translation}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t.translationDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.quickAccess}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {language === "en"
                ? "Choose your role and jump into the action with one click"
                : "Wybierz swoją rolę i zacznij działać jednym kliknięciem"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
              onClick={() => navigateTo("/listen")}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 backdrop-blur-md rounded-3xl p-8 border border-blue-200/50 hover:border-blue-300 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                {t.listener}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t.listenerDesc}
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>
                  {language === "en"
                    ? "Start Listening"
                    : "Rozpocznij Słuchanie"}
                </span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigateTo("/participant")}
              className="bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 backdrop-blur-md rounded-3xl p-8 border border-green-200/50 hover:border-green-300 transition-all duration-300 text-left group transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                {t.participant}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t.participantDesc}
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>
                  {language === "en" ? "Ask Questions" : "Zadaj Pytania"}
                </span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Mic className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">{t.title}</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                {language === "en"
                  ? "Transform your events with professional live audio streaming, real-time translation, and interactive engagement tools."
                  : "Przekształć swoje wydarzenia dzięki profesjonalnej transmisji audio na żywo, tłumaczeniu w czasie rzeczywistym i interaktywnym narzędziom angażowania."}
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">
                    {language === "en" ? "Live Now" : "Na Żywo Teraz"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === "en" ? "Platform" : "Platforma"}
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    onClick={() => navigateTo("/listen")}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {t.listener}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("/participant")}
                    className="hover:text-green-400 transition-colors"
                  >
                    {t.participant}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {language === "en" ? "Features" : "Funkcje"}
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <Headphones className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">{t.liveTranscription}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">{t.qa}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-green-400" />
                  <span className="text-sm">{t.translation}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 FastMic.{" "}
              {language === "en"
                ? "All rights reserved."
                : "Wszystkie prawa zastrzeżone."}
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Shield className="h-4 w-4" />
                <span className="text-sm">
                  {language === "en"
                    ? "Enterprise Ready"
                    : "Gotowe dla Przedsiębiorstw"}
                </span>
              </div>
              <button
                onClick={() => setLanguage(language === "en" ? "pl" : "en")}
                className="flex items-center space-x-2 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
