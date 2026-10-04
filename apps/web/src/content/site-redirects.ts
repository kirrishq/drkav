import { allPageRegistryItems } from "./page-registry";

type SiteRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

export type ExcludedRedirectCandidate = {
  source: string;
  destination: string;
  reason:
    | "canonical-destination-not-confirmed"
    | "normalization-only"
    | "source-confirmed-destination-not-confirmed";
};

/**
 * Kept for the migration audit, but deliberately excluded from Next.js runtime
 * until an owner or a source document confirms the exact destination.
 */
export const excludedRedirectCandidates: readonly ExcludedRedirectCandidate[] = [
  {
    source: "/ceny/umenshenie-grudi.html",
    destination: "/operaczii/plastika-grudi/umenshenie-grudi",
    reason: "canonical-destination-not-confirmed",
  },
  {
    source: "/operaczii/umenshenie-grudi",
    destination: "/operaczii/plastika-grudi/umenshenie-grudi",
    reason: "normalization-only",
  },
  {
    source: "/operaczii/podtyazhka-yagodic",
    destination: "/operaczii/liposkulptura/podtyazhka-yagodic",
    reason: "normalization-only",
  },
  {
    source: "/operaczii/podtyazhka-beder",
    destination: "/operaczii/liposkulptura/podtyazhka-beder",
    reason: "normalization-only",
  },
  {
    source: "/operaczii/podtyazhka-ruk",
    destination: "/operaczii/liposkulptura/podtyazhka-ruk",
    reason: "normalization-only",
  },
  {
    source: "/operaczii/ultrazvukovaya-liposakciya",
    destination: "/operaczii/liposkulptura/ultrazvukovaya-liposakciya",
    reason: "normalization-only",
  },
  {
    source: "/operaczii/lechenie-ginekompastii",
    destination: "/operaczii/muzhskaya-plastika/lechenie-ginekompastii",
    reason: "normalization-only",
  },
  {
    source: "/pacientam/otzyvy.html",
    destination: "/pacientam/otzyvy",
    reason: "normalization-only",
  },
];

const excludedRedirectSources = new Set(
  excludedRedirectCandidates.map((redirect) => redirect.source),
);

const redirects = allPageRegistryItems.flatMap((item) =>
  (item.legacyRoutes ?? [])
    .filter((source) => !excludedRedirectSources.has(source))
    .map<SiteRedirect>((source) => ({
      source,
      destination: item.route,
      permanent: true,
    })),
);

const mediaPublicationRedirects: readonly SiteRedirect[] = [
  "neschool",
  "rbg",
  "book",
  "kak-navyki-ekstrennoy-hirurgii-pomogayut-pri-reshenii-zadach-v-plastike-opyt-doktora-korobova",
  "hirurg-nomer-odin",
].map((slug) => ({
  source: `/smi/${slug}.html`,
  destination: `/obo-mne/smi/${slug}`,
  permanent: true,
}));

redirects.push(...mediaPublicationRedirects);

const redirectSources = new Set<string>();

for (const redirect of redirects) {
  if (redirectSources.has(redirect.source)) {
    throw new Error(`Duplicate redirect source: ${redirect.source}`);
  }

  redirectSources.add(redirect.source);
}

for (const redirect of redirects) {
  if (redirectSources.has(redirect.destination)) {
    throw new Error(
      `Redirect chain is not allowed: ${redirect.source} -> ${redirect.destination}`,
    );
  }
}

export const siteRedirects: readonly SiteRedirect[] = redirects;
