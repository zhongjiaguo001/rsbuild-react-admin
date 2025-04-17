import { Button } from "@douyinfe/semi-ui";
import type { ButtonProps } from "@douyinfe/semi-ui/lib/es/button";
import { IconPlus } from "@douyinfe/semi-icons";

export function AddBtn({
  children = "新增",
  icon = <IconPlus />,
  type = "primary",
  theme = "light",
  ...rest
}: ButtonProps) {
  return (
    <Button type={type} theme={theme} icon={icon} {...rest}>
      {children}
    </Button>
  );
}
