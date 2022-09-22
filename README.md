# Getting Started with Create React App

```console
yarn --version
yarn create react-app frontend
yarn add react-router-dom
```

## react-router-dom

we need import react router dom components then put them _React.StrincMode_ tag in the _index.js_

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
        ...
<BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        ...
```

Layout component comes with react-router-dom which will recieve children and show them below as a layout

```javascript
<Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
```

---

```console
yarn add @fortawesome/fontawesome-svg-core  @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

in App.js,we will place another layout that we created which is _DashLayout_, so it can has children elements. we will turn DashLayout into protectec route late.

```javascript
<Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
        </Route>
        ...
```

if we browse http://localhost:3000/dash, we will see links which will be private later.

---

## redux

```console
yarn add @reduxjs/toolkit react-redux
```

We need crete apiSlice.js file app/api directories to fetch the Note and User models
we will use createApi and fetchBaseQuery redux hooks

```javascript
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
}
```

then in app directory, we will use configureStore hook and call apiSlice as a reducer

```javascript
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
```

Then wrap BrowserRouter with Provider and inject the store so state managment will be accessible in whole app

---

after completing usersApiSlice.js, User.js, UserList.js

if we run backend server, users will be fetch within the url;
http://localhost:3000/dash/users

---

just like usersApiSlice, we need create notesApiSlice to inject endpoint to query notes from db, and Note.js and NotesList.js to route

when we get http://localhost:4000/users in insomnia, we will see all the users with \_id, however we transform them id to able query them with transformResponse method of apiSlice.injectEndPoint. And id is ref in the Note model so we need to post
http://localhost:4000/notes
-d {
"user":"632322100ce3a551b5b973dc",
"title":"what's up!",
"text":"lol!!!"
}
Now we can access and fetch the data in the browser with url of
http://localhost:3000/dash/notes

---

## Auth Reducer

create authSlice under feature/auth/ directory and add it to store.js. this reducer will keep the token, once we route to /auth url.

## auth api slice

now we need a api slice to inject end point is routed to auth/login, outh/logout and auth/refresh

So far we set up most of the app and we use json web token middleware (verifyJWT.js) in the backend, in noteRoutes.js and userRoutes.js. Although we know create jwt , we dont pass it to backend in the request thus we get unauthorized respond, everytime we try to send req to backend. Note that we still can access new user page since no backend request involved in it.

---

we need to access refreh route for JWT query so we need to update apiSlice with credentials and authorization Bearer token

```javascript
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
```

since we alerady fetch url, we need to assign const baseQuery to base Query to createApi

```javascript
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
```

If we change aess token expires in 10s and refresh token 20s, when we sign in we will able to fetch notes but when access token expires it will give 403 forbidden error from jwt verification.

we need create _baseQueryWithReauth_ function whict take _fetchBaseQuery_ as an args and route to **/auth/refresh** to refrech access token and finally we should assign baseQueryWithReauth to baseQuery in createApi.

- if we login and access /dash/notes ,access token will expires within 10s and the page will not be fetched (403) but the server will be directed to /auth/refresh and will get one more access token which will expires within 10 sec. This time it will not get refresh token because it also expires in 20s.
  Note that server update every 15s
