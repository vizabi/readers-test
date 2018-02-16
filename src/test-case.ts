import { isEmpty } from 'lodash';
import { DataSource } from './settings/datasources';
import { AbstractExpectationStrategy } from './expectations/abstract-expectation-strategy';
import { AbstractFamilyMember } from "./family-definition/abstract-family-member";

export class TestCase<T extends AbstractExpectationStrategy> {
  title: string;
  fixturePath: string;
  request;
  expectationStrategy: typeof T;
  dataSources: DataSource[] = [];
  unsupported: (typeof AbstractFamilyMember)[] = [];

  withTitle(title: string) {
    this.title = title;

    return this;
  }

  withFixturePath(fixturePath: string) {
    this.fixturePath = fixturePath;

    return this;
  }

  withRequest(request) {
    this.request = request;

    return this;
  }

  withExpectationStrategy(expectationStrategy: typeof AbstractExpectationStrategy) {
    this.expectationStrategy = expectationStrategy;

    return this;
  }

  forDataSource(dataSource: DataSource) {
    this.dataSources.push(dataSource);

    return this;
  }

  unsupportedFor(unsupportedFamilyMember: typeof AbstractFamilyMember) {
    this.unsupported.push(unsupportedFamilyMember);

    return this;
  }

  checkConstraints() {
    if (!this.title) {
      throw Error('"title" should be defined');
    }

    if (!this.fixturePath) {
      throw Error('"fixturePath" should be defined');
    }

    if (!this.request) {
      throw Error('"request" should be defined');
    }

    if (!this.expectationStrategy) {
      throw Error('"expectationStrategy" should be defined');
    }

    if (isEmpty(this.dataSources)) {
      throw Error('at least one dataSource should be defined');
    }
  }
}
