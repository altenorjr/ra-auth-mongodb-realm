# What?
A React-Admin Authentication Provider for MongoDB Realm

# Usage

```javascript
import buildMongoDbRealmAuthProvider from "ra-auth-mongodb-realm";

import * as Realm from "realm-web";

const app = new Realm.App({
  id: process.env.REACT_APP_REALM_APP_ID,
});

const dataProvider = buildMongoDbRealmAuthProvider(app);
```

## Overriding custom defaults

```javascript
import buildMongoDbRealmAuthProvider, {
  login // We export the individual default implementations...
} from "ra-auth-mongodb-realm";

import * as Realm from "realm-web";

const app = new Realm.App({
  id: process.env.REACT_APP_REALM_APP_ID,
});

const dataProvider = buildMongoDbRealmAuthProvider(app, {
  login: ({ username, password }) => {
    if (/*some condition*/) {
        return Promise.reject();
    }

    // ...so you can reuse it as needed
    return login({ username, password });
  }
});
```

Read more about React Admin's implementation