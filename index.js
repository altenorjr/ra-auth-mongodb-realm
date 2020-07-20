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
    const logOut = (app.currentUser || {}).logOut;

    if (typeof logOut !== "function") {
      return Promise.resolve();
    }

    await (app.currentUser || {}).logOut();

    return Promise.resolve();
  } catch (err) {
    console.log(err.message);

    return Promise.resolve();
  }
};

export const checkAuth = (app) => async () => {
  if (app.currentUser) {
    return Promise.resolve();
  }

  return Promise.reject();
};

export const checkError = (app) => (error) => {
  const status = error.statusCode;
  if (status === 401) {
    return Promise.reject();
  }
  return Promise.resolve();
};

let isFirstTime = true;

export const getPermissions = (app) => async () => {
  if (!app.currentUser) {
    return Promise.reject();
  }

  if (isFirstTime) {
    await app.currentUser.refreshAccessToken();

    isFirstTime = false;
  }

  return Promise.resolve(app.currentUser.customData);
};

export default (app, overrides = {}) => ({
  login: login(app),
  logout: logout(app),
  checkAuth: checkAuth(app),
  checkError: checkError(app),
  getPermissions: getPermissions(app),
  ...overrides,
});
