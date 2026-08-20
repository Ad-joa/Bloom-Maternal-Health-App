import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { BounceButton } from '../components/BounceButton';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons, Feather } from '@expo/vector-icons';
import { io } from 'socket.io-client';

// Connect to the Node.js backend
// IMPORTANT: In production, this should point to your real backend URL or use environment variables.
const socket = io('http://127.0.0.1:8000');

export default function CommunityScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Listen for initial data payload
    socket.on('init_posts', (data) => {
      setPosts(data);
      setLoading(false);
    });

    // Listen for live updates (e.g. someone else likes a post)
    socket.on('posts_updated', (data) => {
      setPosts(data);
    });

    return () => {
      socket.off('init_posts');
      socket.off('posts_updated');
    };
  }, []);

  const toggleLike = (id: string) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
    // Optimistic UI update for instantaneous feedback
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

    // Send to backend for real-time broadcast
    socket.emit('toggle_like', id);
  };

  const renderPost = ({ item, index }: { item: any, index: number }) => (
    <View >
      <Card variant="glass" style={styles.postCard}>
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
          <Ionicons name={item.liked ? "heart" : "heart-outline"} size={20} color={item.liked ? theme.colors.primaryDark : theme.colors.textMedium} />
          <Typography variant="subhead" color={item.liked ? theme.colors.primaryDark : theme.colors.textMedium} style={{ marginLeft: 6 }}>
            {item.likes}
          </Typography>
        </BounceButton>
        <BounceButton style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textMedium} />
          <Typography variant="subhead" color={theme.colors.textMedium} style={{ marginLeft: 6 }}>
            {item.comments}
          </Typography>
        </BounceButton>
      </View>
    </Card>
    </View>
  );

  return (
    <View style={styles.container}>

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        <View  style={styles.header}>
          <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
            Community
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium}>
            Connect with other expecting mothers
          </Typography>
        </View>

        {loading ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={renderPost}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

      </SafeAreaView>

      {/* Floating Action Button for Real-Time Testing */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          socket.emit('create_post', {
            author: 'You',
            week: 28,
            content: "Just testing the new Real-Time WebSocket connection! This should pop up for everyone instantly. 👋"
          });
        }}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    paddingBottom: 160, // Space for FAB and Bottom Nav
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
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
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    paddingTop: theme.spacing[3],
    gap: theme.spacing[6],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 110, // Avoid bottom nav bar
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
