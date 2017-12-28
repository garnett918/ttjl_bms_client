'use strict';

app.controller('AMFixedAssetManageController', function($scope, $resource,$stateParams,$modal,$state) {
    //查询
    $scope.query = function(page,filter){
        var $com = $resource($scope.app.host + "/fixedasset/?page=:page&search=:filter",{page:'@page',filter:'@filter'});
        if(!page){
            page=1;
        }else{
            page=parseInt(page);
        }
        $com.get({page:page,filter:filter},function(data){
            //扩展分页数据，显示页签，最终效果为  < 1 2 3 4 5 >
            data.page_index = page;
            data.pages = [];    //页签表
            var N = 4;          //每次显示5个页签
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
        //$state.go('app.assetmanage.fixedassetmanage',{search:$scope.search_context});
        //alert("$stateParams.page"+$stateParams.page);
        //alert("$stateParams.search"+obj.search);
        $scope.query(1,obj.search);
    }
    //分页跳转
    $scope.paging = function(obj){
        //$state.go('app.assetmanage.fixedassetmanage',{search:$scope.search_context});
        //alert("$stateParams.page"+page.page);
        //alert("$stateParams.search"+page.search);
        $scope.query(obj.page,obj.search);
    }
    //分页跳转
    $scope.setdbid = function(obj){
        //$state.go('app.assetmanage.fixedassetmanage',{search:$scope.search_context});
        //alert("$stateParams.page"+obj);
        //alert("$stateParams.search"+obj.dbid);
        //$scope.dbid_hidden = obj.dbid;
        //$scope.search_context = obj.dbid;
        angular.element("#dbidhidden").val(obj.dbid);
        angular.element("#forgectrl").click();
        angular.element("#propset").click();
        //var ui =angular.element("#propdiv");
        //ui.style.display="true";
    }
    //全选
    var selected = false;
    $scope.selectAll = function(){
        selected = !selected;
        angular.forEach($scope.data.results,function(item){
            item.selected = selected;
        });
    }
    //自定义操作处理，其中1为删除所选记录
    $scope.exec = function(){

    }
    //根据url参数（分页、搜索关键字）查询数据
    $scope.query($stateParams.page,$stateParams.search);
});


app.controller('AMFAMPropertiesController', function($scope, $resource,$stateParams,$modal,$state) {
    //查询
    $scope.query = function(page,filter){
    var prophidden =  angular.element("#prophidden").val();
    //alert("prophidden  "+prophidden);
        if(!page){
            page=1;
        }else{
            page=parseInt(page);
        }
        var proparr=prophidden.split(','); 
        if(proparr.length>1)
        {
            var PAGE_SIZE=4;
            var limit = PAGE_SIZE;
            var offset = PAGE_SIZE*(page-1);
            var total_count = proparr.length-1;
            var page_count = Math.floor(total_count/PAGE_SIZE);
            if(total_count%PAGE_SIZE>0){
                page_count++;
            }

            var data1 = {
                total_count:total_count,
                page_count:page_count,
                next:page<page_count,
                previous:page>1,
                results:[],
            }

            data1.page_index = page;
            data1.pages = [];    //页签表
            var N = 4;          //每次显示5个页签
            var s = Math.floor(page/N)*N;
            if(s==page)s-=N;
            s += 1;
            var e = Math.min(data1.page_count,s+N-1)
            for(var i=s;i<=e;i++)
                data1.pages.push(i)

            for(var i=offset;i<(offset+limit);i++)
            {

                if(i<proparr.length)
                {
                    var propitem = proparr[i];
                     //alert(propitem);
                    var propitemarr=propitem.split('###'); 
                    //var propstr = '{value:'+propitemarr[0]+',name:'+propitemarr[1]+'}';
                    var propstr = {value:propitemarr[1],name:propitemarr[0]};
                    data1.results.push(propstr); 
                }
            }
            

            // data.results = [{
            //         value:1,
            //         name:"灯箱"
            //     },
            //     {
            //         value:2,
            //         name:"灯箱1"
            //     },{
            //         value:3,
            //         name:"灯箱2"
            //     },{
            //         value:6,
            //         name:"灯箱5"
            //     }
            //     ];

            $scope.data1 = data1;
        }


    }
    //搜索跳转
    $scope.search = function(obj){
        //$state.go('app.assetmanage.fixedassetmanage',{search:$scope.search_context});
        //alert("$stateParams.page"+$stateParams.page);
        //alert("$stateParams.search"+obj.search);
        $scope.query(1,obj.search);
    }
    //分页跳转
    $scope.paging = function(obj){
        //$state.go('app.assetmanage.fixedassetmanage',{search:$scope.search_context});
        //alert("$stateParams.page"+page.page);
        //alert("$stateParams.search"+page.search);
        $scope.query(obj.page,obj.search);
    }
    //根据url参数（分页、搜索关键字）查询数据
    $scope.query($stateParams.page,$stateParams.search);
});
