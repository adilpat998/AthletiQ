import { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ onToggle, collapsed: propCollapsed, mobileOpen }) => {
  const [collapsed, setCollapsed] = useState(propCollapsed || false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Handle window resize to detect mobile view
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Sync collapsed state with props
    if (propCollapsed !== undefined) {
      setCollapsed(propCollapsed);
    }
  }, [propCollapsed]);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  const handleFeatureClick = (e) => {
    e.preventDefault();
    alert('Coming Soon! This feature is under development.');
  };

  // Determine sidebar classes based on state
  const sidebarClasses = [
    'sidebar',
    collapsed ? 'collapsed' : '',
    isMobile ? 'mobile' : '',
    isMobile && mobileOpen ? 'mobile-open' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={sidebarClasses}>
      {!isMobile && (
        <button className="toggle-button" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          {collapsed ? '›' : '‹'}
        </button>
      )}

      <div className="sidebar-content">
        <div className="sidebar-header">
          <h3 className="sidebar-title">AtletIQ Tools</h3>
        </div>

        {/* AI Workout Plans Section - Most Important */}
        <div className="sidebar-section ai-section">
          <h4 className="section-title">AI WORKOUT PLANS</h4>
          <div className="sidebar-menu">
            <a href="#" className="sidebar-item" onClick={handleFeatureClick} data-tooltip="Generate Custom Plan">
              <div className="sidebar-icon">🤖</div>
              <span className="sidebar-text">Generate Custom Plan</span>
            </a>
            
            <a href="#" className="sidebar-item" onClick={handleFeatureClick} data-tooltip="Muscle Targeting">
              <div className="sidebar-icon">💪</div>
              <span className="sidebar-text">Muscle Targeting</span>
            </a>
            
            <a href="#" className="sidebar-item" onClick={handleFeatureClick} data-tooltip="Quick Workouts">
              <div className="sidebar-icon">⚡</div>
              <span className="sidebar-text">Quick Workouts</span>
            </a>
          </div>
        </div>

        <div className="sidebar-section">
          <h4 className="section-title">FITNESS TOOLS</h4>
          <div className="sidebar-menu">
            <a href="#" className="sidebar-item" onClick={handleFeatureClick} data-tooltip="BMI Calculator">
              <div className="sidebar-icon">📏</div>
              <span className="sidebar-text">BMI Calculator</span>
            </a>
            
            <a href="#" className="sidebar-item" onClick={handleFeatureClick} data-tooltip="Calorie Calculator">
              <div className="sidebar-icon">🔥</div>
              <span className="sidebar-text">Calorie Calculator</span>
            </a>
            
            <a href="#" className="sidebar-item" onClick={handleFeatureClick} data-tooltip="Workout Timer">
              <div className="sidebar-icon">⏱️</div>
              <span className="sidebar-text">Workout Timer</span>
            </a>
          </div>
        </div>

        <div className="sidebar-section">
          <h4 className="section-title">QUICK RESOURCES</h4>
          <div className="sidebar-menu">
            <a href="#" className="sidebar-item" onClick={handleFeatureClick} data-tooltip="Exercise Library">
              <div className="sidebar-icon">📚</div>
              <span className="sidebar-text">Exercise Library</span>
            </a>
            
            <a href="#" className="sidebar-item" onClick={handleFeatureClick} data-tooltip="Track Progress">
              <div className="sidebar-icon">📊</div>
              <span className="sidebar-text">Track Progress</span>
            </a>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-stats">
            <div className="stat-item">
              <span className="stat-label">Workouts</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Streak</span>
              <span className="stat-value">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;