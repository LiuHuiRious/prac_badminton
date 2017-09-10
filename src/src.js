var feeStandard = {
    normal:
        [
            {begin:9,end:12,price:30},
            {begin:12,end:18,price:50},
            {begin:18,end:20,price:80},
            {begin:20,end:22,price:60}
        ],
    weekend:
        [
            {begin:9,end:12,price:40},
            {begin:12,end:18,price:50},
            {begin:18,end:22,price:60}
    ]
};

var orderList = [{date:'2016-06-02',time:'20:00~22:00',place:'A',status:'ok'}];

function showName(name){
    return 'name:' + name;
}
function createOder(order) {
    var data = order.split(' ');
    if(order == '\n'){
        var outPutString = outPutOrder();
        return outPutString;
    }
    try {
        if(data.length === 4){
            if(!checkIsWholeHour(data[2])){
                throw new CommonException();
            }
            else if(checkIfOrderConflict(data)){
                throw new CommonException('Error: the booking conflicts with existing bookings');
            }
            else {
                addOrderToList(data);
                throw new CommonException('Success: the booking is accepted');
            }
        }
        else if (data.length === 5){
            if(data[4] == 'C'){
                if(checkIsWholeHour(data[2]) && checkOrderHasTheSame(data)){
                    cancelOrder(data);
                    throw new CommonException('Success: the booking is accepted');
                }
                else {
                    throw new CommonException();
                }
            }
            else {
                throw new CommonException('Error: the cancel order was not right');
            }
        }
        else {
            throw new CommonException();
        }

    }
    catch (e){
        console.log(e.message);
        return(e.message);
    }
}

function CommonException(message)
{
    if(message){
        this.message = message;
    }
    else {
        this.message = 'Error: the booking is invalid';
    }
}
function addOrderToList(order){
    orderList.push({date:order[1],time:order[2],place:order[3],status:'ok'});
}
function checkIsWholeHour(time){
    var timeArr = time.split('~');
    var isWholeHour = true;
    for(var i=0; i<timeArr.length; i++){
        var splitTimeArr = timeArr[i].split(':');
        if(splitTimeArr[1] != '00'){
            isWholeHour = false;
        }
    }
    return  isWholeHour;
}
function checkIfOrderConflict(newOrder){
    var orderConflict = false;
    var timeConflict = false;
    var time = splitTime(newOrder[2]);
    orderList.map(function (oItem, oIndex, oInput) {
        var orderTime = splitTime(oItem.time);
        if((time.begin>=orderTime.begin && time.begin<orderTime.end)||(time.end>orderTime.begin && time.end<=orderTime.end)){
            timeConflict = true;
        }
        if(oItem.date == newOrder[1] && timeConflict && oItem.place == newOrder[3]){
            orderConflict = true;
        }
    });
    return orderConflict;
}
function splitTime(time){
    var timeArr = time.split('~');
    var beginHour = parseInt(timeArr[0]);
    var endOur = parseInt(timeArr[1]);
    return {begin:beginHour,end:endOur};
}
function checkOrderHasTheSame(newOrder){
    var hasTheSame = false;
    orderList.map(function (oItem, oIndex, oInput) {
        if(oItem.date == newOrder[1] && oItem.time == newOrder[2] && oItem.place == newOrder[3]){
            hasTheSame = true;
        }
    });
    return hasTheSame;
}
function cancelOrder(order){
    orderList.map(function (oItem, oIndex, oInput) {
        if(oItem.date == order[1] && oItem.time == order[2] && oItem.place == order[3]){
            orderList.push({date:order[1],time:order[2],place:order[3],status:'cancel'});
        }
    });
}
function outPutOrder(){
    var outputString = '';
    var outputOrder = [];
    orderList.map(function (oItem, oIndex, oInput) {
        outputOrder.push(oItem);
    });
    outputOrder.sort(function (a, b) {
        return a.place.charCodeAt(0)- b.place.charCodeAt(0);
    }).map(function (oItem, oIndex, oInput) {
        outputString += oItem.date + ' ' + oItem.time + '\n';
    });
    return outputString
}