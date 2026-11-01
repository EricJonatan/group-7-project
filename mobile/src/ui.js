import React, { useLayoutEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Pumpkin } from './icons.js';
export const colors = {
  price: '#bd570f',
  paper: '#fffaf1',
  ink: '#3c2b22',
  red: '#ad3e30',
  muted: '#786454',
  soft: '#f3e8d7',
  line: '#e5d9c8',
  footer: '#593a2c',
};
export const serif = 'PlayfairDisplay_500Medium';
export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  content: { padding: 20, paddingBottom: 32, flexGrow: 1 },
  h1: { fontFamily: serif, fontSize: 28, lineHeight: 35, color: colors.ink, marginBottom: 14 },
  h2: { fontFamily: serif, fontSize: 24, lineHeight: 31, color: colors.ink, marginBottom: 18 },
  eyebrow: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: 1,
    color: colors.red,
    marginBottom: 14,
  },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 15, lineHeight: 25, color: colors.muted },
  button: {
    backgroundColor: colors.red,
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontFamily: 'DMSans_400Regular',
    color: colors.paper,
    fontSize: 14,
    lineHeight: 21,
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.red },
  outlineText: { color: colors.red },
  field: {
    fontFamily: 'DMSans_400Regular',
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 13,
    paddingVertical: 12,
    backgroundColor: '#fffcf6',
    color: colors.ink,
    fontSize: 16,
    marginTop: 7,
    marginBottom: 18,
    minHeight: 48,
  },
  label: { fontFamily: 'DMSans_400Regular', fontSize: 14, lineHeight: 21, color: colors.ink },
  error: {
    backgroundColor: '#f8e1d6',
    color: '#a52b25',
    padding: 13,
    lineHeight: 22,
    marginVertical: 15,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  line: { borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 18 },
  summary: { padding: 22, backgroundColor: colors.soft, marginVertical: 24 },
  price: { fontFamily: 'DMSans_400Regular', fontSize: 15, lineHeight: 23, color: colors.price },
  link: {
    fontFamily: 'DMSans_400Regular',
    color: colors.red,
    fontSize: 14,
    lineHeight: 21,
    paddingVertical: 12,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    alignSelf: 'flex-start',
    minHeight: 48,
  },
  quantityButton: { width: 34, height: 46, justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontFamily: 'DMSans_400Regular', fontSize: 18, color: colors.ink },
  muted: { color: colors.muted },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: { backgroundColor: colors.soft, borderColor: colors.red },
  chipText: { fontFamily: 'DMSans_400Regular', color: colors.red, fontSize: 13, lineHeight: 20 },
  cardImage: { width: '100%', aspectRatio: 1, backgroundColor: colors.soft },
  cardTitle: {
    fontFamily: serif,
    fontSize: 18,
    lineHeight: 25,
    color: colors.ink,
    marginTop: 4,
    marginBottom: 4,
  },
  cardUnit: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    lineHeight: 19,
    color: colors.muted,
    marginTop: 12,
    marginBottom: 2,
  },
  section: { paddingHorizontal: 20, paddingVertical: 32 },
});
export function Brand({ light = false }) {
  return (
    <View
      accessibilityLabel="Labuibu"
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
    >
      <Pumpkin
        size={34}
        color={light ? '#f2bd7f' : colors.red}
        paper={light ? colors.footer : colors.paper}
      />
      <View>
        <Text
          style={{
            fontFamily: 'PlayfairDisplay_600SemiBold',
            fontSize: 30,
            lineHeight: 36,
            color: light ? '#f2bd7f' : colors.red,
            letterSpacing: -1,
          }}
        >
          labuibu
        </Text>
        <Text
          style={{
            fontSize: 8,
            lineHeight: 13,
            letterSpacing: 1,
            color: light ? '#ead4bc' : colors.ink,
          }}
        >
          LABU ASLI PREMIUM
        </Text>
      </View>
    </View>
  );
}
export function Footer({ bottomInset = 0 }) {
  return (
    <View
      testID="app-footer"
      style={{
        width: '100%',
        alignSelf: 'stretch',
        backgroundColor: colors.footer,
        paddingHorizontal: 20,
        paddingTop: 26,
        paddingBottom: 22 + bottomInset,
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Brand light />
      <Text
        style={{
          fontSize: 13,
          lineHeight: 22,
          color: '#fff4e5',
          textAlign: 'center',
          maxWidth: 290,
        }}
      >
        Semua bahan utama dari labu asli premium,{`\n`}
        <Text style={{ color: '#f2bd7f' }}>tanpa perasa buatan.</Text>
      </Text>
      <Text style={{ fontSize: 12, color: '#ead4bc' }}>© {new Date().getFullYear()} Labuibu</Text>
    </View>
  );
}
export function Button({ title, onPress, disabled, outline = false, hug = false, style }) {
  const hasArrow = typeof title === 'string' && title.endsWith('→');
  const label = hasArrow ? title.replace(/\s*→$/, '') : title;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        hug && { alignSelf: 'flex-start' },
        style,
        {
          flexDirection: 'row',
          gap: 8,
          justifyContent: 'center',
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[styles.buttonText, outline && styles.outlineText]}>{label}</Text>
      {hasArrow && <Icon name="arrow" size={17} color={outline ? colors.red : colors.paper} />}
    </Pressable>
  );
}
export function Field({ label, value, onChangeText, style, ...props }) {
  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#ac9987"
        style={[styles.field, props.multiline && { minHeight: 96, textAlignVertical: 'top' }]}
        {...props}
      />
    </View>
  );
}
export function Screen({
  children,
  footer = true,
  contentStyle,
  scrollResetKey,
  safeBottom = true,
}) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [scrollResetKey]);
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
        {footer && <Footer bottomInset={safeBottom ? insets.bottom : 0} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Quantity({ value, onChange, name }) {
  return (
    <View style={styles.quantity}>
      <Pressable
        accessibilityLabel={`Kurangi ${name}`}
        disabled={value <= 1}
        style={styles.quantityButton}
        onPress={() => onChange(value - 1)}
      >
        <Text style={[styles.quantityText, value <= 1 && { opacity: 0.35 }]}>−</Text>
      </Pressable>
      <Text style={styles.body}>{value}</Text>
      <Pressable
        accessibilityLabel={`Tambah ${name}`}
        disabled={value >= 99}
        style={styles.quantityButton}
        onPress={() => onChange(value + 1)}
      >
        <Text style={styles.quantityText}>+</Text>
      </Pressable>
    </View>
  );
}
