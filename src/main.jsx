import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout.jsx';
import App from './App.jsx';
import CreateTrip from './create-trip/page.jsx';
import ViewTrip from './view-trip/[tripId]/page.jsx';
import MyTrips from './my-trips/page.jsx';
import SignUp from './components/SignUp.jsx';
import SignIn from './components/SignIn.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: '/create-trip',
    element: (
      <Layout>
        <CreateTrip />
      </Layout>
    ),
  },
  {
    path: '/view-trip/:tripId',
    element: (
      <Layout>
        <ViewTrip />
      </Layout>
    ),
  },
  {
    path: '/my-trips',
    element: (
      <Layout>
        <MyTrips />
      </Layout>
    ),
  },
  {
    path: '/sign-up',
    element: (
      <Layout>
        <SignUp />
      </Layout>
    ),
  },
  {
    path: '/sign-in',
    element: (
      <Layout>
        <SignIn />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>
);