var app = angular.module('h20', ['ui.router'])
  .config(MainRouter)

function MainRouter($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state("mainPage", {
      url: "/",
      templateUrl: "views/pages/main.html"
      // controller: "MainController",
      // controllerAs: 'main'
    })
}
