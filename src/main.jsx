import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip/page.jsx'
import ViewTrip from './view-trip/[tripId]/page.jsx'
import MyTrips from './my-trips/page.jsx'
import Header from './components/Header.jsx'
import { Toaster } from 'react-hot-toast'
// import { GoogleOAuthProvider } from '@react-oauth/google'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />
  },
  {
    path: '/view-trip/:tripId',
    element: <ViewTrip />
  },
  {
    path: 'my-trips',
    element: <MyTrips />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOOGLE_AUTH_CLIENT_ID}> */}
      <Header />
      <Toaster />
      <RouterProvider router={router} />
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>
)