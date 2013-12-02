var Hash = require('hashish');
var optimist = require('../index');
var test = require('tap').test;

test('usageFail', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x','y'])
            .argv;
    });
    t.same(
        r.result,
        { x : 10, z : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage -x NUM -y NUM',
            'Options:',
            '  -x  [required]',
            '  -y  [required]',
            'Missing required arguments: y',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});


test('usagePass', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -y 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x','y'])
            .argv;
    });
    t.same(r, {
        result : { x : 10, y : 20, _ : [], $0 : './usage' },
        errors : [],
        logs : [],
        exit : false,
    });
    t.end();
});

test('usageWithZeroValue', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -y 0'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x','y'])
            .argv;
    });
    t.same(r, {
        result : { x : 10, y : 0, _ : [], $0 : './usage' },
        errors : [],
        logs : [],
        exit : false,
    });
    t.end();
});

test('usageWithRequire', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .require(['x','y'])
            .argv;
    });
    t.same(
        r.result,
        { x : 10, z : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage -x NUM -y NUM',
            'Options:',
            '  -x  [required]',
            '  -y  [required]',
            'Missing required arguments: y',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('usageWithOptions', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { required: true },
            bar: { demand: true }
        };
        return optimist('--foo 10 --baz 20'.split(' '))
            .usage('Usage: $0 --foo NUM --bar NUM', opts)
            .argv;
    });
    t.same(
        r.result,
        { foo : 10, baz : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage --foo NUM --bar NUM',
            'Options:',
            '  --foo  [required]',
            '  --bar  [required]',
            'Missing required arguments: bar',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('usageWithOptionsAlias', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { required: true, alias: 'f' },
            bar: { demand: true, alias: 'b' }
        };
        return optimist('-f 10 -b 20'.split(' '))
            .usage('Usage: $0 --foo NUM --bar NUM', opts)
            .argv;
    });
    t.same(r, {
        result : { f : 10, foo : 10, b : 20, bar : 20, _ : [], $0 : './usage' },
        errors : [],
        logs : [],
        exit : false,
    });
    t.end();
});

test('checkPass', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -y 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .check(function (argv) {
                if (!('x' in argv)) throw 'You forgot about -x';
                if (!('y' in argv)) throw 'You forgot about -y';
            })
            .argv;
    });
    t.same(r, {
        result : { x : 10, y : 20, _ : [], $0 : './usage' },
        errors : [],
        logs : [],
        exit : false,
    });
    t.end();
});

test('checkFail', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .check(function (argv) {
                if (!('x' in argv)) throw 'You forgot about -x';
                if (!('y' in argv)) throw 'You forgot about -y';
            })
            .argv;
    });

    t.same(
        r.result,
        { x : 10, z : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage -x NUM -y NUM',
            'You forgot about -y'
        ]
    );

    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('checkCondPass', function (t) {
    function checker (argv) {
        return 'x' in argv && 'y' in argv;
    }

    var r = checkUsage(function () {
        return optimist('-x 10 -y 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .check(checker)
            .argv;
    });
    t.same(r, {
        result : { x : 10, y : 20, _ : [], $0 : './usage' },
        errors : [],
        logs : [],
        exit : false,
    });
    t.end();
});

test('checkCondFail', function (t) {
    function checker (argv) {
        return 'x' in argv && 'y' in argv;
    }

    var r = checkUsage(function () {
        return optimist('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .check(checker)
            .argv;
    });

    t.same(
        r.result,
        { x : 10, z : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/).join('\n'),
        'Usage: ./usage -x NUM -y NUM\n'
        + 'Argument check failed: ' + checker.toString()
    );

    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('countPass', function (t) {
    var r = checkUsage(function () {
        return optimist('1 2 3 --moo'.split(' '))
            .usage('Usage: $0 [x] [y] [z] {OPTIONS}')
            .demand(3)
            .argv;
    });
    t.same(r, {
        result : { _ : [ '1', '2', '3' ], moo : true, $0 : './usage' },
        errors : [],
        logs : [],
        exit : false,
    });
    t.end();
});

test('countFail', function (t) {
    var r = checkUsage(function () {
        return optimist('1 2 --moo'.split(' '))
            .usage('Usage: $0 [x] [y] [z] {OPTIONS}')
            .demand(3)
            .argv;
    });
    t.same(
        r.result,
        { _ : [ '1', '2' ], moo : true, $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage [x] [y] [z] {OPTIONS}',
            'Not enough non-option arguments: got 2, need at least 3',
        ]
    );

    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('defaultSingles', function (t) {
    var r = checkUsage(function () {
        return optimist('--foo 50 --baz 70 --powsy'.split(' '))
            .default('foo', 5)
            .default('bar', 6)
            .default('baz', 7)
            .argv
        ;
    });
    t.same(r.result, {
        foo : '50',
        bar : 6,
        baz : '70',
        powsy : true,
        _ : [],
        $0 : './usage',
    });
    t.end();
});

test('defaultAliases', function (t) {
    var r = checkUsage(function () {
        return optimist('')
            .alias('f', 'foo')
            .default('f', 5)
            .argv
        ;
    });
    t.same(r.result, {
        f : '5',
        foo : '5',
        _ : [],
        $0 : './usage',
    });
    t.end();
});

test('defaultHash', function (t) {
    var r = checkUsage(function () {
        return optimist('--foo 50 --baz 70'.split(' '))
            .default({ foo : 10, bar : 20, quux : 30 })
            .argv
        ;
    });
    t.same(r.result, {
        _ : [],
        $0 : './usage',
        foo : 50,
        baz : 70,
        bar : 20,
        quux : 30,
    });
    t.end();
});

test('usageStrictFail', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option', alias: 'f' },
            bar: { description: 'bar option', alias: 'b' }
        };

        return optimist('-f 10 --bar 20 --baz 30'.split(' '))
            .usage('Usage: $0 [options]', opts)
            .strict()
            .argv;
    });
    t.same(
        r.result,
        { f : 10, foo : 10, b : 20, bar : 20, baz : 30, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage [options]',
            'Options:',
            '  --foo, -f  foo option',
            '  --bar, -b  bar option',
            'Unknown argument: baz',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('usageStrictFailMultiple', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option', alias: 'f' },
            bar: { description: 'bar option', alias: 'b' }
        };

        return optimist('-f 10 --bar 20 --baz 30 -q 40'.split(' '))
            .usage('Usage: $0 [options]', opts)
            .strict()
            .argv;
    });
    t.same(
        r.result,
        { f : 10, foo : 10, b : 20, bar : 20, baz : 30, q : 40, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage [options]',
            'Options:',
            '  --foo, -f  foo option',
            '  --bar, -b  bar option',
            'Unknown arguments: baz, q',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('usageStrictPass', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option' },
            bar: { description: 'bar option' }
        };

        return optimist('--foo 10 --bar 20'.split(' '))
            .usage('Usage: $0 [options]', opts)
            .strict()
            .argv;
    });
    t.same(r, {
        result : { foo : 10, bar : 20, _ : [], $0 : './usage' },
        errors : [],
        logs : [],
        exit : false,
    });
    t.end();
});

test('usageRequiresArgOptionFail', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option', alias: 'f', requiresArg: true },
            bar: { description: 'bar option', alias: 'b', requiresArg: true }
        };

        return optimist('-f --bar 20'.split(' '))
            .usage('Usage: $0 [options]', opts)
            .strict()
            .argv;
    });
    t.same(
        r.result,
        { f : true, foo : true, b : 20, bar : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage [options]',
            'Options:',
            '  --foo, -f  foo option',
            '  --bar, -b  bar option',
            'Missing argument value: foo',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('usageRequiresArgOptionFailMultiple', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option', alias: 'f', requiresArg: true },
            bar: { description: 'bar option', alias: 'b', requiresArg: true }
        };

        return optimist('-f --bar'.split(' '))
            .usage('Usage: $0 [options]', opts)
            .strict()
            .argv;
    });
    t.same(
        r.result,
        { f : true, foo : true, b : true, bar : true, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage [options]',
            'Options:',
            '  --foo, -f  foo option',
            '  --bar, -b  bar option',
            'Missing argument values: foo, bar',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('usageRequiresArgFail', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option', alias: 'f' },
            bar: { description: 'bar option', alias: 'b' }
        };

        return optimist('-f --bar 20'.split(' '))
            .usage('Usage: $0 [options]', opts)
            .requiresArg(['foo', 'bar'])
            .argv;
    });
    t.same(
        r.result,
        { f : true, foo : true, b : 20, bar : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage [options]',
            'Options:',
            '  --foo, -f  foo option',
            '  --bar, -b  bar option',
            'Missing argument value: foo',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('showHelpOnFailWithMessage', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x','y'])
            .showHelpOnFail(false, 'Specify --help for available options')
            .argv;
    });
    t.same(
        r.result,
        { x : 10, z : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors,
        [
            'Missing required arguments: y',
            'Specify --help for available options'
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('showHelpOnFailWithoutMessage', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x','y'])
            .showHelpOnFail(false)
            .argv;
    });
    t.same(
        r.result,
        { x : 10, z : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors,
        [ 'Missing required arguments: y' ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('showHelpOnFailDefault', function (t) {
    var r = checkUsage(function () {
        return optimist('-x 10 -z 20'.split(' '))
            .usage('Usage: $0 -x NUM -y NUM')
            .demand(['x','y'])
            .showHelpOnFail()
            .argv;
    });
    t.same(
        r.result,
        { x : 10, z : 20, _ : [], $0 : './usage' }
    );

    t.same(
        r.errors.join('\n').split(/\n+/),
        [
            'Usage: ./usage -x NUM -y NUM',
            'Options:',
            '  -x  [required]',
            '  -y  [required]',
            'Missing required arguments: y',
        ]
    );
    t.same(r.logs, []);
    t.ok(r.exit);
    t.end();
});

test('usageHelp', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option' },
            bar: { description: 'bar option' }
        };

        return optimist(['--help'])
            .usage('Usage: $0 [options]')
            .help('help')
            .alias('help', 'h')
            .version('1.0.1', 'version')
            .alias('version', 'V')
            .options(opts)
            .argv;
    });
    t.same(r.result, { help : true, h : true, _ : [], $0 : './usage' });
    t.same(
        r.logs.join('\n').split(/\n/),
        [
            'Usage: ./usage [options]',
            '',
            'Options:',
            '  --help, -h     Show help          ',
            '  --version, -V  Show version number',
            '  --foo          foo option         ',
            '  --bar          bar option         ',
            ''
        ]
    );
    t.same(r.errors, []);
    t.ok(r.exit);
    t.end();
});

test('usageHelpWithMessage', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option' },
            bar: { description: 'bar option' }
        };

        return optimist(['--help'])
            .usage('Usage: $0 [options]')
            .help('help', 'Show usage')
            .alias('help', 'h')
            .version('1.0.1', 'version', 'Show version')
            .alias('version', 'V')
            .options(opts)
            .argv;
    });
    t.same(r.result, { help : true, h : true, _ : [], $0 : './usage' });
    t.same(
        r.logs.join('\n').split(/\n/),
        [
            'Usage: ./usage [options]',
            '', 
            'Options:',
            '  --help, -h     Show usage  ',
            '  --version, -V  Show version',
            '  --foo          foo option  ',
            '  --bar          bar option  ',
            ''
        ]
    );
    t.same(r.errors, []);
    t.ok(r.exit);
    t.end();
});

test('usageVersion', function (t) {
    var r = checkUsage(function () {
        opts = {
            foo: { description: 'foo option' },
            bar: { description: 'bar option' }
        };

        return optimist(['--version'])
            .usage('Usage: $0 [options]')
            .help('help', 'Show usage')
            .alias('help', 'h')
            .version('1.0.1', 'version', 'Show version number')
            .alias('version', 'V')
            .options(opts)
            .argv;
    });
    t.same(r.result, { version : true, V : true, _ : [], $0 : './usage' });
    t.same(r.logs, ['1.0.1']);
    t.same(r.errors, []);
    t.ok(r.exit);
    t.end();
});

test('rebase', function (t) {
    t.equal(
        optimist.rebase('/home/substack', '/home/substack/foo/bar/baz'),
        './foo/bar/baz'
    );
    t.equal(
        optimist.rebase('/home/substack/foo/bar/baz', '/home/substack'),
        '../../..'
    );
    t.equal(
        optimist.rebase('/home/substack/foo', '/home/substack/pow/zoom.txt'),
        '../pow/zoom.txt'
    );
    t.end();
});

function checkUsage (f) {

    var exit = false;

    process._exit = process.exit;
    process._env = process.env;
    process._argv = process.argv;

    process.exit = function (t) { exit = true; };
    process.env = Hash.merge(process.env, { _ : 'node' });
    process.argv = [ './usage' ];

    var errors = [];
    var logs = [];

    console._error = console.error;
    console.error = function (msg) { errors.push(msg); };
    console._log = console.log;
    console.log = function (msg) { logs.push(msg); };

    var result = f();

    process.exit = process._exit;
    process.env = process._env;
    process.argv = process._argv;

    console.error = console._error;
    console.log = console._log;

    return {
        errors : errors,
        logs : logs,
        exit : exit,
        result : result,
    };
}
