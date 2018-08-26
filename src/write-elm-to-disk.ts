import { ElmModule } from './types';
import * as fs from 'fs';
import elmModuleToString from './elm-module-to-string';

interface Options {
  elmFormatPath?: string;
  outputPath: string;
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
    const elmModuleAsString = elmModuleToString(module);
    fs.writeFile(
      options.outputPath,
      elmModuleAsString,
      { encoding: 'utf8' },
      err => {
        if (err) resolve({ success: false, error: err });

        resolve({
          success: true,
        });
      },
    );
  });
};

export default writeElmToDisk;
