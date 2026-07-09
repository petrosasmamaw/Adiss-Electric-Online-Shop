import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IconBell, IconBellRinging, IconCheck } from '@tabler/icons-react';
import { markAllOrdersSeen, markOrderSeen } from '../../store/ordersSlice';
import { formatPrice } from '../../utils/formatPrice';

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationItem({ order, unseen, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(order)}
      className={`admin-notif-item w-full text-left px-3.5 py-3 flex gap-3 transition-colors duration-150 ${
        unseen ? 'admin-notif-item--unseen hover:bg-amber-tint/70' : 'hover:bg-smoke'
      }`}
    >
      <span
        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
          unseen ? 'bg-amber animate-pulse' : 'bg-border'
        }`}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={`text-[13px] leading-snug truncate ${
              unseen ? 'font-bold text-ink' : 'font-semibold text-ink3'
            }`}
          >
            New order · {order.item_name}
          </span>
          <span className="text-[11px] text-muted shrink-0">{formatRelativeTime(order.created_at)}</span>
        </span>
        <span className="block text-[12px] text-muted mt-0.5 truncate">
          {order.customer_name} · Qty {order.quantity} · {formatPrice(order.total_price)}
        </span>
      </span>
    </button>
  );
}

export default function AdminNotificationBell({ unseenCount, unseenOrders, seenOrders }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (
        panelRef.current?.contains(event.target) ||
        buttonRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleSelect = async (order) => {
    if (!order.admin_seen_at) {
      await dispatch(markOrderSeen(order.id));
    }
    setOpen(false);
    navigate('/admin/dashboard/orders');
  };

  const handleMarkAllRead = async () => {
    if (unseenCount === 0) return;
    await dispatch(markAllOrdersSeen());
  };

  const BellIcon = unseenCount > 0 ? IconBellRinging : IconBell;
  const displayCount = unseenCount > 9 ? '9+' : String(unseenCount);

  return (
    <div className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`admin-notif-bell relative w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-150 ${
          open
            ? 'border-amber bg-amber-tint text-amber'
            : 'border-border bg-white text-ink hover:border-amber hover:text-amber'
        }`}
        aria-label={`Notifications${unseenCount ? `, ${unseenCount} unread` : ''}`}
        aria-expanded={open}
      >
        <BellIcon size={20} stroke={1.8} className={unseenCount > 0 ? 'admin-notif-bell-ring' : ''} />
        {unseenCount > 0 && (
          <span className="admin-notif-badge absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {displayCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="admin-notif-panel fixed md:absolute right-3 md:right-auto md:left-full top-[60px] md:top-[calc(100%+0.25rem)] md:ml-3 z-[130] w-[min(22rem,calc(100vw-1.5rem))] bg-white border border-border rounded-xl shadow-dropdown overflow-hidden"
          role="dialog"
          aria-label="Order notifications"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-smoke/60">
            <div>
              <p className="font-condensed font-bold text-[16px] text-ink leading-none">Notifications</p>
              <p className="text-[11px] text-muted mt-1">
                {unseenCount > 0 ? `${unseenCount} new order${unseenCount === 1 ? '' : 's'}` : 'All caught up'}
              </p>
            </div>
            {unseenCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-amber hover:bg-amber-tint transition-colors"
              >
                <IconCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[min(24rem,58vh)] overflow-y-auto">
            {unseenOrders.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber">
                  New
                </p>
                <div className="divide-y divide-border/70">
                  {unseenOrders.map((order) => (
                    <NotificationItem
                      key={order.id}
                      order={order}
                      unseen
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {seenOrders.length > 0 && (
              <div className={unseenOrders.length > 0 ? 'border-t border-border' : ''}>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  Earlier
                </p>
                <div className="divide-y divide-border/70">
                  {seenOrders.slice(0, 12).map((order) => (
                    <NotificationItem
                      key={order.id}
                      order={order}
                      unseen={false}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {unseenOrders.length === 0 && seenOrders.length === 0 && (
              <div className="px-4 py-10 text-center">
                <IconBell size={28} className="mx-auto text-muted/50 mb-2" />
                <p className="text-[13px] font-semibold text-ink">No orders yet</p>
                <p className="text-[12px] text-muted mt-1">New customer orders will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
