import { useContext } from "react";
import {
  DemoStateContext,
  type DemoStateContextType,
} from "../context/DemoStateContext";

export const useDemoState = (): DemoStateContextType => {
  const context = useContext(DemoStateContext);

  if (context === undefined) {
    throw new Error("useDemoState must be used within a DemoStateProvider");
  }

  return context;
};
