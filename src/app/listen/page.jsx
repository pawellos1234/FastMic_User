"use client";

import { useState } from "react";
import { useEventCode } from "@/utils/useEventCode";
import { useEventData } from "@/utils/useEventData";
import { useEventActions } from "@/utils/useEventActions";
import { translations } from "@/utils/translations";
import { Navigation } from "@/components/ListenPage/Navigation";
import { JoinEventForm } from "@/components/ListenPage/JoinEventForm";
import { QRScanner } from "@/components/QRScanner";
import { LiveTranscription } from "@/components/ListenPage/LiveTranscription";
import { TranslationPanel } from "@/components/ListenPage/TranslationPanel";
import { EventInfo } from "@/components/ListenPage/EventInfo";
import { QuickActions } from "@/components/ListenPage/QuickActions";
import { LanguageSettings } from "@/components/ListenPage/LanguageSettings";
import { EventStatus } from "@/components/ListenPage/EventStatus";
import { LoadingState } from "@/components/ListenPage/LoadingState";
import { ErrorState } from "@/components/ListenPage/ErrorState";

export default function ListenPage() {
  const [language, setLanguage] = useState("en");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { eventCode, setEventCode } = useEventCode();
  const { event, eventLoading, eventError, liveSession } =
    useEventData(eventCode);
  const { isLiked, handleShareEvent, toggleLike, handleJoinEvent } =
    useEventActions(language);

  const t = translations[language];

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "pl" : "en");
  };

  const handleBack = () => {
    window.location.href = "/";
  };

  const handleQRScanResult = (scannedCode) => {
    setEventCode(scannedCode);
    setShowQRScanner(false);
    handleJoinEvent(scannedCode);
  };

  if (!eventCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation
          title={t.title}
          language={language}
          onLanguageToggle={handleLanguageToggle}
          onBack={handleBack}
        />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <JoinEventForm
            eventCode={eventCode}
            setEventCode={setEventCode}
            onJoin={() => handleJoinEvent(eventCode)}
            onScanQR={() => setShowQRScanner(true)}
            translations={t}
          />
        </div>

        {/* QR Scanner */}
        <QRScanner
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onScanResult={handleQRScanResult}
          translations={t}
        />
      </div>
    );
  }

  if (eventLoading) {
    return <LoadingState message={t.connecting} />;
  }

  if (eventError || !event) {
    return (
      <ErrorState
        message={t.eventNotFound}
        onBack={handleBack}
        backButtonText={t.back}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation
        title={event.title}
        language={language}
        onLanguageToggle={handleLanguageToggle}
        onBack={handleBack}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventStatus status={event.status} translations={t} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Panel */}
          <div className="lg:col-span-2 space-y-6">
            <LiveTranscription
              liveSession={liveSession}
              language={language}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              translations={t}
            />

            <TranslationPanel
              liveSession={liveSession}
              language={language}
              translations={t}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <EventInfo event={event} language={language} translations={t} />

            <QuickActions
              event={event}
              language={language}
              isLiked={isLiked}
              onAskQuestion={() =>
                (window.location.href = `/participant?code=${event.code}`)
              }
              onJoinVoice={() =>
                (window.location.href = `/room?code=${event.code}`)
              }
              onShare={handleShareEvent}
              onToggleLike={toggleLike}
              translations={t}
            />

            <LanguageSettings
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
