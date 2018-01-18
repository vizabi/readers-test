import {
  bubbles3, datetesting, gmassets, popwpp, popwppbig, presentation, sankey, sg, sgmixentity, sgtiny,
  staticassets
} from './datasources';
import { AbstractFamilyMember } from '../family-definition/abstract-family-member';
import { DdfCsvReader } from '../family-definition/ddf-csv-reader';
import { DdfCsvNewReader } from '../family-definition/ddf-csv-new-reader';

export const familyMembers: AbstractFamilyMember[] = [

  new DdfCsvReader()
    .forDataSource(sg)
    .init({path: './test/data-fixtures/systema_globalis'}),
  new DdfCsvNewReader()
    .forDataSource(sg)
    .init({path: './test/data-fixtures/systema_globalis'}),

  new DdfCsvReader()
    .forDataSource(presentation)
    .init({path: './test/data-fixtures/presentation_set'}),
  new DdfCsvNewReader()
    .forDataSource(presentation)
    .init({path: './test/data-fixtures/presentation_set'}),

  new DdfCsvReader()
    .forDataSource(sankey)
    .init({path: './test/data-fixtures/sankey'}),
  new DdfCsvNewReader()
    .forDataSource(sankey)
    .init({path: './test/data-fixtures/sankey'}),

  new DdfCsvReader()
    .forDataSource(sgtiny)
    .init({path: './test/data-fixtures/systema_globalis_tiny'}),
  new DdfCsvNewReader()
    .forDataSource(sgtiny)
    .init({path: './test/data-fixtures/systema_globalis_tiny'}),

  new DdfCsvReader()
    .forDataSource(popwpp)
    .init({path: './test/data-fixtures/population_wpp'}),
  new DdfCsvNewReader()
    .forDataSource(popwpp)
    .init({path: './test/data-fixtures/population_wpp'}),

  new DdfCsvReader()
    .forDataSource(bubbles3)
    .init({path: './test/data-fixtures/ddf--bubbles-3'}),
  new DdfCsvNewReader()
    .forDataSource(bubbles3)
    .init({path: './test/data-fixtures/ddf--bubbles-3'}),

  new DdfCsvReader()
    .forDataSource(popwppbig)
    .init({path: './test/data-fixtures/ddf--gapminder--population.big'}),
  new DdfCsvNewReader()
    .forDataSource(popwppbig)
    .init({path: './test/data-fixtures/ddf--gapminder--population.big'}),

  new DdfCsvReader()
    .forDataSource(sgmixentity)
    .init({path: './test/data-fixtures/sg_mix_entity'}),
  new DdfCsvNewReader()
    .forDataSource(sgmixentity)
    .init({path: './test/data-fixtures/sg_mix_entity'}),

  new DdfCsvReader()
    .forDataSource(staticassets)
    .init({path: './test/data-fixtures/static-assets'}),
  new DdfCsvNewReader()
    .forDataSource(staticassets)
    .init({path: './test/data-fixtures/static-assets'}),

  new DdfCsvReader()
    .forDataSource(gmassets)
    .init({path: './test/data-fixtures/ddf--gapminder--static_assets'}),
  new DdfCsvNewReader()
    .forDataSource(gmassets)
    .init({path: './test/data-fixtures/ddf--gapminder--static_assets'}),

  new DdfCsvReader()
    .forDataSource(datetesting)
    .init({path: './test/data-fixtures/ddf--gapminder--date_testing'}),
  new DdfCsvNewReader()
    .forDataSource(datetesting)
    .init({path: './test/data-fixtures/ddf--gapminder--date_testing'})
];
