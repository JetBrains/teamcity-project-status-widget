/* eslint-disable no-magic-numbers */
import {expect} from 'chai';

import copyAndRemove from './copy-and-remove';

describe('copyAndRemove', () => {
  it('first', () => {
    expect(copyAndRemove([1, 2, 3], 1, (a, b) => a === b)).to.deep.equal([2, 3]);
  });
  it('last', () => {
    expect(copyAndRemove([1, 2, 3], 3, (a, b) => a === b)).to.deep.equal([1, 2]);
  });
  it('middle', () => {
    expect(copyAndRemove([1, 2, 3], 2, (a, b) => a === b)).to.deep.equal([1, 3]);
  });
  it('not existing', () => {
    expect(copyAndRemove([1, 2, 3], 4, (a, b) => a === b)).to.deep.equal([1, 2, 3]);
  });
  it('the only', () => {
    expect(copyAndRemove([1], 1, (a, b) => a === b)).to.deep.equal([]);
  });
  it('from empty', () => {
    expect(copyAndRemove([], 1, (a, b) => a === b)).to.deep.equal([]);
  });
  it('custom equals', () => {
    expect(copyAndRemove(
      [{id: 1}, {id: 2}, {id: 3}],
      {id: 2},
      (a, b) => a.id === b.id
    )).to.deep.equal([{id: 1}, {id: 3}]);
  });
});
