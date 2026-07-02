import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconClipboardList, IconPhone, IconTrash, IconRefresh } from '@tabler/icons-react';
import {
  fetchAdminOrders,
  deleteAdminOrder,
  updateOrderStatus,
} from '../../store/ordersSlice';
import { showToast } from '../../store/toastSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatEthiopianDateTime } from '../../utils/ethiopianDate';
import StatusFilterPills from '../StatusFilterPills';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_delivery', label: 'In Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'canceled', label: 'Canceled' },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  ...ORDER_STATUSES,
];

function StatusSelect({ order, onChange, updating }) {
  return (
    <select
      value={order.status || 'pending'}
      onChange={(e) => onChange(order.id, e.target.value)}
      disabled={updating}
      className="w-full min-w-[120px] px-2 py-1.5 rounded-md border border-border bg-white font-sans text-[12px] text-ink focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-colors duration-150 disabled:opacity-60 disabled:cursor-wait"
      aria-label={`Status for order ${order.id}`}
    >
      {ORDER_STATUSES.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

function OrderCard({ order, onDelete, onStatusChange, updatingId }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex justify-between items-start gap-2">
        <p className="font-sans font-semibold text-[14px] text-ink min-w-0 truncate">
          {order.item_name}
        </p>
        <p className="font-condensed font-bold text-[16px] text-amber shrink-0">
          {formatPrice(order.total_price)}
        </p>
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          ['Order', `#${order.id}`],
          ['Customer', order.customer_name],
          ['Phone', order.customer_phone],
          ['Address', order.customer_address],
          ['Qty', order.quantity],
          ['Date', formatEthiopianDateTime(order.created_at)],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <span className="text-muted text-[11px] font-bold uppercase tracking-wide shrink-0">
              {label}
            </span>
            <span className="text-ink3 text-[12px] font-medium text-right">{value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center gap-4 pt-1">
          <span className="text-muted text-[11px] font-bold uppercase tracking-wide shrink-0">
            Status
          </span>
          <div className="flex-1 max-w-[160px]">
            <StatusSelect
              order={order}
              onChange={onStatusChange}
              updating={updatingId === order.id}
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onDelete(order)}
        className="w-full mt-3 h-11 rounded-md bg-[#FDEAEA] text-danger text-[13px] font-bold uppercase tracking-[0.03em] hover:bg-danger/20 transition-colors flex items-center justify-center gap-1.5"
      >
        <IconTrash size={15} /> Delete
      </button>
    </div>
  );
}

export default function OrdersManager() {
  const dispatch = useDispatch();
  const { adminOrders, adminLoading, adminError } = useSelector((state) => state.orders);
  const updatingId = useSelector((state) => state.orders.updatingStatusId);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return adminOrders;
    return adminOrders.filter((order) => (order.status || 'pending') === statusFilter);
  }, [adminOrders, statusFilter]);

  const loadOrders = () => {
    dispatch(fetchAdminOrders())
      .unwrap()
      .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
  };

  useEffect(() => {
    loadOrders();
  }, [dispatch]);

  const handleDelete = (order) => {
    if (window.confirm(`Delete this order from ${order.customer_name}?`)) {
      dispatch(deleteAdminOrder(order.id))
        .unwrap()
        .then(() => dispatch(showToast('Order deleted.', 'neutral')))
        .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
    }
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }))
      .unwrap()
      .then(() => dispatch(showToast('Order status updated.', 'success')))
      .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
  };

  const thClass =
    'text-left px-4 py-3 font-bold text-[11px] text-muted uppercase tracking-[0.06em]';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-condensed font-bold text-[24px] text-ink">Orders</h1>
        <button
          type="button"
          onClick={loadOrders}
          disabled={adminLoading}
          className="bg-transparent border border-border text-muted px-4 py-2 rounded-md font-sans font-bold text-[13px] uppercase tracking-[0.04em] hover:border-ink hover:text-ink transition-colors duration-150 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconRefresh size={16} /> Refresh
        </button>
      </div>

      {!adminLoading && !adminError && adminOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-4 mb-5">
          <StatusFilterPills
            options={STATUS_FILTER_OPTIONS}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />
        </div>
      )}

      {adminLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-14 rounded-xl" />
          ))}
        </div>
      ) : adminError ? (
        <p className="text-danger font-sans">{adminError}</p>
      ) : adminOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-border py-16 text-center">
          <IconClipboardList size={36} className="text-border mx-auto mb-3" />
          <p className="font-sans text-[13px] text-muted">No orders yet.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-border py-16 text-center">
          <IconClipboardList size={36} className="text-border mx-auto mb-3" />
          <p className="font-sans text-[13px] text-muted">
            No orders with this status.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-border overflow-x-auto">
            <table className="w-full font-sans">
              <thead>
                <tr className="bg-smoke border-b border-border">
                  <th className={thClass}>#</th>
                  <th className={thClass}>Item</th>
                  <th className={thClass}>Customer</th>
                  <th className={thClass}>Phone</th>
                  <th className={thClass}>Qty</th>
                  <th className={thClass}>Total</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-smoke transition-colors duration-100"
                  >
                    <td className="px-4 py-3 font-condensed font-bold text-[15px] text-muted">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[13px] text-ink">{order.item_name}</td>
                    <td className="px-4 py-3 font-semibold text-[13px] text-ink">{order.customer_name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-sans text-[13px] text-ink3">
                        <IconPhone size={13} className="text-muted" />
                        {order.customer_phone}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-condensed font-bold text-[15px] text-ink text-center">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-3 font-condensed font-bold text-[15px] text-amber">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        order={order}
                        onChange={handleStatusChange}
                        updating={updatingId === order.id}
                      />
                    </td>
                    <td className="px-4 py-3 text-muted text-[12px] font-sans whitespace-nowrap">
                      {formatEthiopianDateTime(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(order)}
                        className="w-8 h-8 rounded-md bg-[#FDEAEA] text-danger hover:bg-danger/20 transition-colors flex items-center justify-center"
                        aria-label="Delete"
                      >
                        <IconTrash size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                updatingId={updatingId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
