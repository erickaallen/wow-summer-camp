import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { shareVCard } from '../utils/vcard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { MoreStackParamList, RootTabParamList, UserProfile } from '../types';
import { useProfile } from '../hooks/useProfile';
import { colors, spacing, fontSize, fontFamily, radius, shadow } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'Profile'>;

// ─── Field definitions ────────────────────────────────────────────────────────
type FieldDef = {
  key: keyof UserProfile;
  label: string;
  placeholder: string;
  required?: boolean;
  keyboard?: 'default' | 'email-address' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'words' | 'sentences';
};

const CHECK_IN_FIELDS: FieldDef[] = [
  {
    key: 'ticketEmail',
    label: 'Ticket Email',
    placeholder: 'email@example.com',
    required: true,
    keyboard: 'email-address',
    autoCapitalize: 'none',
  },
];

const NETWORKING_FIELDS: FieldDef[] = [
  { key: 'firstName',      label: 'First Name',       placeholder: 'Jane',                required: true, autoCapitalize: 'words' },
  { key: 'lastName',       label: 'Last Name',        placeholder: 'Smith',               required: true, autoCapitalize: 'words' },
  { key: 'networkingEmail',label: 'Contact Email',    placeholder: 'jane@mybusiness.com', keyboard: 'email-address', autoCapitalize: 'none' },
  { key: 'businessName',   label: 'Business Name',    placeholder: 'My Business LLC',     autoCapitalize: 'words' },
  { key: 'jobTitle',       label: 'Job Title',        placeholder: 'Founder & CEO',       autoCapitalize: 'words' },
  { key: 'phone',          label: 'Phone',            placeholder: '(502) 555-0100',      keyboard: 'phone-pad', autoCapitalize: 'none' },
  { key: 'instagram',      label: 'Instagram',        placeholder: '@yourhandle',         autoCapitalize: 'none' },
  { key: 'website',        label: 'Website',          placeholder: 'https://yourbiz.com', keyboard: 'url', autoCapitalize: 'none' },
];

// ─── Reusable field group ─────────────────────────────────────────────────────
function FieldGroup({
  fields,
  form,
  onChange,
}: {
  fields: FieldDef[];
  form: UserProfile;
  onChange: (key: keyof UserProfile, value: string) => void;
}) {
  return (
    <View style={styles.card}>
      {fields.map((field, i) => (
        <View key={field.key} style={[styles.fieldRow, i < fields.length - 1 && styles.fieldDivider]}>
          <Text style={styles.fieldLabel}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
          <TextInput
            style={styles.input}
            value={(form[field.key] as string) ?? ''}
            onChangeText={(v) => onChange(field.key, v)}
            placeholder={field.placeholder}
            placeholderTextColor="#BBB"
            keyboardType={field.keyboard ?? 'default'}
            autoCapitalize={field.autoCapitalize ?? 'sentences'}
            autoCorrect={false}
          />
        </View>
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen({ navigation, route }: Props) {
  const fromHome = route.params?.fromHome ?? false;
  const { profile, emptyProfile, saveProfile, isComplete } = useProfile();
  const [form, setForm] = useState<UserProfile>(profile ?? emptyProfile);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  // When opened from the Home checklist, back should return to Home (not MoreMenu)
  useLayoutEffect(() => {
    if (!fromHome) return;
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          label="Home"
          onPress={() => {
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'MoreMenu' }] }));
            (navigation.getParent() as BottomTabNavigationProp<RootTabParamList>)
              ?.navigate('Home');
          }}
        />
      ),
    });
  }, [fromHome, navigation]);

  const update = (key: keyof UserProfile, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to set a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });
    if (!result.canceled && result.assets[0].base64) {
      const asset    = result.assets[0];
      const mimeType = asset.mimeType ?? 'image/jpeg';
      const dataUri  = `data:${mimeType};base64,${asset.base64}`;
      // Update local form state and persist immediately — no Save tap required
      const updated = { ...form, photo: dataUri };
      setForm(updated);
      await saveProfile(updated);
    }
  };

  const handleSave = async () => {
    if (!form.firstName?.trim() || !form.lastName?.trim() || !form.ticketEmail?.trim()) {
      Alert.alert('Required Fields', 'Please fill in your first name, last name, and ticket email.');
      return;
    }
    setSaving(true);
    await saveProfile(form);
    setSaving(false);
    Alert.alert('Profile Saved', 'Your profile has been saved to this device.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleShare = async () => {
    if (!isComplete) {
      Alert.alert('Profile Incomplete', 'Save your profile first, then share it.');
      return;
    }
    setSharing(true);
    try {
      await shareVCard(profile!);
    } catch {
      Alert.alert('Error', 'Could not share contact. Please try again.');
    }
    setSharing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* ── Profile photo ── */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrap} onPress={handlePickPhoto} activeOpacity={0.8}>
              {form.photo ? (
                <Image
                  source={{ uri: form.photo }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={48} color={colors.tealLight} />
                </View>
              )}
              <View style={styles.avatarBadge}>
                <Ionicons name="camera" size={14} color={colors.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>
              {form.photo ? 'Tap to change photo' : 'Add a profile photo'}
            </Text>
          </View>

          {/* Not implementing QR checkin for 2026 */}
          {/* ── Section 1: Check-in ── */}
          {/* <Text style={styles.sectionHeader}>🎟 CHECK-IN</Text>
          <Text style={styles.sectionSubheader}>
            This is the email you used to purchase your ticket. It's encoded into your check-in QR code and never shared with other attendees.
          </Text>
          <FieldGroup fields={CHECK_IN_FIELDS} form={form} onChange={update} /> */}

          {/* ── Section 2: Networking ── */}
          <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>YOUR NETWORKING CARD</Text>
          <Text style={styles.sectionSubheader}>
            This info is what gets shared when you tap "Share My Contact" with a fellow camper. Contact email can be the same as your ticket email or different.
          </Text>
          <FieldGroup fields={NETWORKING_FIELDS} form={form} onChange={update} />

          <Text style={styles.requiredNote}>* Required fields</Text>

          {/* ── Save ── */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Profile'}</Text>
          </TouchableOpacity>

          {/* ── Share (only visible after save) ── */}
          {/* {isComplete && (
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShare}
              activeOpacity={0.85}
              disabled={sharing}
            >
              <Ionicons name="share-outline" size={20} color={colors.primary} />
              <Text style={styles.shareBtnText}>
                {sharing ? 'Opening Share Sheet…' : 'Share My Contact'}
              </Text>
            </TouchableOpacity>
          )} */}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },

  // ── Avatar ──
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrap: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.tealLight,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarHint: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },

  sectionHeader: {
    fontFamily: fontFamily.display,
    color: colors.textDark,
    fontSize: fontSize.sm,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  sectionSubheader: {
    fontFamily: fontFamily.body,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 0,
    ...shadow.sm,
    overflow: 'hidden',
  },
  fieldRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  fieldDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  fieldLabel: {
    fontFamily: fontFamily.bodyBold,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  required: { color: colors.primary },
  input: {
    fontFamily: fontFamily.body,
    color: colors.textDark,
    fontSize: fontSize.md,
    paddingVertical: 2,
  },

  requiredNote: {
    fontFamily: fontFamily.body,
    color: '#BBB',
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 0,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  saveBtnText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.white,
    fontSize: fontSize.md,
  },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  shareBtnText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.primary,
    fontSize: fontSize.md,
  },
});
