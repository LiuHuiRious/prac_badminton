describe('just a test', function () {
    it('test shwoName', function () {
        var data = 'liuhui';
        var result = 'name:liuhui';
        expect(result).toEqual(showName(data))
    })
});
describe('Badminton', function () {
    it("when given wrong string should return Error: the booking is invalid" , function () {
        var data = 'asd asdasdasd';
        var result = 'Error: the booking is invalid';
        expect(result).toEqual(createOder(data))
    });
    it('when given not whole hour should return Error: the booking is invalid', function () {
        var data = 'U234 2016-06-02 09:20~10:01 A';
        var result = 'Error: the booking is invalid';
        expect(result).toEqual(createOder(data))
    });
    it('when given the whole hour should return Success: the booking is accepted', function () {
        var data = 'U234 2016-06-02 09:00~10:00 B';
        var result = 'Success: the booking is accepted';
        expect(result).toEqual(createOder(data))
    });
    it('when given the same order should return Error: the booking conflicts with existing bookings', function () {
        var data = 'U234 2016-06-02 20:00~22:00 A';
        var result = 'Error: the booking conflicts with existing bookings';
        expect(result).toEqual(createOder(data));
    });
    it('when given the wrong cancel char should return Error: the cancel order was not right', function () {
        var data = 'U234 2016-06-02 8:00~12:00 A a';
        var result = 'Error: the cancel order was not right';
        expect(result).toEqual(createOder(data));
    });
    it('when given the right cancel char should cancel this order', function () {
        var data = 'U234 2016-06-02 20:00~22:00 A C';
        var result = 'Success: the booking is accepted';
        expect(result).toEqual(createOder(data));
    });
    it('when given a empty line should output all the bookings', function () {
        var data = '\n';
        var result = '2016-06-02 20:00~22:00\n2016-06-02 20:00~22:00\n2016-06-02 09:00~10:00\n';
        expect(result).toEqual(createOder(data));
    });

})