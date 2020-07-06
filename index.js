import * as Realm from "realm-web";

export const login = (app) => async ({ username, password }) => {
  const credentials = Realm.Credentials.emailPassword(username, password);

  try {
    // Authenticate the user
    const user = await app.logIn(credentials);

    return user;
  } catch (err) {
    console.error("Falha no Login", err);
  }
};

export const logout = (app) => async () => {
  try {
    await (app.currentUser || {}).logOut();
  } catch (err) {
    console.log(err.message);
  }
};

export const checkAuth = (app) => async () => {
  if (!app.currentUser) {
    return Promise.reject();
  }

  return app.currentUser.refreshAccessToken();
};

export const checkError = (app) => (error) => {
  const status = error.statusCode;
  if (status === 401) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const getPermissions = (app) => async () =>
  (app.currentUser || {}).customData || {};

export default (app, overrides = {}) => ({
  login: login(app),
  logout: logout(app),
  checkAuth: checkAuth(app),
  checkError: checkError(app),
  getPermissions: getPermissions(app),
  ...overrides,
});
