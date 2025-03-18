import { Button } from "@douyinfe/semi-ui";

export function ThemeToggle() {
  const switchMode = () => {
    const body = document.body;
    if (body.hasAttribute("theme-mode")) {
      body.removeAttribute("theme-mode");
    } else {
      body.setAttribute("theme-mode", "dark");
    }
  };

  return <Button onClick={switchMode}>Switch Mode</Button>;
}
