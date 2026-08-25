import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Animated,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAdvisory } from '../api/api';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { Send, Sparkles, AlertTriangle, User, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  isDanger?: boolean;
}

const QUICK_REPLIES = [
  "I'm feeling very nauseous",
  "Is it safe to eat sushi?",
  "I have a mild headache",
  "How much water should I drink?"
];

export default function AdvisoryScreen() {
  const { theme } = useTheme();
  const { isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  // Animation for the typing indicator
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Initial Welcome Message
    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        text: `Hi ${user?.name || 'Mama'}! I'm Bloom AI. I'm here to answer any questions about your symptoms, diet, or pregnancy journey. How are you feeling today?`,
      }
    ]);
  }, [user]);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 0.3, duration: 500, useNativeDriver: true })
        ])
      ).start();
    } else {
      fadeAnim.setValue(1);
      fadeAnim.stopAnimation();
    }
  }, [loading]);

  const handleSpeak = (text: string) => {
    Speech.stop();
    Speech.speak(text);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await getAdvisory([text.trim()]);
      const adviceStr = typeof response.advice === 'string' ? response.advice : response.advice?.text;
      
      // Basic client-side danger check just for UI styling (the backend also checks this)
      const isDanger = text.toLowerCase().includes('severe bleeding') || text.toLowerCase().includes('chest pain') || text.toLowerCase().includes('convulsions');
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: adviceStr || "I'm having trouble connecting right now. Please try again.",
        isDanger: response.severity === 'danger' || isDanger
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "Sorry, I encountered an error connecting to my servers.",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    if (isUser) {
      return (
        <View style={[styles.messageRow, styles.messageRowUser]}>
          <LinearGradient 
            colors={[theme.colors.primary, theme.colors.primaryDark]} 
            style={styles.userBubble}
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          >
            <Typography variant="body" color={theme.colors.background}>{item.text}</Typography>
          </LinearGradient>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, styles.messageRowAI]}>
        <View style={styles.aiAvatar}>
          {item.isDanger ? (
             <AlertTriangle color={theme.colors.background} size={16} />
          ) : (
             <Sparkles color={theme.colors.background} size={16} />
          )}
        </View>
        <View style={[styles.aiBubble, item.isDanger && styles.aiBubbleDanger]}>
          <Typography variant="body" color={theme.colors.textHigh} style={{lineHeight: 22}}>
            {item.text}
          </Typography>
          <TouchableOpacity style={styles.speakButton} onPress={() => handleSpeak(item.text)}>
            <Volume2 size={16} color={theme.colors.textMedium} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleWrap}>
            <Sparkles color={theme.colors.primaryDark} size={24} style={{ marginRight: 8 }} />
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.headerTitle}>
              Bloom AI
            </Typography>
          </View>
          <Typography variant="caption1" color={theme.colors.textMedium}>
            Your intelligent maternal assistant
          </Typography>
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          {/* Chat List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatListContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          {/* Typing Indicator */}
          {loading && (
            <Animated.View style={[styles.messageRow, styles.messageRowAI, { opacity: fadeAnim, marginBottom: 8 }]}>
              <View style={styles.aiAvatar}>
                <Sparkles color={theme.colors.background} size={16} />
              </View>
              <View style={styles.aiBubble}>
                <Typography variant="body" color={theme.colors.textMedium}>Bloom AI is typing...</Typography>
              </View>
            </Animated.View>
          )}

          {/* Quick Replies */}
          {messages.length === 1 && !loading && (
            <View style={styles.quickRepliesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always">
                {QUICK_REPLIES.map((reply, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.quickReplyPill}
                    onPress={() => handleSend(reply)}
                  >
                    <Typography variant="subhead" color={theme.colors.primaryDark}>{reply}</Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Message Bloom AI..."
              placeholderTextColor={theme.colors.textMedium}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
              onPress={() => handleSend(inputText)}
              disabled={!inputText.trim() || loading}
            >
              <Send color={theme.colors.background} size={20} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: isDark ? theme.colors.background : theme.colors.surface,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: theme.typography.families.headingBold,
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingBottom: 110, // Gives permanent space for the absolute tab bar
  },
  chatListContent: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[2],
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[4],
    maxWidth: '85%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end', // Aligns avatar to bottom of bubble
  },
  userBubble: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiBubble: {
    backgroundColor: isDark ? theme.colors.background : theme.colors.surface,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  aiBubbleDanger: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: theme.colors.danger + '40',
  },
  speakButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    padding: 4,
  },
  quickRepliesContainer: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  quickReplyPill: {
    backgroundColor: theme.colors.primaryLight + '30',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: 20,
    marginRight: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.primaryLight + '50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: isDark ? theme.colors.background : theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: theme.spacing[4],
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 44,
    maxHeight: 120,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: 16,
    color: theme.colors.textHigh,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing[3],
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.textMedium,
  }
});
