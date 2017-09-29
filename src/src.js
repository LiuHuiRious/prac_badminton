var feeStandard = {
    normal:
    {
        time:[
            {begin:9,end:12,price:30},
            {begin:12,end:18,price:50},
            {begin:18,end:20,price:80},
            {begin:20,end:22,price:60}
        ],
        fee:0.5
    },
    weekend:
    {
        time:[
            {begin:9,end:12,price:40},
            {begin:12,end:18,price:50},
            {begin:18,end:22,price:60}
        ],
        fee:0.3
    }
};

var orderList = [{date:'2016-06-02',time:'20:00~22:00',place:'A',status:'ok'}];

function showName(name){
    return 'name:' + name;
}
function createOder(order) {
    var data = order.split(' ');
    if(order == ''){
        var outPutString = outPutOrder();
        console.log(orderList)
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
                if(!checkIsWholeHour(data[2])){
                    throw new CommonException();
                }
                else if(!checkOrderHasTheSame(data)){
                    throw new CommonException('Error：the booking being cancelled does not exist!');
                }
                else {
                    cancelOrder(data);
                    throw new CommonException('Success: the booking is accepted');
                }
            }
            else {
                throw new CommonException('Error: the cancel order was not right');
            }
        }
        if (data && data[0] === ''){}//防止node弹出异常错误！
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
        if(oItem.status == 'ok' && oItem.date == newOrder[1] && timeConflict && oItem.place == newOrder[3]){
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
        if(oItem.status == 'ok' && oItem.date == newOrder[1] && oItem.time == newOrder[2] && oItem.place == newOrder[3]){
            hasTheSame = true;
        }
    });
    return hasTheSame;
}
function cancelOrder(order){
    orderList.map(function (oItem, oIndex, oInput) {
        if(oItem.status=='ok' && oItem.date == order[1]&& oItem.date == order[1] && oItem.time == order[2] && oItem.place == order[3]){
            oItem.status = 'cancel';
        }
    });
}
function outPutOrder(){
    var outputString = '';
    var outputOrder = [];
    var subTotal = 0;
    var total = 0;
    orderList.map(function (oItem, oIndex, oInput) {
        outputOrder.push(oItem);
    });
    outputString += '收入汇总：\n---\n'
    outputOrder.sort(compareBy('time')).sort(compareBy('date')).sort(compareBy('place'));
    allPlace.map(function (item, index, input) {
        outputString += '场地：' + item + '\n';
        outputOrder.map(function (oItem, oIndex, oInput) {
            if(item === oItem.place){
                oItem.price = calculatePrice(oItem);
                subTotal += oItem.price;
                total += oItem.price;
                outputString += oItem.date + ' ' + oItem.time +  (oItem.status == 'cancel'?' 违约金 ' + oItem.price: ' ' + oItem.price) + '元\n';
            }
        });
        outputString += '小计：' + subTotal + '元\n\n';
        subTotal = 0;
    });
    outputString += '---\n总计：' + total + '元\n';
    return outputString
}
function calculatePrice(order){
    var price,feeType;
    var day = new Date(order.date).getDay();
    if(day>=1&&day<=5){
        feeType = 'normal'
    }
    else if (day == 0||day == 6){
        feeType = 'weekend';
    }
    return price = calculateRealPrice(order,feeType);
}
function calculateRealPrice(order,feeType){
    var time = splitTime(order.time);
    var price = 0,curTime = time.begin;
    feeStandard[feeType].time.map(function (item, index, input) {
        if(curTime>=item.begin && curTime<item.end){
            if(time.end<=item.end){
                price += item.price * (time.end - curTime);
            }
            else {
                price += item.price * (item.end - curTime);
                curTime = item.end;
            }
        }
    });
    return order.status == 'cancel' ? price*feeStandard[feeType].fee : price;
}
function compareBy(property) {
    return function (a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1.localeCompare(value2);
    }
}