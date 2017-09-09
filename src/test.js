describe('just a test', function () {
    it('test shwoName', function () {
        var data = 'liuhui';
        var result = 'name:liuhui';
        expect(result).toEqual(showName(data))
    })
})
describe('booking:if the input string not has the right length', function () {
    it("test the input string's length" , function () {
        var data = 'asd asdasdasd';
        var result = 'Error: the booking is invalid';
        expect(result).toEqual(createOder(data))
    })
})