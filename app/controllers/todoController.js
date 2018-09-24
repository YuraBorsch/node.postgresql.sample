var app = angular.module('todoApp', ['ngResource']);

// inject the Todo service factory into our controller
app.controller('todoController', ['$scope', '$resource', function($scope, $resource) {

    $scope.loading = false;
    $scope.message = "Hi there";
    $scope.todos = [];

    var Todo = $resource('http://localhost:8000/api/todos/:todoId', {todoId:'@id'}, {update: {method: 'PUT'}});

    Todo.get({todoId:1}, function(data) {
        $scope.todo = data;
    }, function(err) {
        console.log("Todo.get() error : "+err);
    });


    Todo.query(function(todos) {
        // success
        $scope.message = "2nd hello";
        $scope.todos = todos;
    });


    // GET =====================================================================
    // when landing on the page, get all todos and show them
    // use the service to get all the todos


    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {

        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.title != undefined) {
            $scope.loading = true;

            // call the create function from our service (returns a promise object)
            Todo.save($scope.formData,function(data) {

                // if successful creation, call our get function to get all the new todos
                $scope.loading = false;
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos.push(data); // assign our new list of todos
            });
        }
    };

    // DELETE ==================================================================
    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $scope.loading = true;

        Todo.remove({'id': id},function(data) {
                $scope.loading = false;
                //$scope.todos = data; // assign our new list of todos
            });
    };
}]);


