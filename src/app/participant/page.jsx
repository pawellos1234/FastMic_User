"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Mic,
  Send,
  ArrowLeft,
  Globe,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  MicOff,
  Play,
  Pause,
  Trash2,
  Edit3,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function ParticipantPage() {
  const [eventCode, setEventCode] = useState("");
  const [language, setLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const questionText = watch("question", "");

  // Get event code from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setEventCode(code);
    }
  }, []);

  // Timer effect for recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

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

  // Fetch questions for this event
  const { data: questions = [] } = useQuery({
    queryKey: ["questions", event?.id],
    queryFn: async () => {
      if (!event?.id) return [];
      const response = await fetch(`/api/questions?eventId=${event.id}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!event?.id,
    refetchInterval: 3000, // Poll every 3 seconds for updates
  });

  // Submit question mutation
  const submitQuestionMutation = useMutation({
    mutationFn: async (questionData) => {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit question");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", event?.id] });
      reset();
      setAudioBlob(null);
      setRecordingTime(0);
      toast.success(
        language === "en"
          ? "Question submitted successfully! 🎉"
          : "Pytanie zostało wysłane pomyślnie! 🎉",
      );
    },
    onError: () => {
      toast.error(
        language === "en"
          ? "Failed to submit question"
          : "Nie udało się wysłać pytania",
      );
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success(
        language === "en" ? "Recording started..." : "Rozpoczęto nagrywanie...",
      );
    } catch (error) {
      toast.error(
        language === "en"
          ? "Could not access microphone"
          : "Nie można uzyskać dostępu do mikrofonu",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success(
        language === "en" ? "Recording stopped!" : "Zatrzymano nagrywanie!",
      );
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlayingAudio(false);
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (data) => {
    if (!event?.id) return;

    let audioUrl = null;
    if (audioBlob) {
      // In a real implementation, you would upload the audio file here
      // For demo purposes, we'll just use a placeholder
      audioUrl = "demo-audio-url";
    }

    await submitQuestionMutation.mutateAsync({
      event_id: event.id,
      participant_name: data.name,
      participant_email: null, // Email field removed - set to null
      question_text: data.question,
      question_audio_url: audioUrl,
      language: language,
    });
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
    const loadingToast = toast.loading(
      language === "en" ? "Joining event..." : "Dołączanie do wydarzenia...",
    );
    setTimeout(() => {
      toast.dismiss(loadingToast);
      window.location.href = `/participant?code=${eventCode.trim()}`;
    }, 800);
  };

  const translations = {
    en: {
      title: "Ask & Participate",
      joinEvent: "Join Event",
      enterCode: "Enter event code",
      eventNotFound: "Event not found",
      askQuestion: "Submit Your Question",
      yourName: "Your Name or Nickname",
      yourQuestion: "Your Question",
      recordAudio: "Record Audio",
      stopRecording: "Stop Recording",
      playRecording: "Play Recording",
      pauseRecording: "Pause Recording",
      clearRecording: "Clear Recording",
      submitQuestion: "Submit Question",
      questionQueue: "Live Question Queue",
      yourPosition: "Your Position in Queue",
      status: "Status",
      pending: "Waiting",
      approved: "Approved",
      declined: "Declined",
      answered: "Answered",
      noQuestions: "No questions yet. Be the first to ask!",
      connecting: "Connecting to event...",
      back: "Back to Home",
      required: "This field is required",
      audioRecorded: "Audio recorded!",
      characterCount: "characters",
      timeRecorded: "Time recorded",
      submitting: "Submitting...",
      listenMode: "Switch to Listen Mode",
    },
    pl: {
      title: "Zadawaj i Uczestniczność",
      joinEvent: "Dołącz do Wydarzenia",
      enterCode: "Wprowadź kod wydarzenia",
      eventNotFound: "Nie znaleziono wydarzenia",
      askQuestion: "Wyślij Swoje Pytanie",
      yourName: "Twoje Imię lub Pseudonim",
      yourQuestion: "Twoje Pytanie",
      recordAudio: "Nagraj Audio",
      stopRecording: "Zatrzymaj Nagrywanie",
      playRecording: "Odtwórz Nagranie",
      pauseRecording: "Wstrzymaj Nagranie",
      clearRecording: "Usuń Nagranie",
      submitQuestion: "Wyślij Pytanie",
      questionQueue: "Kolejka Pytań Na Żywo",
      yourPosition: "Twoja Pozycja w Kolejce",
      status: "Status",
      pending: "Oczekujące",
      approved: "Zatwierdzone",
      declined: "Odrzucone",
      answered: "Odpowiedziane",
      noQuestions: "Brak pytań. Bądź pierwszy!",
      connecting: "Łączenie z wydarzeniem...",
      back: "Powrót do Strony Głównej",
      required: "To pole jest wymagane",
      audioRecorded: "Audio zostało nagrane!",
      characterCount: "znaków",
      timeRecorded: "Czas nagrania",
      submitting: "Wysyłanie...",
      listenMode: "Przełącz na Tryb Słuchania",
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
                <MessageSquare className="h-8 w-8 text-green-600" />
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
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "declined":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "answered":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "declined":
        return "text-red-600";
      case "answered":
        return "text-blue-600";
      default:
        return "text-yellow-600";
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
              <MessageSquare className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">
                {event.title}
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Enhanced Ask Question Form */}
          <div className="bg-gradient-to-br from-white/80 to-green-50/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t.askQuestion}
                </h2>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Share your thoughts with everyone"
                    : "Podziel się swoimi myślami ze wszystkimi"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.yourName} *
                </label>
                <input
                  type="text"
                  {...register("name", { required: t.required })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-200 bg-white/70"
                  placeholder={
                    language === "en"
                      ? "Enter your name or nickname"
                      : "Wprowadź swoje imię lub pseudonim"
                  }
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* Question Input */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t.yourQuestion} *
                  </label>
                  <span className="text-xs text-gray-500">
                    {questionText.length} {t.characterCount}
                  </span>
                </div>
                <textarea
                  {...register("question", { required: t.required })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none transition-all duration-200 bg-white/70"
                  placeholder={
                    language === "en"
                      ? "What would you like to ask?"
                      : "Co chciałbyś zapytać?"
                  }
                />
                {errors.question && (
                  <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.question.message}</span>
                  </p>
                )}
              </div>

              {/* Enhanced Audio Recording */}
              <div className="bg-white/50 rounded-2xl p-6 border border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <Mic className="h-5 w-5 text-gray-600" />
                  <label className="block text-sm font-semibold text-gray-700">
                    {t.recordAudio}
                  </label>
                  {isRecording && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-red-600 font-medium">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Recording Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                        isRecording
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
                      }`}
                    >
                      {isRecording ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                      <span>
                        {isRecording ? t.stopRecording : t.recordAudio}
                      </span>
                    </button>

                    {audioBlob && !isRecording && (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={isPlayingAudio ? pauseAudio : playAudio}
                          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          {isPlayingAudio ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          <span>
                            {isPlayingAudio
                              ? t.pauseRecording
                              : t.playRecording}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={clearAudio}
                          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>{t.clearRecording}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Audio Status */}
                  {audioBlob && (
                    <div className="bg-green-50 rounded-xl p-3 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        {t.audioRecorded} ({formatTime(recordingTime)}{" "}
                        {t.timeRecorded})
                      </span>
                    </div>
                  )}

                  {/* Audio Element */}
                  <audio
                    ref={audioRef}
                    onEnded={() => setIsPlayingAudio(false)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={submitQuestionMutation.isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                >
                  <Send className="h-6 w-6" />
                  <span className="text-lg">
                    {submitQuestionMutation.isLoading
                      ? t.submitting
                      : t.submitQuestion}
                  </span>
                  {submitQuestionMutation.isLoading && (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `/listen?code=${event.code}`)
                  }
                  className="px-6 py-4 rounded-2xl bg-white/70 text-gray-700 font-medium hover:bg-white/90 transition-colors border border-gray-200"
                >
                  {t.listenMode}
                </button>
              </div>
            </form>
          </div>

          {/* Enhanced Question Queue */}
          <div className="bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t.questionQueue}
                </h2>
                <p className="text-sm text-gray-600">
                  {questions.length > 0
                    ? `${questions.length} ${language === "en" ? "questions in queue" : "pytań w kolejce"}`
                    : language === "en"
                      ? "No questions yet"
                      : "Brak pytań"}
                </p>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 italic">{t.noQuestions}</p>
                  </div>
                </div>
              ) : (
                questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-white/70 rounded-2xl p-5 border border-white/30 hover:bg-white/90 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index < 3
                              ? "bg-gradient-to-r from-green-500 to-emerald-600"
                              : index < 6
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                                : "bg-gradient-to-r from-gray-400 to-gray-500"
                          }`}
                        >
                          #{question.queue_position || index + 1}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">
                            {question.participant_name}
                          </span>
                          <p className="text-xs text-gray-500">
                            {new Date(question.submitted_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusIcon(question.status)}
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            question.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : question.status === "declined"
                                ? "bg-red-100 text-red-700"
                                : question.status === "answered"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {t[question.status] || question.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-800 leading-relaxed">
                      {question.question_text}
                    </p>

                    {question.question_audio_url && (
                      <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                        <Mic className="h-4 w-4" />
                        <span>
                          {language === "en"
                            ? "Audio question included"
                            : "Dołączono pytanie audio"}
                        </span>
                      </div>
                    )}
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
