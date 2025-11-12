"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  ArrowLeft,
  Globe,
  Phone,
  PhoneOff,
} from "lucide-react";
import { toast } from "sonner";

export default function VoiceRoomPage() {
  const [eventCode, setEventCode] = useState("");
  const [language, setLanguage] = useState("en");
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [userRole, setUserRole] = useState("listener");
  const audioRef = useRef(null);

  // Get event code from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setEventCode(code);
    }
  }, []);

  // Fetch event data
  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
  } = useQuery({
    queryKey: ["event", eventCode],
    queryFn: async () => {
      if (!eventCode) return null;
      const response = await fetch(`/api/events?code=${eventCode}`);
      if (!response.ok) {
        throw new Error("Event not found");
      }
      const events = await response.json();
      return events[0] || null;
    },
    enabled: !!eventCode,
  });

  const connectToVoiceRoom = async () => {
    try {
      // In a real implementation, this would connect to a WebRTC service
      // For demo purposes, we'll simulate the connection
      setIsConnected(true);
      setParticipants([
        { id: 1, name: "Demo Organizer", role: "organizer", isMuted: false },
        { id: 2, name: "John Doe", role: "participant", isMuted: true },
        { id: 3, name: "Anna Kowalski", role: "listener", isMuted: true },
      ]);
      toast.success(
        language === "en"
          ? "Connected to voice room!"
          : "Połączono z pokojem głosowym!",
      );
    } catch (error) {
      toast.error(
        language === "en"
          ? "Failed to connect to voice room"
          : "Nie udało się połączyć z pokojem głosowym",
      );
    }
  };

  const disconnectFromVoiceRoom = () => {
    setIsConnected(false);
    setParticipants([]);
    toast.info(
      language === "en"
        ? "Disconnected from voice room"
        : "Rozłączono z pokoju głosowego",
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(
      isMuted
        ? language === "en"
          ? "Microphone unmuted"
          : "Mikrofon włączony"
        : language === "en"
          ? "Microphone muted"
          : "Mikrofon wyciszony",
    );
  };

  const toggleDeafen = () => {
    setIsDeafened(!isDeafened);
    toast.info(
      isDeafened
        ? language === "en"
          ? "Audio enabled"
          : "Dźwięk włączony"
        : language === "en"
          ? "Audio disabled"
          : "Dźwięk wyłączony",
    );
  };

  const handleJoinEvent = () => {
    if (!eventCode.trim()) {
      toast.error(
        language === "en"
          ? "Please enter an event code"
          : "Proszę wprowadzić kod wydarzenia",
      );
      return;
    }
    window.location.href = `/room?code=${eventCode.trim()}`;
  };

  const translations = {
    en: {
      title: "Voice Room",
      joinEvent: "Join Voice Room",
      enterCode: "Enter event code",
      eventNotFound: "Event not found",
      connect: "Connect to Voice Room",
      disconnect: "Disconnect",
      mute: "Mute",
      unmute: "Unmute",
      deafen: "Deafen",
      undeafen: "Undeafen",
      participants: "Participants",
      organizer: "Organizer",
      participant: "Participant",
      listener: "Listener",
      connected: "Connected",
      disconnected: "Disconnected",
      connecting: "Connecting to event...",
      back: "Back to Home",
      voiceControls: "Voice Controls",
      roomInfo: "Room Information",
      noParticipants: "No participants in the room",
    },
    pl: {
      title: "Pokój Głosowy",
      joinEvent: "Dołącz do Pokoju Głosowego",
      enterCode: "Wprowadź kod wydarzenia",
      eventNotFound: "Nie znaleziono wydarzenia",
      connect: "Połącz z Pokojem Głosowym",
      disconnect: "Rozłącz",
      mute: "Wycisz",
      unmute: "Włącz",
      deafen: "Wyłącz Dźwięk",
      undeafen: "Włącz Dźwięk",
      participants: "Uczestnicy",
      organizer: "Organizator",
      participant: "Uczestnik",
      listener: "Słuchacz",
      connected: "Połączony",
      disconnected: "Rozłączony",
      connecting: "Łączenie z wydarzeniem...",
      back: "Powrót do Strony Głównej",
      voiceControls: "Kontrola Głosu",
      roomInfo: "Informacje o Pokoju",
      noParticipants: "Brak uczestników w pokoju",
    },
  };

  const t = translations[language];

  if (!eventCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>{t.back}</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold text-gray-900">
                  {t.title}
                </span>
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

        {/* Join Event Form */}
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              {t.joinEvent}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t.enterCode}
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleJoinEvent()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-lg font-medium"
              />
              <button
                onClick={handleJoinEvent}
                className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-purple-700 transition-all duration-200"
              >
                {t.joinEvent}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.connecting}</p>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{t.eventNotFound}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "organizer":
        return "text-purple-600";
      case "participant":
        return "text-green-600";
      default:
        return "text-blue-600";
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "organizer":
        return "bg-purple-100 text-purple-800";
      case "participant":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

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
              <Mic className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">
                {event.title}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isConnected ? t.connected : t.disconnected}
              </span>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Voice Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Controls */}
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>{t.voiceControls}</span>
              </h3>

              <div className="flex items-center justify-center space-x-4">
                {!isConnected ? (
                  <button
                    onClick={connectToVoiceRoom}
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{t.connect}</span>
                  </button>
                ) : (
                  <button
                    onClick={disconnectFromVoiceRoom}
                    className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <PhoneOff className="h-5 w-5" />
                    <span>{t.disconnect}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Audio Controls */}
            {isConnected && (
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={toggleMute}
                    className={`flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-colors ${
                      isMuted
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="h-6 w-6" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                    <span>{isMuted ? t.unmute : t.mute}</span>
                  </button>

                  <button
                    onClick={toggleDeafen}
                    className={`flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-colors ${
                      isDeafened
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {isDeafened ? (
                      <VolumeX className="h-6 w-6" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                    <span>{isDeafened ? t.undeafen : t.deafen}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Room Information */}
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.roomInfo}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Event:</strong> {event.title}
                </p>
                <p>
                  <strong>Code:</strong> {event.code}
                </p>
                <p>
                  <strong>Organizer:</strong> {event.organizer_name}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`capitalize ${event.status === "active" ? "text-green-600" : event.status === "paused" ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {event.status}
                  </span>
                </p>
                <p>
                  <strong>Participants:</strong> {participants.length}
                </p>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>
                {t.participants} ({participants.length})
              </span>
            </h3>

            <div className="space-y-3">
              {participants.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">
                  {t.noParticipants}
                </p>
              ) : (
                participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/20"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          participant.role === "organizer"
                            ? "bg-purple-100"
                            : participant.role === "participant"
                              ? "bg-green-100"
                              : "bg-blue-100"
                        }`}
                      >
                        <span
                          className={`font-semibold ${getRoleColor(participant.role)}`}
                        >
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {participant.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(participant.role)}`}
                        >
                          {t[participant.role] || participant.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {participant.isMuted ? (
                        <MicOff className="h-4 w-4 text-red-600" />
                      ) : (
                        <Mic className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
