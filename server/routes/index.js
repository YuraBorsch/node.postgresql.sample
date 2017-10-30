const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;
const usersController = require('../controllers').users;
const authController = require('../controllers').auth;


module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  app.post('/api/todos', todosController.create);
  app.get('/api/todos', todosController.list);
  app.post('/api/todos/:todoId/items', todoItemsController.create);
  app.get('/api/todos/:todoId', todosController.retrieve);
  app.put('/api/todos/:todoId', todosController.update);
  // user endpoints
  app.get('/api/users/:userId', authController.isAuthenticated, usersController.get);
  app.get('/api/users', authController.isAuthenticated, usersController.getAll);
  app.put('/api/users/:userId', authController.isAuthenticated, usersController.update);
  app.post('/api/users', authController.isAuthenticated, usersController.create);
};