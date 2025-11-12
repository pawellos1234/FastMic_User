"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Users,
  Plus,
  Settings,
  Mic,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Globe,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";

export default function OrganizerPage() {
  const [language, setLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch events
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await fetch("/api/events");
      if (!response.ok) return [];
      return response.json();
    },
    refetchInterval: 5000,
  });

  // Fetch questions for selected event
  const { data: questions = [] } = useQuery({
    queryKey: ["questions", selectedEvent?.id],
    queryFn: async () => {
      if (!selectedEvent?.id) return [];
      const response = await fetch(
        `/api/questions?eventId=${selectedEvent.id}`,
      );
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!selectedEvent?.id,
    refetchInterval: 3000,
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData) => {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create event");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      reset();
      toast.success(
        language === "en"
          ? "Event created successfully!"
          : "Wydarzenie zostało utworzone pomyślnie!",
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update question status mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ questionId, status }) => {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update question");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", selectedEvent?.id],
      });
      toast.success(
        language === "en"
          ? "Question updated!"
          : "Pytanie zostało zaktualizowane!",
      );
    },
    onError: () => {
      toast.error(
        language === "en"
          ? "Failed to update question"
          : "Nie udało się zaktualizować pytania",
      );
    },
  });

  const onSubmit = async (data) => {
    await createEventMutation.mutateAsync({
      code: data.code,
      title: data.title,
      description: data.description,
      organizer_name: data.organizer_name,
      organizer_email: data.organizer_email,
      language: language,
      max_participants: parseInt(data.max_participants) || 100,
    });
  };

  const handleQuestionAction = (questionId, status) => {
    updateQuestionMutation.mutate({ questionId, status });
  };

  const generateQRCode = (eventCode) => {
    const url = `${window.location.origin}/listen?code=${eventCode}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const translations = {
    en: {
      title: "Organizer Dashboard",
      events: "Events",
      questions: "Questions",
      createEvent: "Create New Event",
      eventCode: "Event Code",
      eventTitle: "Event Title",
      eventDescription: "Event Description",
      organizerName: "Organizer Name",
      organizerEmail: "Organizer Email",
      maxParticipants: "Max Participants",
      createButton: "Create Event",
      manageQuestions: "Manage Questions",
      approve: "Approve",
      decline: "Decline",
      markAnswered: "Mark as Answered",
      noEvents: "No events created yet",
      noQuestions: "No questions for this event",
      selectEvent: "Select an event to manage questions",
      qrCode: "QR Code",
      eventLink: "Event Link",
      back: "Back to Home",
      required: "This field is required",
      status: "Status",
      pending: "Pending",
      approved: "Approved",
      declined: "Declined",
      answered: "Answered",
    },
    pl: {
      title: "Panel Organizatora",
      events: "Wydarzenia",
      questions: "Pytania",
      createEvent: "Utwórz Nowe Wydarzenie",
      eventCode: "Kod Wydarzenia",
      eventTitle: "Tytuł Wydarzenia",
      eventDescription: "Opis Wydarzenia",
      organizerName: "Imię Organizatora",
      organizerEmail: "Email Organizatora",
      maxParticipants: "Maksymalna Liczba Uczestników",
      createButton: "Utwórz Wydarzenie",
      manageQuestions: "Zarządzaj Pytaniami",
      approve: "Zatwierdź",
      decline: "Odrzuć",
      markAnswered: "Oznacz jako Odpowiedziane",
      noEvents: "Nie utworzono jeszcze żadnych wydarzeń",
      noQuestions: "Brak pytań dla tego wydarzenia",
      selectEvent: "Wybierz wydarzenie, aby zarządzać pytaniami",
      qrCode: "Kod QR",
      eventLink: "Link do Wydarzenia",
      back: "Powrót do Strony Głównej",
      required: "To pole jest wymagane",
      status: "Status",
      pending: "Oczekujące",
      approved: "Zatwierdzone",
      declined: "Odrzucone",
      answered: "Odpowiedziane",
    },
  };

  const t = translations[language];

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
              <Users className="h-8 w-8 text-purple-600" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-md rounded-lg p-1 mb-8 border border-white/20">
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "events"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.events}
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === "questions"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.questions}
          </button>
        </div>

        {activeTab === "events" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Event Form */}
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Plus className="h-6 w-6" />
                <span>{t.createEvent}</span>
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.eventCode} *
                  </label>
                  <input
                    type="text"
                    {...register("code", { required: t.required })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  {errors.code && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.eventTitle} *
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: t.required })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.eventDescription}
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.organizerName} *
                  </label>
                  <input
                    type="text"
                    {...register("organizer_name", { required: t.required })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  {errors.organizer_name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.organizer_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.organizerEmail} *
                  </label>
                  <input
                    type="email"
                    {...register("organizer_email", { required: t.required })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  {errors.organizer_email && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.organizer_email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.maxParticipants}
                  </label>
                  <input
                    type="number"
                    defaultValue={100}
                    {...register("max_participants")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createEventMutation.isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                >
                  {createEventMutation.isLoading
                    ? "Creating..."
                    : t.createButton}
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t.events}
              </h2>

              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-8">
                    {t.noEvents}
                  </p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white/50 rounded-lg p-4 border border-white/20"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Code: {event.code}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            event.status === "active"
                              ? "bg-green-100 text-green-800"
                              : event.status === "paused"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {event.description}
                      </p>

                      <div className="flex items-center space-x-2 mb-3">
                        <img
                          src={generateQRCode(event.code)}
                          alt="QR Code"
                          className="w-16 h-16 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">
                            {t.eventLink}:
                          </p>
                          <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {window.location.origin}/listen?code={event.code}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setActiveTab("questions");
                        }}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        {t.manageQuestions}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t.manageQuestions}
            </h2>

            {!selectedEvent ? (
              <p className="text-gray-500 italic text-center py-8">
                {t.selectEvent}
              </p>
            ) : (
              <div>
                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-purple-700 text-sm">
                    Code: {selectedEvent.code}
                  </p>
                </div>

                <div className="space-y-4">
                  {questions.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">
                      {t.noQuestions}
                    </p>
                  ) : (
                    questions.map((question) => (
                      <div
                        key={question.id}
                        className="bg-white/50 rounded-lg p-4 border border-white/20"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {question.participant_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {question.participant_email}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              question.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : question.status === "declined"
                                  ? "bg-red-100 text-red-800"
                                  : question.status === "answered"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {t[question.status] || question.status}
                          </span>
                        </div>

                        <p className="text-gray-800 mb-3">
                          {question.question_text}
                        </p>

                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleQuestionAction(question.id, "approved")
                            }
                            disabled={question.status === "approved"}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>{t.approve}</span>
                          </button>
                          <button
                            onClick={() =>
                              handleQuestionAction(question.id, "declined")
                            }
                            disabled={question.status === "declined"}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>{t.decline}</span>
                          </button>
                          <button
                            onClick={() =>
                              handleQuestionAction(question.id, "answered")
                            }
                            disabled={question.status === "answered"}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Mic className="h-4 w-4" />
                            <span>{t.markAnswered}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
