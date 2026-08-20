import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from './Typography';
import { Card } from './Card';
import { Button } from './Button';
import { Lightbulb, Droplet, Moon, Apple } from 'lucide-react-native';

const TIPS = [
  {
    type: 'hydration',
    icon: <Droplet color={theme.colors.info} size={32} />,
    title: 'Hydration Check',
    fact: 'Did you know? Pregnant women need about 10 cups (80 ounces) of water daily. Staying hydrated reduces swelling and prevents cramps!'
  },
  {
    type: 'sleep',
    icon: <Moon color={theme.colors.primaryDark} size={32} />,
    title: 'Sleep Tip',
    fact: 'Sleeping on your left side improves blood flow and nutrients to the placenta. Try using a pillow between your knees for comfort.'
  },
  {
    type: 'diet',
    icon: <Apple color={theme.colors.danger} size={32} />,
    title: 'Nutrition Fact',
    fact: 'Iron is crucial right now! Pairing iron-rich local foods (like Kontomire stew or Dawadawa) with Vitamin C (like oranges) helps your body absorb it much better.'
  },
  {
    type: 'swelling',
    icon: <Lightbulb color={theme.colors.warning} size={32} />,
    title: 'Did you know?',
    fact: 'Mild swelling in your feet and ankles is totally normal. Elevating your feet for 20 minutes a day can make a huge difference.'
  }
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const RemindersPopup = ({ visible, onClose }: Props) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [tip, setTip] = useState(TIPS[0]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Pick a random tip
      setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <Card style={styles.card} variant="elevated">
            <View style={styles.iconContainer}>
              {tip.icon}
            </View>
            
            <Typography variant="title2" style={styles.title} align="center">
              {tip.title}
            </Typography>
            
            <Typography variant="body" color={theme.colors.textMedium} align="center" style={styles.fact}>
              {tip.fact}
            </Typography>

            <Button 
              title="Got it, thanks!" 
              onPress={onClose} 
              style={styles.btn}
            />
          </Card>
        </Animated.View>
      </View>
    </Modal>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[5],
  },
  modalContainer: {
    width: '100%',
  },
  card: {
    padding: theme.spacing[6],
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    marginBottom: theme.spacing[3],
  },
  fact: {
    marginBottom: theme.spacing[6],
    lineHeight: 24,
  },
  btn: {
    width: '100%',
  }
});
