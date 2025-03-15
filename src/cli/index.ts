#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initProject } from "./handlers/init.js";

yargs(hideBin(process.argv))
  .scriptName("agentic-express")
  .command({
    command: "init",
    describe: "Initialize a new Agentic Express project",
    handler: initProject,
    aliases: ["i"],
  })
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;
