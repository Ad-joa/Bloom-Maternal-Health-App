import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
}

export default function BloomAIScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi Sarah! I am Bloom AI. Do you have any questions about your pregnancy today?', sender: 'ai' },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const newMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: "That's completely normal for your second trimester! However, if the pain becomes sharp or continuous, please use our Symptom Check.", 
        sender: 'ai' 
      }]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <ScrollView contentContainerStyle={styles.chatContainer}>
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
        </ScrollView>
        
        <View style={styles.inputArea}>
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
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: theme.spacing[4],
    gap: theme.spacing[4],
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bubble: {
    maxWidth: '75%',
    padding: theme.spacing[4],
    borderRadius: theme.radii.xl,
  },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputArea: {
    padding: theme.spacing[4],
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  input: {
    minHeight: 48,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
