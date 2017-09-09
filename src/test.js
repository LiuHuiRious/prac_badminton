describe('just a test', function () {
    it('test shwoName', function () {
        var data = 'liuhui';
        var result = 'name:liuhui';
        expect(result).toEqual(showName(data))
    })
})
describe('Badminton', function () {
    it("when given wrong string should throw Exception" , function () {
        var data = 'asd asdasdasd';
        var result = 'Error: the booking is invalid';
        expect(result).toEqual(createOder(data))
    })
    it('when given not whole hour should throw Exception', function () {
        var data = 'U234 2016-06-02 09:20~10:01 A';
        var result = 'Error: the booking is invalid';
        expect(result).toEqual(createOder(data))
    })
    it('when given the whole hour should return Success: the booking is accepted', function () {
        var data = 'U234 2016-06-02 09:00~10:00 A';
        var result = 'Success: the booking is accepted';
        expect(result).toEqual(createOder(data))
    })
    it('when given the same order should throw Exception', function () {
        var data = 'U234 2016-06-02 20:00~22:00 A';
        var result = 'Error: the booking is invalid';
        expect(result).toEqual(createOder(data));
    })

})