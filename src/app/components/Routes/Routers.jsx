import {
    createBrowserRouter,
    
  } from "react-router-dom";


import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import Gallery from "../Gallery/PhotoCard";
import Commete from "../Commete/Commete";
import AllEvent from "../Events/AllEvent";
import AllPhoto from "../Gallery/AllPhoto";
import Details from "../Events/Details";
import Feature from "../Feature/Feature";


  export const router = createBrowserRouter([
    {
      path: "/",
      element:<Main></Main>,
      children:[
        {
        path: "/",
        element: <Home></Home>
        },
        {
        path: "/events",
        element: <AllEvent></AllEvent>
        },
        {
        path: "/gal",
        element: <AllPhoto></AllPhoto>
        },
        {
        path: "/com",
        element: <Commete></Commete>
        },
        {
        path: "/colab",
        element: <Feature></Feature>
        },
        {
          path: "/details/:id",
         element: <Details />,
         loader: async ({ params }) => {
         const res = await fetch("../../src/Events/event.json"); // This must be in your public folder
         const data = await res.json();
         const matchedEvent = data.find(event => event.id.toString() === params.id);
         return matchedEvent;
  },
}
      ]
      
      
    },
  ]);