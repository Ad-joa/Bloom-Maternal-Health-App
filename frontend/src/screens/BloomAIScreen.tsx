import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator, TextInput as RNTextInput, Keyboard } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { BounceButton } from '../components/BounceButton';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Send, ArrowUp, ArrowLeft, Mic, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getAdvisory, getSymptomLogs, getAdvisoryHistoryBySession } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
}

const PROMPT_POOL = [
  "Is it safe to eat sushi?",
  "Why am I so tired?",
  "What should I pack for the hospital?",
  "How to manage morning sickness?",
  "How is my baby developing this week?",
  "What should I eat for more energy?",
  "Are these Braxton Hicks contractions?",
  "What foods help with heartburn?",
  "Is it normal to feel this emotional?",
  "What should I ask at my next ultrasound?",
  "Review my recent health logs",
  "Any concerns based on my vitals?"
];

export default function BloomAIScreen({ navigation, route, isNested }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const hasFetchedInsight = useRef(false);
  const [currentSessionId, setCurrentSessionId] = useState(route?.params?.sessionId || (Date.now().toString(36) + Math.random().toString(36).substring(2)));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => {
              setCurrentSessionId(Date.now().toString(36) + Math.random().toString(36).substring(2));
              setMessages([{ id: '1', text: t('ai.welcomeMsg', `Hi I'm Bloom, Your Maternal Health companion`), sender: 'ai' }]);
              hasFetchedInsight.current = false;
            }}
            style={{ marginRight: 16 }}
          >
            <Typography variant="subhead" color={theme.colors.primary} style={{ fontFamily: theme.typography.families.headingSemibold }}>
              New Chat
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('BloomAIHistory')}>
            <Ionicons name="time-outline" size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, theme]);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: t('ai.welcomeMsg', `Hi I'm Bloom, Your Maternal Health companion`), sender: 'ai' },
  ]);

  React.useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  // Proactive health check-in: fetch recent logs and ask AI for a personalized greeting
  React.useEffect(() => {
    if (hasFetchedInsight.current || !user?.id) return;
    hasFetchedInsight.current = true;

    const fetchProactiveInsight = async () => {
      try {
        const logs = await getSymptomLogs(user.id);
        if (!logs || logs.length === 0) return; // No logs, keep the default greeting

        // Build a summary of recent activity to send to the AI
        const recentLog = logs[0];
        const logSummary = [
          recentLog.symptoms ? `Symptoms: ${recentLog.symptoms}` : null,
          recentLog.severity ? `Severity: ${recentLog.severity}` : null,
          recentLog.blood_pressure ? `BP: ${recentLog.blood_pressure}` : null,
          recentLog.weight ? `Weight: ${recentLog.weight}kg` : null,
          recentLog.notes ? `Notes: ${recentLog.notes}` : null,
        ].filter(Boolean).join(', ');

        if (!logSummary) return;

        setLoading(true);

        const proactivePrompt = `The user just opened the chat. Based on her recent health logs, give a brief, warm, proactive check-in. Acknowledge her most recent logged data (${logSummary}) and offer one helpful tip or reassurance. Keep it to 2-3 sentences max.`;

        const response = await getAdvisory([proactivePrompt], currentSessionId);
        const adviceStr = typeof response.advice === 'string' ? response.advice : response.advice?.text;

        if (adviceStr) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setMessages(prev => [...prev, {
            id: 'proactive-insight',
            text: adviceStr,
            sender: 'ai'
          }]);
        }
      } catch (e) {
        // Silently fail — the user still has the generic greeting
        console.log('Proactive insight fetch failed:', e);
      } finally {
        setLoading(false);
      }
    };

    // First fetch history
    const loadHistory = async () => {
      try {
        const history = await getAdvisoryHistoryBySession(currentSessionId);
        if (history && history.length > 0) {
          const formattedHistory = history.map((msg: any) => ({
            id: msg.id.toString(),
            text: msg.text,
            sender: msg.sender
          }));
          
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          // Prepend welcome message, then append history
          setMessages([
            { id: '1', text: t('ai.welcomeMsg', `Hi I'm Bloom, Your Maternal Health companion`), sender: 'ai' },
            ...formattedHistory
          ]);
        } else {
          // If no history, do proactive insight
          const timer = setTimeout(fetchProactiveInsight, 1200);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    };
    
    loadHistory();
    
  }, [user?.id, currentSessionId]);

  React.useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.5, duration: 600, useNativeDriver: true })
        ])
      ).start();
    } else {
      pulseAnim.setValue(0.5);
    }
  }, [loading]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Smooth layout animation for new bubbles
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Add user message
    const userText = inputText.trim();
    const newMsg: Message = { id: Date.now().toString(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Call our rule-based backend engine!
      const response = await getAdvisory([userText], currentSessionId);
      const adviceStr = typeof response.advice === 'string' ? response.advice : response.advice.text;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: adviceStr || t('ai.processError', "I am having trouble processing that right now."),
        sender: 'ai'
      }]);
    } catch (error) {
      console.error(error);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: t('ai.error', "I couldn't reach the server. Please try again later."),
        sender: 'ai'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptPress = (prompt: string) => {
    setInputText(prompt);
  };

  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);

  React.useEffect(() => {
    // Randomly select 4 prompts from the pool every time the screen mounts
    const shuffled = [...PROMPT_POOL].sort(() => 0.5 - Math.random());
    setSuggestedPrompts(shuffled.slice(0, 4));
  }, []);

  const renderContent = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? (isNested ? 180 : 90) : 0}
    >
      {/* Header handled by React Navigation */}

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
        <View style={styles.chatWrapper}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.chatContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === 'user' ? styles.messageRowUser : styles.messageRowAI
              ]}
            >
              {msg.sender === 'user' ? (
                <View style={[styles.bubble, styles.bubbleUser]}>
                  <Typography variant="body" color="#fff">{msg.text}</Typography>
                </View>
              ) : (
                <>
                  <View style={styles.aiAvatarSmallOuter}>
                    <View style={styles.aiAvatarSmallInner} />
                  </View>
                  <View style={[styles.bubble, styles.bubbleAI]}>
                    <Typography variant="body" color={theme.colors.textHigh}>{msg.text}</Typography>
                  </View>
                </>
              )}
            </View>
          ))}
          {loading && (
            <View style={[styles.messageRow, styles.messageRowAI]}>
              <View style={styles.aiAvatarSmallOuter}>
                <View style={styles.aiAvatarSmallInner} />
              </View>
              <Animated.View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble, { opacity: pulseAnim }]}>
                <Typography variant="caption1" color={theme.colors.textMedium} style={{ fontStyle: 'italic' }}>{t('ai.typing', 'Bloom AI is typing...')}</Typography>
              </Animated.View>
            </View>
          )}
        </ScrollView>
        </View>
      )}

      <View style={[styles.inputArea, { paddingBottom: keyboardVisible ? (Platform.OS === 'ios' ? 16 : 24) : Math.max(insets.bottom, 16) + 20 }]}>
        {/* Suggested Prompts */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContainer}>
          {suggestedPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.promptChip}
              onPress={() => handlePromptPress(prompt)}
            >
              <Typography variant="subhead" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingSemibold }}>{prompt}</Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <RNTextInput
            placeholder={t('ai.placeholder', 'Ask about your pregnancy...')}
            placeholderTextColor={theme.colors.textMedium}
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.micButton}>
            <Mic color={theme.colors.textMedium} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={[styles.sendButtonActive, !inputText.trim() && styles.sendButtonDisabled]}
          >
            <ArrowUp color={theme.colors.background} size={22} strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
    paddingBottom: theme.spacing[2],
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  chatWrapper: {
    flex: 1,
  },
  clearButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 20,
    padding: 8,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  chatContainer: {
    padding: theme.spacing[4],
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: theme.spacing[2],
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  aiAvatarSmallOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiAvatarSmallInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  bubble: {
    maxWidth: '80%',
    padding: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 6,
    borderRadius: 24,
  },
  bubbleAI: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    borderBottomLeftRadius: 6,
    borderRadius: 24,
  },
  loadingBubble: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
  },
  inputArea: {
    paddingTop: theme.spacing[2],
    backgroundColor: 'transparent',
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
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 14 : 12,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.bodyRegular,
    minHeight: 44,
  },
  micButton: {
    padding: 10,
    marginRight: 4,
    marginBottom: 2,
  },
  sendButtonActive: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.textMedium,
  },
  promptsContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    gap: theme.spacing[2],
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: theme.spacing[3],
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
    textAlign: 'center',
    paddingHorizontal: theme.spacing[6],
  }
});
