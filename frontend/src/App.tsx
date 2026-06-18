/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { useNotificationStore } from './store/notificationStore';
import { useStockStore } from './store/stockStore';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SnackbarProvider } from './components/common/SnackbarProvider';

export default function App() {
  // App initialization hooks to establish core live metrics
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const setMarketStatus = useStockStore((state) => state.setMarketStatus);
  const setIndices = useStockStore((state) => state.setIndices);

  useEffect(() => {
    // 1. Initialize Global Toast / Notification systems
    setUnreadCount(3);
    setNotifications([
      {
        id: 'msg-1',
        title: 'ALERT: NIFTY Breakout',
        message: 'NIFTY 50 breached 22,400 pivot resistance level.',
        type: 'alert',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'msg-2',
        title: 'Dividend Declared: TCS',
        message: 'TCS declared interim dividend of ₹28 per share.',
        type: 'dividend',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'msg-3',
        title: 'AI Catalyst Review',
        message: 'Reliance industries capex upgrade triggers bullish momentum.',
        type: 'news',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ]);

    // 2. Refresh initial market tickers status
    setMarketStatus({
      isOpen: true,
      session: 'normal',
      nextClose: '15:30'
    });

    setIndices([
      { name: 'NIFTY 50', symbol: 'NIFTY', value: 22410.50, change: 115.4, changePercent: 0.52 },
      { name: 'SENSEX', symbol: 'SENSEX', value: 73815.10, change: 352.2, changePercent: 0.48 },
      { name: 'NIFTY BANK', symbol: 'BANKNIFTY', value: 48150.20, change: -72.3, changePercent: -0.15 },
      { name: 'NIFTY IT', symbol: 'CNXIT', value: 35980.80, change: 391.5, changePercent: 1.10 }
    ]);
  }, [setUnreadCount, setNotifications, setMarketStatus, setIndices]);

  return (
    <ErrorBoundary>
      <SnackbarProvider>
        <AppRouter />
      </SnackbarProvider>
    </ErrorBoundary>
  );
}

