const expect = require('expect')

const { isRealString } = require('./isRealString')

describe('is Real String', () => {
    it('should reject non string values', () => {
        let res = isRealString(65)
        expect(res).toBe(false)
    })

    it('shoould reject string with only spaces', () => {
        let res = isRealString('         ');
        expect(res).toBe(false);
    })

    it('should allow string with non space chars', () => {
        let res = isRealString('     asd      ');
        expect(res).toBe(true);
    })
})