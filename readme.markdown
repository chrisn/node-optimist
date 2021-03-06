optimist
========

[![Build Status](https://travis-ci.org/chrisn/node-optimist.png?branch=master)](https://travis-ci.org/chrisn/node-optimist)

Optimist is a node.js library for option parsing for people who hate option
parsing. More specifically, this module is for people who like all the --bells
and -whistlz of program usage but think optstrings are a waste of time.

With optimist, option parsing doesn't have to suck (as much).

This fork of [optimist](https://github.com/substack/node-optimist) introduces
the following changes:

* `.require()` as synonym for `.demand()`
* `.strict()` reports errors for unknown options (i.e., options with no
  description)
* `.showHelpOnFail()` controls whether the usage message is output if invalid
  arguments are given
* `.requiresArg()` to specify arguments which require values (default optimist
  behaviour is to set these values to `true`)
* `.help()` and `.version()` to enable default handling of `--help` and
  `--version` options.

examples
========

With Optimist, the options are just a hash! No optstrings attached.
-------------------------------------------------------------------

xup.js:

````javascript
#!/usr/bin/env node
var argv = require('optimist').argv;

if (argv.rif - 5 * argv.xup > 7.138) {
    console.log('Buy more riffiwobbles');
}
else {
    console.log('Sell the xupptumblers');
}
````

***

    $ ./xup.js --rif=55 --xup=9.52
    Buy more riffiwobbles

    $ ./xup.js --rif 12 --xup 8.1
    Sell the xupptumblers

But wait! There's more! You can do short options:
-------------------------------------------------

short.js:

````javascript
#!/usr/bin/env node
var argv = require('optimist').argv;
console.log('(%d,%d)', argv.x, argv.y);
````

***

    $ ./short.js -x 10 -y 21
    (10,21)

And booleans, both long and short (and grouped):
----------------------------------

bool.js:

````javascript
#!/usr/bin/env node
var util = require('util');
var argv = require('optimist').argv;

if (argv.s) {
    util.print(argv.fr ? 'Le chat dit: ' : 'The cat says: ');
}
console.log(
    (argv.fr ? 'miaou' : 'meow') + (argv.p ? '.' : '')
);
````

***

    $ ./bool.js -s
    The cat says: meow

    $ ./bool.js -sp
    The cat says: meow.

    $ ./bool.js -sp --fr
    Le chat dit: miaou.

And non-hyphenated options too! Just use `argv._`!
-------------------------------------------------

nonopt.js:

````javascript
#!/usr/bin/env node
var argv = require('optimist').argv;
console.log('(%d,%d)', argv.x, argv.y);
console.log(argv._);
````

***

    $ ./nonopt.js -x 6.82 -y 3.35 moo
    (6.82,3.35)
    [ 'moo' ]

    $ ./nonopt.js foo -x 0.54 bar -y 1.12 baz
    (0.54,1.12)
    [ 'foo', 'bar', 'baz' ]

Plus, Optimist comes with .usage() and .demand()!
-------------------------------------------------

divide.js:

````javascript
#!/usr/bin/env node
var argv = require('optimist')
    .usage('Usage: $0 -x [num] -y [num]')
    .demand(['x','y'])
    .argv;

console.log(argv.x / argv.y);
````

***

    $ ./divide.js -x 55 -y 11
    5

    $ node ./divide.js -x 4.91 -z 2.51
    Usage: node ./divide.js -x [num] -y [num]

    Options:
      -x  [required]
      -y  [required]

    Missing required arguments: y

EVEN MORE HOLY COW
------------------

default_singles.js:

````javascript
#!/usr/bin/env node
var argv = require('optimist')
    .default('x', 10)
    .default('y', 10)
    .argv
;
console.log(argv.x + argv.y);
````

***

    $ ./default_singles.js -x 5
    15

default_hash.js:

````javascript
#!/usr/bin/env node
var argv = require('optimist')
    .default({ x : 10, y : 10 })
    .argv
;
console.log(argv.x + argv.y);
````

***

    $ ./default_hash.js -y 7
    17

And if you really want to get all descriptive about it...
---------------------------------------------------------

boolean_single.js

````javascript
#!/usr/bin/env node
var argv = require('optimist')
    .boolean('v')
    .argv
;
console.dir(argv);
````

***

    $ ./boolean_single.js -v foo bar baz
    true
    [ 'bar', 'baz', 'foo' ]

boolean_double.js

````javascript
#!/usr/bin/env node
var argv = require('optimist')
    .boolean(['x','y','z'])
    .argv
;
console.dir([ argv.x, argv.y, argv.z ]);
console.dir(argv._);
````

***

    $ ./boolean_double.js -x -z one two three
    [ true, false, true ]
    [ 'one', 'two', 'three' ]

Optimist is here to help...
---------------------------

You can describe parameters for help messages and set aliases. Optimist figures
out how to format a handy help string automatically.

line_count.js

````javascript
#!/usr/bin/env node
var argv = require('optimist')
    .usage('Count the lines in a file.\nUsage: $0')
    .demand('f')
    .alias('f', 'file')
    .describe('f', 'Load a file')
    .argv
;

var fs = require('fs');
var s = fs.createReadStream(argv.file);

var lines = 0;
s.on('data', function (buf) {
    lines += buf.toString().match(/\n/g).length;
});

s.on('end', function () {
    console.log(lines);
});
````

***

    $ node line_count.js
    Count the lines in a file.
    Usage: node ./line_count.js

    Options:
      -f, --file  Load a file  [required]

    Missing required arguments: f

    $ node line_count.js --file line_count.js
    20

    $ node line_count.js -f line_count.js
    20

methods
=======

By itself,

````javascript
require('optimist').argv
`````

will use `process.argv` array to construct the `argv` object.

You can pass in the `process.argv` yourself:

````javascript
require('optimist')([ '-x', '1', '-y', '2' ]).argv
````

or use .parse() to do the same thing:

````javascript
require('optimist').parse([ '-x', '1', '-y', '2' ])
````

The rest of these methods below come in just before the terminating `.argv`.

.alias(key, alias)
------------------

Set key names as equivalent such that updates to a key will propagate to aliases
and vice-versa.

Optionally `.alias()` can take an object that maps keys to aliases.

.default(key, value)
--------------------

Set `argv[key]` to `value` if no option was specified on `process.argv`.

Optionally `.default()` can take an object that maps keys to default values.

.demand(key)
------------

If `key` is a string, show the usage information and exit if `key` wasn't
specified in `process.argv`.

If `key` is a number, demand at least as many non-option arguments, which show
up in `argv._`.

If `key` is an Array, demand each element.

.requiresArg(key)
-----------------

Specifies either a single option key (string), or an array of options that
must be followed by option values. If any option value is missing, show the
usage information and exit.

````javascript
#!/usr/bin/env node
var argv = require('optimist')
    .usage('Count the lines in a file.\nUsage: $0')
    .demand('f')
    .alias('f', 'file')
    .describe('f', 'Load a file')
    .requiresArg('f')
    .argv;

// etc.
````

***

    $ node line_count.js --file
    Count the lines in a file.
    Usage: node ./line_count.js

    Options:
      -f, --file  Load a file  [required]

    Missing argument value: f

    $ node line_count.js --file line_count.js
    20

.describe(key, desc)
--------------------

Describe a `key` for the generated usage information.

Optionally `.describe()` can take an object that maps keys to descriptions.

.options(key, opt)
------------------

Instead of chaining together `.alias().demand().default()`, you can specify
keys in `opt` for each of the chainable methods.

For example:

````javascript
var argv = require('optimist')
    .options('f', {
        alias : 'file',
        default : '/etc/passwd',
    })
    .argv
;
````

is the same as

````javascript
var argv = require('optimist')
    .alias('f', 'file')
    .default('f', '/etc/passwd')
    .argv
;
````

Optionally `.options()` can take an object that maps keys to `opt` parameters.

.usage(message)
---------------

Set a usage message to show which commands to use. Inside `message`, the string
`$0` will get interpolated to the current script name or node command for the
present script similar to how `$0` works in bash or perl.

.check(fn)
----------

Check that certain conditions are met in the provided arguments.

If `fn` throws or returns `false`, show the thrown error, usage information, and
exit.

.boolean(key)
-------------

Interpret `key` as a boolean. If a non-flag option follows `key` in
`process.argv`, that string won't get set as the value of `key`.

If `key` never shows up as a flag in `process.arguments`, `argv[key]` will be
`false`.

If `key` is an Array, interpret all the elements as booleans.

.string(key)
------------

Tell the parser logic not to interpret `key` as a number or boolean.
This can be useful if you need to preserve leading zeros in an input.

If `key` is an Array, interpret all the elements as strings.

.wrap(columns)
--------------

Format usage output to wrap at `columns` many columns.

.strict()
---------

Any command-line argument given that does not have a corresponding
description will be reported as an error.

line_count.js

````javascript
#!/usr/bin/env node

var opts = {
  f: {
    alias: 'file',
    description: 'Load a file',
    required: true
  },
};

var argv = require('optimist')
    .usage('Count the lines in a file.\nUsage: $0', opts)
    .strict()
    .argv;

// etc.
````

***

    $ node line_count.js --file line_count.js --foo bar
    Count the lines in a file.
    Usage: node ./line_count.js

    Options:
      -f, --file  Load a file  [required]

    Unknown argument: foo

.help([option, [description]])
------------------------------

Add an option (e.g., `--help`) that displays the usage string and exits the
process. If present, the `description` parameter customises the description of
the help option in the usage string.

If invoked without parameters, `.help` returns the generated usage string.

````javascript
#!/usr/bin/env node

var opts = {
  f: {
    alias: 'file',
    description: 'Load a file',
    required: true
  }
};

var argv = require('optimist')
    .usage('Count the lines in a file.\nUsage: $0', opts)
    .help('help', 'Show usage')
    .strict()
    .argv;

// etc.
````

***

    $ node line_count.js --help
    Count the lines in a file.
    Usage: node ./line_count.js

    Options:
      --help      Show usage
      -f, --file  Load a file  [required]

.version(version, option, [description])
----------------------------------------

Add an option (e.g., `--version`) that displays the version number (given by the
`version` parameter) and exits the process. If present, the `description`
parameter customises the description of the version option in the usage string.

````javascript
#!/usr/bin/env node

var opts = {
  f: {
    alias: 'file',
    description: 'Load a file',
    required: true
  }
};

var argv = require('optimist')
  .usage('Count the lines in a file.\nUsage: $0', opts)
  .help('help', 'Show usage')
  .version('1.0', 'version', 'Show version')
  .strict()
  .argv;

// etc.
````

***

    $ node line_count.js --version
    1.0

    $ node line_count.js --help
    Usage: node ./line_count.js

    Options:
      --help      Show usage
      --version   Show version
      -f, --file  Load a file  [required]

.showHelpOnFail(enable, [message])
----------------------------------

By default, optimist outputs a usage string if any error is detected. Use the
`.showHelpOnFail` method to customize this behaviour. if `enable` is `false`,
the usage string is not output. If the `message` parameter is present, this
message is output after the error message.

line_count.js

````javascript
#!/usr/bin/env node
var argv = require('optimist')
    .usage('Count the lines in a file.\nUsage: $0')
    .demand('f')
    .alias('f', 'file')
    .describe('f', 'Load a file')
    .showHelpOnFail(false, "Specify --file <filename> to load a file")
    .argv;

// etc.
````

***

    $ node line_count.js --file
    Missing argument value: f
    Specify --file <filename> to load a file

.showHelp(fn=console.error)
---------------------------

Print the usage data using `fn` for printing.

.parse(args)
------------

Parse `args` instead of `process.argv`. Returns the `argv` object.

.argv
-----

Get the arguments as a plain old object.

Arguments without a corresponding flag show up in the `argv._` array.

The script name or node command is available at `argv.$0` similarly to how `$0`
works in bash or perl.

parsing tricks
==============

stop parsing
------------

Use `--` to stop parsing flags and stuff the remainder into `argv._`.

    $ node examples/reflect.js -a 1 -b 2 -- -c 3 -d 4
    { _: [ '-c', '3', '-d', '4' ],
      '$0': 'node ./examples/reflect.js',
      a: 1,
      b: 2 }

negate fields
-------------

If you want to explicity set a field to false instead of just leaving it
undefined or to override a default you can do `--no-key`.

    $ node examples/reflect.js -a --no-b
    { _: [],
      '$0': 'node ./examples/reflect.js',
      a: true,
      b: false }

numbers
-------

Every argument that looks like a number (`!isNaN(Number(arg))`) is converted to
one. This way you can just `net.createConnection(argv.port)` and you can add
numbers out of `argv` with `+` without having that mean concatenation,
which is super frustrating.

duplicates
----------

If you specify a flag multiple times it will get turned into an array containing
all the values in order.

    $ node examples/reflect.js -x 5 -x 8 -x 0
    { _: [],
      '$0': 'node ./examples/reflect.js',
        x: [ 5, 8, 0 ] }

dot notation
------------

When you use dots (`.`s) in argument names, an implicit object path is assumed.
This lets you organize arguments into nested objects.

     $ node examples/reflect.js --foo.bar.baz=33 --foo.quux=5
     { _: [],
       '$0': 'node ./examples/reflect.js',
         foo: { bar: { baz: 33 }, quux: 5 } }

short numbers
-------------

Short numeric `head -n5` style argument work too:

    $ node reflect.js -n123 -m456
    { '3': true,
      '6': true,
      _: [],
      '$0': 'node ./reflect.js',
      n: 123,
      m: 456 }

installation
============

With [npm](http://github.com/isaacs/npm), just do:

    npm install git+https://github.com/chrisn/node-optimist.git

or clone this project on github:

    git clone https://github.com/chrisn/node-optimist.git

inspired By
===========

This module is loosely inspired by Perl's
[Getopt::Casual](http://search.cpan.org/~photo/Getopt-Casual-0.13.1/Casual.pm).
