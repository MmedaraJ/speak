const UserController = require('../controllers/user.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = function(app){
    app.post('/api/user/login', UserController.login);
    app.post('/api/user/logout', UserController.logout);
    app.get('/api/users', UserController.getAllUsers);
    app.post('/api/users/new', UserController.createUser);
    //authenticate home page
    /* app.get('/api/products', authenticate, ProductController.getAllProducts);
    app.put('/api/products/update/:id', ProductController.updateProduct); */
}