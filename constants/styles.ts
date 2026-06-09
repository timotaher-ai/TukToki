// Powered by OnSpace.AI — Shared Styles for تك توكي
import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from './theme';

export const sharedStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenPadding: {
    paddingHorizontal: Spacing.base,
  },

  // Cards
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  cardPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadow.md,
  },

  // Text
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    textAlign: 'right',
    lineHeight: Typography.base * Typography.normal,
  },
  caption: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.regular,
    color: Colors.textTertiary,
    textAlign: 'right',
  },

  // Buttons
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...Shadow.md,
  },
  btnPrimaryText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },
  btnSecondary: {
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  btnSecondaryText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },

  // Row / Flex
  row: {
    flexDirection: 'row-reverse' as const,
    alignItems: 'center' as const,
  },
  rowBetween: {
    flexDirection: 'row-reverse' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },

  // Badge
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center' as const,
  },
  badgeText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textInverse,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row-reverse' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  sectionLink: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
});
