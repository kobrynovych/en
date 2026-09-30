export type RoadmapStageId = "start" | "a1" | "a2" | "b1" | "b2";

export type RoadmapModuleKind =
  | "setup"
  | "grammar"
  | "vocabulary"
  | "pronunciation"
  | "listening"
  | "reading"
  | "speaking"
  | "writing"
  | "checkpoint";

/** CEFR skill areas used for the "what you will be able to do" lists. */
export type RoadmapSkill = "interaction" | "production" | "listening" | "reading" | "writing" | "strategies";

/** Internal links start with "/" and are rendered with next/link; everything else opens in a new tab. */
export interface RoadmapLink {
  label: string;
  href: string;
}

export interface RoadmapResource {
  label: string;
  /** Books and other offline resources have no link. */
  href?: string;
  note: string;
}

export interface RoadmapTask {
  /** Stable identifier: progress is stored by it, so never rename an existing id. */
  id: string;
  title: string;
  details: string;
  /** English examples; each one can be played with speech synthesis. */
  examples?: string[];
  links?: RoadmapLink[];
  /** Optional tasks (e.g. official exams) can be checked but do not count towards progress. */
  optional?: boolean;
}

export interface RoadmapModule {
  id: string;
  kind: RoadmapModuleKind;
  title: string;
  intro?: string;
  tasks: RoadmapTask[];
}

export interface RoadmapOutcome {
  skill: RoadmapSkill;
  items: string[];
}

export interface RoadmapPitfall {
  wrong: string;
  right: string;
  note: string;
}

export interface RoadmapStage {
  id: RoadmapStageId;
  /** Short badge text: "Pre-A1", "A1"… */
  code: string;
  title: string;
  /** Official CEFR level name. */
  cefrName: string;
  tagline: string;
  summary: string;
  /** Guided learning hours for this stage alone. */
  stageHours: string;
  /** Cumulative guided learning hours from zero (Cambridge English guideline). */
  totalHours: string;
  pace: string;
  vocabulary: string;
  certification: string;
  outcomes: RoadmapOutcome[];
  functions: string[];
  topics: string[];
  pitfalls: RoadmapPitfall[];
  modules: RoadmapModule[];
  resources: RoadmapResource[];
}
