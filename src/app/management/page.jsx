"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  ArrowLeft,
  Globe,
  BarChart3,
  Users,
  Calendar,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function ManagementPage() {
  const [language, setLanguage] = useState("en");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const queryClient = useQueryClient();

  // Fetch all events
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await fetch("/api/events");
      if (!response.ok) return [];
      return response.json();
    },
    refetchInterval: 10000,
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
  });

  // Update event status mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ eventId, status }) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success(
        language === "en"
          ? "Event updated!"
          : "Wydarzenie zostało zaktualizowane!",
      );
    },
    onError: () => {
      toast.error(
        language === "en"
          ? "Failed to update event"
          : "Nie udało się zaktualizować wydarzenia",
      );
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setSelectedEvent(null);
      toast.success(
        language === "en" ? "Event deleted!" : "Wydarzenie zostało usunięte!",
      );
    },
    onError: () => {
      toast.error(
        language === "en"
          ? "Failed to delete event"
          : "Nie udało się usunąć wydarzenia",
      );
    },
  });

  const handleStatusChange = (eventId, status) => {
    updateEventMutation.mutate({ eventId, status });
  };

  const handleDeleteEvent = (eventId) => {
    if (
      window.confirm(
        language === "en"
          ? "Are you sure you want to delete this event?"
          : "Czy na pewno chcesz usunąć to wydarzenie?",
      )
    ) {
      deleteEventMutation.mutate(eventId);
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: events.length,
      active: events.filter((e) => e.status === "active").length,
      paused: events.filter((e) => e.status === "paused").length,
      ended: events.filter((e) => e.status === "ended").length,
    };
    return stats;
  };

  const getQuestionStats = () => {
    const stats = {
      total: questions.length,
      pending: questions.filter((q) => q.status === "pending").length,
      approved: questions.filter((q) => q.status === "approved").length,
      answered: questions.filter((q) => q.status === "answered").length,
    };
    return stats;
  };

  const translations = {
    en: {
      title: "Event Management",
      overview: "Overview",
      events: "Events",
      questions: "Questions",
      analytics: "Analytics",
      totalEvents: "Total Events",
      activeEvents: "Active Events",
      pausedEvents: "Paused Events",
      endedEvents: "Ended Events",
      totalQuestions: "Total Questions",
      pendingQuestions: "Pending Questions",
      approvedQuestions: "Approved Questions",
      answeredQuestions: "Answered Questions",
      eventList: "Event List",
      selectEvent: "Select an event to view details",
      eventDetails: "Event Details",
      status: "Status",
      active: "Active",
      paused: "Paused",
      ended: "Ended",
      actions: "Actions",
      pause: "Pause",
      resume: "Resume",
      end: "End Event",
      delete: "Delete",
      view: "View",
      edit: "Edit",
      back: "Back to Home",
      noEvents: "No events found",
      noQuestions: "No questions for this event",
      createdAt: "Created",
      organizer: "Organizer",
      participants: "Participants",
      code: "Code",
    },
    pl: {
      title: "Zarządzanie Wydarzeniami",
      overview: "Przegląd",
      events: "Wydarzenia",
      questions: "Pytania",
      analytics: "Analityka",
      totalEvents: "Wszystkie Wydarzenia",
      activeEvents: "Aktywne Wydarzenia",
      pausedEvents: "Wstrzymane Wydarzenia",
      endedEvents: "Zakończone Wydarzenia",
      totalQuestions: "Wszystkie Pytania",
      pendingQuestions: "Oczekujące Pytania",
      approvedQuestions: "Zatwierdzone Pytania",
      answeredQuestions: "Odpowiedziane Pytania",
      eventList: "Lista Wydarzeń",
      selectEvent: "Wybierz wydarzenie, aby zobaczyć szczegóły",
      eventDetails: "Szczegóły Wydarzenia",
      status: "Status",
      active: "Aktywne",
      paused: "Wstrzymane",
      ended: "Zakończone",
      actions: "Akcje",
      pause: "Wstrzymaj",
      resume: "Wznów",
      end: "Zakończ Wydarzenie",
      delete: "Usuń",
      view: "Zobacz",
      edit: "Edytuj",
      back: "Powrót do Strony Głównej",
      noEvents: "Nie znaleziono wydarzeń",
      noQuestions: "Brak pytań dla tego wydarzenia",
      createdAt: "Utworzono",
      organizer: "Organizator",
      participants: "Uczestnicy",
      code: "Kod",
    },
  };

  const t = translations[language];
  const eventStats = getStatusStats();
  const questionStats = getQuestionStats();

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
              <Settings className="h-8 w-8 text-indigo-600" />
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
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t.totalEvents}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {eventStats.total}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t.activeEvents}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {eventStats.active}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t.totalQuestions}
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {questionStats.total}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t.pendingQuestions}
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {questionStats.pending}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Events List */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t.eventList}
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
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      selectedEvent?.id === event.id
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-white/50 border-white/20 hover:bg-white/70"
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {t.code}: {event.code}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t.organizer}: {event.organizer_name}
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
                        {t[event.status] || event.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {t.createdAt}:{" "}
                        {new Date(event.created_at).toLocaleDateString()}
                      </p>

                      <div className="flex space-x-2">
                        {event.status === "active" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(event.id, "paused");
                            }}
                            className="text-xs px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                          >
                            {t.pause}
                          </button>
                        )}
                        {event.status === "paused" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(event.id, "active");
                            }}
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            {t.resume}
                          </button>
                        )}
                        {event.status !== "ended" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(event.id, "ended");
                            }}
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            {t.end}
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t.eventDetails}
            </h2>

            {!selectedEvent ? (
              <p className="text-gray-500 italic text-center py-8">
                {t.selectEvent}
              </p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedEvent.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>{t.code}:</strong> {selectedEvent.code}
                    </p>
                    <p>
                      <strong>{t.organizer}:</strong>{" "}
                      {selectedEvent.organizer_name}
                    </p>
                    <p>
                      <strong>{t.status}:</strong>
                      <span
                        className={`ml-1 capitalize ${
                          selectedEvent.status === "active"
                            ? "text-green-600"
                            : selectedEvent.status === "paused"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {t[selectedEvent.status] || selectedEvent.status}
                      </span>
                    </p>
                    <p>
                      <strong>{t.createdAt}:</strong>{" "}
                      {new Date(selectedEvent.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t.questions} ({questions.length})
                  </h4>
                  <div className="space-y-2">
                    {questions.length === 0 ? (
                      <p className="text-gray-500 italic text-sm">
                        {t.noQuestions}
                      </p>
                    ) : (
                      questions.slice(0, 5).map((question) => (
                        <div
                          key={question.id}
                          className="p-2 bg-white/50 rounded text-sm"
                        >
                          <p className="font-medium">
                            {question.participant_name}
                          </p>
                          <p className="text-gray-600 truncate">
                            {question.question_text}
                          </p>
                          <span
                            className={`text-xs px-1 py-0.5 rounded ${
                              question.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : question.status === "declined"
                                  ? "bg-red-100 text-red-800"
                                  : question.status === "answered"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {question.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      (window.location.href = `/listen?code=${selectedEvent.code}`)
                    }
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{t.view}</span>
                  </button>
                  <button
                    onClick={() => (window.location.href = `/organizer`)}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{t.edit}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
