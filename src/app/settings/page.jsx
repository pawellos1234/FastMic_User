"use client";

import { useState } from "react";
import {
  Settings,
  ArrowLeft,
  Globe,
  User,
  Bell,
  Shield,
  Palette,
  Volume2,
  Mic,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [language, setLanguage] = useState("en");
  const [settings, setSettings] = useState({
    // User preferences
    defaultLanguage: "en",
    theme: "light",
    notifications: true,
    soundEnabled: true,

    // Audio settings
    microphoneEnabled: true,
    autoMute: false,
    audioQuality: "high",

    // Privacy settings
    shareAnalytics: true,
    allowRecording: true,

    // Display settings
    showTranscription: true,
    showTranslation: true,
    fontSize: "medium",
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success(
      language === "en"
        ? "Setting updated!"
        : "Ustawienie zostało zaktualizowane!",
    );
  };

  const resetSettings = () => {
    if (
      window.confirm(
        language === "en"
          ? "Reset all settings to default?"
          : "Przywrócić wszystkie ustawienia domyślne?",
      )
    ) {
      setSettings({
        defaultLanguage: "en",
        theme: "light",
        notifications: true,
        soundEnabled: true,
        microphoneEnabled: true,
        autoMute: false,
        audioQuality: "high",
        shareAnalytics: true,
        allowRecording: true,
        showTranscription: true,
        showTranslation: true,
        fontSize: "medium",
      });
      toast.success(
        language === "en"
          ? "Settings reset to default!"
          : "Ustawienia zostały przywrócone do domyślnych!",
      );
    }
  };

  const translations = {
    en: {
      title: "Settings",
      userPreferences: "User Preferences",
      audioSettings: "Audio Settings",
      privacySettings: "Privacy Settings",
      displaySettings: "Display Settings",
      defaultLanguage: "Default Language",
      theme: "Theme",
      notifications: "Enable Notifications",
      soundEnabled: "Enable Sound",
      microphoneEnabled: "Enable Microphone",
      autoMute: "Auto-mute when joining",
      audioQuality: "Audio Quality",
      shareAnalytics: "Share Analytics",
      allowRecording: "Allow Audio Recording",
      showTranscription: "Show Live Transcription",
      showTranslation: "Show Live Translation",
      fontSize: "Font Size",
      light: "Light",
      dark: "Dark",
      system: "System",
      english: "English",
      polish: "Polish",
      high: "High",
      medium: "Medium",
      low: "Low",
      small: "Small",
      large: "Large",
      resetSettings: "Reset to Default",
      saveSettings: "Save Settings",
      back: "Back to Home",
      description: "Customize your FastMic experience with these settings.",
      notificationsDesc:
        "Receive notifications for new questions and event updates",
      soundDesc: "Enable audio feedback and notification sounds",
      micDesc: "Allow access to your microphone for voice participation",
      autoMuteDesc:
        "Automatically mute your microphone when joining voice rooms",
      qualityDesc: "Higher quality uses more bandwidth",
      analyticsDesc: "Help improve FastMic by sharing anonymous usage data",
      recordingDesc: "Allow organizers to record your audio questions",
      transcriptionDesc: "Display live transcription of spoken content",
      translationDesc: "Display live translation between languages",
      fontDesc: "Adjust text size for better readability",
    },
    pl: {
      title: "Ustawienia",
      userPreferences: "Preferencje Użytkownika",
      audioSettings: "Ustawienia Audio",
      privacySettings: "Ustawienia Prywatności",
      displaySettings: "Ustawienia Wyświetlania",
      defaultLanguage: "Domyślny Język",
      theme: "Motyw",
      notifications: "Włącz Powiadomienia",
      soundEnabled: "Włącz Dźwięk",
      microphoneEnabled: "Włącz Mikrofon",
      autoMute: "Automatyczne wyciszenie przy dołączaniu",
      audioQuality: "Jakość Audio",
      shareAnalytics: "Udostępnij Analitykę",
      allowRecording: "Zezwól na Nagrywanie Audio",
      showTranscription: "Pokaż Transkrypcję Na Żywo",
      showTranslation: "Pokaż Tłumaczenie Na Żywo",
      fontSize: "Rozmiar Czcionki",
      light: "Jasny",
      dark: "Ciemny",
      system: "Systemowy",
      english: "Angielski",
      polish: "Polski",
      high: "Wysoka",
      medium: "Średnia",
      low: "Niska",
      small: "Mały",
      large: "Duży",
      resetSettings: "Przywróć Domyślne",
      saveSettings: "Zapisz Ustawienia",
      back: "Powrót do Strony Głównej",
      description:
        "Dostosuj swoje doświadczenie FastMic za pomocą tych ustawień.",
      notificationsDesc:
        "Otrzymuj powiadomienia o nowych pytaniach i aktualizacjach wydarzeń",
      soundDesc: "Włącz dźwięki informacji zwrotnej i powiadomień",
      micDesc: "Zezwól na dostęp do mikrofonu w celu uczestnictwa głosowego",
      autoMuteDesc:
        "Automatycznie wycisz mikrofon przy dołączaniu do pokoi głosowych",
      qualityDesc: "Wyższa jakość używa więcej przepustowości",
      analyticsDesc:
        "Pomóż ulepszyć FastMic, udostępniając anonimowe dane użytkowania",
      recordingDesc: "Zezwól organizatorom na nagrywanie twoich pytań audio",
      transcriptionDesc: "Wyświetl transkrypcję na żywo mówionej treści",
      translationDesc: "Wyświetl tłumaczenie na żywo między językami",
      fontDesc: "Dostosuj rozmiar tekstu dla lepszej czytelności",
    },
  };

  const t = translations[language];

  const SettingSection = ({ title, children }) => (
    <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const SettingItem = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const Select = ({ value, onChange, options }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t.back}</span>
            </button>
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-gray-600" />
              <span className="text-xl font-bold text-gray-900">{t.title}</span>
            </div>
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
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.description}</p>
        </div>

        <div className="space-y-8">
          {/* User Preferences */}
          <SettingSection title={t.userPreferences}>
            <SettingItem label={t.defaultLanguage}>
              <Select
                value={settings.defaultLanguage}
                onChange={(value) =>
                  handleSettingChange("defaultLanguage", value)
                }
                options={[
                  { value: "en", label: t.english },
                  { value: "pl", label: t.polish },
                ]}
              />
            </SettingItem>

            <SettingItem label={t.theme}>
              <Select
                value={settings.theme}
                onChange={(value) => handleSettingChange("theme", value)}
                options={[
                  { value: "light", label: t.light },
                  { value: "dark", label: t.dark },
                  { value: "system", label: t.system },
                ]}
              />
            </SettingItem>

            <SettingItem
              label={t.notifications}
              description={t.notificationsDesc}
            >
              <Toggle
                checked={settings.notifications}
                onChange={(value) =>
                  handleSettingChange("notifications", value)
                }
              />
            </SettingItem>

            <SettingItem label={t.soundEnabled} description={t.soundDesc}>
              <Toggle
                checked={settings.soundEnabled}
                onChange={(value) => handleSettingChange("soundEnabled", value)}
              />
            </SettingItem>
          </SettingSection>

          {/* Audio Settings */}
          <SettingSection title={t.audioSettings}>
            <SettingItem label={t.microphoneEnabled} description={t.micDesc}>
              <Toggle
                checked={settings.microphoneEnabled}
                onChange={(value) =>
                  handleSettingChange("microphoneEnabled", value)
                }
              />
            </SettingItem>

            <SettingItem label={t.autoMute} description={t.autoMuteDesc}>
              <Toggle
                checked={settings.autoMute}
                onChange={(value) => handleSettingChange("autoMute", value)}
              />
            </SettingItem>

            <SettingItem label={t.audioQuality} description={t.qualityDesc}>
              <Select
                value={settings.audioQuality}
                onChange={(value) => handleSettingChange("audioQuality", value)}
                options={[
                  { value: "high", label: t.high },
                  { value: "medium", label: t.medium },
                  { value: "low", label: t.low },
                ]}
              />
            </SettingItem>
          </SettingSection>

          {/* Privacy Settings */}
          <SettingSection title={t.privacySettings}>
            <SettingItem label={t.shareAnalytics} description={t.analyticsDesc}>
              <Toggle
                checked={settings.shareAnalytics}
                onChange={(value) =>
                  handleSettingChange("shareAnalytics", value)
                }
              />
            </SettingItem>

            <SettingItem label={t.allowRecording} description={t.recordingDesc}>
              <Toggle
                checked={settings.allowRecording}
                onChange={(value) =>
                  handleSettingChange("allowRecording", value)
                }
              />
            </SettingItem>
          </SettingSection>

          {/* Display Settings */}
          <SettingSection title={t.displaySettings}>
            <SettingItem
              label={t.showTranscription}
              description={t.transcriptionDesc}
            >
              <Toggle
                checked={settings.showTranscription}
                onChange={(value) =>
                  handleSettingChange("showTranscription", value)
                }
              />
            </SettingItem>

            <SettingItem
              label={t.showTranslation}
              description={t.translationDesc}
            >
              <Toggle
                checked={settings.showTranslation}
                onChange={(value) =>
                  handleSettingChange("showTranslation", value)
                }
              />
            </SettingItem>

            <SettingItem label={t.fontSize} description={t.fontDesc}>
              <Select
                value={settings.fontSize}
                onChange={(value) => handleSettingChange("fontSize", value)}
                options={[
                  { value: "small", label: t.small },
                  { value: "medium", label: t.medium },
                  { value: "large", label: t.large },
                ]}
              />
            </SettingItem>
          </SettingSection>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={resetSettings}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              {t.resetSettings}
            </button>
            <button
              onClick={() =>
                toast.success(
                  language === "en"
                    ? "Settings saved!"
                    : "Ustawienia zostały zapisane!",
                )
              }
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t.saveSettings}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
