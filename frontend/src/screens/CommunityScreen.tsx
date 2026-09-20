import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View, StyleSheet, Dimensions, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, Modal, TextInput as RNTextInput,
  ActivityIndicator, Animated, LayoutAnimation, Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BounceButton } from '../components/BounceButton';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons } from '@expo/vector-icons';
import { Heart, MessageCircle, PenLine, X, Users, Sparkles, TrendingUp } from 'lucide-react-native';
import { io } from 'socket.io-client';
import { getBaseUrl } from '../api/api';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const socket = io(getBaseUrl() || 'http://127.0.0.1:8000', {
  autoConnect: false
});

// Deterministic color based on author name for consistent avatar colors
const AVATAR_COLORS = [
  ['#F472B6', '#EC4899'],
  ['#A78BFA', '#7C3AED'],
  ['#34D399', '#059669'],
  ['#60A5FA', '#2563EB'],
  ['#FBBF24', '#D97706'],
  ['#F87171', '#DC2626'],
  ['#38BDF8', '#0284C7'],
];
const getAvatarGradient = (name: string) => {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'q_a', label: 'Q&A', icon: MessageCircle },
  { id: 'support', label: 'Support', icon: Users },
];

function TimeAgo({ date }: { date: string }) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let text = 'just now';
  if (diffMins >= 1 && diffMins < 60) text = `${diffMins}m ago`;
  else if (diffHours >= 1 && diffHours < 24) text = `${diffHours}h ago`;
  else if (diffDays >= 1) text = `${diffDays}d ago`;

  return <Typography variant="caption1" color="rgba(150,150,160,1)">{text}</Typography>;
}

export default function CommunityScreen({ navigation, isNested }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const fadeAnim = useRef(new Animated.Value(0)).current;



  const saveLikes = async (newLikes: Set<string>) => {
    try {
      await AsyncStorage.setItem('@bloom_liked_posts', JSON.stringify(Array.from(newLikes)));
    } catch (e) {
      console.error("Failed to save likes", e);
    }
  };

  React.useEffect(() => {
    const loadLikes = async () => {
      try {
        const stored = await AsyncStorage.getItem('@bloom_liked_posts');
        if (stored) {
          setLikedPostIds(new Set(JSON.parse(stored)));
        }
      } catch (e) {
        console.error("Failed to load likes", e);
      }
    };
    loadLikes();
    
    // Connect socket with auth token
    const connectSocket = async () => {
      const storedToken = await AsyncStorage.getItem('@bloom_token');
      socket.auth = { token: storedToken };
      socket.connect();
    };
    connectSocket();

    socket.on('init_posts', (data) => {
      setPosts(data);
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    });

    socket.on('post_liked', ({ postId, likes }) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes } : p));
    });

    socket.on('post_created', (newPost) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPosts(prev => [newPost, ...prev]);
    });

    socket.on('connect_error', (err) => {
      console.error("Socket connect error:", err.message);
      setLoading(false);
    });

    const timeout = setTimeout(() => setLoading(false), 2500);
    return () => {
      socket.off('init_posts');
      socket.off('post_liked');
      socket.off('post_created');
      socket.off('connect_error');
      socket.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  const toggleLike = useCallback((id: string) => {
    const isLiked = likedPostIds.has(id);
    
    // Optimistic UI Update
    const newLikedIds = new Set(likedPostIds);
    if (isLiked) {
      newLikedIds.delete(id);
    } else {
      newLikedIds.add(id);
    }
    setLikedPostIds(newLikedIds);
    saveLikes(newLikedIds);

    // Tell server
    socket.emit('toggle_like', { postId: id, isLiked: !isLiked });
  }, [likedPostIds]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    socket.emit('create_post', {
      author: user?.name || 'Mama',
      week: (() => {
        if (user?.due_date) {
          const due = new Date(user.due_date);
          const now = new Date();
          const msLeft = due.getTime() - now.getTime();
          const weeksLeft = msLeft / (7 * 24 * 60 * 60 * 1000);
          return Math.max(1, Math.min(42, Math.round(40 - weeksLeft)));
        }
        return null;
      })(),
      content: newPostContent.trim(),
    });
    setNewPostContent('');
    setModalVisible(false);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (activeTab === 'all') return true;
      if (activeTab === 'trending') return p.likes >= 3;
      if (activeTab === 'q_a') return p.content.includes('?');
      if (activeTab === 'support') return p.likes < 3 && !p.content.includes('?');
      return true;
    });
  }, [posts, activeTab]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={isDark ? ['rgba(168,85,247,0.15)', 'rgba(236,72,153,0.10)'] : ['rgba(168,85,247,0.08)', 'rgba(236,72,153,0.05)']}
        style={styles.emptyIconRing}
      >
        <Users color={theme.colors.primaryDark} size={40} />
      </LinearGradient>
      <Typography variant="title2" style={{ marginTop: 20, marginBottom: 8, textAlign: 'center', fontFamily: theme.typography.families.headingBold }}>
        {activeTab === 'trending' ? 'No trending posts yet' : "It's quiet in here..."}
      </Typography>
      <Typography variant="body" color={theme.colors.textMedium} style={{ textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 }}>
        {t('support.emptyDesc', 'Be the first to start a conversation in this community!')}
      </Typography>
      <BounceButton style={[styles.emptyCtaButton, { backgroundColor: theme.colors.primaryDark }]} onPress={() => setModalVisible(true)}>
        <PenLine color="#fff" size={16} />
        <Typography variant="subhead" color="#fff" style={{ marginLeft: 8, fontFamily: theme.typography.families.headingBold }}>Start a Post</Typography>
      </BounceButton>
    </View>
  ), [isDark, theme, activeTab, t]);

  const renderPost = useCallback(({ item }: { item: any }) => (
    <PostItem 
      item={{...item, liked: likedPostIds.has(item.id)}} 
      toggleLike={toggleLike} 
      theme={theme} 
      isDark={isDark} 
      fadeAnim={fadeAnim} 
      styles={styles} 
    />
  ), [toggleLike, theme, isDark, fadeAnim, styles, likedPostIds]);

  const renderContent = () => (
    <>
      {/* Header */}
      {!isNested && (
        <View style={styles.header}>
          <View>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingBold }}>
              Community
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={{ marginTop: 2 }}>
              Connect, share and support each other 💜
            </Typography>
          </View>
          <BounceButton style={[styles.composeBtn, { backgroundColor: theme.colors.primaryDark }]} onPress={() => setModalVisible(true)}>
            <PenLine color="#fff" size={18} />
            <Typography variant="subhead" color="#fff" style={{ marginLeft: 6, fontFamily: theme.typography.families.headingBold }}>Post</Typography>
          </BounceButton>
        </View>
      )}

      {/* Category Tabs */}
      <View style={styles.tabsRow}>
        {CATEGORY_TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <BounceButton key={tab.id} onPress={() => setActiveTab(tab.id)} style={styles.tabBtn}>
              <View style={[styles.tabInner, isActive && { backgroundColor: theme.colors.primaryDark }]}>
                <Icon size={14} color={isActive ? '#fff' : theme.colors.textMedium} />
                <Typography
                  variant="caption1"
                  color={isActive ? '#fff' : theme.colors.textMedium}
                  style={{ marginLeft: 5, fontFamily: isActive ? theme.typography.families.headingBold : theme.typography.families.bodyRegular }}
                >
                  {tab.label}
                </Typography>
              </View>
            </BounceButton>
          );
        })}
      </View>

      {/* Posts List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Typography variant="body" color={theme.colors.textMedium} style={{ marginTop: 12 }}>Loading community posts...</Typography>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id}
          renderItem={renderPost}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[styles.listContent, filteredPosts.length === 0 && { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={11}
          removeClippedSubviews={Platform.OS === 'android'}
          updateCellsBatchingPeriod={50}
        />
      )}

      {/* Floating Action Button */}
      {!isNested && (
        <BounceButton style={[styles.fab, { bottom: insets.bottom + 90 }]} onPress={() => setModalVisible(true)}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.fabGradient}
          >
            <PenLine color="#fff" size={22} />
          </LinearGradient>
        </BounceButton>
      )}

      {/* Compose Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1A1A2E' : '#FAFAFA' }]}>
            <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />

            {/* Handle */}
            <View style={styles.modalHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={[styles.modalAvatar, { overflow: 'hidden' }]}>
                <LinearGradient colors={getAvatarGradient(user?.name || 'M') as [string, string]} style={StyleSheet.absoluteFillObject} />
                <Typography variant="headline" color="#fff" style={{ fontFamily: theme.typography.families.headingBold }}>
                  {(user?.name || 'M')[0].toUpperCase()}
                </Typography>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Typography variant="subhead" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingBold }}>
                  {user?.name || 'Mama'}
                </Typography>
                <Typography variant="caption1" color={theme.colors.textMedium}>Sharing with Community</Typography>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X color={theme.colors.textHigh} size={20} />
              </TouchableOpacity>
            </View>

            {/* Text Input */}
            <RNTextInput
              style={[styles.modalInput, { color: theme.colors.textHigh }]}
              placeholder="What's on your mind? Ask a question, share a tip, or offer support..."
              placeholderTextColor={theme.colors.textMedium}
              multiline
              autoFocus
              value={newPostContent}
              onChangeText={setNewPostContent}
              textAlignVertical="top"
            />

            {/* Character count & Post Button */}
            <View style={styles.modalFooter}>
              <Typography variant="caption1" color={newPostContent.length > 450 ? '#EF4444' : theme.colors.textMedium}>
                {newPostContent.length}/500
              </Typography>
              <BounceButton
                style={[styles.postBtn, { backgroundColor: newPostContent.trim() ? theme.colors.primaryDark : theme.colors.border }]}
                onPress={handleCreatePost}
                disabled={!newPostContent.trim()}
              >
                <Typography variant="subhead" color="#fff" style={{ fontFamily: theme.typography.families.headingBold }}>
                  Share Post
                </Typography>
              </BounceButton>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );

  return (
    <View style={styles.container}>
      <BackgroundMesh />
      {isNested ? renderContent() : (
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          {renderContent()}
        </SafeAreaView>
      )}
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  composeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tabBtn: { flexShrink: 1 },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 160,
    paddingTop: 4,
  },
  postCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekBadge: {
    backgroundColor: isDark ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  hotBadge: {
    backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.10)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postContent: {
    lineHeight: 24,
    marginBottom: 14,
  },
  postFooter: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    paddingTop: 12,
  },
  actionBtn: {},
  actionBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyIconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    overflow: 'hidden',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  },
  modalInput: {
    fontSize: 16,
    fontFamily: undefined,
    lineHeight: 24,
    minHeight: 120,
    maxHeight: 200,
    marginBottom: 16,
    paddingTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    paddingTop: 14,
  },
  postBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
});

const PostItem = React.memo(({ item, toggleLike, theme, isDark, fadeAnim, styles }: any) => {
  const gradColors = getAvatarGradient(item.author || 'M');
  const handleLike = useCallback(() => toggleLike(item.id), [toggleLike, item.id]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.postCard, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}>
        <BlurView intensity={isDark ? 25 : 50} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
        <LinearGradient
          colors={isDark ? ['rgba(255,255,255,0.04)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Header */}
        <View style={styles.postHeader}>
          <LinearGradient colors={gradColors as [string, string]} style={styles.avatar}>
            <Typography variant="headline" color="#fff" style={{ fontFamily: theme.typography.families.headingBold }}>
              {(item.author || 'M')[0].toUpperCase()}
            </Typography>
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Typography variant="subhead" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingBold }}>
              {item.author || 'Mama'}
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              {item.week && (
                <View style={styles.weekBadge}>
                  <Typography variant="caption2" color={theme.colors.primaryDark} style={{ fontFamily: theme.typography.families.headingBold }}>
                    Week {item.week}
                  </Typography>
                </View>
              )}
              {item.created_at && <TimeAgo date={item.created_at} />}
            </View>
          </View>
          {item.likes >= 5 && (
            <View style={styles.hotBadge}>
              <Typography variant="caption2" color="#F59E0B" style={{ fontFamily: theme.typography.families.headingBold }}>🔥 Hot</Typography>
            </View>
          )}
        </View>

        {/* Content */}
        <Typography variant="body" color={theme.colors.textHigh} style={styles.postContent}>
          {item.content}
        </Typography>

        {/* Footer */}
        <View style={styles.postFooter}>
          <BounceButton style={styles.actionBtn} onPress={handleLike}>
            <View style={[styles.actionBtnInner, item.liked && { backgroundColor: 'rgba(236,72,153,0.12)' }]}>
              <Heart
                size={18}
                color={item.liked ? '#EC4899' : theme.colors.textMedium}
                fill={item.liked ? '#EC4899' : 'transparent'}
              />
              <Typography
                variant="caption1"
                color={item.liked ? '#EC4899' : theme.colors.textMedium}
                style={{ marginLeft: 5, fontFamily: theme.typography.families.headingBold }}
              >
                {item.likes}
              </Typography>
            </View>
          </BounceButton>
          <BounceButton style={styles.actionBtn}>
            <View style={styles.actionBtnInner}>
              <MessageCircle size={18} color={theme.colors.textMedium} />
              <Typography variant="caption1" color={theme.colors.textMedium} style={{ marginLeft: 5, fontFamily: theme.typography.families.headingBold }}>
                {item.comments || 0}
              </Typography>
            </View>
          </BounceButton>
        </View>
      </View>
    </Animated.View>
  );
});
