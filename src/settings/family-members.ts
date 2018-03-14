import {
  bubbles3, datetesting, gmassets, popwpp, popwppbig, presentation, sankey, sg, sgmixentity, sgtiny, sodertornsmodellen,
  staticassets
} from './datasources';
import { AbstractFamilyMember } from '../family-definition/abstract-family-member';
import { WsReader } from '../family-definition/ws-reader';
import { DdfCsvReader } from '../family-definition/ddf-csv-reader';

const wsPath = 'http://waffle-server-dev.gapminderdev.org/api/ddf/ql';
const ghWsAcc = 'buchslava';

export const familyMembers: AbstractFamilyMember[] = [

  new DdfCsvReader()
    .forDataSource(sg)
    .init({path: './test/data-fixtures/systema_globalis'}),
  new WsReader()
    .forDataSource(sg)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-systema-globalis`}),

  new DdfCsvReader()
    .forDataSource(presentation)
    .init({path: './test/data-fixtures/presentation_set'}),
  new WsReader()
    .forDataSource(presentation)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-presentation-set`}),

  new DdfCsvReader()
    .forDataSource(sankey)
    .init({path: './test/data-fixtures/sankey'}),
  new WsReader()
    .forDataSource(sankey)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-sankey`}),

  new DdfCsvReader()
    .forDataSource(sgtiny)
    .init({path: './test/data-fixtures/systema_globalis_tiny'}),
  new WsReader()
    .forDataSource(sgtiny)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-systema-globalis-tiny`}),

  new DdfCsvReader()
    .forDataSource(popwpp)
    .init({path: './test/data-fixtures/population_wpp'}),
  new WsReader()
    .forDataSource(popwpp)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-gm-population`}),

  new DdfCsvReader()
    .forDataSource(bubbles3)
    .init({path: './test/data-fixtures/ddf--bubbles-3'}),
  new WsReader()
    .forDataSource(bubbles3)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-bubbles-3`}),

  new DdfCsvReader()
    .forDataSource(popwppbig)
    .init({path: './test/data-fixtures/ddf--gapminder--population.big'}),
  new WsReader()
    .forDataSource(popwppbig)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-gm-population-big`}),

  new DdfCsvReader()
    .forDataSource(sgmixentity)
    .init({path: './test/data-fixtures/sg_mix_entity'}),
  new WsReader()
    .forDataSource(sgmixentity)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-sg-mix-entity`}),

  new DdfCsvReader()
    .forDataSource(staticassets)
    .init({path: './test/data-fixtures/static-assets'}),
  new WsReader()
    .forDataSource(staticassets)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-static-assets`}),

  new DdfCsvReader()
    .forDataSource(gmassets)
    .init({path: './test/data-fixtures/ddf--gapminder--static_assets'}),
  new WsReader()
    .forDataSource(gmassets)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-ds-gm-static-assets`}),

  new DdfCsvReader()
    .forDataSource(sodertornsmodellen)
    .init({path: './test/data-fixtures/ddf--sodertornsmodellen'}),
  new WsReader()
    .forDataSource(sodertornsmodellen)
    .init({path: wsPath, dataset: `${ghWsAcc}/readers-test-sodertornsmodellen`}),
  new DdfCsvReader()
    .forDataSource(datetesting)
    .init({path: './test/data-fixtures/ddf--gapminder--date_testing'}),
  new WsReader()
    .forDataSource(datetesting)
    .init({path: wsPath, dataset: `${ghWsAcc}/`})
];
