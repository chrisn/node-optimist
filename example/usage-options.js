var optimist = require('./../index');

var argv = optimist.usage('This is my awesome program', {
  'about': {
    description: 'Provide some details about the author of this program',
    required: true,
    alias: 'a',
  },
  'info': {
    description: 'Provide some information about the node.js agains!!!!!!',
    boolean: true,
    alias: 'i'
  }
}).argv;

optimist.showHelp();

console.log('\n\nInspecting options');
console.dir(argv);
