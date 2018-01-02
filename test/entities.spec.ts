import * as chai from 'chai';
import { nth } from 'lodash';
import { runTests } from '../src/test-utils';
import { ExactTestFlow, GenericTestFlow } from '../src/test-flow';
import { TestCase } from '../src/test-case';
import { Dataset } from '../src/datasets';
import { readersCases } from '../src/test-utils';

const expect = chai.expect;

describe('Basic entities supporting', () => {
  runTests([
    new TestCase()
      .forDataset(Dataset.sg)
      .withTitle('result for #readerProvider# when plain query should be processed correctly')
      .withFixturePath('../test/result-fixtures/entities/entities-1-#dataset#.json')
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
      .withFlowConstructor(GenericTestFlow),
    new TestCase()
      .forDataset(Dataset.sg)
      .withTitle('result for #readerProvider# when plain Arabic query should be processed correctly')
      .withFixturePath('../test/result-fixtures/entities/entities-2-#dataset#.json')
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
      .withFlowConstructor(GenericTestFlow),
    new TestCase()
      .forDataset(Dataset.sg)
      .withTitle('result for #readerProvider# shapes query should be processed correctly')
      .withFixturePath('../test/result-fixtures/entities/entities-3-#dataset#.json')
      .withRequest({
        from: 'entities',
        animatable: false,
        select: {key: ['geo'], value: ['name', 'shape_lores_svg']},
        where: {'is--world_4region': true},
        grouping: {},
        orderBy: null
      })
      .withFlowConstructor(GenericTestFlow),
    new TestCase()
      .forDataset(Dataset.sg)
      .withTitle('result for #readerProvider# tags query should be processed correctly')
      .withFixturePath('../test/result-fixtures/entities/entities-4-#dataset#.json')
      .withRequest({
        from: 'entities',
        animatable: false,
        select: {key: ['tag'], value: ['name', 'parent']},
        where: {},
        grouping: {},
        orderBy: null
      })
      .withFlowConstructor(GenericTestFlow),
    new TestCase()
      .forDataset(Dataset.sg)
      .withTitle('result for #readerProvider# "world_4region" query should be processed correctly')
      .withFixturePath('../test/result-fixtures/entities/entities-5-#dataset#.json')
      .withRequest({
        language: 'en',
        from: 'entities',
        animatable: false,
        select: {key: ['world_4region'], value: ['name', 'rank', 'shape_lores_svg']},
        where: {},
        join: {},
        order_by: ['rank']
      })
      .withFlowConstructor(ExactTestFlow),
    new TestCase()
      .forDataset(Dataset.presentation)
      .withTitle('result for #readerProvider# query with boolean condition should be processed correctly')
      .withFixturePath('../test/result-fixtures/entities/entities-6-#dataset#.json')
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
      .withFlowConstructor(ExactTestFlow),
    new TestCase()
      .forDataset(Dataset.sankey)
      .withTitle('result for #readerProvider# query with boolean condition should be processed correctly')
      .withFixturePath('../test/result-fixtures/entities/entities-7-#dataset#.json')
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
      .withFlowConstructor(ExactTestFlow),
  ]);
});

describe('Additional entities supporting', () => {
  readersCases
    .filter(readerProvider => readerProvider.dataset === Dataset.presentation)
    .forEach(readerProvider => {
      it('should filters work properly', () => {
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
          getRequest({}),
          getRequest({$and: [{'un_state': true}]}),
          getRequest({$and: [{'un_state': false}]}),
          getRequest({$and: [{'un_state': {$exists: false}}]})
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
          const EXPECTED_UNSTATE_LESS_QUANTITY = 23;

          const allEntities = nth(results, 0);
          const unStateEntities = nth(results, 1);
          const nonUnStateEntities = nth(results, 2);
          const unStateLessEntities = nth(results, 3);

          expect(nonUnStateEntities.length).to.equal(EXPECTED_NON_UNSTATE_QUANTITY);
          expect(unStateEntities.length).to.equal(EXPECTED_UNSTATE_QUANTITY);
          expect(unStateLessEntities.length).to.equal(EXPECTED_UNSTATE_LESS_QUANTITY);
          expect(allEntities.length).to.equal(EXPECTED_UNSTATE_QUANTITY + EXPECTED_NON_UNSTATE_QUANTITY + EXPECTED_UNSTATE_LESS_QUANTITY);
        });
      });
    });

  readersCases
    .filter(readerProvider => readerProvider.dataset === Dataset.sg)
    .forEach(readerProvider => {
      it('should filters work properly (an another case)', () => {
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
          ]
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
          const allEntities = nth(results, 0);
          const unStateEntities = nth(results, 1);
          const nonUnStateEntities = nth(results, 2);

          expect(unStateEntities.length + nonUnStateEntities.length).to.equal(allEntities.length);
        });
      });
    });
});
