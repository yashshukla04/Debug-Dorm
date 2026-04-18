import { Router, Request, Response } from "express";
import { analyzeRepository } from "../ingestion/orchestrator";
import { handleQuery } from "../ai/queryHandler";

const router = Router();

// ---------------------------------------------------------------------------
// POST /api/analyze
// Accepts: { repoUrl?: string, mockId?: string }
// Returns: AnalysisResult
// ---------------------------------------------------------------------------
router.post("/analyze", (req: Request, res: Response) => {
  try {
    const { repoUrl, mockId } = req.body;

    if (!repoUrl && !mockId) {
      return res.status(400).json({
        error: "Missing required field: provide repoUrl or mockId"
      });
    }

    const result = analyzeRepository({ repoUrl, mockId });
    return res.status(200).json(result);

  } catch (error) {
    console.error("[/analyze] Exception:", error);

    // Canonical empty fallback — never crash the client
    return res.status(200).json({
      graph: { nodes: [], edges: [] },
      views: { default: [], highImpact: [], entryPoints: [], byFolder: {} },
      nodeMap: {},
      searchIndex: {},
      queryContext: { topNodes: [], entryPoints: [], nodeMap: {} },
      metadata: {
        totalFiles: 0,
        totalEdges: 0,
        validEdges: 0,
        isLargeGraph: false,
        payloadSize: 0
      }
    });
  }
});

router.post("/query", (req: Request, res: Response) => {
  try {
    const { query, context } = req.body;
    
    if (!context || !context.graph) {
        return res.status(400).json({ error: "Context missing or invalid" });
    }

    const response = handleQuery({ query: query || "", context });
    return res.status(200).json(response);
  } catch (error) {
    console.error("Query Exception:", error);
    return res.status(200).json({
        answer: "I encountered an error while processing your query. Showing general exploration views.",
        highlightNodes: [],
        focusNode: ""
    });
  }
});

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

export default router;
