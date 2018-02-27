import { executionSummaryTable, runTests } from '../src/test-utils';
import { TestCase } from '../src/test-case';
import {
  sg,
  presentation,
  sgtiny,
  popwpp,
  bubbles3,
  popwppbig,
  sgmixentity,
  staticassets,
  sodertornsmodellen
} from '../src/settings/datasources';
import { ExactExpectationStrategy } from '../src/expectations/exact-expectation-strategy';
import { GenericExpectationStrategy } from '../src/expectations/generic-expectation-strategy';
import { OnlySameQuantityExpectationStrategy } from '../src/expectations/only-same-quantity-expectation-strategy';
import { WsReader } from "../src/family-definition/ws-reader";

describe('Datapoints supporting', () => {
  const aggregatedData = {};

  after(() => {
    executionSummaryTable(aggregatedData);
  });

  runTests([
    new TestCase()
      .forDataSource(sg)
      .unsupportedFor(WsReader)
      .withTitle('plain query should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-1-#datasource#.json')
      .withRequest({
        from: 'datapoints',
        animatable: 'time',
        select: {
          key: ['geo', 'time'],
          value: ['life_expectancy_years', 'income_per_person_gdppercapita_ppp_inflation_adjusted', 'population_total']
        },
        where: {
          time: {$gt: 1800, $lt: 2016}
        },
        grouping: {},
        order_by: ['time', 'geo']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('joins query should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-2-#datasource#.json')
      .withRequest({
        select: {
          key: ['geo', 'time'],
          value: [
            'life_expectancy_years', 'population_total'
          ]
        },
        from: 'datapoints',
        where: {
          $and: [
            {geo: '$geo'},
            {time: '$time'},
            {
              $or: [
                {population_total: {$gt: 10000}},
                {life_expectancy_years: {$gt: 30, $lt: 70}}
              ]
            }
          ]
        },
        join: {
          $geo: {
            key: 'geo',
            where: {
              $and: [
                {'is--country': true},
                {latitude: {$lte: 0}}
              ]
            }
          },
          $time: {
            key: 'time',
            where: {$and: [{time: {$gt: '1990', $lte: '2015'}}]}
          }
        }
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('joins query by one year should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-3-#datasource#.json')
      .withRequest({
        from: 'datapoints',
        animatable: 'time',
        select: {
          key: ['geo', 'time'],
          value: ['life_expectancy_years', 'income_per_person_gdppercapita_ppp_inflation_adjusted', 'population_total']
        },
        where: {$and: [{geo: '$geo'}, {time: '$time'}]},
        join: {
          $geo: {key: 'geo', where: {'is--country': true}},
          $time: {key: 'time', where: {time: '2015'}}
        },
        order_by: ['time']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('joins query by all period should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-4-#datasource#.json')
      .withRequest({
        from: 'datapoints',
        animatable: 'time',
        select: {
          key: ['geo', 'time'],
          value: ['life_expectancy_years', 'income_per_person_gdppercapita_ppp_inflation_adjusted', 'population_total']
        },
        where: {$and: [{geo: '$geo'}]},
        join: {
          $geo: {
            key: 'geo',
            where: {'is--country': true}
          }
        },
        order_by: ['time', 'geo']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sgtiny)
      .withTitle('query by "ago" country should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-5-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'time',
        select: {
          key: ['geo', 'time'],
          value: ['sg_population', 'sg_gdp_p_cap_const_ppp2011_dollar', 'sg_gini']
        },
        where: {
          $and: [{geo: '$geo'}, {time: '$time'}]
        },
        join: {
          $geo: {key: 'geo', where: {'is--country': true, geo: {$in: ['ago']}}},
          $time: {key: 'time', where: {time: {$gte: '1800', $lte: '2015'}}}
        },
        order_by: ['time', 'geo']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwpp)
      .withTitle('query by gender, age, and country with code 900 should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-6-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'year',
        select: {
          key: ['country_code', 'year', 'gender', 'age'],
          value: ['population']
        },
        where: {
          $and: [{country_code: '$country_code'}]
        },
        join: {
          $country_code: {key: 'country_code', where: {country_code: {$in: ['900']}}}
        },
        order_by: ['country_code', 'year', 'gender', 'age']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sgtiny)
      .withTitle('query by "americas" and "asia" regions should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-7-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'time',
        select: {
          key: ['geo', 'time'],
          value: ['population_total']
        },
        where: {
          $and: [{geo: '$geo'}]
        },
        join: {
          $geo: {key: 'geo', where: {world_4region: {$in: ['americas', 'asia']}}}
        },
        order_by: ['geo', 'time']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(bubbles3)
      .withTitle('should consume files with many indicators in different columns')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-8-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'time',
        select: {
          key: ['country', 'time'],
          value: ['gdp_per_capita', 'life_expectancy', 'population']
        },
        where: {},
        join: {},
        order_by: ['country', 'time']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('multidimentional dataSource reading should return expected result')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-9-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'year',
        select: {
          key: ['geo', 'year', 'age'],
          value: ['population']
        },
        where: {
          $and: [{geo: '$geo'}, {year: '$year'}, {age: '$age'}]
        },
        join: {
          $geo: {key: 'geo', where: {geo: {$in: ['world']}}},
          $year: {key: 'year', where: {year: '2017'}},
          $age: {key: 'age', where: {age: {$nin: ['80plus', '100plus']}}}
        },
        order_by: ['geo', 'year', 'age']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(presentation)
      .withTitle('query with boolean condition should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-10-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'time',
        select: {
          key: ['geo', 'time'],
          value: ['income_per_person_gdppercapita_ppp_inflation_adjusted', 'life_expectancy_years', 'population_total']
        },
        where: {
          $and: [{geo: '$geo'}, {time: '$time'}]
        },
        join: {
          $geo: {key: 'geo', where: {'un_state': true}},
          $time: {key: 'time', where: {time: {$gte: '1800', $lte: '2015'}}}
        },
        order_by: ['geo', 'time']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(staticassets)
      .withTitle('query with static assets should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-11-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'time',
        select: {
          key: ['geo', 'time'],
          value: ['income_mountains']
        },
        where: {
          $and: [{geo: '$geo'}, {time: '$time'}]
        },
        join: {
          $geo: {key: 'geo', where: {geo: {$in: ['world']}}},
          $time: {key: 'time', where: {time: '2015'}}
        },
        order_by: ['geo', 'time']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('query with join and world4region should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-12-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'year',
        select: {
          key: ['geo', 'year', 'age'],
          value: ['population']
        },
        where: {
          $and: [{geo: '$geo'}, {age: '$age'}]
        },
        join: {
          $geo: {key: 'geo', where: {geo: {$in: ['world']}}},
          $age: {key: 'age', where: {age: {$nin: ['80plus', '100plus']}}}
        },
        order_by: ['geo', 'year', 'age']
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sgmixentity)
      .withTitle('query on dataSource that contains mixed kinds of entities in the same file should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-13-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'year',
        select: {
          key: [
            'global',
            'time'
          ],
          value: [
            'population_total'
          ]
        },
        where: {},
        join: {},
        order_by: [
          'global',
          'time'
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('query on dataSource when datapoint record contains domain but request contains entity set should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-14-#datasource#.json')
      .withRequest({
        select: {
          key: ['country', 'time'],
          value: ['population_total', 'life_expectancy_years']
        },
        from: 'datapoints',
        where: {
          $and: [
            {time: '$time'}
          ]
        },
        join: {
          $time: {
            key: 'time',
            where: {
              time: {
                $gte: '1993',
                $lte: '2015'
              }
            }
          }
        },
        order_by: ['country', 'time'],
        language: 'en'
      })
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('filter datapoints by entity properties should be processed correctly')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-17-#datasource#.json')
      .withRequest({
        language: 'en',
        from: 'datapoints',
        animatable: 'year',
        select: {
          key: [
            'basomrade',
            'year'
          ],
          value: [
            'mean_income_aged_gt_20',
            'post_secondary_education_min_3_years_aged_25_64',
            'population_aged_gt_20'
          ]
        },
        where: {
          $and: [
            {
              basomrade: '$basomrade'
            },
            {
              year: '$year'
            }
          ]
        },
        join: {
          $basomrade: {
            key: 'basomrade',
            where: {
              municipality: {
                $in: [
                  '0192_nynashamn',
                  '0127_botkyrka',
                  '0136_haninge',
                  '0126_huddinge',
                  '0128_salem',
                  '0138_tyreso'
                ]
              }
            }
          },
          $year: {
            key: 'year',
            where: {
              year: '2000'
            }
          }
        },
        order_by: [
          'basomrade',
          'year'
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    /*,
        new TestCase()
          .forDataSource(datetesting)
          .withTitle('query by full date should be processed correctly')
          .withFixturePath('../../test/result-fixtures/datapoints/datapoints-15-#datasource#.json')
          .withRequest({
            select: {
              key: ['currency', 'day'],
              value: [
                'exchange_rate_usd'
              ]
            },
            from: 'datapoints',
            where: {
              $and: [
                {day: {$lt: '20151230'}},
                {day: {$gt: '20151220'}}
              ]
            }
          })
          .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
        new TestCase()
          .forDataSource(datetesting)
          .withTitle('query by month should be processed correctly')
          .withFixturePath('../../test/result-fixtures/datapoints/datapoints-16-#datasource#.json')
          .withRequest({
            select: {
              key: ['currency', 'month'],
              value: [
                'exchange_rate_usd'
              ]
            },
            from: 'datapoints',
            where: {
              $and: [
                {month: {$lt: '2015-01'}},
                {month: {$gt: '2014-05'}}
              ]
            }
          })
          .withExpectationStrategy(OnlySameQuantityExpectationStrategy)*/
  ], aggregatedData);
});
