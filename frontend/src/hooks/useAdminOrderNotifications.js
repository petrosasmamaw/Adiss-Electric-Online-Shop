import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders } from '../store/ordersSlice';
import { showOrderBrowserNotification } from '../utils/browserNotifications';

const POLL_INTERVAL_MS = 20000;

export default function useAdminOrderNotifications() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const orders = useSelector((state) => state.orders.adminOrders);
  const knownOrderIdsRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      knownOrderIdsRef.current = null;
      return undefined;
    }

    dispatch(fetchAdminOrders());

    const timer = window.setInterval(() => {
      dispatch(fetchAdminOrders());
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!knownOrderIdsRef.current) {
      knownOrderIdsRef.current = new Set(orders.map((order) => order.id));
      return;
    }

    const newOrders = orders.filter((order) => !knownOrderIdsRef.current.has(order.id));

    newOrders.forEach((order) => {
      showOrderBrowserNotification(order);
      knownOrderIdsRef.current.add(order.id);
    });

    orders.forEach((order) => knownOrderIdsRef.current.add(order.id));
  }, [orders, isAuthenticated]);

  const unseenOrders = orders.filter((order) => !order.admin_seen_at);
  const seenOrders = orders.filter((order) => order.admin_seen_at);

  return {
    orders,
    unseenOrders,
    seenOrders,
    unseenCount: unseenOrders.length,
  };
}
