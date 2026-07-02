import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { BounceButton } from '../components/BounceButton';
import { Send, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getAdvisory } from '../api/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
}

export default function BloomAIScreen() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! I am Bloom AI. Do you have any questions about your pregnancy today? Describe what you are feeling.`, sender: 'ai' },
  ]);

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
      const response = await getAdvisory([userText], user?.id);
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

  return (
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.container}
          keyboardVerticalOffset={90}
        >
          <View style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
              Bloom AI
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium}>
              Your intelligent pregnancy assistant
            </Typography>
          </View>

          <ScrollView 
            ref={scrollViewRef}
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
                    <Typography style={{fontSize: 16}}>🌸</Typography>
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
                  <Typography style={{fontSize: 16}}>🌸</Typography>
                </View>
                <View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble]}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                </View>
              </View>
            )}
          </ScrollView>
          
          <View style={styles.inputArea}>
            {/* Suggested Prompts */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContainer}>
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <BounceButton 
                  key={index} 
                  style={styles.promptChip} 
                  onPress={() => handlePromptPress(prompt)}
                >
                  <Sparkles size={14} color={theme.colors.primaryDark} style={{ marginRight: 6 }} />
                  <Typography variant="caption1" color={theme.colors.primaryDark}>{prompt}</Typography>
                </BounceButton>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Ask anything..."
                value={inputText}
                onChangeText={setInputText}
                style={styles.input}
                containerStyle={{ marginBottom: 0, flex: 1 }}
              />
              <Button 
                title="" 
                onPress={handleSend}
                style={styles.sendButton}
              >
                <Send color="#fff" size={20} />
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    paddingTop: theme.spacing[2],
    paddingBottom: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontFamily: theme.typography.families.headingBold,
  },
  chatContainer: {
    padding: theme.spacing[4],
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[8],
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[2],
    shadowColor: theme.colors.primaryDark,
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
    shadowColor: theme.colors.primaryDark,
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
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  loadingBubble: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
  },
  inputArea: {
    padding: theme.spacing[4],
    paddingTop: theme.spacing[2],
    paddingBottom: Platform.OS === 'ios' ? theme.spacing[2] : theme.spacing[4],
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: theme.spacing[4],
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    width: 48,
    height: 48,
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing[2],
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
