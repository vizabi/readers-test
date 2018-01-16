import { isEmpty } from 'lodash';
import { AbstractTestFlow } from './test-flow';
import { Dataset } from "./settings/datasets";

export class TestCase<T extends AbstractTestFlow> {
  title: string;
  fixturePath: string;
  request;
  flowConstructor: typeof T;
  datasets: Dataset[] = [];

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

  withFlowConstructor(flowConstructor: typeof T) {
    this.flowConstructor = flowConstructor;

    return this;
  }

  forDataset(dataset: Dataset) {
    this.datasets.push(dataset);

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

    if (!this.flowConstructor) {
      throw Error('"flowConstructor" should be defined');
    }

    if (isEmpty(this.datasets)) {
      throw Error('at least one dataset should be defined');
    }
  }
}
