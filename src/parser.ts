import { parseString } from 'xml2js';
import * as fs from 'fs';
import * as util from 'util';
import Svg, { Attribute, Child } from './svg';
import { ElmModule } from './types';

export interface ParsingError {
  message: string;
  success: boolean;
}

export type ParserResult = ElmModule | ParsingError;

interface XmlAttributes {
  [x: string]: string;
}

interface GenericXmlElements {
  [x: string]: XmlElement[];
}

type XmlElement = GenericXmlElements & {
  $: XmlAttributes;
};

interface XmlToJsResult {
  svg: XmlElement;
}

const ATTRIBUTE_BLACKLIST = ['xmlns'];

const notOnBlacklist = (key: string) => ATTRIBUTE_BLACKLIST.indexOf(key) === -1;

const parseAttributesFromElement = (element: XmlElement): Attribute[] =>
  Object.keys(element.$)
    .filter(notOnBlacklist)
    .map(key => {
      return { name: key, value: element.$[key] };
    });

const parseChildren = (element: XmlElement): Child[] =>
  Object.keys(element)
    .filter(key => key !== '$')
    .map(key => {
      return {
        element: key,
        attributes: parseAttributesFromElement(element[key][0]),
        children: parseChildren(element[key][0]),
      };
    });

class Parser {
  parse(
    filePath: string,
    options: { moduleName: string },
  ): Promise<ParserResult> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, { encoding: 'utf8' }, (err, contents) => {
        if (err) {
          reject({ success: false, message: err.message });
        }

        this.parseSvg(contents)
          .then(svg => {
            resolve(svg.toElm(options.moduleName));
          })
          .catch(err => {
            reject({ success: false, message: err.message });
          });
      });
    });
    return Promise.resolve({ message: 'blah', success: false });
  }

  parseSvg(contents: string): Promise<Svg> {
    return new Promise(resolve => {
      parseString(contents, (err, result: XmlToJsResult) => {
        const parentAttrs = parseAttributesFromElement(result.svg);

        const children = parseChildren(result.svg);

        resolve(new Svg(parentAttrs, children));
      });
    });
  }
}

export default Parser;
