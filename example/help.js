var optimist = require('./../index');

var argv = optimist
  .usage('This is my awesome program\n\nUsage: $0 [options]')
  .help('help').alias('help', 'h')
  .version('1.0.1', 'version').alias('version', 'V')
  .options({
    input: {
      alias: 'i',
      description: "<filename> Input file name",
      requiresArg: true,
      required: true
    },
    output: {
      alias: 'o',
      description: "<filename> output file name",
      requiresArg: true,
      required: true
    }
  })
  .showHelpOnFail(false, "Specify --help for available options")
  .check(function(argv) {
    if (argv._.length > 0) {
      throw "Unexpected arguments: " + argv._.join(", ");
    }
  })
  .argv;

console.log('Inspecting options');
console.dir(argv);

console.log("input:", argv.input);
console.log("output:", argv.output);
