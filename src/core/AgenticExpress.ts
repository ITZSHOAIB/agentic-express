import type { Request, Response, Router } from "express";

export type SendDataType = {
  type: "agent" | "end" | "error";
  content?: unknown;
};

/**
 * Configuration options for AgenticExpress
 * @type Check Here - {@link AgenticExpressConfig}
 */
export type AgenticExpressConfig = {
  /**
   * Base URL path for agent stream endpoints
   * @default "/agent"
   */
  basePath?: string;
  /**
   * Function that generates an async stream of agent responses from a user prompt.
   * Typically this is your AsyncGenerator function with LangGraph graph.stream() implementation.
   */
  graphStream(prompt: string): AsyncGenerator<unknown, void, unknown>;
};

/**
 * AgenticExpress - Main class for setting up agentic routes with Express
 * It utilized Server-Sent Events (SSE) to stream agent responses to the client.
 *
 *
 * @param {AgenticExpressConfig} {@link AgenticExpressConfig} - Configuration options for AgenticExpress
 */
export class AgenticExpress {
  private basePath: string;
  private graphStream: (
    prompt: string,
  ) => AsyncGenerator<unknown, void, unknown>;

  private streamPath: string;
  private activeSessions = new Map<string, { res: Response }>();

  constructor({ basePath, graphStream }: AgenticExpressConfig) {
    this.basePath = basePath || "/agent";
    this.streamPath = `${this.basePath}/stream/:sessionId`;
    this.graphStream = graphStream;
  }

  /**
   * Setup the agent endpoints with Express Router
   *
   * The agent endpoints include: (default basePath: `/agent`)
   * - GET `{basePath}/stream/:sessionId` - Stream endpoint for agent responses
   * - POST `{basePath}/stream/:sessionId` - Endpoint to send user prompts to the agent
   *
   * @returns {Router} {@link Router} - Express Router with agent endpoints
   */
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
