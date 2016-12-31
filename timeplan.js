// timeplan.js
// author: Pingze-github


exports.Timeplan =  function(task_list,time_finish=null,delay=5000){
    var timeplan = {};
    timeplan.init = function(){
        timeplan.task_list = task_list; //任务列表
        timeplan.report_delay = delay; //报时间隔，为0表示不报时
        timeplan.ifContinue = true; //初始化标志位
        for (var key in timeplan.task_list){ //添加done属性
            var task = timeplan.task_list[key];
            if (task.done!="never"){
                task.done = false;
            }
        }
        console.log(timeplan.task_list); //显示时间计划
        timeplan.last_date = new Date();
        console.log("[timeplan.js] "+timeFormat(timeplan.last_date)); //时间初始化
    }
    function timeFormat(date) {
        var fmt="yyyy/MM/dd hh:mm:ss"; //默认格式
        var o = {
            "M+": date.getMonth()+1, //月份(补足) 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    timeplan.start = function(){
        setTimeout(function(){
            console.log("[timeplan.js] 开始计时");
            function rec(){ //定时递归
                var date = new Date();
                //时间显示（间隔）
                if (timeplan.report_delay != "0"){
                    if (date.getTime() - timeplan.last_date.getTime() > timeplan.report_delay){
                        console.log("[timeplan.js] "+timeFormat(date));
                        timeplan.last_date = date;
                    }
                }
                //生成时间对象
                var time_now = {
                    "hour" : date.getHours()
                    ,"minute" : date.getMinutes()
                    ,"day" : date.getDay()
                    ,"month" : date.getMonth()
                    ,"second" : date.getSeconds()
                    //,"year" : date.year 不支持制定到年
                    //,"microsecond" : date.microsecond 不支持指定到毫秒
                }
                //结束检测
                var isAllDone = true; //任务完成结束计时
                for (var key in timeplan.task_list){
                    if (timeplan.task_list[key].done === false){
                        isAllDone = false;
                    }
                }
                if (isAllDone === true){
                    console.log("[timeplan.js] 全部任务结束，结束计时");
                    timeplan.ifContinue = false;
                }
                if (time_finish){
                    var isSameTime = true; //到达预定结束时间结束计时
                    for (var key in time_finish){
                        if (time_now[key] != time_finish[key]){
                            isSameTime = false;
                        }
                    }
                    if (isSameTime === true){
                        console.log("[timeplan.js] 到达预定结束时间，结束计时");
                        timeplan.ifContinue = false;
                    }
                }
                //任务检测
                for (var key in timeplan.task_list){ 
                    var task = timeplan.task_list[key];
                    if (task.done === false || task.done == "never"){
                        if (task.time == "now"){
                            console.log("[timeplan.js] 立即任务开始执行");
                            var code = task.code;
                            setTimeout(function(){ //异步 运行时task已不是所需要的
                                eval(code);
                            },0);
                            if (task.done!="never"){
                                task.done = true;
                            }
                        }else{
                            var isSameTime = true;
                            var time = task.time;
                            for (var key in time){
                                if (time_now[key] != time[key]){
                                    isSameTime = false
                                }
                            }
                            if (isSameTime === true){
                                console.log("[timeplan.js] 定时任务开始执行");
                                var code = task.code;
                                setTimeout(function(){
                                    eval(task.code);
                                },0);
                                if (task.done!="never"){
                                    task.done = true;
                                }
                            }
                        }
                    }
                }
                //递归
                if (timeplan.ifContinue === true){
                    setTimeout(function(){
                        rec();
                    },100);
                }
            }
            rec();
        },0);
    }
    timeplan.finish = function(){
        console.log("[timeplan.js] 手动结束计时");
        timeplan.ifContinue = false;
    }
    timeplan.init(); //初始化
    return timeplan;
}

