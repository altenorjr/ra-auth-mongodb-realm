import * as Realm from "realm-web";
import BSON from "bson";

export const login = (app) => async ({ username, password }) => {
  const credentials = Realm.Credentials.emailPassword(username, password);

  const user = await app.logIn(credentials);

  return user;
};

export const logout = (app) => async () => {
  if (!app.currentUser || !app.currentUser.logOut) {
    return Promise.resolve();
  }

  const result = await app.currentUser.logOut();

  return Promise.resolve(result);
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

export const getPermissions = (app) => async (force) => {
  if (!app.currentUser) {
    return Promise.resolve({});
  }

  if (isFirstTime || force) {
    try {
      await app.currentUser.refreshAccessToken();
    } catch (err) {
      console.warn(err);
    }

    isFirstTime = false;
  }

  const data = BSON.EJSON.deserialize((app.currentUser || {}).customData || {});

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
