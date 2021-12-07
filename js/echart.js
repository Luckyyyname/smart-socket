$(document).ready(function(){
    var app = {};

    var chartDom = document.getElementById('main-echart');
    var myChart = echarts.init(chartDom);
    var option;
            
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }
        },
        legend: {
            data:['实时电流量']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: (function (){
                    var now = new Date();
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                        now = new Date(now - 2000);
                    }
                    return res;
                })()
            },
            {
                type: 'category',
                boundaryGap: true,
                data: (function (){
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.push(10 - len - 1);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '电流量/A',
                max: 30,
                min: 0,
                boundaryGap: [0.2, 0.2]
            },
            {
                type: 'value',
                scale: true,
                name: '电流量/A',
                max: 30,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name: '实时电流量',
                type: 'line',
                xAxisIndex: 1,
                yAxisIndex: 1,
                color: '#3b9ff3',
                data: (function (){
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.push(0);
                    }
                    return res;
                })()
            }
        ]
    };
    
    app.count = 11;
    setInterval(function (){
        var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
    
        var data0 = option.series[0].data;
        data0.shift();
        data0.push(nowCurrent);
    
        option.xAxis[0].data.shift();
        option.xAxis[0].data.push(axisData);
        option.xAxis[1].data.shift();
        option.xAxis[1].data.push(app.count++);
    
        myChart.setOption(option);
    }, 2000);
    
    window.addEventListener("resize",function(){
        myChart.resize();
})

    option && myChart.setOption(option);
})

var nowCurrent = 0;
var ws= new WebSocket('ws://localhost:8080/imserver');
ws.onopend = function () {
    ws.send('客户端和服务器已建立连接');
}
ws.onmessage = function (res) {
    console.log('接收数据：'+res.data);
    nowCurrent = parseInt(res.data);
    $("#socket-num").text(nowCurrent);
}

window.onbeforeunload = function(){
    ws.close();
    console.log("websocket连接已关闭");
}

$('.change-button').click(function(){
    $.ajax({
        'url':"http://localhost:8080/chart/change",
        'type':'GET',
        'dataType':'json',
        'success':function(res){
            console.log("开关控制请求成功发送!")
        },
        'error':function(){
            alert("服务器请求超时，请重试！");
        }
    })
})