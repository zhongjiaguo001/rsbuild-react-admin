import { useState } from "react";
import { Button } from "@douyinfe/semi-ui";
import { SunOne, Moon } from "@icon-park/react";

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
          <Moon theme="filled" size="18" />
        ) : (
          <SunOne theme="filled" size="18" />
        )
      }
      onClick={switchMode}
    />
  );
}
