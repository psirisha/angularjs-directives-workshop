(function(){

    'use strict';
    
    var $ = require('jquery');
    require('angular');
    
    angular.module('myApp').controller('MyController', MyController);

    MyController.$inject = ['$scope'];

    function MyController($scope) {
        $scope.actors = [{
                name: 'Amit Khan',
                age: 48
            }, {
                name: 'Salman Khan',
                age: 51
            }, {
                name: 'Shahrukh Khan',
                age: 47
            }, {
                name: 'Irfan Khan',
                age: 49
            }, {
                name: 'Saif ALi Khan',
                age: 55
            }];

        $scope.add = function() {
            $scope.actors.push({name: 'Naya Khan', age: 29});
        }

        $scope.remove = function() {
            $scope.actors.length--;
        }
    }

    angular.module('myApp').directive('actorList', ActorListDirective);

    ActorListDirective.$inject = ['$compile'];

    function ActorListDirective($compile) {
        return {
            restrict: 'A',
            transclude: 'element',
            link: function(scope, el, attrs, ctrl, transclude) {
                ActorListDirectiveLink($compile, scope, el, attrs, ctrl, transclude);
            }
        };
    }

    function ActorListDirectiveLink($compile, scope, el, attrs, ctrl, transclude) {
        var pieces = attrs.actorList.split(' ');
        var itemString = pieces[0];
        var collectionName = pieces[2];
        var elements = [];
        
        scope.$watchCollection(collectionName, function(collection) {
            if( elements.length > 0) {
                for(var i = 0; i < elements.length; i++) {
                    elements[i].el.remove();
                    elements[i].scope.$destroy();
                }
                elements = [];
            }

            for( var i =0; i < collection.length; i++ ) {
                var childScope = scope.$new();
                childScope[itemString] = collection[i];
                transclude(childScope, function(clone){
                    var template = $compile('<div class="panel panel-primary"><div class="panel-heading">{{' + itemString +'.name}}</div><div class="panel-body" /></div>')
                    var wrapper = template(childScope);
                    $(wrapper).find(".panel-body").append(clone);
                    
                    $(el).before(wrapper);
                    var item = {};
                    item.el = wrapper;
                    item.scope = childScope;
                    elements.push(item);
                });
            }
        });
    }

    
})();