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
