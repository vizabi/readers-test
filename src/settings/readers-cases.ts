import { AbstractReaderProvider, DdfCsvNewReaderProvider, DdfCsvReaderProvider } from '../reader-providers';
import {
  bubbles3, datetesting, gmassets, popwpp, popwppbig, presentation, sankey, sg, sgmixentity, sgtiny,
  staticassets
} from './datasets';

export const readersCases: AbstractReaderProvider[] = [

  new DdfCsvReaderProvider()
    .forDataset(sg)
    .init({path: './test/data-fixtures/systema_globalis'}),
  new DdfCsvNewReaderProvider()
    .forDataset(sg)
    .init({path: './test/data-fixtures/systema_globalis'}),

  new DdfCsvReaderProvider()
    .forDataset(presentation)
    .init({path: './test/data-fixtures/presentation_set'}),
  new DdfCsvNewReaderProvider()
    .forDataset(presentation)
    .init({path: './test/data-fixtures/presentation_set'}),

  new DdfCsvReaderProvider()
    .forDataset(sankey)
    .init({path: './test/data-fixtures/sankey'}),
  new DdfCsvNewReaderProvider()
    .forDataset(sankey)
    .init({path: './test/data-fixtures/sankey'}),

  new DdfCsvReaderProvider()
    .forDataset(sgtiny)
    .init({path: './test/data-fixtures/systema_globalis_tiny'}),
  new DdfCsvNewReaderProvider()
    .forDataset(sgtiny)
    .init({path: './test/data-fixtures/systema_globalis_tiny'}),

  new DdfCsvReaderProvider()
    .forDataset(popwpp)
    .init({path: './test/data-fixtures/population_wpp'}),
  new DdfCsvNewReaderProvider()
    .forDataset(popwpp)
    .init({path: './test/data-fixtures/population_wpp'}),

  new DdfCsvReaderProvider()
    .forDataset(bubbles3)
    .init({path: './test/data-fixtures/ddf--bubbles-3'}),
  new DdfCsvNewReaderProvider()
    .forDataset(bubbles3)
    .init({path: './test/data-fixtures/ddf--bubbles-3'}),

  new DdfCsvReaderProvider()
    .forDataset(popwppbig)
    .init({path: './test/data-fixtures/ddf--gapminder--population.big'}),
  new DdfCsvNewReaderProvider()
    .forDataset(popwppbig)
    .init({path: './test/data-fixtures/ddf--gapminder--population.big'}),

  new DdfCsvReaderProvider()
    .forDataset(sgmixentity)
    .init({path: './test/data-fixtures/sg_mix_entity'}),
  new DdfCsvNewReaderProvider()
    .forDataset(sgmixentity)
    .init({path: './test/data-fixtures/sg_mix_entity'}),

  new DdfCsvReaderProvider()
    .forDataset(staticassets)
    .init({path: './test/data-fixtures/static-assets'}),
  new DdfCsvNewReaderProvider()
    .forDataset(staticassets)
    .init({path: './test/data-fixtures/static-assets'}),

  new DdfCsvReaderProvider()
    .forDataset(gmassets)
    .init({path: './test/data-fixtures/ddf--gapminder--static_assets'}),
  new DdfCsvNewReaderProvider()
    .forDataset(gmassets)
    .init({path: './test/data-fixtures/ddf--gapminder--static_assets'}),

  new DdfCsvReaderProvider()
    .forDataset(datetesting)
    .init({path: './test/data-fixtures/ddf--gapminder--date_testing'}),
  new DdfCsvNewReaderProvider()
    .forDataset(datetesting)
    .init({path: './test/data-fixtures/ddf--gapminder--date_testing'})
];
