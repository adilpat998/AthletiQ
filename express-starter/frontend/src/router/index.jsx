import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home';
import WorkoutPage from '../components/WorkoutPage'; // Import your new WorkoutPage component
import CreateWorkoutPage from '../components/CreateWorkoutPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      
      {
        path: "workout/:id",  
        element: <WorkoutPage />,  
      },
      {
        path: "create-workout",  
        element: <CreateWorkoutPage />,  
      },
    ],
  },
]);
