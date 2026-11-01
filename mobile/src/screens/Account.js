import React from 'react';
import { Text } from 'react-native';
import { useShop } from '../store.js';

import { Screen, Button, styles as s } from '../ui.js';
import { AccountMenu } from '../components/AccountMenu.js';

export function Account({ navigation }) {
  const { user, logout } = useShop();
  return (
    <Screen safeBottom={false}>
      {user ? (
        <>
          <Text style={s.eyebrow}>AKUN SAYA</Text>
          <Text style={s.h1}>Halo, {user.name}.</Text>
          <Text style={s.body}>{user.email}</Text>
          {user.demo && (
            <Text style={[s.body, { fontSize: 12, marginTop: 8 }]}>
              Akun demo · Belum terhubung ke server.
            </Text>
          )}
          <AccountMenu navigation={navigation} />
          <Button title="Keluar" outline onPress={logout} />
        </>
      ) : (
        <>
          <Text style={s.h1}>Akun saya</Text>
          <Text style={s.body}>Masuk untuk melanjutkan belanja dan melihat pesanan.</Text>
          <AccountMenu navigation={navigation} />
          <Button title="Masuk / Daftar" onPress={() => navigation.navigate('Auth')} />
        </>
      )}
    </Screen>
  );
}
