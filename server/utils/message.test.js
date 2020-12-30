let expect = require('expect')

let {generateMessage, generateLocationMessage} = require('./message')

describe('Generate Message', () => {
    it('should generate correct message object', () => {
        let from = 'user',
            text = 'test text',
            message = generateMessage(from, text)
        
            expect(typeof message.createdAt).toBe('number')
            expect(message).toMatchObject({from, text})
    })
})

describe('Generate location message', () => {
    it('should generate correct location object', () => {
        let from = "geo user",
          lat = 15,
          long = 16,
          url = `https://www.google.com/maps?q=${lat},${long}`,
          message = generateLocationMessage(from, lat, long)
          expect(typeof message.createdAt).toBe("number")
          expect(message).toMatchObject({ from, url });
    })
})