import { Button } from "@douyinfe/semi-ui";

export function ThemeToggle() {
  const switchMode = () => {
    const body = document.body;
    if (body.hasAttribute("theme-mode")) {
      body.removeAttribute("theme-mode");
      body.setAttribute("data-theme", "light");
    } else {
      body.setAttribute("theme-mode", "dark");
      body.setAttribute("data-theme", "dark");
    }
  };

  return <Button onClick={switchMode}>Switch Mode</Button>;
}
