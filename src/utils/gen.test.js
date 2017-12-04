'use strict';
const assert = require('chai').assert;

const gen = require('../../../src/lib/gen.js');

describe('gen()', () => {
    it('should pause generator function until Promise resolves', (done) => {
        gen(function* () {
            const result = yield new Promise((resolve) => {
                setTimeout(() => {
                    resolve('success?');
                }, 0.05);
            });

            assert.equal(result, 'success?');
            done();
        });
    });

    it('should pause generator function until Promise rejects', (done) => {
        gen(function* () {
            try {
                yield new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject('failure?');
                    }, 0.05);
                });
            } catch(e) {
                assert.equal(e, 'failure?');
                done();
            }
        });
    });
});
