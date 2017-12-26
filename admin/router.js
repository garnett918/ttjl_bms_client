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
              .state('app.spacemanage.loopmanage', {
                  url: '/loopmanage',
                  templateUrl: 'admin/spacemanage/loopmanage.html',
                  ncyBreadcrumb: {
                    parent:'app.spacemanage.menu',
                    label: '回路管理',
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