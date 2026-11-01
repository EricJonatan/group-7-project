import React from 'react';
import { View, Text } from 'react-native';
import { Screen, Button, styles as s, colors } from '../ui.js';
import { money } from '@labuibu/contracts/catalog';
import { BankTransferInfo } from '../components/BankTransferInfo.js';

export function Success({ route, navigation }) {
  const order = route.params;
  const bankTransfer =
    (order.paymentMethod || (order.demo ? 'bank_transfer' : undefined)) === 'bank_transfer';
  return (
    <Screen>
      <Text style={[s.eyebrow, { marginTop: 30 }]}>
        {order.demo ? 'SIMULASI SELESAI' : 'PESANAN DITERIMA'}
      </Text>
      <Text style={s.h1}>Pesananmu sudah masuk.</Text>
      <Text style={s.body}>
        {order.demo
          ? 'Pesanan demo berhasil dibuat. Tidak ada pembayaran atau pengiriman sungguhan.'
          : bankTransfer
            ? 'Lanjutkan pembayaran sesuai instruksi untuk memproses pesananmu.'
            : 'Penjual akan mengonfirmasi pesananmu.'}
      </Text>
      <View style={s.summary}>
        <Text style={[s.body, { fontSize: 12, marginBottom: 18 }]}>Nomor pesanan: {order.id}</Text>
        {order.items?.map((item, index) => (
          <View key={index} style={[s.row, { alignItems: 'flex-start', marginBottom: 12 }]}>
            <Text style={[s.body, { fontSize: 13, flex: 1 }]}>
              {item.quantity} × {item.name}
            </Text>
            <Text style={[s.price, { fontSize: 13 }]}>{money(item.price * item.quantity)}</Text>
          </View>
        ))}
        {order.shipping !== undefined && (
          <View style={[s.row, { marginTop: 8 }]}>
            <Text style={[s.body, { fontSize: 13 }]}>Ongkir</Text>
            <Text style={[s.price, { fontSize: 13 }]}>{money(order.shipping)}</Text>
          </View>
        )}
        <View
          style={[
            s.row,
            { borderTopWidth: 1, borderTopColor: colors.line, marginTop: 18, paddingTop: 18 },
          ]}
        >
          <Text style={[s.label, { flex: 1 }]}>Total pembayaran</Text>
          <Text style={[s.price, { fontSize: 20 }]}>{money(order.total)}</Text>
        </View>
      </View>
      {bankTransfer && <BankTransferInfo total={order.total} />}
      <Button title="Lihat pesanan saya  →" onPress={() => navigation.navigate('Orders')} />
    </Screen>
  );
}
