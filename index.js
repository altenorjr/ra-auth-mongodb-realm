import * as Realm from "realm-web";
import BSON from "bson";

window.Realm = Realm;

export const login = (app) => async ({ username, password }) => {
  const credentials = Realm.Credentials.emailPassword(username, password);

  const user = await app.logIn(credentials);

  return user;
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
    console.warn(err.message);

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
    return Promise.resolve({});
  }

  if (isFirstTime) {
    try {
      await app.currentUser.refreshAccessToken();
    } catch (err) {
      return Promise.reject(err);
    }

    isFirstTime = false;
  }

  const data = BSON.EJSON.deserialize(app.currentUser.customData);

  return Promise.resolve(data);
};

export default (app, overrides = {}) => ({
  login: login(app),
  logout: logout(app),
  checkAuth: checkAuth(app),
  checkError: checkError(app),
  getPermissions: getPermissions(app),
  ...overrides,
});
