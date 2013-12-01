var optimist = require('./../index');

var argv = optimist.usage('This is my awesome program', {
  'foo': {
    description: 'Foo option',
    alias: 'f',
    requiresArg: true
  },
  'bar': {
    description: 'Bar option',
    alias: 'b',
    requiresArg: true
  }
}).strict().argv;

optimist.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
