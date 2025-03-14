import {
  ChatMistralAI,
  type ChatMistralAICallOptions,
} from "@langchain/mistralai";
import { ChatOpenAI, type ChatOpenAICallOptions } from "@langchain/openai";

/**
 * Enum for supported LLM providers
 */
export enum LLMProviders {
  OPENAI = "openai",
  MISTRAL = "mistral",
}

/**
 * Configuration options for LLM.
 * Check here - {@link LLMConfig}
 */
export interface LLMConfig {
  /** Provider for the LLM instance {@link LLMProviders} */
  provider: LLMProviders;
  /**
   * Options for the LLM provider
   * [{@link ChatOpenAICallOptions}, {@link ChatMistralAICallOptions}]
   */
  options: ChatOpenAICallOptions | ChatMistralAICallOptions;
}

/**
 * LLM - Main class for setting up LLM instances
 * It provides a unified interface for any {@link LLMProviders}.
 *
 * @param {LLMConfig} {@link LLMConfig} - Configuration options for LLM
 */
export class LLM {
  private llm: ChatOpenAI | ChatMistralAI;
  private config: LLMConfig;

  private chooseProvider = {
    [LLMProviders.OPENAI]: () => {
      const { options } = this.config;
      return new ChatOpenAI(options);
    },
    [LLMProviders.MISTRAL]: () => {
      const { options } = this.config;
      return new ChatMistralAI(options);
    },
  };

  constructor(config: LLMConfig) {
    this.config = config;
    this.llm = this.chooseProvider[this.config.provider]();
  }

  /**
   * Get the LLM instance
   *
   * @returns {ChatOpenAI | ChatMistralAI} {@link ChatOpenAI} | {@link ChatMistralAI}
   */
  public getInstance(): ChatOpenAI | ChatMistralAI {
    return this.llm;
  }
}
