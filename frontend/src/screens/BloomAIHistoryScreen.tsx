import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Trash2, MessageCircle, ChevronRight } from 'lucide-react-native';
import { getAdvisorySessions, deleteAdvisorySession } from '../api/api';
import { useTranslation } from 'react-i18next';

interface Session {
  session_id: string;
  text: string;
  created_at: string;
}

export default function BloomAIHistoryScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getAdvisorySessions();
      setSessions(data);
    } catch (e) {
      console.error("Failed to load sessions", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (sessionId: string) => {
    Alert.alert(
      t('ai.deleteChat', 'Delete Chat'),
      t('ai.deleteChatConfirm', 'Are you sure you want to delete this chat history?'),
      [
        { text: t('common.cancel', 'Cancel'), style: 'cancel' },
        { 
          text: t('common.delete', 'Delete'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAdvisorySession(sessionId);
              setSessions(prev => prev.filter(s => s.session_id !== sessionId));
            } catch (e) {
              console.error("Failed to delete session", e);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Session }) => {
    const date = new Date(item.created_at);
    const dateString = date.toLocaleDateString();
    
    // Create a title from the first message
    let title = item.text || 'Chat Session';
    if (title.length > 40) {
      title = title.substring(0, 40) + '...';
    }

    return (
      <TouchableOpacity 
        style={[styles.sessionItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
        onPress={() => navigation.navigate('BloomAI', { sessionId: item.session_id })}
      >
        <View style={styles.iconContainer}>
          <MessageCircle size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.contentContainer}>
          <Typography variant="body" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingSemibold }}>
            {title}
          </Typography>
          <Typography variant="caption1" color={theme.colors.textMedium} style={{ marginTop: 4 }}>
            {dateString}
          </Typography>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.session_id)}
        >
          <Trash2 size={18} color={theme.colors.error || '#ff3b30'} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.center}>
          <MessageCircle size={48} color={theme.colors.textMedium} style={{ marginBottom: 16, opacity: 0.5 }} />
          <Typography variant="body" color={theme.colors.textMedium}>
            {t('ai.noHistory', 'No chat history found')}
          </Typography>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.session_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  }
});
