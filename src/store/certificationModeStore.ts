/**
 * Certification Mode Store
 *
 * Switches the app between NCP-AII (AI Infrastructure) and NCP-AIO (AI Operations)
 * content tracks. Each mode loads its own data files (command families, scenarios,
 * exam questions, quizzes, gates) and uses its own domain blueprint.
 *
 * Persisted to localStorage under the key `dcsim-cert-mode`.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CertificationMode = "aii" | "aio";

export interface CertificationModeInfo {
  id: CertificationMode;
  shortName: string;
  longName: string;
  fullName: string;
  description: string;
  totalDomains: number;
  examQuestionCount: number;
  examDurationMinutes: number;
  passingScore: number;
}

export const CERT_MODE_INFO: Record<CertificationMode, CertificationModeInfo> =
  {
    aii: {
      id: "aii",
      shortName: "NCP-AII",
      longName: "NCP-AII (AI Infrastructure)",
      fullName: "NVIDIA Certified Professional - AI Infrastructure",
      description:
        "Hardware bring-up, accelerator configuration, base infrastructure, validation, and troubleshooting.",
      totalDomains: 5,
      examQuestionCount: 60,
      examDurationMinutes: 90,
      passingScore: 70,
    },
    aio: {
      id: "aio",
      shortName: "NCP-AIO",
      longName: "NCP-AIO (AI Operations)",
      fullName: "NVIDIA Certified Professional - AI Operations",
      description:
        "Installation & deployment, administration, workload management, and troubleshooting & optimization for AI clusters.",
      totalDomains: 4,
      examQuestionCount: 30,
      examDurationMinutes: 120,
      passingScore: 70,
    },
  };

interface CertificationModeState {
  mode: CertificationMode;
  setMode: (mode: CertificationMode) => void;
  getInfo: () => CertificationModeInfo;
}

export const useCertificationModeStore = create<CertificationModeState>()(
  persist(
    (set, get) => ({
      mode: "aii",
      setMode: (mode: CertificationMode) => set({ mode }),
      getInfo: () => CERT_MODE_INFO[get().mode],
    }),
    {
      name: "dcsim-cert-mode",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);

/**
 * Convenience selector for components that only need the current mode.
 */
export const useCertMode = () => useCertificationModeStore((s) => s.mode);

/**
 * Convenience selector for the current mode's info bundle.
 */
export const useCertInfo = () =>
  useCertificationModeStore((s) => CERT_MODE_INFO[s.mode]);
