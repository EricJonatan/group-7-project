import type { StackScreenProps } from '../navigation.ts';
import { getErrorMessage } from '@labuibu/api-client';
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useShop } from '../store.tsx';
import { apiEnabled } from '../api.ts';
import { Screen, Button, Field, styles as s, colors } from '../ui.tsx';

export function Auth({ route, navigation }: StackScreenProps<'Auth'>) {
  const { authenticate } = useShop();
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useLayoutEffect(() => {
    navigation.setOptions({ title: register ? 'Buat akun' : 'Masuk' });
  }, [navigation, register]);
  async function submit() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await authenticate(register, { email, password, ...(register ? { name } : {}) });
      setPassword('');
      if (route.params?.next) navigation.replace(route.params.next);
      else navigation.goBack();
    } catch (err) {
      setError(getErrorMessage(err, 'Belum berhasil masuk. Periksa koneksi dan data kamu.'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen contentStyle={{ paddingTop: 30, paddingBottom: 32 }}>
      <View style={{ width: '100%', maxWidth: 380, alignSelf: 'center', marginVertical: 'auto' }}>
        <Text style={[s.h1, { textAlign: 'center', marginBottom: 8 }]}>
          {register ? 'Buat akun Labuibu' : 'Masuk ke Labuibu'}
        </Text>
        <Text style={[s.body, { textAlign: 'center', fontSize: 14, marginBottom: 28 }]}>
          {register
            ? 'Daftar untuk belanja dan cek pesanan.'
            : 'Masuk untuk belanja dan cek pesanan.'}
        </Text>
        {register && (
          <Field
            label="Nama lengkap"
            placeholder="Nama kamu"
            value={name}
            onChangeText={setName}
            autoComplete="name"
          />
        )}
        <Field
          label="Alamat email"
          placeholder="nama@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <Field
          label="Kata sandi"
          placeholder="Minimal 8 karakter"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={register ? 'new-password' : 'current-password'}
        />
        {error && (
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
        )}
        <Button
          title={busy ? 'Sebentar, ya...' : register ? 'Daftar  →' : 'Masuk  →'}
          onPress={submit}
          disabled={busy}
          style={{ marginTop: 0 }}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setRegister(!register);
            setError('');
          }}
          style={{ paddingVertical: 20 }}
        >
          <Text style={{ fontSize: 13, color: colors.muted, textAlign: 'center' }}>
            {register ? 'Sudah punya akun?  ' : 'Belum punya akun?  '}
            <Text style={{ color: colors.red, textDecorationLine: 'underline' }}>
              {register ? 'Masuk di sini' : 'Daftar di sini'}
            </Text>
          </Text>
        </Pressable>
        {!apiEnabled && (
          <View style={{ borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16 }}>
            <Text style={{ fontSize: 12, lineHeight: 20, color: colors.muted }}>
              Mode demo · Belum terhubung ke server.
            </Text>
            <Text style={{ fontSize: 12, lineHeight: 20, color: colors.muted }}>
              {register
                ? 'Pendaftaran membuat sesi demo, bukan akun sungguhan.'
                : 'Gunakan email dan kata sandi contoh (min. 8 karakter).'}{' '}
              Kata sandi tidak disimpan.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}
