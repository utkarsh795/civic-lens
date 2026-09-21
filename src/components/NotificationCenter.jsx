import React, { useState, useEffect } from 'react';
import { 
  getNotifications, 
  markNotificationRead, 
  markAllNotificationsRead, 
  getUnreadCount 
} from '../services/notifications';
import { Bell, Check, CheckCheck, X, MessageSquare, Clock } from 'lucide-react';

export default function NotificationCenter({ onSelectComplaint }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifs = () => {
    const list = getNotifications();
    setNotifications(list);
    setUnreadCount(getUnreadCount());
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    const updated = markNotificationRead(id);
    setNotifications(updated);
    setUnreadCount(getUnreadCount());
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
    setUnreadCount(0);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon Trigger Button */}
      <button 
        type="button" 
        className="theme-toggle-btn"
        onClick={() => setIsOpen(prev => !prev)}
        title="Notifications"
        style={{ position: 'relative' }}
      >
        <Bell size={18} color="var(--primary)" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: '#ef4444',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 800,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '48px',
          right: '0',
          width: '340px',
          maxHeight: '440px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-subtle)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={16} color="var(--primary)" /> Citizen Notifications
              {unreadCount > 0 && (
                <span className="badge" style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem' }}>
                  {unreadCount} new
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button 
                  type="button" 
                  onClick={handleMarkAllRead} 
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Mark All Read
                </button>
              )}
              <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No notifications yet.
              </div>
            ) : (
              notifications.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    if (onSelectComplaint) onSelectComplaint(item.complaintId);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: item.isRead ? 'transparent' : 'var(--primary-light)',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <button 
                        type="button" 
                        onClick={(e) => handleMarkRead(item.id, e)}
                        title="Mark as read"
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.3', marginBottom: '4px' }}>
                    {item.message}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                      {item.complaintId}
                    </span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
