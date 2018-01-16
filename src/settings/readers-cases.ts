import { AbstractReaderProvider, DdfCsvNewReaderProvider, DdfCsvReaderProvider } from '../reader-providers';
import { Dataset } from "./datasets";

export const readersCases: AbstractReaderProvider[] = [

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on SG"')
    .forDataset(Dataset.sg)
    .init({path: './test/data-fixtures/systema_globalis'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on SG"')
    .forDataset(Dataset.sg)
    .init({path: './test/data-fixtures/systema_globalis'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Presentation set"')
    .forDataset(Dataset.presentation)
    .init({path: './test/data-fixtures/presentation_set'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on Presentation set"')
    .forDataset(Dataset.presentation)
    .init({path: './test/data-fixtures/presentation_set'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Sankey"')
    .forDataset(Dataset.sankey)
    .init({path: './test/data-fixtures/sankey'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on Sankey"')
    .forDataset(Dataset.sankey)
    .init({path: './test/data-fixtures/sankey'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Tiny SG"')
    .forDataset(Dataset.sgtiny)
    .init({path: './test/data-fixtures/systema_globalis_tiny'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on Tiny SG"')
    .forDataset(Dataset.sgtiny)
    .init({path: './test/data-fixtures/systema_globalis_tiny'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Population WPP"')
    .forDataset(Dataset.popwpp)
    .init({path: './test/data-fixtures/population_wpp'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on Population WPP"')
    .forDataset(Dataset.popwpp)
    .init({path: './test/data-fixtures/population_wpp'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Bubbles3"')
    .forDataset(Dataset.bubbles3)
    .init({path: './test/data-fixtures/ddf--bubbles-3'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on Bubbles3"')
    .forDataset(Dataset.bubbles3)
    .init({path: './test/data-fixtures/ddf--bubbles-3'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on big Population WPP"')
    .forDataset(Dataset.popwppbig)
    .init({path: './test/data-fixtures/ddf--gapminder--population.big'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on big Population WPP"')
    .forDataset(Dataset.popwppbig)
    .init({path: './test/data-fixtures/ddf--gapminder--population.big'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on SG mix entity"')
    .forDataset(Dataset.sgmixentity)
    .init({path: './test/data-fixtures/sg_mix_entity'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on SG mix entity"')
    .forDataset(Dataset.sgmixentity)
    .init({path: './test/data-fixtures/sg_mix_entity'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Static Assets"')
    .forDataset(Dataset.staticassets)
    .init({path: './test/data-fixtures/static-assets'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on Static Assets"')
    .forDataset(Dataset.staticassets)
    .init({path: './test/data-fixtures/static-assets'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Gapminder Static Assets"')
    .forDataset(Dataset.gmassets)
    .init({path: './test/data-fixtures/ddf--gapminder--static_assets'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on Gapminder Static Assets"')
    .forDataset(Dataset.gmassets)
    .init({path: './test/data-fixtures/ddf--gapminder--static_assets'}),

  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Gapminder Date Testing"')
    .forDataset(Dataset.datetesting)
    .init({path: './test/data-fixtures/ddf--gapminder--date_testing'}),
  new DdfCsvNewReaderProvider()
    .withTitle('"DDFcsv NEW on Date Testing"')
    .forDataset(Dataset.datetesting)
    .init({path: './test/data-fixtures/ddf--gapminder--date_testing'})
];
