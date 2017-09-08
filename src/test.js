describe('just a test', function () {
    it('test shwoName', function () {
        var data = 'liuhui';
        var result = 'name:liuhui';
        expect(result).toEqual(showName(data))
    })
})