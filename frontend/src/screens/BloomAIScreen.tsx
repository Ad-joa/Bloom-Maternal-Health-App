import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator, TextInput as RNTextInput, Keyboard } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { BounceButton } from '../components/BounceButton';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Send, Flower2, ArrowUp, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getAdvisory } from '../api/api';
import { useAuth } from '../context/AuthContext';

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
  "Can I drink coffee while pregnant?",
  "What are good exercises for the second trimester?",
  "How do I track fetal kicks?",
  "Tips for better sleep with a bump?",
  "When should I call my doctor?",
  "What is a birth plan?",
  "How can my partner support me right now?",
  "Are these Braxton Hicks contractions?",
  "What foods help with heartburn?",
  "Is it normal to feel this emotional?",
  "What should I ask at my next ultrasound?"
];

export default function BloomAIScreen({ navigation, isNested }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0.5)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hi ${user?.name ? user.name : 'there'}! I am Bloom AI. Do you have any questions about your pregnancy today? Describe what you are feeling.`, sender: 'ai' },
  ]);

  React.useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

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
      const response = await getAdvisory([userText]);
      const adviceStr = typeof response.advice === 'string' ? response.advice : response.advice.text;
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: adviceStr || "I am having trouble processing that right now.", 
        sender: 'ai' 
      }]);
    } catch (error) {
      console.error(error);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: "I couldn't reach the server. Please try again later.", 
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
      {!isNested && (
        <View style={styles.header}>
          <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
            Bloom AI
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium}>
            Your 24/7 intelligent pregnancy guide
          </Typography>
        </View>
      )}

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
                {msg.sender === 'ai' && (
                  <View style={styles.aiAvatar}>
                    <Flower2 size={18} color={theme.colors.background} />
                  </View>
                )}
                {msg.sender === 'user' ? (
                  <LinearGradient
                    colors={['#818CF8', '#6366F1']}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    style={[styles.bubble, styles.bubbleUser]}
                  >
                    <Typography variant="body" color="#fff">{msg.text}</Typography>
                  </LinearGradient>
                ) : (
                  <View style={[styles.bubble, styles.bubbleAI]}>
                    <Typography variant="body" color={theme.colors.textHigh}>{msg.text}</Typography>
                  </View>
                )}
              </View>
            ))}
            {loading && (
              <View style={[styles.messageRow, styles.messageRowAI]}>
                <View style={styles.aiAvatar}>
                  <Flower2 size={18} color={theme.colors.background} />
                </View>
                <Animated.View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble, { opacity: pulseAnim }]}>
                  <Typography variant="caption1" color={theme.colors.textMedium} style={{ fontStyle: 'italic' }}>Bloom AI is typing...</Typography>
                </Animated.View>
              </View>
            )}
          </ScrollView>
          
          <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={[styles.inputArea, { paddingBottom: keyboardVisible ? (Platform.OS === 'ios' ? 16 : 24) : Math.max(insets.bottom, 16) + 70 }]}>
            {/* Suggested Prompts */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContainer}>
              {suggestedPrompts.map((prompt, index) => (
                <BounceButton 
                  key={index} 
                  style={styles.promptChip} 
                  onPress={() => handlePromptPress(prompt)}
                >
                  <Typography variant="subhead" color={isDark ? '#E0E7FF' : theme.colors.primaryDark} style={{fontFamily: theme.typography.families.headingSemibold}}>{prompt}</Typography>
                </BounceButton>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <RNTextInput
                  placeholder="Ask anything..."
                  placeholderTextColor={theme.colors.textMedium}
                  value={inputText}
                  onChangeText={setInputText}
                  style={styles.input}
                  multiline
                  maxLength={500}
                />
              </View>
              <BounceButton 
                onPress={handleSend}
                disabled={!inputText.trim()}
              >
                {inputText.trim() ? (
                  <LinearGradient
                    colors={['#818CF8', '#6366F1']}
                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                    style={styles.sendButtonActive}
                  >
                    <ArrowUp color={theme.colors.background} size={22} strokeWidth={3} />
                  </LinearGradient>
                ) : (
                  <View style={styles.sendButtonDisabled}>
                    <ArrowUp color={theme.colors.textMedium} size={22} strokeWidth={3} />
                  </View>
                )}
              </BounceButton>
            </View>
          </BlurView>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontFamily: theme.typography.families.headingBold,
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
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryDark,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[2],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
    borderBottomLeftRadius: 4,
  },
  loadingBubble: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
  },
  inputArea: {
    paddingTop: theme.spacing[2],
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    minHeight: 48,
    maxHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.bodyRegular,
  },
  sendButtonActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  sendButtonDisabled: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptsContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    gap: theme.spacing[2],
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: theme.spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  }
});
