import { useState } from "react";
import { toast } from "sonner";

export function useEventActions(language) {
  const [isLiked, setIsLiked] = useState(false);

  const handleShareEvent = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success(
      language === "en"
        ? "Event link copied to clipboard!"
        : "Link wydarzenia skopiowany do schowka!",
    );
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(
      isLiked
        ? language === "en"
          ? "Removed from favorites"
          : "Usunięto z ulubionych"
        : language === "en"
          ? "Added to favorites"
          : "Dodano do ulubionych",
    );
  };

  const handleJoinEvent = (eventCode) => {
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
      window.location.href = `/listen?code=${eventCode.trim()}`;
    }, 800);
  };

  return {
    isLiked,
    handleShareEvent,
    toggleLike,
    handleJoinEvent,
  };
}
