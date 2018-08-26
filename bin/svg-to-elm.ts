import Parser, { ParsingError } from '../src/parser';
import { ElmModule } from '../src/types';

import yargs from 'yargs';
import writeElmToDisk from '../src/write-elm-to-disk';
import chalk from 'chalk';

const argv = yargs
  .usage('Usage: svg-to-elm <command> [options]')
  .command('parse', 'Parse an SVG to Elm')
  .example(
    '$0 parse --file foo.svg --output Foo.elm --module-name Foo',
    'Parse foo.svg into an Elm module',
  )
  .alias('f', 'file')
  .alias('o', 'output')
  .alias('m', 'module-name')
  .alias('b', 'banner')
  .describe('f', 'The SVG to parse')
  .describe('o', 'The destination to write to')
  .describe('m', 'The name of the Elm module')
  .describe('b', 'A code comment to put in each file.')
  .describe(
    'elm-version',
    'The version of Elm to use [0.18 or 0.19]. This is passed to elm-format if you use it.',
  )
  .describe(
    'elm-format-path',
    'The path to Elm format, if you would like the code run through it',
  )
  .demandOption(['f'])
  .demandOption(['o'])
  .demandOption(['module-name'])
  .help('h').argv;

const parser = new Parser();

parser
  .parse(argv.f, {
    moduleName: argv.m,
  })
  .then(result => {
    if (result.success) {
      return writeElmToDisk(result as ElmModule, {
        outputPath: argv.o,
        elmFormatElmVersion: argv.elmVersion,
        elmFormatPath: argv.elmFormatPath,
        banner: argv.b || '',
      });
    } else {
      throw (result as ParsingError).message;
    }
  })
  .then(result => {
    if (result.success) {
      console.log(
        chalk.green('Success!'),
        chalk.blue(argv.f),
        'parsed and saved as',
        chalk.blue(argv.o),
      );
    } else {
      throw result;
    }
  })
  .catch(err => {
    console.log('Error parsing svg:', chalk.red(err.message));
  });
