'use strict';

const truthy = true;

describe('truth test', () => {
  it('should return true for true things', () => {
    expect(truthy).toBeTruthy();
  });
});
