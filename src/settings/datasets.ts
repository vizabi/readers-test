export class Dataset {
  constructor(public name, public title) {
  }
}

export const sg = new Dataset('sg', 'Systema Globalis');
export const presentation = new Dataset('presentation', 'Presentation set');
export const sankey = new Dataset('sankey', 'Sankey');
export const sgtiny = new Dataset('sgtiny', 'Systema Globalis tiny');
export const popwpp = new Dataset('popwpp', 'Population WPP');
export const bubbles3 = new Dataset('bubbles3', 'Bubbles3');
export const popwppbig = new Dataset('popwppbig', 'Population WPP big version');
export const sgmixentity = new Dataset('sgmixentity', 'Systema Globalis mix entity');
export const staticassets = new Dataset('staticassets', 'Static assets');
export const gmassets = new Dataset('gmassets', 'Gapminder assets');
export const datetesting = new Dataset('datetesting', 'For date tests');

export const datasets = [
  sg,
  presentation,
  sankey,
  sgtiny,
  popwpp,
  bubbles3,
  popwppbig,
  sgmixentity,
  staticassets,
  gmassets,
  datetesting
];
