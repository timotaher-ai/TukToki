// Powered by OnSpace.AI — Onboarding Screen
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Pressable,
  FlatList, ViewToken,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('@/assets/images/onboarding1.png'),
    title: 'تك توكي',
    subtitle: 'تنقّل بذكاء في كل مكان',
    desc: 'طلب رحلة فورية أو مجدولة مع تتبع السائق لحظيًا وأسعار شفافة قبل التأكيد',
  },
  {
    id: '2',
    image: require('@/assets/images/onboarding2.png'),
    title: 'أمان أسرتك أولاً',
    subtitle: 'تحكم كامل في يدك',
    desc: 'تتبع أفراد عائلتك، حدد المناطق المسموحة، وتحكم في صلاحيات كل فرد بضغطة زر',
  },
  {
    id: '3',
    image: require('@/assets/images/onboarding3.png'),
    title: 'شارك واكسب',
    subtitle: 'محفظتك تنمو معك',
    desc: 'اشارك مع أصدقائك وأكسب مكافآت عليهم. محفظة رقمية متكاملة مع سحب سهل',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.slideImage}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={['transparent', 'rgba(13,27,62,0.9)', '#0D1B3E']}
              style={styles.gradient}
            />
            <View style={[styles.textBlock, { paddingBottom: insets.bottom + 180 }]}>
              <Text style={styles.appName}>{item.title}</Text>
              <Text style={styles.slideTitle}>{item.subtitle}</Text>
              <Text style={styles.slideDesc}>{item.desc}</Text>
            </View>
          </View>
        )}
      />

      {/* Dots */}
      <View style={[styles.dotsRow, { bottom: insets.bottom + 120 }]}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Buttons */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          style={styles.btnPrimary}
          onPress={handleNext}
        >
          <Text style={styles.btnPrimaryText}>
            {currentIndex < slides.length - 1 ? 'التالي' : 'ابدأ الآن'}
          </Text>
        </Pressable>
        {currentIndex < slides.length - 1 && (
          <Pressable onPress={handleSkip}>
            <Text style={styles.skipText}>تخطي</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B3E' },
  slide: { width, height },
  slideImage: { width, height, position: 'absolute' },
  gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.65 },
  textBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  appName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xxxl,
    fontWeight: Typography.extraBold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  slideTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slideDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: Typography.base * 1.7,
  },
  dotsRow: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  btnPrimaryText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: '#FFFFFF',
  },
  skipText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    paddingVertical: 8,
  },
});
