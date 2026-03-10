import express, { Request, Response } from "express";
import { checkUpstreamHealth, isBreakerOpen } from "../services/upstreamClient";
import { DIVISIONSJSON } from "./employees";

export const healthRouter = express.Router();

healthRouter.get("/", async (_req: Request, res: Response) => {
  if (isBreakerOpen()) {
    return res.status(503).json({ status: "down", code: "SERVICE_UNAVAILABLE" });
  }

  const healthy = await checkUpstreamHealth(String(DIVISIONSJSON));

  if (!healthy) {
    return res.status(503).json({ status: "down", code: "SERVICE_UNAVAILABLE" });
  }

  return res.status(200).json({ status: "ok" });
});