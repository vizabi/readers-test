# readers-test

First of all, this is a platform that helps to test a family of objects. The main goal of this project is `Gapminder DDF reader` family testing on different datasets.

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
 * `npm run test-schema`

# Developers guide

## Preface

In order to test a lot of similar objects, software developer or QA should provide a lot of similar tests,  which in itself is a problem. A lot of time can be wasted in this case. This framework partially solves this problem.

Its main idea is to encapsulate such concepts as

 * Family of objects / Family member
 * Data source
 * Test case
 * Expectation strategy

In general terms, the principle of operation consists in the repetition of each `Test case` for each `Family member` for particular `Data source` followed by the use of `Expectation strategy` to the results of testing.

So, let explain main concepts...

## Data source

You can find this kind of data [here](https://github.com/vizabi/readers-test/blob/master/src/settings/datasources.ts).

Please add a new variable as instance of `DataSource` class if you want to register a new data source:

```typescript
export const myNewDataSource = new DataSource('new-ds', 'title for new ds');
```

## Family of objects

An object that's represented by any child of [AbstractFamilyMember class](https://github.com/vizabi/readers-test/blob/master/src/family-definition/abstract-family-member.ts) encapsulates a particular reader functionality.
For example, [DdfCsvReader](https://github.com/vizabi/readers-test/blob/master/src/family-definition/ddf-csv-reader.ts).

Method `getReaderObject` of `XXXXFamilyMember` class should return `reader object`. More information regarding `reader object` you
can see [here](https://github.com/vizabi/vizabi-ddfcsv-reader) and [here](https://github.com/vizabi/vizabi-ws-reader).

### Family member initialization example

```typescript
import { sg } from './datasources';

new DdfCsvReader()
  .forDataSource(sg)
  .init({path: './test/data-fixtures/systema_globalis'}),
```

Let explain some important points regarding initialization:

 * `forDataSource(sg)` - assign particular dataset
 * `init({path: './test/data-fixtures/systema_globalis'})` - set initial data for the reader: its format can be different in accordance with particular reader type (DDFcsv, Waffle Server...)

## Family members registry

You can find `Family members registry` [here](https://github.com/vizabi/readers-test/blob/master/src/settings/family-members.ts).

`familyMembers` is a collection objects that represented by any child of [AbstractFamilyMember class](https://github.com/vizabi/readers-test/blob/master/src/family-definition/abstract-family-member.ts).

### Expectation strategy

This is a strategy that represents expectations for the current test. All of them should be a child of [AbstractExpectationStrategy](https://github.com/vizabi/readers-test/blob/master/src/expectations/abstract-expectation-strategy.ts) and should implement [testIt](https://github.com/vizabi/readers-test/blob/master/src/expectations/abstract-expectation-strategy.ts#L6) method.

All of the strategies should compare result by `Family member` with predefined result fixture.

Next implementations are available at this moment:

 * `GenericExpectationStrategy` - an accurate comparison that ignores the order of records. Can be slow on huge results.
 * `ExactExpectationStrategy` - an accurate comparison based on deep equal functionality. Can be slow on huge results.
 * `QuickExactExpectationStrategy` - String comparison based. Fast, but not generic.
 * `OnlySameQuantityExpectationStrategy` - compare only record count between DDF reader result and fixture. Fastest, but inaccurate.

## Test case

[TestCase](https://github.com/vizabi/readers-test/blob/master/src/test-case.ts) is a main term of this platform.

You can see `Test case` definition [here](https://github.com/vizabi/readers-test/blob/master/src/test-case.ts)

It unites 'Family member', 'Data source' and 'Expectation strategy'.

Instance creation example is:

```typescript
import { GenericExpectationStrategy } from '../src/expectations/generic-expectation-strategy';
import { TestCase } from '../src/test-case';
import { sg } from '../src/settings/datasources';

const testCase = new TestCase()
  .forDataSource(sg)
  .unsupportedFor(WsReader)
  .withTitle('4 fields selects should be expected')
  .withFixturePath('../test/result-fixtures/concepts/concepts-1-#datasource#.json')
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
  .withExpectationStrategy(GenericExpectationStrategy);

```

Let explain some important points regarding initialization:

 * `forDataSource(sg)` - assign the test case to particular data source; by the way, you can do this kind of assign more than once: you should call `forDataSource` again in this case (see `Data sources registry`)
 * `unsupportedFor(WsReader)` - adds `WsReader` Family Member as unsupported for this case, `xit` should be used instead `it`
 * `withTitle('4 fields selects should be expected')` - set main part of title that should be displayed during testing (with reader prefix: see `withTitle` in `Family member`).
 * `withFixturePath('../test/result-fixtures/concepts/concepts-1-#datasource#.json')` - set path to JSON file that should contain result fixture data. It's important to add `#datasource#` suffix, because it will be changed to related data source name (see `Data sources registry`) during testing!
 * `withRequest({...` - set DDF request
 * `withExpectationStrategy(GenericExpectationStrategy)` - set an expectation strategy for this case.


## How to add new tests

The first part of tests creation is usual: you should create `*.spec.ts` file in `test` folder. Put `describe` block (or blocks) to the spec file and call `runTests` utility method:

```typescript
import { runTests } from '../src/test-utils';
// ....

describe('Concepts supporting', () => {
  // see Test case
  runTests([testCase, testCase1, ...]);
});
```

## Obtain results

All of the tests have an own unique identifier. The identifier is appointed next to test title and covered by brackets:

``"WS" on "Systema Globalis (sg)": plain query should be processed correctly [#37]`

`37` in this case.

If test was failed you may see (depends on expectation strategy) details of the test in

 * `./test/result/#test identifier#`/original.json - fixture (right version)
 * `./test/result/#test identifier#`/result.json - data was produced by test

And after that, you can compare original and result to find the reason why test fail.
