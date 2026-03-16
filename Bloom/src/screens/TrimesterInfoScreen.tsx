import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import ContentCard from '../components/ContentCard';
import { TrimesterContent } from '../constants/trimesterContent';

const TrimesterInfoScreen = () => {
  const [activeTab, setActiveTab] = useState<'T1' | 'T2' | 'T3'>('T1');

  const tabs = [
    { id: 'T1', label: 'Trimester 1' },
    { id: 'T2', label: 'Trimester 2' },
    { id: 'T3', label: 'Trimester 3' },
  ];

  const content = TrimesterContent[activeTab];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Learning Library" subtitle="Growth and health by trimester" />
      
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={content}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <ContentCard
            title={item.title}
            category={item.category}
            preview={item.preview}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.surface,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.white,
  },
  listContent: {
    padding: Spacing.lg,
  },
});

export default TrimesterInfoScreen;
