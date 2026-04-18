import { FileInput, DependencyInput } from "../types/graphTypes";

export type IngestionInput = {
  repoUrl?: string;
  mockId?: string;
};

export type IngestionOutput = {
  files: FileInput[];
  dependencies: DependencyInput[];
};

// ---------------------------------------------------------------------------
// Mock Dataset Registry
// ---------------------------------------------------------------------------

const MOCK_DATASETS: Record<string, IngestionOutput> = {
  default: {
    files: [
      { id: "src/index.ts", content: "", extension: ".ts" },
      { id: "src/auth/authService.ts", content: "", extension: ".ts" },
      { id: "src/auth/loginController.ts", content: "", extension: ".ts" },
      { id: "src/db/connection.ts", content: "", extension: ".ts" },
      { id: "src/db/userRepository.ts", content: "", extension: ".ts" },
      { id: "src/middleware/authMiddleware.ts", content: "", extension: ".ts" },
      { id: "src/routes/apiRouter.ts", content: "", extension: ".ts" },
      { id: "src/utils/logger.ts", content: "", extension: ".ts" },
      { id: "src/utils/validator.ts", content: "", extension: ".ts" },
      { id: "src/config/appConfig.ts", content: "", extension: ".ts" },
    ],
    dependencies: [
      { from: "src/index.ts", to: "src/routes/apiRouter.ts" },
      { from: "src/index.ts", to: "src/db/connection.ts" },
      { from: "src/index.ts", to: "src/config/appConfig.ts" },
      { from: "src/routes/apiRouter.ts", to: "src/auth/loginController.ts" },
      { from: "src/routes/apiRouter.ts", to: "src/middleware/authMiddleware.ts" },
      { from: "src/auth/loginController.ts", to: "src/auth/authService.ts" },
      { from: "src/auth/authService.ts", to: "src/db/userRepository.ts" },
      { from: "src/auth/authService.ts", to: "src/utils/logger.ts" },
      { from: "src/db/userRepository.ts", to: "src/db/connection.ts" },
      { from: "src/middleware/authMiddleware.ts", to: "src/auth/authService.ts" },
      { from: "src/middleware/authMiddleware.ts", to: "src/utils/validator.ts" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Deterministic Repo Structure Generator
// For hackathon demo use: parses GitHub URL → generates realistic structure
// ---------------------------------------------------------------------------

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const clean = url.trim().replace(/\.git$/, "");
    const match = clean.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}

/**
 * Deterministic hash from a string (djb2).
 * Used to make repo-specific structure variation without randomness.
 */
function deterministicHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Generates a realistic repository structure from a GitHub URL.
 * Results are deterministic — same URL always produces same graph.
 */
function generateFromUrl(owner: string, repo: string): IngestionOutput {
  const seed = deterministicHash(`${owner}/${repo}`);

  // Determine project "flavour" from repo name keywords
  const repoLower = repo.toLowerCase();

  const isReact = repoLower.includes("react") || repoLower.includes("ui") || repoLower.includes("frontend") || repoLower.includes("app");
  const isMl = repoLower.includes("ml") || repoLower.includes("model") || repoLower.includes("ai") || repoLower.includes("nn");
  const isCli = repoLower.includes("cli") || repoLower.includes("tool") || repoLower.includes("cmd");

  const files: FileInput[] = [];
  const dependencies: DependencyInput[] = [];

  // Always include entry
  files.push({ id: "src/index.ts", content: "", extension: ".ts" });

  if (isReact) {
    const reactFiles: FileInput[] = [
      { id: "src/App.tsx", content: "", extension: ".tsx" },
      { id: "src/components/Header.tsx", content: "", extension: ".tsx" },
      { id: "src/components/Footer.tsx", content: "", extension: ".tsx" },
      { id: "src/pages/HomePage.tsx", content: "", extension: ".tsx" },
      { id: "src/pages/DashboardPage.tsx", content: "", extension: ".tsx" },
      { id: "src/hooks/useAuth.ts", content: "", extension: ".ts" },
      { id: "src/hooks/useData.ts", content: "", extension: ".ts" },
      { id: "src/services/apiClient.ts", content: "", extension: ".ts" },
      { id: "src/store/appStore.ts", content: "", extension: ".ts" },
      { id: "src/utils/helpers.ts", content: "", extension: ".ts" },
    ];
    files.push(...reactFiles);
    dependencies.push(
      { from: "src/index.ts", to: "src/App.tsx" },
      { from: "src/App.tsx", to: "src/pages/HomePage.tsx" },
      { from: "src/App.tsx", to: "src/pages/DashboardPage.tsx" },
      { from: "src/App.tsx", to: "src/components/Header.tsx" },
      { from: "src/App.tsx", to: "src/components/Footer.tsx" },
      { from: "src/pages/HomePage.tsx", to: "src/hooks/useData.ts" },
      { from: "src/pages/DashboardPage.tsx", to: "src/hooks/useAuth.ts" },
      { from: "src/pages/DashboardPage.tsx", to: "src/store/appStore.ts" },
      { from: "src/hooks/useData.ts", to: "src/services/apiClient.ts" },
      { from: "src/hooks/useAuth.ts", to: "src/services/apiClient.ts" },
      { from: "src/services/apiClient.ts", to: "src/utils/helpers.ts" },
    );
  } else if (isMl) {
    const mlFiles: FileInput[] = [
      { id: "src/model/architecture.py", content: "", extension: ".py" },
      { id: "src/model/trainer.py", content: "", extension: ".py" },
      { id: "src/data/dataLoader.py", content: "", extension: ".py" },
      { id: "src/data/preprocessor.py", content: "", extension: ".py" },
      { id: "src/evaluation/metrics.py", content: "", extension: ".py" },
      { id: "src/evaluation/evaluator.py", content: "", extension: ".py" },
      { id: "src/utils/config.py", content: "", extension: ".py" },
      { id: "src/utils/logger.py", content: "", extension: ".py" },
      { id: "src/inference/predictor.py", content: "", extension: ".py" },
    ];
    files.push(...mlFiles);
    dependencies.push(
      { from: "src/index.ts", to: "src/model/trainer.py" },
      { from: "src/model/trainer.py", to: "src/model/architecture.py" },
      { from: "src/model/trainer.py", to: "src/data/dataLoader.py" },
      { from: "src/model/trainer.py", to: "src/evaluation/evaluator.py" },
      { from: "src/data/dataLoader.py", to: "src/data/preprocessor.py" },
      { from: "src/evaluation/evaluator.py", to: "src/evaluation/metrics.py" },
      { from: "src/inference/predictor.py", to: "src/model/architecture.py" },
      { from: "src/model/architecture.py", to: "src/utils/config.py" },
      { from: "src/model/trainer.py", to: "src/utils/logger.py" },
    );
  } else if (isCli) {
    const cliFiles: FileInput[] = [
      { id: "src/cli/main.ts", content: "", extension: ".ts" },
      { id: "src/commands/init.ts", content: "", extension: ".ts" },
      { id: "src/commands/build.ts", content: "", extension: ".ts" },
      { id: "src/commands/deploy.ts", content: "", extension: ".ts" },
      { id: "src/config/parser.ts", content: "", extension: ".ts" },
      { id: "src/utils/fileSystem.ts", content: "", extension: ".ts" },
      { id: "src/utils/logger.ts", content: "", extension: ".ts" },
      { id: "src/output/renderer.ts", content: "", extension: ".ts" },
    ];
    files.push(...cliFiles);
    dependencies.push(
      { from: "src/index.ts", to: "src/cli/main.ts" },
      { from: "src/cli/main.ts", to: "src/commands/init.ts" },
      { from: "src/cli/main.ts", to: "src/commands/build.ts" },
      { from: "src/cli/main.ts", to: "src/commands/deploy.ts" },
      { from: "src/commands/build.ts", to: "src/config/parser.ts" },
      { from: "src/commands/deploy.ts", to: "src/config/parser.ts" },
      { from: "src/config/parser.ts", to: "src/utils/fileSystem.ts" },
      { from: "src/commands/init.ts", to: "src/output/renderer.ts" },
      { from: "src/commands/build.ts", to: "src/utils/logger.ts" },
    );
  } else {
    // Default: API / backend service  
    const apiFiles: FileInput[] = [
      { id: "src/controllers/mainController.ts", content: "", extension: ".ts" },
      { id: `src/${repo.toLowerCase().replace(/[^a-z0-9]/g, "")}Service.ts`, content: "", extension: ".ts" },
      { id: "src/routes/router.ts", content: "", extension: ".ts" },
      { id: "src/middleware/errorHandler.ts", content: "", extension: ".ts" },
      { id: "src/middleware/requestLogger.ts", content: "", extension: ".ts" },
      { id: "src/db/connection.ts", content: "", extension: ".ts" },
      { id: "src/db/repository.ts", content: "", extension: ".ts" },
      { id: "src/utils/logger.ts", content: "", extension: ".ts" },
      { id: "src/config/env.ts", content: "", extension: ".ts" },
    ];

    // Add extra seed-based files for variation
    const extraCount = (seed % 4) + 1;
    for (let i = 0; i < extraCount; i++) {
      apiFiles.push({ id: `src/helpers/helper${i + 1}.ts`, content: "", extension: ".ts" });
    }

    files.push(...apiFiles);
    dependencies.push(
      { from: "src/index.ts", to: "src/routes/router.ts" },
      { from: "src/index.ts", to: "src/db/connection.ts" },
      { from: "src/index.ts", to: "src/config/env.ts" },
      { from: "src/routes/router.ts", to: "src/controllers/mainController.ts" },
      { from: "src/routes/router.ts", to: "src/middleware/errorHandler.ts" },
      { from: "src/routes/router.ts", to: "src/middleware/requestLogger.ts" },
      { from: `src/controllers/mainController.ts`, to: `src/${repo.toLowerCase().replace(/[^a-z0-9]/g, "")}Service.ts` },
      { from: `src/${repo.toLowerCase().replace(/[^a-z0-9]/g, "")}Service.ts`, to: "src/db/repository.ts" },
      { from: "src/db/repository.ts", to: "src/db/connection.ts" },
      { from: "src/controllers/mainController.ts", to: "src/utils/logger.ts" },
    );
  }

  return { files, dependencies };
}

// ---------------------------------------------------------------------------
// Main Ingestion Entry Point
// ---------------------------------------------------------------------------

/**
 * Ingests repository information and returns a normalized file + dependency list.
 * Output EXACTLY matches RepoAnalyzerInput / graphBuilder input format.
 */
export function ingest(input: IngestionInput): IngestionOutput {
  // 1. Named mock dataset shortcut
  if (input.mockId) {
    const dataset = MOCK_DATASETS[input.mockId] ?? MOCK_DATASETS["default"];
    return dataset;
  }

  // 2. Real URL — parse and generate deterministic structure
  if (input.repoUrl) {
    const parsed = parseGitHubUrl(input.repoUrl);
    if (parsed) {
      return generateFromUrl(parsed.owner, parsed.repo);
    }
    // Non-GitHub URL or malformed — fall through to default
  }

  // 3. Fallback default mock
  return MOCK_DATASETS["default"];
}
