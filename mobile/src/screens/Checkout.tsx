import type {
  Customer,
  ShippingMethod,
  PaymentMethod,
  OrderRecord,
} from '@labuibu/contracts/types';
import type { StackScreenProps } from '../navigation.ts';
import {
  createOrderReceipt,
  orderItemsFromCart,
  requiresInstantShipping,
} from '@labuibu/contracts/commerce';
import React, { useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useShop } from '../store.tsx';
import { api, apiEnabled } from '../api.ts';
import { Screen, Button, Field, styles as s } from '../ui.tsx';
import { money } from '@labuibu/contracts/catalog';
import { orderSchema, shippingPrices } from '@labuibu/contracts';
import { unwrap, getErrorMessage } from '@labuibu/api-client';
import { Choice } from '../components/Choice.tsx';
import { OrderSummary } from '../components/OrderSummary.tsx';

export function Checkout({ navigation }: StackScreenProps<'Checkout'>) {
  const { cart, user, subtotal, clear, rememberOrder } = useShop();
  const [values, setValues] = useState<Customer>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    notes: '',
  });
  const [delivery, setDelivery] = useState<ShippingMethod>('regular');
  const [payment, setPayment] = useState<PaymentMethod>('bank_transfer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [orderKey] = useState(() => `mobile-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const lock = useRef(false);
  const requiresInstant = requiresInstantShipping(cart);
  const shipping = shippingPrices[requiresInstant ? 'instant' : delivery];
  if (!user)
    return (
      <Screen>
        <Text style={s.body}>Sesi berakhir. Silakan masuk lagi.</Text>
        <Button title="Masuk" onPress={() => navigation.replace('Auth', { next: 'Checkout' })} />
      </Screen>
    );
  if (!cart.length)
    return (
      <Screen>
        <Text style={s.body}>Keranjangmu kosong.</Text>
        <Button
          title="Kembali"
          onPress={() => navigation.navigate('Shop', { screen: 'Produk kami' })}
        />
      </Screen>
    );
  async function submit() {
    if (lock.current) return;
    setError('');
    const parsed = orderSchema.safeParse({
      items: orderItemsFromCart(cart),
      shippingMethod: requiresInstant ? 'instant' : delivery,
      paymentMethod: payment,
      customer: values,
    });
    if (!parsed.success) {
      setError(
        'Lengkapi nama penerima, email, nomor telepon, alamat (minimal 10 karakter), kota, dan kode pos 5 digit.',
      );
      return;
    }
    lock.current = true;
    setBusy(true);
    try {
      const order = apiEnabled
        ? unwrap<OrderRecord>(
            await api.post('/orders', parsed.data, { headers: { 'Idempotency-Key': orderKey } }),
          )
        : { _id: `DEMO-${Date.now().toString(36).toUpperCase()}`, total: subtotal + shipping };
      const receipt = createOrderReceipt(order, {
        cart,
        shipping,
        paymentMethod: payment,
        demo: !apiEnabled,
      });
      rememberOrder(receipt);
      clear();
      navigation.replace('Success', receipt);
    } catch (err) {
      setError(getErrorMessage(err, 'Pesanan belum berhasil. Keranjangmu tetap tersimpan.'));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Screen>
      <Text style={s.eyebrow}>TINGGAL SELANGKAH LAGI</Text>
      <Text style={s.h1}>Selesaikan pesananmu.</Text>
      <Text style={[s.body, { marginBottom: 24 }]}>
        Isi alamat, pilih pengiriman, lalu periksa total pesanan.
      </Text>
      {!apiEnabled && (
        <Text style={s.error}>
          Checkout demo · Tidak ada pembayaran atau pengiriman sungguhan. Gunakan data contoh.
        </Text>
      )}
      {[
        {
          title: '01 · Informasi penerima',
          fields: { name: 'Nama penerima', phone: 'Nomor telepon', email: 'Alamat email' },
        },
        {
          title: '02 · Alamat pengiriman',
          fields: {
            address: 'Alamat lengkap',
            city: 'Kota / Kabupaten',
            postcode: 'Kode pos (5 digit)',
            notes: 'Catatan (opsional)',
          },
        },
      ].map((section) => (
        <View key={section.title} style={{ marginBottom: 24 }}>
          <Text style={s.h2}>{section.title}</Text>
          {Object.entries(section.fields).map(([field, label]) => {
            const key = field as keyof Customer;
            return (
              <Field
                key={key}
                label={label}
                placeholder={
                  key === 'address'
                    ? 'Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan'
                    : key === 'postcode'
                      ? '5 digit'
                      : undefined
                }
                value={values[key]}
                onChangeText={(text) => setValues((v) => ({ ...v, [key]: text }))}
                multiline={key === 'address' || key === 'notes'}
                keyboardType={
                  key === 'email'
                    ? 'email-address'
                    : ['phone', 'postcode'].includes(key)
                      ? 'phone-pad'
                      : 'default'
                }
                autoComplete={
                  {
                    city: undefined,
                    notes: undefined,
                    name: 'name' as const,
                    phone: 'tel' as const,
                    email: 'email' as const,
                    address: 'street-address' as const,
                    postcode: 'postal-code' as const,
                  }[key]
                }
                maxLength={
                  key === 'postcode' ? 5 : key === 'address' || key === 'notes' ? 500 : undefined
                }
                autoCapitalize={key === 'email' ? 'none' : 'sentences'}
              />
            );
          })}
        </View>
      ))}
      <Text style={s.h2}>03 · Pilihan pengiriman</Text>
      {(requiresInstant ? (['instant'] as const) : (['regular', 'instant'] as const)).map((v) => (
        <Choice
          key={v}
          selected={(requiresInstant ? 'instant' : delivery) === v}
          title={v === 'regular' ? 'Reguler' : 'Instan'}
          description={
            v === 'regular'
              ? 'Estimasi 2–3 hari · Hanya produk kering'
              : 'Hari yang sama · Wajib untuk produk segar & dingin'
          }
          price={money(shippingPrices[v])}
          onPress={() => setDelivery(v)}
        />
      ))}
      <Text style={[s.body, { fontSize: 13, marginVertical: 14 }]}>
        Produk segar dan dingin hanya dikirim lokal pada hari yang sama. Kebutuhan kemasan dingin
        dikonfirmasi penjual; ketahanan 7 hari belum diuji.
      </Text>
      <Text style={s.h2}>04 · Metode pembayaran</Text>
      {(['bank_transfer', 'cod'] as const).map((v) => (
        <Choice
          key={v}
          selected={payment === v}
          title={v === 'bank_transfer' ? 'Transfer bank' : 'Bayar di tempat'}
          description={
            v === 'bank_transfer'
              ? 'Instruksi akan diberikan setelah pesanan dikonfirmasi'
              : 'Tergantung ketersediaan layanan di alamatmu'
          }
          onPress={() => setPayment(v)}
        />
      ))}
      <OrderSummary shipping={shipping}>
        {error && (
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
        )}
        <Button
          title={busy ? 'Memproses...' : apiEnabled ? 'Buat Pesanan' : 'Buat Pesanan Demo'}
          onPress={submit}
          disabled={busy}
        />
        <Text style={[s.body, { fontSize: 13, marginTop: 12 }]}>
          {apiEnabled
            ? 'Penjual akan mengonfirmasi pesanan dan petunjuk pembayaran.'
            : 'Tidak ada uang yang ditagihkan.'}
        </Text>
      </OrderSummary>
    </Screen>
  );
}
