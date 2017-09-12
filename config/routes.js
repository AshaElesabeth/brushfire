module.exports.routes = {

  /*************************************************************
   * JSON API                                                  *
   *************************************************************/

  'PUT /login': 'UserController.login',
  'GET /logout': 'UserController.logout',
  'GET /video': 'VideoController.find',
  'POST /video': 'VideoController.create',
  'POST /user/signup': 'UserController.signup',
  'PUT /user/removeProfile/:id': 'UserController.removeProfile',
  'PUT /user/restoreProfile': 'UserController.restoreProfile',
  'PUT /user/restoreGravatarURL': 'UserController.restoreGravatarURL',
  'PUT /user/updateProfile/:id': 'UserController.updateProfile',
  'PUT /user/changePassword': 'UserController.changePassword',
  'GET /user/adminUsers': 'UserController.adminUsers',
  'PUT /user/updateAdmin/:id': 'UserController.updateAdmin',
  'PUT /user/updateBanned/:id': 'UserController.updateBanned',
  'PUT /user/updateDeleted/:id': 'UserController.updateDeleted',


  /*************************************************************
   * Server-rendered HTML Pages                                *
   *************************************************************/

  'GET /': 'PageController.showHomePage',  

  'GET /videos': 'PageController.showVideosPage',

  'GET /administration': 'PageController.showAdminPage',

  'GET /profile': 'PageController.showProfilePage',

  'GET /edit-profile': 'PageController.showEditProfilePage',

  'GET /restore-profile': 'PageController.showRestorePage',

  'GET /signup': 'PageController.showSignupPage',
};

