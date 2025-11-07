'use client';

import { useState, useEffect } from 'react';
import type { Order } from '@/types';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'printed' | 'mailed'>('all');

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      alert('Invalid password');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const downloadPDF = async (order: Order) => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardDesign: order.cardDesign }),
      });

      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-playfair text-whisper-charcoal mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border-2 border-whisper-sage/30 rounded-lg focus:border-whisper-sage focus:outline-none mb-4"
            />
            <button
              type="submit"
              className="w-full py-3 bg-whisper-sage text-white rounded-lg hover:bg-whisper-gold transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  return (
    <div className="min-h-screen paper-bg">
      <header className="border-b border-whisper-sage/30 bg-whisper-softWhite/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair text-whisper-charcoal">
              Nana's Studio
            </h1>
            <p className="text-whisper-charcoal/70 mt-1 font-light">
              Order Management Dashboard
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_auth');
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 border-2 border-whisper-sage text-whisper-charcoal rounded-lg hover:bg-whisper-sage hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['all', 'pending', 'paid', 'printed', 'mailed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-4 py-2 rounded-lg capitalize transition-all whitespace-nowrap
                ${
                  filter === status
                    ? 'bg-whisper-sage text-white'
                    : 'bg-white text-whisper-charcoal border border-whisper-sage/30 hover:border-whisper-sage'
                }
              `}
            >
              {status} ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-whisper-charcoal/70">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-whisper-charcoal/70">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Order Info */}
                  <div>
                    <h3 className="font-playfair text-lg text-whisper-charcoal mb-2">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-whisper-charcoal/70 mb-1">
                      <span className="font-medium">Buyer:</span> {order.buyerName}
                    </p>
                    <p className="text-sm text-whisper-charcoal/70 mb-1">
                      <span className="font-medium">Email:</span> {order.buyerEmail}
                    </p>
                    <p className="text-sm text-whisper-charcoal/70 mb-1">
                      <span className="font-medium">Amount:</span> ${(order.amount / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-whisper-charcoal/70">
                      <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Recipient Info */}
                  <div>
                    <h4 className="font-medium text-whisper-charcoal mb-2">Recipient</h4>
                    <p className="text-sm text-whisper-charcoal/70">{order.recipient.name}</p>
                    <p className="text-sm text-whisper-charcoal/70">{order.recipient.addressLine1}</p>
                    {order.recipient.addressLine2 && (
                      <p className="text-sm text-whisper-charcoal/70">{order.recipient.addressLine2}</p>
                    )}
                    <p className="text-sm text-whisper-charcoal/70">
                      {order.recipient.city}, {order.recipient.state} {order.recipient.zipCode}
                    </p>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-medium text-whisper-charcoal mb-3">Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => downloadPDF(order)}
                        className="w-full px-4 py-2 bg-whisper-blush text-whisper-charcoal rounded-lg hover:bg-whisper-blush/80 transition-all text-sm"
                      >
                        Download PDF
                      </button>

                      {order.status === 'paid' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'printed')}
                          className="w-full px-4 py-2 bg-whisper-sage text-white rounded-lg hover:bg-whisper-gold transition-all text-sm"
                        >
                          Mark as Printed
                        </button>
                      )}

                      {order.status === 'printed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'mailed')}
                          className="w-full px-4 py-2 bg-whisper-gold text-white rounded-lg hover:bg-whisper-sage transition-all text-sm"
                        >
                          Mark as Mailed
                        </button>
                      )}

                      <div className={`
                        px-4 py-2 rounded-lg text-center text-sm font-medium
                        ${order.status === 'mailed' ? 'bg-green-100 text-green-800' :
                          order.status === 'printed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        Status: {order.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Preview */}
                <div className="mt-4 pt-4 border-t border-whisper-sage/30">
                  <p className="text-sm text-whisper-charcoal/70">
                    <span className="font-medium">Card:</span> {order.cardDesign.intent.occasion} •{' '}
                    {order.cardDesign.text.frontCaption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
