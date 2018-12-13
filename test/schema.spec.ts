import { executionSummaryTable, runTests } from '../src/test-utils';
import { TestCase } from '../src/test-case';
import { sankey, sg } from '../src/settings/datasources';
import { GenericExpectationStrategy } from '../src/expectations/generic-expectation-strategy';
import { QuickExactExpectationStrategy } from '../src/expectations/quick-exact-expectation-strategy';
import { WsReader } from "../src/family-definition/ws-reader";
import { DdfCsvReader } from "../src/family-definition/ddf-csv-reader";
import { WsReaderMongoless } from "../src/family-definition/ws-reader-mongoless";

describe('Schema supporting', () => {
  describe('for concepts', () => {
    const aggregatedData = {};
    const testCases = [
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
    ];

    after(() => {
      executionSummaryTable(testCases, aggregatedData);
    });

    runTests(testCases, aggregatedData);
  });
  describe('for entities', () => {
    const aggregatedData = {};
    const testCases = [
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
    ];

    after(() => {
      executionSummaryTable(testCases, aggregatedData);
    });

    runTests(testCases, aggregatedData);
  });
  describe('for datapoints', () => {
    const aggregatedData = {};
    const testCases = [
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
        .withExpectationStrategy(GenericExpectationStrategy),
      /*new TestCase()
        .forDataSource(sg)
        .unsupportedFor('performance and functionality should be considered', WsReader, WsReaderMongoless, DdfCsvReader)
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
        .unsupportedFor('performance and functionality should be considered', WsReader, WsReaderMongoless, DdfCsvReader)
        .withTitle('simple max-min test')
        .withFixturePath('../../test/result-fixtures/schema/schema-5-#datasource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: ["min(value)", "max(value)"]
          },
          from: "datapoints.schema"
        })
        .withExpectationStrategy(GenericExpectationStrategy)*/
    ];

    after(() => {
      executionSummaryTable(testCases, aggregatedData);
    });

    runTests(testCases, aggregatedData);
  });
  describe('for general query', () => {
    const aggregatedData = {};
    const testCases = [
      new TestCase()
        .forDataSource(sg)
        .unsupportedFor('this is an issue, should be resolved later', WsReader, WsReaderMongoless, DdfCsvReader)
        .withTitle('simple test')
        .withFixturePath('../../test/result-fixtures/schema/schema-6-#datasource#.json')
        .withRequest({
          select: {
            key: ["key", "value"],
            value: []
          },
          from: "*.schema"
        })
        .withExpectationStrategy(GenericExpectationStrategy)
    ];

    after(() => {
      executionSummaryTable(testCases, aggregatedData);
    });

    runTests(testCases, aggregatedData);
  });
});
