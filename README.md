# readers-test

First of all, this is a testing platform. The main goal of this project is `Gapminder DDF reader` family testing on different datasets.

Next readers are available now:

 * [Vizabi DDFcsv reader](https://github.com/vizabi/vizabi-ddfcsv-reader)
 * [Vizabi Waffle Server reader](https://github.com/vizabi/vizabi-ws-reader)

Before test flow running make sure that all of expected dependencies are installed:

`npm i`

You can run full test flow via next command:

`npm test`

Apart from that, next additional options are present

 * `npm run test-concepts`
 * `npm run test-entities`
 * `npm run test-datapoints`

# Developers guide

## Datasets registry

You can find Datasets registry [here](https://github.com/vizabi/readers-test/blob/master/src/settings/datasets.ts).

Please add a new member to `Dataset` enum if you want to register a new dataset:

```typescript
export enum Dataset {
  sg,
  ...
  my_new_dataset
}
```

## Reader Provider

An object that's represented by any child of [AbstractReaderProvider class](https://github.com/vizabi/readers-test/blob/master/src/reader-providers.ts#L6) encapsulates a particular reader functionality.
For example, [DdfCsvReaderProvider](https://github.com/vizabi/readers-test/blob/master/src/reader-providers.ts#L53).

Method `getReaderObject` of `XXXXReaderProvider` class should return `reader object`. More information regarding `reader object` you
can see [here](https://github.com/vizabi/vizabi-ddfcsv-reader) and [here](https://github.com/vizabi/vizabi-ws-reader).

### Reader Provider initialization example

```typescript
  new DdfCsvReaderProvider()
    .withTitle('"DDFcsv on SG"')
    .forDataset(Dataset.sg)
    .init({path: './test/data-fixtures/systema_globalis'})
```

Let explain some important points regarding initialization:

 * `withTitle('"DDFcsv on SG"')` - set test title prefix that will emphasize (during the testing), what kind of reader should be used and for what dataset should be tested (text only!)
 * `forDataset(Dataset.sg)` - assign particular dataset
 * `init({path: './test/data-fixtures/systema_globalis'})` - set initial data for the reader: its format can be different in accordance with particular reader type (DDFcsv, Waffle Server...)

## Readers Cases

You can find `Readers cases` [here](https://github.com/vizabi/readers-test/blob/master/src/settings/readers-cases.ts).

`Readers cases` is a collection objects that represented by any child of [AbstractReaderProvider class](https://github.com/vizabi/readers-test/blob/master/src/reader-providers.ts#L6).

## How to add tests

The first part of tests creation is usual. First of all, you should create `*.spec.ts` file in `test` folder. Put `describe` block (or blocks) to the spec file.

### TestCase

[TestCase](https://github.com/vizabi/readers-test/blob/master/src/test-case.ts) is a main term of this platform. It unites reader, dataset, and test.

Object instantiation example:

```typescript
import { GenericTestFlow } from '../src/test-flow';
import { TestCase } from '../src/test-case';
import { Dataset } from '../src/settings/datasets';

const testCase = new TestCase()
  .forDataset(Dataset.sg)
  .withTitle('4 fields selects should be expected')
  .withFixturePath('../test/result-fixtures/concepts/concepts-1-#dataset#.json')
  .withRequest({
    select: {
      key: ['concept'],
      value: [
        'concept_type', 'name', 'color'
      ]
    },
    from: 'concepts',
    where: {
      $and: [
        {concept_type: {$eq: 'entity_set'}}
      ]
    }
  })
  .withFlowConstructor(GenericTestFlow);
```

Let explain some important points regarding initialization:

 * `forDataset(Dataset.sg)` - assign the test case to particular dataset; by the way, you can do this kind of assign more than once: you should call `forDataset` again in this case (see `Datasets registry`)
 * `withTitle('4 fields selects should be expected')` - set main part of title that should be displayed during testing (with reader prefix: see `withTitle` in `Reader Provider`).
 * `withFixturePath('../test/result-fixtures/concepts/concepts-1-#dataset#.json')` - set path to JSON file that should contain result fixture data. It's important to add `#dataset#` suffix, because it will be changed to related dataset name (see `Datasets registry`) during testing!
 * `withRequest({...` - set DDF request
 * `withFlowConstructor(GenericTestFlow)` - set test flow for this case (see below...)

### Test flow

`TestFlow` is a strategy that represents expectations for the current test. All of them should be a child of [AbstractTestFlow](https://github.com/vizabi/readers-test/blob/master/src/test-flow.ts#L6) and should implement [testIt](https://github.com/vizabi/readers-test/blob/master/src/test-flow.ts#L11) method.

All of current test flows compare result by DDF reader with predefined result fixture.

Next test flows are available at this moment:

 * `GenericTestFlow` - an accurate comparison that ignores the order of records. Can be slow on huge results.
 * `ExactTestFlow` - an accurate comparison based on deep equal functionality. Can be slow on huge results.
 * `QuickExactTestFlow` - String comparison based. Fast, but not generic.
 * `OnlySameQuantityTestFlow` - compare only record count between DDF reader result and fixture. Fastest, but inaccurate.
