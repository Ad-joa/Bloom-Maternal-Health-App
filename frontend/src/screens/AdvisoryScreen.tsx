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
import { Send, Flower2, AlertTriangle, User, Volume2, ArrowLeft, ArrowUp, Mic } from 'lucide-react-native';
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

export default function AdvisoryScreen({ navigation }: any) {
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
    const conditionText = user?.medical_conditions ? ` I've noted your condition (${user.medical_conditions}) and I'll keep it in mind.` : '';
    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        text: `Hi I'm Bloom, your pregnancy companion`,
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
          <View style={styles.userBubble}>
            <Typography variant="body" color={theme.colors.background}>{item.text}</Typography>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, styles.messageRowAI]}>
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
          <TouchableOpacity onPress={() => navigation?.goBack()} style={{ padding: 8 }}>
            <ArrowLeft color={theme.colors.textHigh} size={24} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          {/* Chat List or Empty State */}
          {messages.length === 1 && !loading ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.glowingRingOuter}>
                <View style={styles.glowingRingInner} />
              </View>
              <Typography variant="title2" style={styles.emptyStateText}>
                {messages[0].text}
              </Typography>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.chatListContent}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          )}

          {/* Typing Indicator */}
          {loading && (
            <Animated.View style={[styles.messageRow, styles.messageRowAI, { opacity: fadeAnim, marginBottom: 8 }]}>
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

          {/* Clean Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.textHigh }]}
              placeholder="Ask about your pregnancy..."
              placeholderTextColor={theme.colors.textMedium}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.micButton}>
              <Mic color={theme.colors.textMedium} size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
              onPress={() => handleSend(inputText)}
              disabled={!inputText.trim() || loading}
            >
              <ArrowUp color={theme.colors.background} size={20} />
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
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
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
    paddingBottom: 85, // Gives permanent space for the absolute tab bar
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
  },
  userBubble: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    borderBottomRightRadius: 6, // Squircle tail
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  aiBubble: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    borderBottomLeftRadius: 6, // Squircle tail
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
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: theme.spacing[3],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
    borderRadius: 30,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 44,
    maxHeight: 120,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: 16,
  },
  micButton: {
    padding: 10,
    marginRight: 4,
    marginBottom: 2,
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
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  glowingRingOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  glowingRingInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 8,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  emptyStateText: {
    fontFamily: theme.typography.families.headingBold,
    color: theme.colors.textHigh,
  }
});
