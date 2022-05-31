#!/usr/bin/env node
const { Command } = require("commander");
const program = new Command();

program.name("toolbasedotdev");
program.description("toolbase.dev scaffolding CLI");
program.usage("<command>");
program.version(require("../package").version);

program
    .command("init")
    .description("initializes a new toolbase.dev tool in the current directory")
    .action((str, opts) => require("../commands/init")(str, opts));

program.parse();
