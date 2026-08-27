import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator, Modal, TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { BounceButton } from '../components/BounceButton';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons, Feather } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import { getBaseUrl } from '../api/api';

const socket = io(getBaseUrl() || 'http://127.0.0.1:8000');

export default function CommunityScreen({ navigation, isNested }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  React.useEffect(() => {
    // Listen for initial data payload
    socket.on('init_posts', (data) => {
      setPosts(data);
      setLoading(false);
    });

    // Listen for live updates
    socket.on('posts_updated', (data) => {
      setPosts(data);
    });

    // Fallback timeout in case the WebSocket fails to connect
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      socket.off('init_posts');
      socket.off('posts_updated');
      clearTimeout(timeout);
    };
  }, []);

  const toggleLike = (id: string) => {
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

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    socket.emit('create_post', {
      author: 'Mama',
      week: 32,
      content: newPostContent.trim()
    });
    
    setNewPostContent('');
    setModalVisible(false);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconWrapper}>
        <Ionicons name="chatbubbles-outline" size={48} color={theme.colors.primaryDark} />
      </View>
      <Typography variant="title2" style={{ marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
        It's quiet in here...
      </Typography>
      <Typography variant="body" color={theme.colors.textMedium} style={{ textAlign: 'center', paddingHorizontal: 32 }}>
        No one has posted in this community yet. Be the first to start the conversation!
      </Typography>
    </View>
  );

  const renderPost = ({ item, index }: { item: any, index: number }) => (
    <View >
      <Card variant="glass" style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Typography variant="headline" color={theme.colors.background}>{item.author[0]}</Typography>
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

  const renderContent = () => (
    <>
      {!isNested && (
        <View style={styles.header}>
          <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
            Community
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium}>
            Connect with mothers in Week 32
          </Typography>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={renderPost}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={[styles.listContent, posts.length === 0 && { flex: 1 }]}
            showsVerticalScrollIndicator={false}
          />
        )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.fabInner}>
          <Ionicons name="add" size={32} color={theme.colors.background} />
        </View>
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <Typography variant="title3">Start a Conversation</Typography>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textHigh} />
              </TouchableOpacity>
            </View>
            <RNTextInput
              style={[styles.modalInput, { color: theme.colors.textHigh, borderColor: theme.colors.border }]}
              placeholder="What's on your mind?"
              placeholderTextColor={theme.colors.textMedium}
              multiline
              autoFocus
              value={newPostContent}
              onChangeText={setNewPostContent}
            />
            <BounceButton 
              style={[styles.modalSubmitButton, { backgroundColor: newPostContent.trim() ? theme.colors.primary : theme.colors.border }]}
              onPress={handleCreatePost}
              disabled={!newPostContent.trim()}
            >
              <Typography variant="headline" color={theme.colors.background}>Post</Typography>
            </BounceButton>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );

  return (
    <View style={styles.container}>
      {isNested ? (
        renderContent()
      ) : (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          {renderContent()}
        </SafeAreaView>
      )}
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.15,
  },
  emptyStateIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
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
    bottom: 110, // Avoid bottom nav bar
    right: theme.spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing[5],
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing[5],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: theme.spacing[4],
    fontSize: 16,
    fontFamily: theme.typography.families.bodyRegular,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: theme.spacing[4],
  },
  modalSubmitButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  }
});
