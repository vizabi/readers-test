import * as chai from 'chai';
import { nth } from 'lodash';
import { executionSummaryTable, runTests } from '../src/test-utils';
import { TestCase } from '../src/test-case';
import { familyMembers } from '../src/settings/family-members';
import { presentation, sankey, sg } from '../src/settings/datasources';
import { OnlySameQuantityExpectationStrategy } from "../src/expectations/only-same-quantity-expectation-strategy";

const expect = chai.expect;

describe('Basic entities supporting', () => {
  const aggregatedData = {};
  const testCases = [
    new TestCase()
      .forDataSource(sg)
      .withTitle('plain query should be processed correctly')
      .withFixturePath('../../test/result-fixtures/entities/entities-1-#datasource#.json')
      .withRequest({
        from: 'entities',
        animatable: 'time',
        select: {
          key: ['geo'],
          value: ['name', 'world_4region', 'latitude', 'longitude']
        },
        where: {'is--country': true},
        grouping: {},
        orderBy: null
      })
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('plain Arabic query should be processed correctly')
      .withFixturePath('../../test/result-fixtures/entities/entities-2-#datasource#.json')
      .withRequest({
        language: 'ar-SA',
        from: 'entities',
        animatable: 'time',
        select: {
          key: ['geo'],
          value: ['name', 'world_4region', 'latitude', 'longitude']
        },
        where: {'is--country': true},
        grouping: {},
        orderBy: null
      })
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('shapes query should be processed correctly')
      .withFixturePath('../../test/result-fixtures/entities/entities-3-#datasource#.json')
      .withRequest({
        from: 'entities',
        animatable: false,
        select: {key: ['geo'], value: ['name', 'shape_lores_svg']},
        where: {'is--world_4region': true},
        grouping: {},
        orderBy: null
      })
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('tags query should be processed correctly')
      .withFixturePath('../../test/result-fixtures/entities/entities-4-#datasource#.json')
      .withRequest({
        from: 'entities',
        animatable: false,
        select: {key: ['tag'], value: ['name', 'parent']},
        where: {},
        grouping: {},
        orderBy: null
      })
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('"world_4region" query should be processed correctly')
      .withFixturePath('../../test/result-fixtures/entities/entities-5-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'entities',
        animatable: false,
        select: {key: ['world_4region'], value: ['name', 'rank', 'shape_lores_svg']},
        where: {},
        join: {},
        order_by: ['rank']
      })
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
    new TestCase()
      .forDataSource(presentation)
      .withTitle('query with boolean condition should be processed correctly')
      .withFixturePath('../../test/result-fixtures/entities/entities-6-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'entities',
        animatable: 'time',
        select: {
          key: [
            'geo'
          ],
          value: [
            'name',
            'world_4region'
          ]
        },
        where: {
          $and: [
            {
              'un_state': true
            }
          ]
        },
        join: {},
        order_by: [
          'rank'
        ]
      })
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
    new TestCase()
      .forDataSource(sankey)
      .withTitle('query with boolean condition should be processed correctly')
      .withFixturePath('../../test/result-fixtures/entities/entities-7-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'entities',
        animatable: false,
        select: {
          key: [
            'phase_from'
          ],
          value: [
            'name'
          ]
        },
        where: {},
        join: {},
        order_by: [
          'rank'
        ]
      })
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
  ];

  after(() => {
    executionSummaryTable(testCases, aggregatedData);
  });

  runTests(testCases, aggregatedData);
});

describe('Additional entities supporting', () => {
  familyMembers
    .filter(readerProvider => readerProvider.dataSource === presentation)
    .forEach(readerProvider => {
      it(`"${readerProvider.getTitle()}" on "${readerProvider.dataSource.title}": should filters work properly`, () => {
        const getRequest = where => ({
          language: 'en',
          from: 'entities',
          animatable: 'time',
          select: {
            key: [
              'geo'
            ],
            value: [
              'name',
              'world_4region'
            ]
          },
          where,
          join: {},
          order_by: [
            'rank'
          ]
        });
        const requests = [
          getRequest({$and: [{'un_state': true}]}),
          getRequest({$and: [{'un_state': false}]})
        ];
        const actions = requests.map(request => new Promise((resolve, reject) => {
          readerProvider.read(request, (err, data) => {
            if (err) {
              return reject(err);
            }

            resolve(data);
          });
        }));

        return Promise.all(actions).then(results => {
          const EXPECTED_UNSTATE_QUANTITY = 195;
          const EXPECTED_NON_UNSTATE_QUANTITY = 78;

          const unStateEntities = <any[]>nth(results, 0);
          const nonUnStateEntities = <any[]>nth(results, 1);

          expect(nonUnStateEntities.length).to.equal(EXPECTED_NON_UNSTATE_QUANTITY);
          expect(unStateEntities.length).to.equal(EXPECTED_UNSTATE_QUANTITY);
        });
      });
    });

  familyMembers
    .filter(readerProvider => readerProvider.dataSource === sg)
    .forEach(readerProvider => {
      it(`"${readerProvider.getTitle()}" on "${readerProvider.dataSource.title}": should filters work properly (an another case)`, () => {
        const getRequest = where => ({
          language: 'en',
          from: 'entities',
          animatable: 'time',
          select: {
            key: [
              'country'
            ],
            value: [
              'name',
              'world_4region'
            ]
          },
          where,
          join: {},
          order_by: [
            'rank'
          ],
          force: true
        });

        const requests = [
          getRequest({}),
          getRequest({$and: [{'un_state': true}]}),
          getRequest({$and: [{'un_state': false}]})
        ];
        const actions = requests.map(request => new Promise((resolve, reject) => {
          readerProvider.read(request, (err, data) => {
            if (err) {
              return reject(err);
            }

            resolve(data);
          });
        }));

        return Promise.all(actions).then(results => {
          const allEntities = <any[]>nth(results, 0);
          const unStateEntities = <any[]>nth(results, 1);
          const nonUnStateEntities = <any[]>nth(results, 2);

          expect(unStateEntities.length + nonUnStateEntities.length).to.equal(allEntities.length);
        });
      });
    });
});
