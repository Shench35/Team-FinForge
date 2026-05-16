import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";

type UserRole = "regular" | "pro" | "developer";
type UpgradePlan = "pro" | "developer";

interface DemoState {
  userRole: UserRole;
  freeCredits: number;
  userEmail: string;
  selectedPlan: UpgradePlan | null;
}

export interface DemoStateContextType extends DemoState {
  consumeFreeCredit: () => void;
  selectPlan: (plan: UpgradePlan) => void;
  applySelectedPlanToRole: () => void;
  resetToRegular: () => void;
}

const STORAGE_KEY = "finforge_demo_state";

const defaultState: DemoState = {
  userRole: "regular",
  freeCredits: 1,
  userEmail: "",
  selectedPlan: null,
};

const safeLoad = (): DemoState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;

  try {
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return {
      userRole:
        parsed.userRole === "pro" || parsed.userRole === "developer"
          ? parsed.userRole
          : "regular",
      freeCredits:
        typeof parsed.freeCredits === "number" && parsed.freeCredits >= 0
          ? parsed.freeCredits
          : 1,
      userEmail: typeof parsed.userEmail === "string" ? parsed.userEmail : "",
      selectedPlan:
        parsed.selectedPlan === "pro" || parsed.selectedPlan === "developer"
          ? parsed.selectedPlan
          : null,
    };
  } catch {
    return defaultState;
  }
};

export const DemoStateContext = createContext<DemoStateContextType | undefined>(
  undefined,
);

export const DemoStateProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [state, setState] = useState<DemoState>(() => safeLoad());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!user?.email) return;
    setState((previous) => {
      if (previous.userEmail === user.email) return previous;
      return {
        ...previous,
        userEmail: user.email,
        userRole: previous.userRole || "regular",
      };
    });
  }, [user?.email]);

  const value = useMemo<DemoStateContextType>(
    () => ({
      ...state,
      consumeFreeCredit: () => {
        setState((previous) => ({
          ...previous,
          freeCredits: Math.max(0, previous.freeCredits - 1),
        }));
      },
      selectPlan: (plan: UpgradePlan) => {
        setState((previous) => ({
          ...previous,
          selectedPlan: plan,
        }));
      },
      applySelectedPlanToRole: () => {
        setState((previous) => {
          if (previous.selectedPlan === "pro") {
            return { ...previous, userRole: "pro" };
          }

          if (previous.selectedPlan === "developer") {
            return { ...previous, userRole: "developer" };
          }

          return previous;
        });
      },
      resetToRegular: () => {
        setState((previous) => ({
          ...previous,
          userRole: "regular",
          freeCredits: 1,
          selectedPlan: null,
        }));
      },
    }),
    [state],
  );

  return (
    <DemoStateContext.Provider value={value}>
      {children}
    </DemoStateContext.Provider>
  );
};

export type { UpgradePlan, UserRole };
