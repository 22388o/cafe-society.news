import type { Component} from 'solid-js';
import {
  Button,
  useColorMode
} from "@hope-ui/core";
const ToggleColorMode: Component<{}> = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      Toggle {colorMode() === "light" ? "dark" : "light"} mode
    </Button>
  );
}
export default ToggleColorMode