import * as Realm from "realm-web";

export const login = async ({ username, password }) => {
  const credentials = Realm.Credentials.emailPassword(username, password);

  try {
    // Authenticate the user
    const user = await app.logIn(credentials);

    return user;
  } catch (err) {
    console.error("Falha no Login", err);
  }
};

export const logout = async () => {
  try {
    await (app.currentUser || {}).logOut();
  } catch (err) {
    console.log(err.message);
  }
};

export const checkAuth = async () => {
  const currentUser = app.currentUser;

  return currentUser ? Promise.resolve() : Promise.reject();
};

export const checkError = (error) => {
  const status = error.statusCode;
  if (status === 401) {
    return Promise.reject();
  }
  return Promise.resolve();
};

export const getPermissions = async () =>
  (app.currentUser || {}).customData || {};

export default (app, overrides = {}) => ({
  login,
  logout,
  checkAuth,
  checkError,
  getPermissions,
  ...overrides,
});
