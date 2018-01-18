import { executionSummaryTable, runTests } from '../src/test-utils';
import { TestCase } from '../src/test-case';
import { sankey, sg } from '../src/settings/datasources';
import { GenericExpectationStrategy } from '../src/expectations/generic-expectation-strategy';
import { QuickExactExpectationStrategy } from '../src/expectations/quick-exact-expectation-strategy';

describe('Schema supporting', () => {
  describe('for concepts', () => {
    const aggregatedData = {};

    after(() => {
      executionSummaryTable(aggregatedData);
    });

    runTests([
      new TestCase()
        .forDataSource(sg)
        .withTitle('simple test')
        .withFixturePath('../../test/result-fixtures/schema/schema-1-#datasource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "concepts.schema"
        })
        .withExpectationStrategy(GenericExpectationStrategy)
    ], aggregatedData);
  });
  describe('for entities', () => {
    const aggregatedData = {};

    after(() => {
      executionSummaryTable(aggregatedData);
    });

    runTests([
      new TestCase()
        .forDataSource(sg)
        .withTitle('simple test')
        .withFixturePath('../../test/result-fixtures/schema/schema-2-#datasource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "entities.schema"
        })
        .withExpectationStrategy(GenericExpectationStrategy),
    ], aggregatedData);
  });
  /*describe('for datapoints', () => {
    const aggregatedData = {};

    after(() => {
      executionSummaryTable(aggregatedData);
    });

    runTests([
      new TestCase()
        .forDataSource(sg)
        .withTitle('should response be expected for simple request')
        .withFixturePath('../../test/result-fixtures/schema/schema-3-#datasource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "datapoints.schema"
        })
        .withExpectationStrategy(QuickExactExpectationStrategy),
      new TestCase()
        .forDataSource(sg)
        .withTitle('should max-min response be expected')
        .withFixturePath('../../test/result-fixtures/schema/schema-4-#datasource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: ["min(value)", "max(value)"]
          },
          from: "datapoints.schema"
        })
        .withExpectationStrategy(QuickExactExpectationStrategy),
      new TestCase()
        .forDataSource(sankey)
        .withTitle('simple max-min test')
        .withFixturePath('../../test/result-fixtures/schema/schema-5-#datasource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: ["min(value)", "max(value)"]
          },
          from: "datapoints.schema"
        })
        .withExpectationStrategy(GenericExpectationStrategy)
    ], aggregatedData);
  });*/
  /*describe('for general query', () => {
    new TestCase()
      .forDataSource(sg)
      .withTitle('result for #readerProvider#')
      .withFixturePath('../test/result-fixtures/schema/schema-6-#datasource#.json')
      .withRequest({
        select: {
          key: ["key", "value"],
          value: []
        },
        from: "*.schema"
      })
      .withExpectationStrategy(GenericExpectationStrategy)
  });*/
});
