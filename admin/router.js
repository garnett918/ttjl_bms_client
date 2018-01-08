'use strict';

app
  .run(
      function ($rootScope,   $state,   $stateParams,$localStorage,$http) {
		  $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.auth;
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
          $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
            $rootScope.previousState = from;
            $rootScope.previousStateParams = fromParams;
          });
	}
  )
.config(
      function ($stateProvider,   $urlRouterProvider) {
          $urlRouterProvider
              .otherwise('/auth/loading');
          $stateProvider
              .state('auth',{
                  abstract: true,
                  url:'/auth',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('admin/auth/ctrl.js');
                      }]
                  }
              })
              .state('auth.loading',{
                  url:'/loading',
                  templateUrl:'admin/auth/loading.html',
              })
              .state('auth.login',{
                  url:'/login',
                  templateUrl:'admin/auth/login.html',
              })
		  
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'admin/app.html',
              })
              .state('app.dashboard', {
                  url: '/dashboard',
                  templateUrl: 'admin/dashboard.html',
                  ncyBreadcrumb: {
                    label: '<i class="fa fa-home"></i> 首页'
                  }
              })
              .state('app.news', {
                  abstract: true,
                  url: '/news',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('admin/news/ctrl.js');
                      }]
                  }
              })
              .state('app.news.list', {
                  url: '/list?page&search',
                  templateUrl: 'admin/news/list.html',
                  ncyBreadcrumb: {
                    parent:'app.dashboard',
                    label: '新闻列表',
                  }
              })
              .state('app.news.detail', {
                  url: '/detail/{id}',
                  templateUrl: 'admin/news/detail.html',
                  ncyBreadcrumb: {
                    parent:'app.news.list',
                    label: '编辑',
                  }
			  })
              .state('app.news.create', {
                  url: '/create',
                  templateUrl: 'admin/news/detail.html',
                  ncyBreadcrumb: {
                    parent:'app.news.list',
                    label: '新增',
                  }
              })
              .state('app.spacemanage', {
                  abstract: true,
                  url: '/spacemanage',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('admin/spacemanage/ctrl.js');
                      }]
                  }
              })
              .state('app.spacemanage.menu', {
                  ncyBreadcrumb: {
                    parent:'app.dashboard',
                    label: '空间管理',
                  }
              })
              .state('app.spacemanage.view', {
                  url: '/view',
                  templateUrl: 'admin/spacemanage/view.html',
                  ncyBreadcrumb: {
                    parent:'app.spacemanage.menu',
                    label: '空间区域管理',
                  }
              })
              .state('app.spacemanage.loopmanage', {
                  url: '/loopmanage',
                  templateUrl: 'admin/spacemanage/loopmanage.html',
                  ncyBreadcrumb: {
                    parent:'app.spacemanage.menu',
                    label: '回路管理',
                  }
              })
              .state('app.assetmanage', {
                  abstract: true,
                  url: '/assetmanage',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('admin/assetmanage/ctrl.js');
                      }]
                  }
              })
              .state('app.assetmanage.menu', {
                  ncyBreadcrumb: {
                    parent:'app.dashboard',
                    label: '资产管理',
                  }
              })
              .state('app.assetmanage.fixedassetmanage', {
                  url: '/list?page&search',
                  templateUrl: 'admin/assetmanage/fixedassetmanage.html',
                  ncyBreadcrumb: {
                    parent:'app.assetmanage.menu',
                    label: '固定资产管理',
                  }
              })
              .state('app.operationmanage', {
                  abstract: true,
                  url: '/operationmanage',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('admin/operationmanage/ctrl.js');
                      }]
                  }
              })
              .state('app.operationmanage.menu', {
                  ncyBreadcrumb: {
                    parent:'app.dashboard',
                    label: '运维管理',
                  }
              })
              .state('app.operationmanage.devicefile', {
                  url: '/dflist?page&search',
                  templateUrl: 'admin/operationmanage/devicefile.html',
                  ncyBreadcrumb: {
                    parent:'app.operationmanage.menu',
                    label: '设备档案',
                  }
              })
              .state('app.operationmanage.dailymaintenance', {
                  url: '/dmlist?page&search',
                  templateUrl: 'admin/operationmanage/dailymaintenance.html',
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            ['vendor/jquery/fullcalendar/fullcalendar.css',
                              'vendor/jquery/fullcalendar/theme.css',
                              'vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                              'vendor/libs/moment.min.js',
                              'vendor/jquery/fullcalendar/fullcalendar.min.js']
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  },
                  ncyBreadcrumb: {
                    parent:'app.operationmanage.menu',
                    label: '设备日常维护',
                  }
              })
              .state('app.operationmanage.emergencymaintenance', {
                  url: '/emlist?page&search',
                  templateUrl: 'admin/operationmanage/emergencymaintenance.html',
                  ncyBreadcrumb: {
                    parent:'app.operationmanage.menu',
                    label: '设备应急报修',
                  }
              })
              .state('app.intelligentmonitor', {
                  abstract: true,
                  url: '/intelligentmonitor',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('admin/intelligentmonitor/ctrl.js');
                      }]
                  }
              })
              .state('app.intelligentmonitor.menu', {
                  ncyBreadcrumb: {
                    parent:'app.dashboard',
                    label: '智能监控',
                  }
              })
              .state('app.intelligentmonitor.devicemonitor', {
                  url: '/dmlist?page&search',
                  templateUrl: 'admin/intelligentmonitor/devicemonitor.html',
                  ncyBreadcrumb: {
                    parent:'app.intelligentmonitor.menu',
                    label: '设备监控',
                  }
              })
              .state('app.intelligentmonitor.environmentalmonitor', {
                  url: '/emlist?page&search',
                  templateUrl: 'admin/intelligentmonitor/environmentalmonitor.html',
                  ncyBreadcrumb: {
                    parent:'app.intelligentmonitor.menu',
                    label: '环境监测',
                  }
              })
              .state('app.intelligentmonitor.energyefficiencymonitor', {
                  url: '/eemlist?page&search',
                  templateUrl: 'admin/intelligentmonitor/energyefficiencymonitor.html',
                  ncyBreadcrumb: {
                    parent:'app.intelligentmonitor.menu',
                    label: '能耗监测',
                  }
              })


              .state('app.operationalanalysis', {
                  abstract: true,
                  url: '/operationalanalysis',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('admin/operationalanalysis/ctrl.js');
                      }]
                  }
              })
              .state('app.operationalanalysis.menu', {
                  ncyBreadcrumb: {
                    parent:'app.dashboard',
                    label: '运营分析',
                  }
              })
              .state('app.operationalanalysis.statisticalreports', {
                  url: '/dmlist?page&search',
                  templateUrl: 'admin/operationalanalysis/statisticalreports.html',
                  ncyBreadcrumb: {
                    parent:'app.operationalanalysis.menu',
                    label: '统计图表',
                  }
              })

		}
  );

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})
app.factory('AuthInterceptor', function ($rootScope, $q,$location) {
  return {
    responseError: function (response) {
        if(response.status==401)
        {
            $location.url('/auth/login');
        }
      return $q.reject(response);
    }
  };
})