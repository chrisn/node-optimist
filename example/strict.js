var optimist = require('./../index');

var argv = optimist.usage('This is my awesome program', {
  'foo': {
    description: 'Foo option',
    alias: 'f',
  },
  'bar': {
    description: 'Bar option',
    alias: 'b'
  }
}).strict().argv;

optimist.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
