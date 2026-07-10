import React, { useState } from 'react';
import { , Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { BounceButton } from '../components/BounceButton';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageSquare, Plus } from 'lucide-react-native';


const MOCK_POSTS = [
  {
    id: '1',
    author: 'Sarah M.',
    week: 24,
    content: "Is anyone else experiencing wild cravings at week 24? I literally just ate pickles with peanut butter and it was the best thing ever.",
    likes: 12,
    comments: 4,
    liked: false,
  },
  {
    id: '2',
    author: 'Emily R.',
    week: 12,
    content: "Finally made it to the second trimester! The morning sickness is slowly fading away. Hang in there mamas! 🌸",
    likes: 45,
    comments: 8,
    liked: true,
  },
  {
    id: '3',
    author: 'Jessica T.',
    week: 36,
    content: "Hospital bag is packed! What is one thing you wish you packed but forgot?",
    likes: 8,
    comments: 15,
    liked: false,
  }
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const renderPost = ({ item, index }: { item: typeof MOCK_POSTS[0], index: number }) => (
    <View >
      <Card style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Typography variant="headline" color="#fff">{item.author[0]}</Typography>
        </View>
        <View style={styles.postMeta}>
          <Typography variant="headline" color={theme.colors.textHigh}>{item.author}</Typography>
          <Typography variant="caption1" color={theme.colors.textMedium}>Week {item.week}</Typography>
        </View>
      </View>
      
      <Typography variant="body" color={theme.colors.textHigh} style={styles.postContent}>
        {item.content}
      </Typography>

      <View style={styles.postFooter}>
        <BounceButton style={styles.actionButton} onPress={() => toggleLike(item.id)}>
          <Heart size={20} color={item.liked ? theme.colors.primaryDark : theme.colors.textMedium} fill={item.liked ? theme.colors.primaryDark : 'transparent'} />
          <Typography variant="subhead" color={item.liked ? theme.colors.primaryDark : theme.colors.textMedium} style={{ marginLeft: 6 }}>
            {item.likes}
          </Typography>
        </BounceButton>
        <BounceButton style={styles.actionButton}>
          <MessageSquare size={20} color={theme.colors.textMedium} />
          <Typography variant="subhead" color={theme.colors.textMedium} style={{ marginLeft: 6 }}>
            {item.comments}
          </Typography>
        </BounceButton>
      </View>
    </Card>
    </View>
  );

  return (
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        <View  style={styles.header}>
          <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
            Community
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium}>
            Connect with other expecting mothers
          </Typography>
        </View>

        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Action Button */}
        <BounceButton style={styles.fab}>
          <Plus size={24} color="#fff" />
        </BounceButton>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing[4],
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  headerTitle: {
    fontFamily: theme.typography.families.headingBold,
  },
  listContent: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: 100, // Space for FAB
    gap: theme.spacing[4],
  },
  postCard: {
    padding: theme.spacing[4],
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[3],
  },
  postMeta: {
    justifyContent: 'center',
  },
  postContent: {
    lineHeight: 24,
    marginBottom: theme.spacing[4],
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing[3],
    gap: theme.spacing[6],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing[6],
    right: theme.spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  }
});
