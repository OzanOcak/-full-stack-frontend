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
