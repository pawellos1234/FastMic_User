import { useQuery } from "@tanstack/react-query";

export function useEventData(eventCode) {
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

  const { data: liveSession } = useQuery({
    queryKey: ["liveSession", event?.id],
    queryFn: async () => {
      if (!event?.id) return null;
      const response = await fetch(
        `/api/audio-sessions?eventId=${event.id}&latest=true`,
      );
      if (!response.ok) return null;
      const sessions = await response.json();
      return sessions[0] || null;
    },
    enabled: !!event?.id,
    refetchInterval: 2000,
  });

  return { event, eventLoading, eventError, liveSession };
}
