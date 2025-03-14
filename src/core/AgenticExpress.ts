import type { Request, Response, Router } from "express";

export type SendDataType = {
  type: "agent" | "end" | "error";
  content?: unknown;
};

export type AgenticExpressConfig = {
  basePath?: string;
  graphStream(prompt: string): AsyncGenerator<unknown, void, unknown>;
};

export class AgenticExpress {
  private basePath: string;
  private streamPath: string;
  private graphStream: (
    prompt: string,
  ) => AsyncGenerator<unknown, void, unknown>;
  private activeSessions = new Map<string, { res: Response }>();

  constructor({ basePath, graphStream }: AgenticExpressConfig) {
    this.basePath = basePath || "/agent";
    this.streamPath = `${this.basePath}/stream/:sessionId`;
    this.graphStream = graphStream;
  }

  setup(): Router {
    console.log("Setting up the agent...");
    console.log("Base path:", this.basePath);

    const express = require("express");
    const router = express.Router();

    router.get(this.streamPath, this.streamConnection.bind(this));
    router.post(this.streamPath, this.handleStreamMessage.bind(this));
    return router;
  }

  private streamConnection(req: Request, res: Response) {
    const { sessionId } = req.params || `session_${Date.now()}`;

    console.log(`Session ID: ${sessionId} connected`);

    // SSE setup
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Store session
    this.activeSessions.set(sessionId, { res });

    // Handle connection close
    req.on("close", () => {
      console.log(`Session ${sessionId} closed`);
      this.activeSessions.delete(sessionId);
    });
  }

  private async handleStreamMessage(req: Request, res: Response) {
    const { sessionId } = req.params;
    const { message } = req.body;

    const session = this.activeSessions.get(sessionId);
    if (!session) {
      res.status(404).send("Session not found");
      return;
    }

    try {
      for await (const response of this.graphStream(message)) {
        if (response) {
          this.sendEvent(session.res, { type: "agent", content: response });
        }
      }

      this.sendEvent(session.res, { type: "end" });
    } catch (error) {
      console.error(`Error processing message in session ${sessionId}:`, error);
      this.sendEvent(session.res, {
        type: "error",
        content: "An error occurred while processing your message",
      });
    }
    res.sendStatus(200);
  }

  private sendEvent(res: Response, data: SendDataType) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}
