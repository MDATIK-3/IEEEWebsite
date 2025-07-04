import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router-dom";
import { router } from './Routes/Routers';

import AnimatedBackground from '../src/Animation/AnimatedBackground'; // ✅ Add this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      {/* <AnimatedBackground /> ✅ Inject BG */}
      <div className=''>
        <RouterProvider router={router} />
      </div>
    </>
  </StrictMode>
);
