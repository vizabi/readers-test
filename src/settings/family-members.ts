import {
  bubbles3, datetesting, gmassets, popwpp, popwppbig, presentation, sankey, sg, sgmixentity, sgtiny, sodertornsmodellen,
  staticassets
} from './datasources';
import { AbstractFamilyMember } from '../family-definition/abstract-family-member';
import { S3Reader } from '../family-definition/s3-reader';
import { GcpReader } from '../family-definition/gcp-reader';

const ghWsAcc = 'buchslava';
const s3Based = 'http://35.241.134.155/api/ddf/ql';
const gcpBased = 'http://35.195.156.36/api/ddf/ql';

export const familyMembers: AbstractFamilyMember[] = [

  new S3Reader()
    .forDataSource(sg)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-systema-globalis`}),
  new GcpReader()
    .forDataSource(sg)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-systema-globalis`}),

  new S3Reader()
    .forDataSource(presentation)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-presentation-set`}),
  new GcpReader()
    .forDataSource(presentation)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-presentation-set`}),

  new S3Reader()
    .forDataSource(sankey)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-sankey`}),
  new GcpReader()
    .forDataSource(sankey)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-sankey`}),

  new S3Reader()
    .forDataSource(sgtiny)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-systema-globalis-tiny`}),
  new GcpReader()
    .forDataSource(sgtiny)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-systema-globalis-tiny`}),

  new S3Reader()
    .forDataSource(popwpp)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-gm-population`}),
  new GcpReader()
    .forDataSource(popwpp)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-gm-population`}),

  new S3Reader()
    .forDataSource(bubbles3)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-bubbles-3`}),
  new GcpReader()
    .forDataSource(bubbles3)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-bubbles-3`}),

  new S3Reader()
    .forDataSource(popwppbig)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-gm-population-big`}),
  new GcpReader()
    .forDataSource(popwppbig)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-gm-population-big`}),

  new S3Reader()
    .forDataSource(sgmixentity)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-sg-mix-entity`}),
  new GcpReader()
    .forDataSource(sgmixentity)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-sg-mix-entity`}),

  new S3Reader()
    .forDataSource(staticassets)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-static-assets`}),
  new GcpReader()
    .forDataSource(staticassets)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-static-assets`}),

  new S3Reader()
    .forDataSource(gmassets)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-ds-gm-static-assets`}),
  new GcpReader()
    .forDataSource(gmassets)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-ds-gm-static-assets`}),

  new S3Reader()
    .forDataSource(sodertornsmodellen)
    .init({path: s3Based, dataset: `${ghWsAcc}/readers-test-sodertornsmodellen`}),
  new GcpReader()
    .forDataSource(sodertornsmodellen)
    .init({path: gcpBased, dataset: `${ghWsAcc}/readers-test-sodertornsmodellen`}),

  new S3Reader()
    .forDataSource(datetesting)
    .init({path: s3Based, dataset: `${ghWsAcc}/`}),
  new GcpReader()
    .forDataSource(datetesting)
    .init({path: gcpBased, dataset: `${ghWsAcc}/`})
];
