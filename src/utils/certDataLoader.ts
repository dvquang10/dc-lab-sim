/**
 * Certification-aware data loaders.
 *
 * Loads command families, narrative scenarios, exam questions, quiz questions,
 * and explanation gates from the data file matching the current certification mode.
 *
 * For each consumer, prefer the typed wrapper here over a raw `import("../data/…")`
 * so swapping certs (AII ↔ AIO) only requires changing the store value.
 */

import type { CertificationMode } from "@/store/certificationModeStore";
import { useCertificationModeStore } from "@/store/certificationModeStore";
import { logger } from "@/utils/logger";

// -------- Command Families --------

export async function loadCommandFamiliesData(
  mode: CertificationMode,
): Promise<unknown> {
  try {
    if (mode === "aio") {
      const mod = await import("@/data/aio/aioCommandFamilies.json");
      return mod.default ?? mod;
    }
    const mod = await import("@/data/commandFamilies.json");
    return mod.default ?? mod;
  } catch (error) {
    logger.error(`Failed to load command families for ${mode}:`, error);
    const fallback = await import("@/data/commandFamilies.json");
    return fallback.default ?? fallback;
  }
}

// -------- Exam Questions --------

export async function loadExamQuestionsData(
  mode: CertificationMode,
): Promise<unknown> {
  try {
    if (mode === "aio") {
      const mod = await import("@/data/aio/aioExamQuestions.json");
      return mod.default ?? mod;
    }
    const mod = await import("@/data/examQuestions.json");
    return mod.default ?? mod;
  } catch (error) {
    logger.error(`Failed to load exam questions for ${mode}:`, error);
    return { questions: [] };
  }
}

// -------- Narrative Scenarios --------

export async function loadNarrativeScenariosData(
  mode: CertificationMode,
): Promise<unknown> {
  try {
    if (mode === "aio") {
      const mod = await import("@/data/aio/aioNarrativeScenarios.json");
      return mod.default ?? mod;
    }
    const mod = await import("@/data/narrativeScenarios.json");
    return mod.default ?? mod;
  } catch (error) {
    logger.error(`Failed to load narrative scenarios for ${mode}:`, error);
    return { scenarios: [] };
  }
}

// -------- Family Quiz Questions --------

export async function loadQuizQuestionsData(
  mode: CertificationMode,
): Promise<unknown> {
  try {
    if (mode === "aio") {
      const mod = await import("@/data/aio/aioQuizQuestions.json");
      return mod.default ?? mod;
    }
    const mod = await import("@/data/quizQuestions.json");
    return mod.default ?? mod;
  } catch (error) {
    logger.error(`Failed to load quiz questions for ${mode}:`, error);
    return { questions: [] };
  }
}

// -------- Explanation Gates --------

export async function loadExplanationGatesData(
  mode: CertificationMode,
): Promise<unknown> {
  try {
    if (mode === "aio") {
      const mod = await import("@/data/aio/aioExplanationGates.json");
      return mod.default ?? mod;
    }
    const mod = await import("@/data/explanationGates.json");
    return mod.default ?? mod;
  } catch (error) {
    logger.error(`Failed to load explanation gates for ${mode}:`, error);
    return { explanationGates: [] };
  }
}

/**
 * React hook returning the current certification mode for use in data-loading
 * effects. Subscribe to changes so swapping the toggle re-fetches data.
 */
export function useActiveCertMode(): CertificationMode {
  return useCertificationModeStore((s) => s.mode);
}
