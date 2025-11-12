import { useState, useEffect } from "react";

export function useEventCode() {
  const [eventCode, setEventCode] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setEventCode(code);
    }
  }, []);

  return { eventCode, setEventCode };
}
