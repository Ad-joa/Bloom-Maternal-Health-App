import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator, TextInput as RNTextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { BounceButton } from '../components/BounceButton';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Send, Flower2 } from 'lucide-react-native';

import { getAdvisory } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
}

export default function BloomAIScreen({ navigation, isNested }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! I am Bloom AI. Do you have any questions about your pregnancy today? Describe what you are feeling.`, sender: 'ai' },
  ]);

  React.useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
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
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: adviceStr || "I am having trouble processing that right now.", 
        sender: 'ai' 
      }]);
    } catch (error) {
      console.error(error);
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

  const SUGGESTED_PROMPTS = [
    "Is it safe to eat sushi?",
    "Why am I so tired?",
    "What should I pack for the hospital?",
    "How to manage morning sickness?"
  ];

  const renderContent = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
                <View 
                  style={[
                    styles.bubble, 
                    msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAI
                  ]}
                >
                  <Typography 
                    variant="body" 
                    color={msg.sender === 'user' ? '#fff' : theme.colors.textHigh}
                  >
                    {msg.text}
                  </Typography>
                </View>
              </View>
            ))}
            {loading && (
              <View style={[styles.messageRow, styles.messageRowAI]}>
                <View style={styles.aiAvatar}>
                  <Flower2 size={18} color={theme.colors.background} />
                </View>
                <View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble]}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                </View>
              </View>
            )}
          </ScrollView>
          
          <BlurView intensity={80} tint="light" style={[styles.inputArea, { paddingBottom: keyboardVisible ? (Platform.OS === 'ios' ? 16 : 24) : 110 }]}>
            {/* Suggested Prompts */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContainer}>
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <BounceButton 
                  key={index} 
                  style={styles.promptChip} 
                  onPress={() => handlePromptPress(prompt)}
                >
                  <Typography variant="caption1" color={theme.colors.primaryDark} style={{fontFamily: theme.typography.families.headingBold}}>{prompt}</Typography>
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
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                disabled={!inputText.trim()}
              >
                <Send color={theme.colors.background} size={20} style={styles.sendIcon} />
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
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendIcon: {
    marginLeft: 2, // optical alignment
  },
  promptsContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    gap: theme.spacing[2],
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.radii.pill,
    marginRight: theme.spacing[2],
  }
});
