import { includes } from 'lodash';
import { AbstractReaderProvider, DdfCsvReaderProvider } from './reader-providers';
import { TestCase } from './test-case';
import { Dataset } from './datasets';

export const readersCases: AbstractReaderProvider[] = [
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on SG"')
    .forDataset(Dataset.sg)
    .init({path: './test/data-fixtures/systema_globalis'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Presentation set"')
    .forDataset(Dataset.presentation)
    .init({path: './test/data-fixtures/presentation_set'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Sankey"')
    .forDataset(Dataset.sankey)
    .init({path: './test/data-fixtures/sankey'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Tiny SG"')
    .forDataset(Dataset.sgtiny)
    .init({path: './test/data-fixtures/systema_globalis_tiny'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Population WPP"')
    .forDataset(Dataset.popwpp)
    .init({path: './test/data-fixtures/population_wpp'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Bubbles3"')
    .forDataset(Dataset.bubbles3)
    .init({path: './test/data-fixtures/ddf--bubbles-3'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on big Population WPP"')
    .forDataset(Dataset.popwppbig)
    .init({path: './test/data-fixtures/ddf--gapminder--population.big'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on SG mix entity"')
    .forDataset(Dataset.sgmixentity)
    .init({path: './test/data-fixtures/sg_mix_entity'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Static Assets"')
    .forDataset(Dataset.staticassets)
    .init({path: './test/data-fixtures/static-assets'}),
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on Gapminder Static Assets"')
    .forDataset(Dataset.gmassets)
    .init({path: './test/data-fixtures/ddf--gapminder--static_assets'})
];

export function runTests(testCases: TestCase[]) {
  for (const testCase of testCases) {
    testCase.checkConstraints();

    for (const readerCase of readersCases) {
      if (includes(testCase.datasets, readerCase.dataset)) {
        readerCase.checkConstraints();

        const title = testCase.title.replace(/#readerProvider#/, readerCase.title);
        const flow = new testCase.flowConstructor(testCase.fixturePath);

        it(title, done => {
          readerCase.read(testCase.request, (err, data) => {
            // console.log(JSON.stringify(data, null, 2));

            try {
              flow.testIt(err, data, Dataset[readerCase.dataset]);
              done();
            } catch (err) {
              done(err);
            }
          });
        });
      }
    }
  }
}
