'use strict';

app.controller('DeviceFileViewController', function($scope, $resource,$stateParams,$modal,$state) {
    //查询
    $scope.query = function(page,filter){
        var $com = $resource($scope.app.host + "/devicefile/?page=:page&search=:filter",{page:'@page',filter:'@filter'});
        if(!page){
            page=1;
        }else{
            page=parseInt(page);
        }
        $com.get({page:page,filter:filter},function(data){
            //扩展分页数据，显示页签，最终效果为  < 1 2 3 4 5 >
            data.page_index = page;
            data.pages = [];    //页签表
            var N = 5;          //每次显示5个页签
            var s = Math.floor(page/N)*N;
            if(s==page)s-=N;
            s += 1;
            var e = Math.min(data.page_count,s+N-1)
            for(var i=s;i<=e;i++)
                data.pages.push(i)
            $scope.data = data;
            $scope.search_context = filter;
        });
    }
    //搜索跳转
    $scope.search = function(obj){
        $scope.query(1,obj.search);
    }
    //分页跳转
    $scope.paging = function(obj){
        $scope.query(obj.page,obj.search);
    }
    //分页跳转
    $scope.setdbid = function(obj){
        angular.element("#dbidhidden").val(obj.dbid);
        angular.element("#forgectrl").click();
        //angular.element("#propset").click();
    }
    //根据url参数（分页、搜索关键字）查询数据
    $scope.query($stateParams.page,$stateParams.search);
});



app.controller('DailyMaintenanceController', function($scope, $resource,$stateParams,$modal,$state) {


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };

    /* event source that contains custom events on the scope */
    $scope.events = [
      {title:'电力设备点检', start: new Date(y, m, d, 9, 0, 0), className: ['b-l b-2x b-info'], location:'天津',param:8733, info:'电力设备点检'},
      {title:'安全设备点检', start: new Date(y, m, d+3, 11, 0, 0), className: ['b-l b-2x b-info'], location:'天津',param:15056, info:'安全设备点检'},
      {title:'监控设备点检', start: new Date(y, m, d+1, 14, 0, 0), className: ['b-l b-2x b-info'], location:'天津',param:15113, info:'监控设备点检'}
    ];

    /* alert on dayClick */
    $scope.precision = 400;
    $scope.lastClickTime = 0;
    $scope.alertOnEventClick = function( date, jsEvent, view ){
      var time = new Date().getTime();
      if(time - $scope.lastClickTime <= $scope.precision){
          $scope.events.push({
            title: 'New Event',
            start: date,
            className: ['b-l b-2x b-info']
          });
      }
      $scope.lastClickTime = time;
    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    $scope.overlay = $('.fc-overlay');
    $scope.alertOnMouseOver = function( event, jsEvent, view ){
      $scope.event = event;
      $scope.overlay.removeClass('left right').find('.arrow').removeClass('left right top pull-up');
      var wrap = $(jsEvent.target).closest('.fc-event');
      var cal = wrap.closest('.calendar');
      var left = wrap.offset().left - cal.offset().left;
      var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
      if( right > $scope.overlay.width() ) { 
        $scope.overlay.addClass('left').find('.arrow').addClass('left pull-up')
      }else if ( left > $scope.overlay.width() ) {
        $scope.overlay.addClass('right').find('.arrow').addClass('right pull-up');
      }else{
        $scope.overlay.find('.arrow').addClass('top');
      }
      (wrap.find('.fc-overlay').length == 0) && wrap.append( $scope.overlay );
    }

    /* alert on Resize */
    $scope.alertOnEventClick1 = function(event, delta, revertFunc, jsEvent, ui, view){
       // $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
       //alert(event.start);
       angular.element("#dbidhidden").val(event.param);
       angular.element("#forgectrl").click();
    };

    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 550,
        editable: false,
        lang:'zh-cn',
        locale: 'zh-cn',
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
        defaultView:'agendaWeek',
        slotLabelFormat:'h:mma',
        views: {
            day: {
                titleFormat: 'YYYY年MM月DD日'
            },
            week: {
                titleFormat: 'YYYY年MM月'
            },
            month: { // name of view
                titleFormat: 'YYYY年MM月'
            },
            agendaDay: {
                titleFormat: 'YYYY年MM月'
            },
            agendaWeek: { // name of view
                titleFormat: 'YYYY年MM月'
            },
        },
        timeFormat: 'HH:mm',
        dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"], 
        monthNames: [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],  
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],  
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],  
        dayClick: $scope.alertOnResize,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventClick: $scope.alertOnEventClick1,
        eventMouseover: $scope.alertOnMouseOver
      }
    };
    
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'New Event',
        start: new Date(y, m, d),
        className: ['b-l b-2x b-info']
      });
    };

    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };

    /* Change View */
    $scope.changeView = function(view, calendar) {
      $('.calendar').fullCalendar('changeView', view);
    };

    $scope.today = function(calendar) {
      $('.calendar').fullCalendar('today');
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events];

});


app.controller('EmergencyMaintenanceController', function($scope, $resource,$stateParams,$modal,$state) {
    //查询
    $scope.query = function(page,filter){
        var $com = $resource($scope.app.host + "/devicefile/?page=:page&search=:filter",{page:'@page',filter:'@filter'});
        if(!page){
            page=1;
        }else{
            page=parseInt(page);
        }
        $com.get({page:page,filter:filter},function(data){
            //扩展分页数据，显示页签，最终效果为  < 1 2 3 4 5 >
            data.page_index = page;
            data.pages = [];    //页签表
            var N = 5;          //每次显示5个页签
            var s = Math.floor(page/N)*N;
            if(s==page)s-=N;
            s += 1;
            var e = Math.min(data.page_count,s+N-1)
            for(var i=s;i<=e;i++)
                data.pages.push(i)
            $scope.data = data;
            $scope.search_context = filter;
        });
    }
    //搜索跳转
    $scope.search = function(obj){
        $scope.query(1,obj.search);
    }
    //分页跳转
    $scope.paging = function(obj){
        $scope.query(obj.page,obj.search);
    }
    //分页跳转
    $scope.setdbid = function(obj){
        angular.element("#dbidhidden").val(obj.dbid);
        angular.element("#forgectrl").click();
        //angular.element("#propset").click();
    }
    //根据url参数（分页、搜索关键字）查询数据
    $scope.query($stateParams.page,$stateParams.search);
});
