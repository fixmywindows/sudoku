import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/game-store';
import { POINTS_PACKAGES, THEMES, NO_ADS_PRICE } from '@/constants/game';
import { useTheme } from '@/hooks/useTheme';

export default function ShopScreen() {
  const { points, unlockTheme, unlockedThemes, noAds, purchaseNoAds, addPoints } = useGameStore();
  const { theme } = useTheme();
  
  // This function would be connected to your app store IAP implementation
  const handleBuyPoints = (packageId: string) => {
    const packageItem = POINTS_PACKAGES.find(pkg => pkg.id === packageId);
    if (!packageItem) return;
    
    // In a real app, this would trigger the app store purchase flow
    Alert.alert(
      'Purchase Points',
      `This would initiate a purchase for ${packageItem.points} points for ${packageItem.price}.`,
      [
        { text: 'Cancel' },
        { 
          text: 'Buy', 
          onPress: () => {
            // This is where you would handle successful purchase
            Alert.alert('Purchase Successful', `You've purchased ${packageItem.points} points!`);
            addPoints(packageItem.points);
          }
        }
      ]
    );
  };
  
  // This function would be connected to your app store IAP implementation for themes
  const handleBuyTheme = (themeId: string) => {
    const themeOption = THEMES.find((t) => t.id === themeId);
    if (!themeOption) return;
    
    if (unlockedThemes.includes(themeId)) {
      Alert.alert('Already Owned', 'You already own this theme.');
      return;
    }
    
    // In a real app with IAP, you might have separate product IDs for themes
    const success = unlockTheme(themeId);
    
    if (success) {
      Alert.alert('Theme Unlocked', `You've unlocked the ${themeOption.name} theme!`);
    } else {
      Alert.alert(
        'Not Enough Points',
        `You need ${themeOption.price} points to unlock this theme.`
      );
    }
  };
  
  // This function would be connected to your app store IAP implementation for removing ads
  const handleBuyNoAds = () => {
    if (noAds) {
      Alert.alert('Already Purchased', 'You already own the No Ads package.');
      return;
    }
    
    // In a real app, this would trigger the app store purchase flow
    Alert.alert(
      'Remove Ads',
      `This would initiate a purchase to remove ads for ${NO_ADS_PRICE}.`,
      [
        { text: 'Cancel' },
        {
          text: 'Buy',
          onPress: () => {
            // This is where you would handle successful purchase
            purchaseNoAds();
            Alert.alert('Success', 'Ads have been removed!');
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primaryColor }]}>Shop</Text>
        <View style={[styles.pointsContainer, { backgroundColor: theme.primaryColor }]}>
          <Text style={styles.pointsText}>Points: {points}</Text>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.primaryColor }]}>Buy Points</Text>
        
        <View style={styles.pointsPackages}>
          {POINTS_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard, 
                { 
                  borderColor: theme.primaryColor,
                  backgroundColor: theme.backgroundColor
                }
              ]}
              onPress={() => handleBuyPoints(pkg.id)}
            >
              <Text style={[styles.packagePoints, { color: theme.primaryColor }]}>
                {pkg.points} Points
              </Text>
              <Text style={[styles.packagePrice, { color: theme.primaryColor }]}>
                {pkg.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.noAdsButton,
            {
              backgroundColor: noAds ? '#94A3B8' : '#22C55E',
            },
          ]}
          onPress={handleBuyNoAds}
          disabled={noAds}
        >
          <Text style={styles.noAdsText}>
            {noAds ? 'Ads Removed' : `Remove Ads (${NO_ADS_PRICE})`}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.sectionTitle, { color: theme.primaryColor }]}>Themes</Text>
        
        <View style={styles.themesContainer}>
          {THEMES.filter((t) => t.id !== 'default').map((themeOption) => {
            const isUnlocked = unlockedThemes.includes(themeOption.id);
            
            return (
              <TouchableOpacity
                key={themeOption.id}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: themeOption.backgroundColor,
                    borderColor: themeOption.primaryColor,
                  },
                ]}
                onPress={() => handleBuyTheme(themeOption.id)}
              >
                <Text
                  style={[
                    styles.themeName,
                    {
                      color: themeOption.primaryColor,
                    },
                  ]}
                >
                  {themeOption.name}
                </Text>
                
                {!isUnlocked && (
                  <View
                    style={[
                      styles.themePriceBadge,
                      { backgroundColor: themeOption.primaryColor },
                    ]}
                  >
                    <Text style={styles.themePriceText}>{themeOption.price} pts</Text>
                  </View>
                )}
                
                {isUnlocked && (
                  <View
                    style={[
                      styles.themeUnlockedBadge,
                      { backgroundColor: themeOption.primaryColor },
                    ]}
                  >
                    <Text style={styles.themeUnlockedText}>Unlocked</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {Platform.OS !== 'web' && (
          <Text style={[styles.disclaimer, { color: theme.id === 'default' ? '#64748B' : theme.primaryColor }]}>
            All purchases are processed through the App Store or Google Play Store and are subject to their terms and conditions.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  pointsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  pointsPackages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  packageCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  packagePoints: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 16,
  },
  noAdsButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  noAdsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCard: {
    width: '48%',
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themePriceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themePriceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  themeUnlockedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeUnlockedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});