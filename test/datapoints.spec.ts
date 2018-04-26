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
  sodertornsmodellen, datetesting
} from '../src/settings/datasources';
import { GenericExpectationStrategy } from '../src/expectations/generic-expectation-strategy';
import { OnlySameQuantityExpectationStrategy } from '../src/expectations/only-same-quantity-expectation-strategy';
import { WsReader } from "../src/family-definition/ws-reader";
import { WsReaderMongoless } from "../src/family-definition/ws-reader-mongoless";
import { DdfCsvReader } from "../src/family-definition/ddf-csv-reader";

describe('Datapoints supporting', () => {
  const aggregatedData = {};
  const testCases = [
    new TestCase()
      .forDataSource(sg)
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
      .unsupportedFor('it should be serious refactoring for query processing: filter results after merging', WsReader)
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
    new TestCase()
      .forDataSource(datetesting)
      .unsupportedFor('date format should be considered', WsReader, WsReaderMongoless, DdfCsvReader)
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
      .unsupportedFor('month format should be considered', WsReader, WsReaderMongoless, DdfCsvReader)
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
      .withExpectationStrategy(OnlySameQuantityExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 1')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-17-#datasource#.json')
      .withRequest({
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "life_expectancy_years",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "is--country": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2015"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 2')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-18-#datasource#.json')
      .withRequest({
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "life_expectancy_years",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "is--country": true
            }
          }
        },
        "order_by": [
          "time",
          "geo"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 3')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-19-#datasource#.json')
      .withRequest({
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "life_expectancy_years",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "population_total"
          ]
        },
        "where": {
          "time": {
            "$gt": 1800,
            "$lt": 2016
          }
        },
        "grouping": {},
        "order_by": [
          "time",
          "geo"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(bubbles3)
      .withTitle('recent 4')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-20-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "country",
            "time"
          ],
          "value": [
            "gdp_per_capita",
            "life_expectancy",
            "population"
          ]
        },
        "where": {},
        "join": {},
        "order_by": [
          "country",
          "time"
        ],
        "dataset": "buchslava/readers-test-ds-bubbles-3"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 5')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-21-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "children_per_woman_total_fertility"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 6')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-22-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "ifpri_underweight_children"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(staticassets)
      .withTitle('recent 7')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-23-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_mountains"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "geo": {
                "$in": [
                  "world"
                ]
              }
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2015"
            }
          }
        },
        "order_by": [
          "geo",
          "time"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-ds-static-assets"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 8')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-24-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "un_state": true
                },
                {
                  "world_4region": {
                    "$in": [
                      "africa"
                    ]
                  }
                }
              ]
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2018"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 9')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-25-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "is--country": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2015"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 10')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-26-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "is--country": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": {
                "$gte": "1800",
                "$lte": "2015"
              }
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 11')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-27-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2018"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(presentation)
      .withTitle('recent 12')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-28-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": {
                "$gte": "1800",
                "$lte": "2015"
              }
            }
          }
        },
        "order_by": [
          "geo",
          "time"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-ds-presentation-set"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 13')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-29-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "un_state": true
                },
                {
                  "world_4region": {
                    "$in": [
                      "africa"
                    ]
                  }
                }
              ]
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 14')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-30-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "un_state": true
                },
                {
                  "world_4region": {
                    "$in": [
                      "world"
                    ]
                  }
                }
              ]
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 15')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-31-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 16')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-32-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$time": {
            "key": "time",
            "where": {
              "time": "2018"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 17')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-33-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "life_expectancy_years",
            "population_total"
          ]
        },
        "where": {},
        "join": {},
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 18')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-34-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "un_state": true
                },
                {
                  "world_4region": {
                    "$in": [
                      "africa"
                    ]
                  }
                }
              ]
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2018"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 19')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-35-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "un_state": true
                },
                {
                  "world_4region": {
                    "$in": [
                      "africa"
                    ]
                  }
                }
              ]
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 20')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-36-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "un_state": true
                },
                {
                  "geo": {
                    "$in": [
                      "usa",
                      "rus",
                      "chn",
                      "nga"
                    ]
                  }
                }
              ]
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 21')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-37-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "un_state": true
                },
                {
                  "world_4region": {
                    "$in": [
                      "africa",
                      "asia"
                    ]
                  }
                }
              ]
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 22')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-38-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_per_person_gdppercapita_ppp_inflation_adjusted"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "un_state": true
                },
                {
                  "world_4region": {
                    "$in": [
                      "africa",
                      "world"
                    ]
                  }
                }
              ]
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 23')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-39-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "life_expectancy_years",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2018"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 24')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-40-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "life_expectancy_years",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 25')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-41-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "life_expectancy_years",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 26')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-42-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "literacy_rate_adult_total_percent_of_people_ages_15_and_above"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 27')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-43-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "males_aged_55plus_unemployment_rate_percent"
          ]
        },
        "where": {},
        "join": {},
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 28')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-44-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "pneumonia_deaths_in_newborn_per_1000_births"
          ]
        },
        "where": {},
        "join": {},
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 29')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-45-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "gapminder_gini"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2015"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 30')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-46-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "gapminder_gini"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2018"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 31')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-47-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "gapminder_gini"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 32')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-48-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "gapminder_gini"
          ]
        },
        "where": {
          "$and": [
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$time": {
            "key": "time",
            "where": {
              "time": "2015"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 33')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-49-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total",
            "income_per_person_gdppercapita_ppp_inflation_adjusted",
            "gapminder_gini"
          ]
        },
        "where": {
          "$and": [
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$time": {
            "key": "time",
            "where": {
              "time": {
                "$gte": "1800",
                "$lte": "2015"
              }
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 34')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-50-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "is--country": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2015"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 35')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-51-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "is--country": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": {
                "$gte": "1800",
                "$lte": "2015"
              }
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 36')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-52-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2010"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 37')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-53-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2013"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 38')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-54-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2013"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 39')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-55-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2018"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 40')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-56-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sgtiny)
      .withTitle('recent 41')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-57-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "world_4region": {
                "$in": [
                  "americas",
                  "asia"
                ]
              }
            }
          }
        },
        "order_by": [
          "geo",
          "time"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-ds-systema-globalis-tiny"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 42')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-58-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$time": {
            "key": "time",
            "where": {
              "time": "2015"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 43')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-59-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {
          "$and": [
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$time": {
            "key": "time",
            "where": {
              "time": {
                "$gte": "1800",
                "$lte": "2015"
              }
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 44')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-60-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "residential_electricity_use_total",
            "cervical_cancer_number_of_female_deaths",
            "trade_balance_percent_of_gdp"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2002"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 45')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-61-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "residential_electricity_use_total",
            "cervical_cancer_number_of_female_deaths",
            "trade_balance_percent_of_gdp"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 46')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-62-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "residential_electricity_use_total",
            "cervical_cancer_number_of_female_deaths",
            "trade_balance_percent_of_gdp"
          ]
        },
        "where": {},
        "join": {},
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 47')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-63-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "residential_electricity_use_total",
            "cervical_cancer_number_of_female_deaths"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "un_state": true
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 48')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-64-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "residential_energy_use_percent"
          ]
        },
        "where": {},
        "join": {},
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sgtiny)
      .withTitle('recent 49')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-65-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "time",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "sg_population",
            "sg_gdp_p_cap_const_ppp2011_dollar",
            "sg_gini"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "is--country": true,
              "geo": {
                "$in": [
                  "ago"
                ]
              }
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": {
                "$gte": "1800",
                "$lte": "2015"
              }
            }
          }
        },
        "order_by": [
          "time",
          "geo"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-ds-systema-globalis-tiny"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 50')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-66-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "basomrade",
            "year",
            "gender"
          ],
          "value": [
            "mean_income_aged_gt_20",
            "post_secondary_education_min_3_years_aged_25_64"
          ]
        },
        "where": {
          "$and": [
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$year": {
            "key": "year",
            "where": {
              "year": "2014"
            }
          }
        },
        "order_by": [
          "year"
        ]// ,
        // "dataset": "open-numbers/ddf--sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 51')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-67-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "basomrade",
            "year",
            "gender"
          ],
          "value": [
            "mean_income_aged_gt_20",
            "post_secondary_education_min_3_years_aged_25_64"
          ]
        },
        "where": {
          "$and": [
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$year": {
            "key": "year",
            "where": {
              "year": {
                "$gte": "2000",
                "$lte": "2014"
              }
            }
          }
        },
        "order_by": [
          "year"
        ]// ,
        // "dataset": "open-numbers/ddf--sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 52')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-68-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "basomrade",
            "year"
          ],
          "value": [
            "mean_income_aged_gt_20",
            "post_secondary_education_min_3_years_aged_25_64",
            "population_aged_gt_20"
          ]
        },
        "where": {
          "$and": [
            {
              "basomrade": "$basomrade"
            },
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$basomrade": {
            "key": "basomrade",
            "where": {
              "municipality": {
                "$in": [
                  "0192_nynashamn",
                  "0127_botkyrka",
                  "0136_haninge",
                  "0126_huddinge",
                  "0128_salem",
                  "0138_tyreso"
                ]
              }
            }
          },
          "$year": {
            "key": "year",
            "where": {
              "year": "2000"
            }
          }
        },
        "order_by": [
          "basomrade",
          "year"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 53')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-69-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "basomrade",
            "year"
          ],
          "value": [
            "post_secondary_education_min_3_years_aged_25_64"
          ]
        },
        "where": {
          "$and": [
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$year": {
            "key": "year",
            "where": {
              "year": "2014"
            }
          }
        },
        "order_by": [
          "year"
        ]// ,
        // "dataset": "open-numbers/ddf--sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 54')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-70-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "basomrade",
            "year"
          ],
          "value": [
            "post_secondary_education_min_3_years_aged_25_64"
          ]
        },
        "where": {
          "$and": [
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$year": {
            "key": "year",
            "where": {
              "year": {
                "$gte": "2000",
                "$lte": "2014"
              }
            }
          }
        },
        "order_by": [
          "year"
        ]// ,
        // "dataset": "open-numbers/ddf--sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwpp)
      .withTitle('recent 55')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-71-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "country_code",
            "year",
            "gender",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "country_code": "$country_code"
            }
          ]
        },
        "join": {
          "$country_code": {
            "key": "country_code",
            "where": {
              "country_code": {
                "$in": [
                  "900"
                ]
              }
            }
          }
        },
        "order_by": [
          "country_code",
          "year",
          "gender",
          "age"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-ds-gm-population"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 56')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-72-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "$or": [
                    {
                      "un_state": true
                    },
                    {
                      "is--global": true
                    },
                    {
                      "is--world_4region": true
                    }
                  ]
                },
                {
                  "geo": {
                    "$in": [
                      "world"
                    ]
                  }
                }
              ]
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "year"
        ],
        // "dataset": "open-numbers/ddf--gapminder--population#develop"
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 57')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-73-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "geo": {
                "$in": [
                  "world"
                ]
              }
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "geo",
          "year",
          "age"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 58')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-74-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "geo": {
                "$in": [
                  "world"
                ]
              }
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "year"
        ],
        // "dataset": "open-numbers/ddf--gapminder--population%#develop"
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 59')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-75-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "year": "$year"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "$or": [
                    {
                      "un_state": true
                    },
                    {
                      "is--global": true
                    },
                    {
                      "is--world_4region": true
                    }
                  ]
                },
                {
                  "geo": {
                    "$in": [
                      "world"
                    ]
                  }
                }
              ]
            }
          },
          "$year": {
            "key": "year",
            "where": {
              "year": "2018"
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "year"
        ],
        // "dataset": "open-numbers%2Fddf--gapminder--population%23develop"
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 60')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-76-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "year": "$year"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "geo": {
                "$in": [
                  "world"
                ]
              }
            }
          },
          "$year": {
            "key": "year",
            "where": {
              "year": "2017"
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "geo",
          "year",
          "age"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 61')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-77-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "gender",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "$or": [
                    {
                      "un_state": true
                    },
                    {
                      "is--global": true
                    },
                    {
                      "is--world_4region": true
                    }
                  ]
                },
                {
                  "geo": {
                    "$in": [
                      "world"
                    ]
                  }
                }
              ]
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "year"
        ],
        // "dataset": "open-numbers%2Fddf--gapminder--population%23develop"
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 62')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-78-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "gender",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "gender": "$gender"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "$or": [
                    {
                      "un_state": true
                    },
                    {
                      "is--global": true
                    },
                    {
                      "is--world_4region": true
                    }
                  ]
                },
                {
                  "geo": {
                    "$in": [
                      "world"
                    ]
                  }
                }
              ]
            }
          },
          "$gender": {
            "key": "gender",
            "where": {
              "gender": {
                "$in": [
                  "female"
                ]
              }
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "year"
        ],
        // "dataset": "open-numbers%2Fddf--gapminder--population%23develop"
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 63')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-79-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "gender",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "year": "$year"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "$or": [
                    {
                      "un_state": true
                    },
                    {
                      "is--global": true
                    },
                    {
                      "is--world_4region": true
                    }
                  ]
                },
                {
                  "geo": {
                    "$in": [
                      "world"
                    ]
                  }
                }
              ]
            }
          },
          "$year": {
            "key": "year",
            "where": {
              "year": "2018"
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "year"
        ],
        // "dataset": "open-numbers%2Fddf--gapminder--population%23develop"
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(popwppbig)
      .withTitle('recent 64')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-80-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "geo",
            "year",
            "gender",
            "age"
          ],
          "value": [
            "population"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "year": "$year"
            },
            {
              "gender": "$gender"
            },
            {
              "age": "$age"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "$and": [
                {
                  "$or": [
                    {
                      "un_state": true
                    },
                    {
                      "is--global": true
                    },
                    {
                      "is--world_4region": true
                    }
                  ]
                },
                {
                  "geo": {
                    "$in": [
                      "world"
                    ]
                  }
                }
              ]
            }
          },
          "$year": {
            "key": "year",
            "where": {
              "year": "2018"
            }
          },
          "$gender": {
            "key": "gender",
            "where": {
              "gender": {
                "$in": [
                  "female"
                ]
              }
            }
          },
          "$age": {
            "key": "age",
            "where": {
              "age": {
                "$nin": [
                  "80plus",
                  "100plus"
                ]
              }
            }
          }
        },
        "order_by": [
          "year"
        ],
        // "dataset": "open-numbers%2Fddf--gapminder--population%23develop"
        "dataset": "buchslava/readers-test-ds-gm-population-big"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sgmixentity)
      .withTitle('recent 65')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-82-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "global",
            "time"
          ],
          "value": [
            "population_total"
          ]
        },
        "where": {},
        "join": {},
        "order_by": [
          "global",
          "time"
        ],
        "force": true,
        "dataset": "buchslava/readers-test-ds-sg-mix-entity"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 66')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-83-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "municipality",
            "year"
          ],
          "value": [
            "population_20xx_12_31",
            "cumulative_immigration_surplus_employed_aged_20_64"
          ]
        },
        "where": {
          "$and": [
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$year": {
            "key": "year",
            "where": {
              "year": "2014"
            }
          }
        },
        "order_by": [
          "year"
        ]// ,
        // "dataset": "open-numbers/ddf--sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 67')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-84-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "municipality",
            "year"
          ],
          "value": [
            "population_20xx_12_31",
            "cumulative_immigration_surplus_employed_aged_20_64"
          ]
        },
        "where": {
          "$and": [
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$year": {
            "key": "year",
            "where": {
              "year": {
                "$gte": "1993",
                "$lte": "2015"
              }
            }
          }
        },
        "order_by": [
          "year"
        ]// ,
        // "dataset": "open-numbers%2Fddf--sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 68')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-85-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "municipality",
            "year"
          ],
          "value": [
            "population_20xx_12_31"
          ]
        },
        "where": {
          "$and": [
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$year": {
            "key": "year",
            "where": {
              "year": "2014"
            }
          }
        },
        "order_by": [
          "year"
        ]// ,
        // "dataset": "open-numbers%2Fddf--sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sodertornsmodellen)
      .withTitle('recent 69')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-86-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "animatable": "year",
        "select": {
          "key": [
            "municipality",
            "year"
          ],
          "value": [
            "population_20xx_12_31"
          ]
        },
        "where": {
          "$and": [
            {
              "year": "$year"
            }
          ]
        },
        "join": {
          "$year": {
            "key": "year",
            "where": {
              "year": {
                "$gte": "1993",
                "$lte": "2015"
              }
            }
          }
        },
        "order_by": [
          "year"
        ]// ,
        // "dataset": "open-numbers%2Fddf--sodertornsmodellen"
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 70')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-87-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_mountains"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "geo": {
                "$in": [
                  "world"
                ]
              }
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2015"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy),
    new TestCase()
      .forDataSource(sg)
      .withTitle('recent 71')
      .withFixturePath('../../test/result-fixtures/datapoints/datapoints-88-#datasource#.json')
      .withRequest({
        "language": "en",
        "from": "datapoints",
        "select": {
          "key": [
            "geo",
            "time"
          ],
          "value": [
            "income_mountains"
          ]
        },
        "where": {
          "$and": [
            {
              "geo": "$geo"
            },
            {
              "time": "$time"
            }
          ]
        },
        "join": {
          "$geo": {
            "key": "geo",
            "where": {
              "geo": {
                "$in": [
                  "world"
                ]
              }
            }
          },
          "$time": {
            "key": "time",
            "where": {
              "time": "2018"
            }
          }
        },
        "order_by": [
          "time"
        ]
      })
      .withExpectationStrategy(GenericExpectationStrategy)
  ];

  after(() => {
    executionSummaryTable(testCases, aggregatedData);
  });

  runTests(testCases, aggregatedData);
});
