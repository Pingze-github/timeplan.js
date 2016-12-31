// 用于测试timeplan.js

var Timeplan = require('./timeplan.js');

var task_list = [ //任务列表
    {
        time: "now" //时间
        ,code: "console.log('task-01')" //eval()执行的代码
    }
    ,{
        time: {"hour":20, "minute":34}
        ,code: "console.log('task-02')"
    }
    ,{
        time: {"hour":8, "minute":0}
        ,code: "console.log('task-03')"
        ,done: "never" //多次执行：每天8:00执行
    }
];

var time_finish = {"hour":"23", "minute":"13"} //结束时间

var timeplan = Timeplan.Timeplan(task_list,time_finish); //创建对象
timeplan.start(); //启动
setTimeout(function(){
    timeplan.finish(); //手动结束
},5000);

