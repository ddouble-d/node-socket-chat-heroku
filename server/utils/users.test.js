const expect = require('expect')
const {Users} = require('./users')

describe('Users', () => {
    let users

    beforeEach(() => {
        users = new Users()
        users.users = [
          {
            id: "1",
            name: "satu",
            room: "wota",
          },
          {
            id: "2",
            name: "dua",
            room: "wota",
          },
          {
            id: "3",
            name: "tiga",
            room: "wibu",
          }
        ]
    })

    it('should add new  user', () => {
        let users = new Users()
        let user = {
            id: 'asdasd',
            name: 'asdasd',
            room: 'asdasd'
        }
        let reUser = users.addUser(user.id, user.name, user.room)

        expect(users.users).toEqual([user])
    })

    it('should return names for wota', () => {
        let userList = users.getUserList('wota')
        expect(userList).toEqual(['satu', 'dua'])
    })

    it("should return names for wibu", () => {
        let userList = users.getUserList("wibu");
        expect(userList).toEqual(["tiga"]);
    })

    it("should find user", () => {
        let userId = '2',
            user = users.getUser(userId)

        expect(user.id).toBe(userId)
    })

    it("should not find user", () => {
      let userId = '123123',
        user = users.getUser(userId)

      expect(user).toBeUndefined()
    })

    it("should not remove a user", () => {
      let userId = "124121",
        user = users.removeUser(userId)

      expect(user).toBeUndefined()
      expect(users.users.length).toBe(3)
    })

    it("should remove a user", () => {
      let userId = "1",
        user = users.removeUser(userId);

      expect(user.id).toBe(userId);
      expect(users.users.length).toBe(2);
    });    
})