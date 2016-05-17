import _ from '../common';

describe('simpleMovingAverage', () => {
  it('keeps a moving average with the given period', () => {
    const sma = _.simpleMovingAverage(5);
    sma.add(1);
    expect(sma.value).toBe(1);
    sma.add(2);
    expect(sma.value).toBe(1.5);
    sma.add(3);
    expect(sma.value).toBe(2);
    sma.add(6);
    expect(sma.value).toBe(3);
    sma.add(3);
    expect(sma.value).toBe(3);
    sma.add(1);
    expect(sma.value).toBe(3);
    sma.add(7);
    expect(sma.value).toBe(4);
  });

  it('can increase its period', () => {
    const sma = _.simpleMovingAverage(2);
    sma.add(2);
    sma.add(4);
    sma.period++;
    sma.add(2);
    sma.add(6);
    expect(sma.value).toBe(4);
  });
});
