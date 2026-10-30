import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { useShop } from '../store.js';
import { api, apiEnabled } from '../api.js';
import { Screen, Button, styles as s, colors } from '../ui.js';
import { unwrap } from '@labuibu/api-client';
import { CompactOrderCard } from '../components/OrderCard.js';

export function Orders({ navigation }) {
  const { user, lastOrder } = useShop();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(apiEnabled);
  useEffect(() => {
    let active = true;
    async function load() {
      if (!user || !apiEnabled) return;
      setLoading(true);
      try {
        const result = unwrap(await api.get('/orders'));
        if (active) {
          setOrders(result);
          setError('');
        }
      } catch {
        if (active) setError('Riwayat pesanan belum bisa dimuat.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const unsubscribe = navigation.addListener('focus', load);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigation, user]);
  if (!user)
    return (
      <Screen>
        <Text style={s.h1}>Pesanan saya</Text>
        <Text style={s.body}>Masuk untuk melihat pesananmu.</Text>
        <Button
          title="Masuk / Daftar"
          onPress={() => navigation.replace('Auth', { next: 'Orders' })}
        />
      </Screen>
    );
  const visibleOrders = apiEnabled ? orders : lastOrder ? [lastOrder] : [];
  return (
    <Screen>
      <Text style={s.h1}>Pesanan saya</Text>
      <Text style={[s.body, { marginBottom: 24 }]}>Lihat pesanan dan informasi pembayaranmu.</Text>
      {loading && <ActivityIndicator color={colors.red} />}
      {error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      {!loading && !visibleOrders.length && !error && (
        <Text style={s.body}>Belum ada pesanan.</Text>
      )}
      {visibleOrders.map((order) => (
        <CompactOrderCard key={order._id || order.id} order={order} navigation={navigation} />
      ))}
    </Screen>
  );
}
