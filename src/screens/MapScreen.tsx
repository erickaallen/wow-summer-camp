import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { venueAreas, VENUE_COORDS, VENUE_NAME, VENUE_ADDRESS } from '../data/venue';
import { VenueArea } from '../types';
import { colors, spacing, fontSize, fontWeight, radius } from '../theme';

export default function MapScreen() {
  const [selected, setSelected] = useState<VenueArea | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.venueName}>{VENUE_NAME}</Text>
        <Text style={styles.venueAddress}>{VENUE_ADDRESS}</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={VENUE_COORDS}
        showsUserLocation
        showsMyLocationButton
      >
        {venueAreas.map((area) => (
          <Marker
            key={area.id}
            coordinate={{ latitude: area.latitude, longitude: area.longitude }}
            onPress={() => setSelected(area)}
            pinColor={colors.primary}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{area.name}</Text>
                <Text style={styles.calloutDesc}>{area.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
      >
        {venueAreas.map((area) => (
          <TouchableOpacity
            key={area.id}
            style={[styles.chip, selected?.id === area.id && styles.chipActive]}
            onPress={() => setSelected(selected?.id === area.id ? null : area)}
          >
            <Text style={[styles.chipText, selected?.id === area.id && styles.chipTextActive]}>
              {area.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected && (
        <View style={styles.detailCard}>
          <Text style={styles.detailName}>{selected.name}</Text>
          <Text style={styles.detailDesc}>{selected.description}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  venueName: { color: colors.white, fontSize: fontSize.md, fontWeight: fontWeight.heavy, letterSpacing: 1 },
  venueAddress: { color: colors.surface, fontSize: fontSize.xs, marginTop: 2 },
  map: { flex: 1 },
  callout: { maxWidth: 180, padding: spacing.xs },
  calloutTitle: { fontWeight: fontWeight.bold, fontSize: fontSize.sm, color: colors.textDark },
  calloutDesc: { fontSize: fontSize.xs, color: '#555', marginTop: 2 },
  chipScroll: { maxHeight: 56 },
  chipRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.teal,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.teal, fontWeight: fontWeight.bold, fontSize: fontSize.xs },
  chipTextActive: { color: colors.white },
  detailCard: {
    backgroundColor: colors.surface,
    borderTopWidth: 3,
    borderTopColor: colors.primary,
    padding: spacing.md,
  },
  detailName: { color: colors.primary, fontSize: fontSize.md, fontWeight: fontWeight.heavy },
  detailDesc: { color: '#555', fontSize: fontSize.sm, marginTop: spacing.xs },
});
