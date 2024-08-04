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
import SignUp from './components/SignUp.jsx'
import SignIn from './components/SignIn.jsx'

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
  },
  {
    path: 'sign-up',
    element: <SignUp />
  },
  {
    path: 'sign-in',
    element: <SignIn />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Header />
      <Toaster />
      <RouterProvider router={router} />
  </React.StrictMode>
)