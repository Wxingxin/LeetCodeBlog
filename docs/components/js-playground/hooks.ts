import { useEffect, useState } from "react";

function getIsDark() {
  const html = document.documentElement;
  const body = document.body;
  return (
    html.getAttribute("data-theme") === "dark" ||
    html.classList.contains("dark") ||
    body.classList.contains("dark")
  );
}

export function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getIsDark());

    const obs = new MutationObserver(() => setIsDark(getIsDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => obs.disconnect();
  }, []);

  return isDark;
}
