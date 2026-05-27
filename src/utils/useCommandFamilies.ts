/**
 * Hook returning the command-families data file for the current certification mode.
 *
 * Both AII and AIO files are bundled (they're small JSON), and the active set is
 * selected at render time from the certification mode store.
 */

import aiiCommandFamilies from "@/data/commandFamilies.json";
import aioCommandFamilies from "@/data/aio/aioCommandFamilies.json";
import { useCertificationModeStore } from "@/store/certificationModeStore";

export type CommandFamiliesData = typeof aiiCommandFamilies;

export function useCommandFamiliesData(): CommandFamiliesData {
  const mode = useCertificationModeStore((s) => s.mode);
  return mode === "aio"
    ? (aioCommandFamilies as CommandFamiliesData)
    : aiiCommandFamilies;
}

/**
 * Non-hook variant for files that need the data outside a React component.
 * Reads the current mode from the store directly.
 */
export function getCommandFamiliesData(): CommandFamiliesData {
  const mode = useCertificationModeStore.getState().mode;
  return mode === "aio"
    ? (aioCommandFamilies as CommandFamiliesData)
    : aiiCommandFamilies;
}
