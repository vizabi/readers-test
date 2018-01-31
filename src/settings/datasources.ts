export class DataSource {
  constructor(public name, public title) {
  }
}

export const sg = new DataSource('sg', 'Systema Globalis');
export const presentation = new DataSource('presentation', 'Presentation set');
export const sankey = new DataSource('sankey', 'Sankey');
export const sgtiny = new DataSource('sgtiny', 'Systema Globalis tiny');
export const popwpp = new DataSource('popwpp', 'Population WPP');
export const bubbles3 = new DataSource('bubbles3', 'Bubbles3');
export const popwppbig = new DataSource('popwppbig', 'Population WPP big version');
export const sgmixentity = new DataSource('sgmixentity', 'Systema Globalis mix entity');
export const staticassets = new DataSource('staticassets', 'Static assets');
export const gmassets = new DataSource('gmassets', 'Gapminder assets');
export const datetesting = new DataSource('datetesting', 'For date tests');
export const sodertornsmodellen = new DataSource('sodertornsmodellen', 'Sodertornsmodellen');
