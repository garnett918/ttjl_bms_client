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
    $scope.search = function(){
        $state.go('app.assetmanage.fixedassetmanage',{search:$scope.search_context});
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
