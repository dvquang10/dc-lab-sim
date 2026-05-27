/**
 * Domain blueprint definitions per certification mode.
 *
 * - NCP-AII uses domain1..domain5 (Platform, Accelerator, Base Infra, Validation, Troubleshooting).
 * - NCP-AIO uses domain1..domain4 (Install/Deploy, Administration, Workload Mgmt, Troubleshoot/Optimize).
 *
 * Keep the DomainId union (`domain1..domain5`) — for AIO, `domain5` is unused.
 */

import type { CertificationMode } from "@/store/certificationModeStore";
import type { DomainId } from "@/types/scenarios";

export interface DomainBlueprint {
  name: string;
  shortName: string;
  weight: number;
  description: string;
  color: string;
}

export const AII_DOMAIN_INFO: Record<DomainId, DomainBlueprint> = {
  domain1: {
    name: "Platform Bring-Up",
    shortName: "Platform",
    weight: 31,
    description:
      "Hardware verification, BIOS, BMC, drivers, and POST procedures",
    color: "blue",
  },
  domain2: {
    name: "Accelerator Configuration",
    shortName: "Accelerator",
    weight: 5,
    description: "GPU configuration, MIG, NVLink, and accelerator setup",
    color: "green",
  },
  domain3: {
    name: "Base Infrastructure",
    shortName: "Base Infra",
    weight: 19,
    description: "Slurm, containers, storage, and network configuration",
    color: "purple",
  },
  domain4: {
    name: "Validation & Testing",
    shortName: "Validation",
    weight: 33,
    description: "DCGM, benchmarks, health checks, and performance validation",
    color: "orange",
  },
  domain5: {
    name: "Troubleshooting",
    shortName: "Troubleshoot",
    weight: 12,
    description:
      "Error diagnosis, XID codes, thermal issues, and problem resolution",
    color: "red",
  },
};

/**
 * NCP-AIO blueprint (4 domains).
 * domain5 is intentionally a zero-weight placeholder so the DomainId union remains
 * compatible across both certs without runtime crashes if iterated.
 */
export const AIO_DOMAIN_INFO: Record<DomainId, DomainBlueprint> = {
  domain1: {
    name: "Installation and Deployment",
    shortName: "Install & Deploy",
    weight: 31,
    description:
      "Mission Control toolkit, Base Command Manager, Kubernetes/Slurm installation, Run:ai, DOCA, firmware sync, user/RBAC, network for nodes/DPUs/switches",
    color: "blue",
  },
  domain2: {
    name: "Administration",
    shortName: "Admin",
    weight: 23,
    description:
      "Slurm administration, Run:ai administration, Kubernetes administration, MIG configuration, AI data center architecture",
    color: "green",
  },
  domain3: {
    name: "Workload Management",
    shortName: "Workloads",
    weight: 23,
    description:
      "Deploy inference (K8s, Run:ai), training jobs (Slurm, Run:ai), NGC container deployment, resource allocation across teams",
    color: "purple",
  },
  domain4: {
    name: "Troubleshooting and Optimization",
    shortName: "Troubleshoot",
    weight: 23,
    description:
      "Docker, Fabric Manager (NVLink/NVSwitch), BCM diagnostics, Magnum IO, storage performance, NGC container issues",
    color: "orange",
  },
  domain5: {
    name: "Unused (AIO has 4 domains)",
    shortName: "—",
    weight: 0,
    description: "Reserved — AIO blueprint only uses domain1 through domain4.",
    color: "gray",
  },
};

export function getDomainInfo(
  mode: CertificationMode,
): Record<DomainId, DomainBlueprint> {
  return mode === "aio" ? AIO_DOMAIN_INFO : AII_DOMAIN_INFO;
}

/**
 * Active domain IDs for a given certification (excludes the unused domain5 for AIO).
 */
export function getActiveDomainIds(mode: CertificationMode): DomainId[] {
  return mode === "aio"
    ? ["domain1", "domain2", "domain3", "domain4"]
    : ["domain1", "domain2", "domain3", "domain4", "domain5"];
}

/**
 * Domain weights as a fraction (sums to 1.0) for the current cert.
 */
export function getDomainWeights(
  mode: CertificationMode,
): Record<DomainId, number> {
  const info = getDomainInfo(mode);
  const result = {} as Record<DomainId, number>;
  (Object.keys(info) as DomainId[]).forEach((id) => {
    result[id] = info[id].weight / 100;
  });
  return result;
}
