import { ElmModule } from './types';
import * as fs from 'fs';
import elmModuleToString from './elm-module-to-string';
import { exec } from 'child_process';

interface Options {
  elmFormatPath?: string;
  elmFormatElmVersion?: '0.19' | '0.18';
  outputPath: string;
  banner?: string;
}

interface WriteResult {
  success: boolean;
  error?: Error;
}

const writeElmToDisk = (
  module: ElmModule,
  options: Options,
): Promise<WriteResult> => {
  return new Promise((resolve, reject) => {
    const elmModuleAsString = elmModuleToString(module, {
      banner: options.banner,
    });
    fs.writeFile(
      options.outputPath,
      elmModuleAsString,
      { encoding: 'utf8' },
      err => {
        if (err) resolve({ success: false, error: err });

        if (options.elmFormatPath != undefined) {
          exec(
            `${
              options.elmFormatPath
            } --elm-version ${options.elmFormatElmVersion || '0.19'} --yes ${
              options.outputPath
            }`,
            (error, stdout, stderr) => {
              if (error) reject({ error, success: false });

              resolve({ success: true });
            },
          );
        } else {
          resolve({
            success: true,
          });
        }
      },
    );
  });
};

export default writeElmToDisk;
