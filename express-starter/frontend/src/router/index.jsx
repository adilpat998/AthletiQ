import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home';
import WorkoutPage from '../components/WorkoutPage'; // Import your new WorkoutPage component
import CreateWorkoutPage from '../components/CreateWorkoutPage';
import EditWorkoutPlan from '../components/EditWorkoutPlan';
import StaticWorkoutPage from '../components/StaticWorkoutPage';

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
      {
        path: "edit-workout/:id",  
        element: <EditWorkoutPlan />,  
      },
      {
        path: "/static-workout/:id",  
        element: <StaticWorkoutPage />,  
      },
    ],
  },
]);
