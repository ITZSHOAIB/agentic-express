import {
  ChatMistralAI,
  type ChatMistralAICallOptions,
} from "@langchain/mistralai";
import { ChatOpenAI, type ChatOpenAICallOptions } from "@langchain/openai";

enum Providers {
  OPENAI = "openai",
  MISTRAL = "mistral",
}

export interface LLMConfig {
  provider: Providers;
  options: ChatOpenAICallOptions | ChatMistralAICallOptions;
}

export class LLM {
  private llm: ChatOpenAI | ChatMistralAI;
  private config: LLMConfig;

  private chooseProvider = {
    [Providers.OPENAI]: () => {
      const { options } = this.config;
      return new ChatOpenAI(options);
    },
    [Providers.MISTRAL]: () => {
      const { options } = this.config;
      return new ChatMistralAI(options);
    },
  };

  constructor(config: LLMConfig) {
    this.config = config;
    this.llm = this.chooseProvider[this.config.provider]();
  }

  public getInstance(): ChatOpenAI | ChatMistralAI {
    return this.llm;
  }
}
