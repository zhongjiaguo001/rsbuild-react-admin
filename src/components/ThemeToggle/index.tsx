import { useState } from "react";
import { Button } from "@douyinfe/semi-ui";
import { IconSun, IconMoon } from "@douyinfe/semi-icons";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const switchMode = () => {
    const body = document.body;
    if (body.hasAttribute("theme-mode")) {
      body.removeAttribute("theme-mode");
      setTheme("light");
    } else {
      body.setAttribute("theme-mode", "dark");
      setTheme("dark");
    }
  };

  return (
    <Button
      theme="borderless"
      type="tertiary"
      icon={
        theme === "light" ? (
          <IconMoon size="extra-large" />
        ) : (
          <IconSun size="extra-large" />
        )
      }
      onClick={switchMode}
    />
  );
}
