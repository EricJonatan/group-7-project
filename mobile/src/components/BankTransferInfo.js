import React from 'react';
import { View, Text } from 'react-native';
import { styles as s, colors } from '../ui.js';
import { money } from '@labuibu/contracts/catalog';
import { demoBankAccount } from '@labuibu/contracts';

export function BankTransferInfo({ total }) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.line,
        padding: 22,
        backgroundColor: '#fffdf7',
        marginBottom: 12,
      }}
    >
      <Text style={s.eyebrow}>TRANSFER BANK · REKENING DUMMY</Text>
      <Text style={[s.h2, { fontSize: 22 }]}>Transfer ke rekening BCA</Text>
      <Text style={[s.body, { fontSize: 12 }]}>Nomor rekening</Text>
      <Text
        style={[
          s.price,
          {
            fontFamily: 'DMSans_600SemiBold',
            fontSize: 22,
            lineHeight: 30,
            letterSpacing: 1,
            marginTop: 4,
            color: colors.ink,
          },
        ]}
      >
        {demoBankAccount.accountNumber}
      </Text>
      <Text style={[s.body, { fontSize: 12, marginTop: 16 }]}>Atas nama</Text>
      <Text style={[s.label, { marginTop: 4 }]}>{demoBankAccount.accountHolder}</Text>
      <View
        style={{ borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16, marginTop: 18 }}
      >
        <Text style={[s.body, { fontSize: 12 }]}>Jumlah pembayaran</Text>
        <Text style={[s.price, { fontFamily: 'DMSans_600SemiBold', fontSize: 18, marginTop: 4 }]}>
          {money(total)}
        </Text>
      </View>
      <Text style={[s.body, { fontSize: 12, lineHeight: 20, marginTop: 18 }]}>
        Rekening contoh untuk simulasi. Tidak perlu melakukan transfer.
      </Text>
    </View>
  );
}
