import { executionSummaryTable, runTests } from '../src/test-utils';
import { TestCase } from '../src/test-case';
import { popwpp, sg, sodertornsmodellen } from '../src/settings/datasources';
import { GenericExpectationStrategy } from "../src/expectations/generic-expectation-strategy";
import { WsReader } from "../src/family-definition/ws-reader";
import { writeDiagnostic } from "../src/expectations/utils";

describe('Concepts supporting', () => {
  const aggregatedData = {};
  const diagnosticData = [];
  const testCases = [
    new TestCase()
      .forDataSource(sg)
      .withTitle('4 fields selects should be expected')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-1-#datasource#.json')
      .withRequest({
        select: {
          key: ['concept'],
          value: [
            'concept_type', 'name', 'domain'
          ]
        },
        from: 'concepts',
        where: {
          $and: [
            {concept_type: {$eq: 'entity_set'}}
          ]
        }
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('3 fields selects should be expected')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-2-#datasource#.json')
      .withRequest({
        select: {
          key: ['concept'],
          value: [
            'concept_type', 'name'
          ]
        },
        from: 'concepts',
        where: {
          $and: [
            {concept_type: {$eq: 'entity_set'}}
          ]
        },
        order_by: ['concept']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('ar-SA base data selects should be expected')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-3-#datasource#.json')
      .withRequest({
        language: 'ar-SA',
        select: {
          key: ['concept'],
          value: [
            'concept_type', 'name', 'description'
          ]
        },
        from: 'concepts',
        where: {
          $and: [
            {concept_type: {$eq: 'entity_set'}}
          ]
        },
        order_by: ['concept']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 1')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-4-#datasource#.json')
      .withRequest({
        "select": {
          "key": [
            "concept"
          ],
          "value": []
        },
        "from": "concepts",
        "where": {},
        "language": "en"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 2')
      .unsupportedFor('WS has null instead empty strings and populated json instead json string', WsReader)
      .withFixturePath('../../test/result-fixtures/concepts/concepts-5-#datasource#.json')
      .withRequest({
        "select": {
          "key": [
            "concept"
          ],
          "value": [
            "concept_type",
            "domain",
            "color",
            "scales",
            "tags",
            "name",
            "format"
          ]
        },
        "from": "concepts",
        "where": {},
        "language": "en"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwpp)
      .withTitle('recent 3')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-6-#datasource#.json')
      .withRequest({
        "select": {
          "key": [
            "concept"
          ],
          "value": [
            "concept_type",
            "domain",
            "indicator_url",
            "color",
            "scales",
            "tags",
            "name",
            "description"
          ]
        },
        "from": "concepts",
        "where": {},
        "language": "en"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 4')
      .unsupportedFor('WS has null instead empty strings and populated json instead json string', WsReader)
      .withFixturePath('../../test/result-fixtures/concepts/concepts-7-#datasource#.json')
      .withRequest({
        "select": {
          "key": [
            "concept"
          ],
          "value": [
            "concept_type",
            "domain",
            "indicator_url",
            "color",
            "scales",
            "tags",
            "name",
            "name_short",
            "name_catalog",
            "description"
          ]
        },
        "from": "concepts",
        "where": {},
        "language": "en"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 5')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-8-#datasource#.json')
      .withRequest({
        "select": {
          "key": [
            "concept"
          ],
          "value": [
            "concept_type",
            "name",
            "domain"
          ]
        },
        "from": "concepts",
        "where": {
          "$and": [
            {
              "concept_type": {
                "$eq": "entity_set"
              }
            }
          ]
        }
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 6')
      .withFixturePath('../../test/result-fixtures/concepts/concepts-9-#datasource#.json')
      .withRequest({
        "select": {
          "key": [
            "concept"
          ],
          "value": [
            "concept_type",
            "name"
          ]
        },
        "from": "concepts",
        "where": {
          "$and": [
            {
              "concept_type": {
                "$eq": "entity_set"
              }
            }
          ]
        },
        "order_by": [
          "concept"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy)
  ];

  after(() => {
    executionSummaryTable(testCases, aggregatedData);
    writeDiagnostic(__filename, diagnosticData);
  });

  runTests(testCases, aggregatedData, diagnosticData);
});
