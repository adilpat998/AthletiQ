import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import Sidebar from "../components/Sidebar/Sidebar";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    // Handle window resize to detect mobile view
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <>
      <ModalProvider>
        <div className="app-layout">
          <Navigation />
          
          <div className="main-content-area">
            <Sidebar 
              onToggle={handleSidebarToggle} 
              collapsed={sidebarCollapsed}
              mobileOpen={mobileSidebarOpen}
            />
            
            <div className={`outlet-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              {isLoaded && <Outlet />}
            </div>

            {isMobile && (
              <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
                ☰
              </button>
            )}
          </div>
        </div>
        <Modal />
      </ModalProvider>
    </>
  );
}