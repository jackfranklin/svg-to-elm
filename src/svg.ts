import { ElmModule, ExposeAll, ExposeSome } from './types';

export type Attribute = {
  name: string;
  value: string;
};

export type Child = {
  element: string;
  attributes: Attribute[];
  children: Child[];
};

class Svg {
  attributes: Attribute[];
  children: Child[];

  constructor(attributes: Attribute[], children: Child[]) {
    this.attributes = attributes;
    this.children = children;
  }

  toElm(moduleName: string): ElmModule {
    const moduleExposing: ExposeSome<string> = {
      kind: 'SOME',
      entries: ['view'],
    };
    const exposeAll: ExposeAll = { kind: 'ALL' };
    const imports = [
      { module: 'Svg', exposing: exposeAll },
      { module: 'Svg.Attributes', exposing: exposeAll },
    ];
    const success = true;

    const module: ElmModule = {
      moduleName,
      moduleExposing,
      imports,
      success,
      viewBody: this.renderViewBody(),
    };

    return module;
  }

  private renderViewBody(): string {
    const svgAttributesToElm = (attributes: Attribute[]): string =>
      attributes.map(attr => `${attr.name} "${attr.value}"`).join(', ');

    const svgChildrenToElm = (children: Child[]): string => {
      return children
        .map(child => {
          return `
        ${child.element} [${svgAttributesToElm(
            child.attributes,
          )}] [${svgChildrenToElm(child.children)}]
        `;
        })
        .join(', ');
    };

    return `
    view =
      svg [${svgAttributesToElm(this.attributes)}] [${svgChildrenToElm(
      this.children,
    )}]
    `;
  }
}

export default Svg;

/* an Elm module

module SearchIcon exposing (view)

import Svg exposing (..)
import Svg.Attributes exposing (..)

view =
  svg [] [path [] []]
*/
