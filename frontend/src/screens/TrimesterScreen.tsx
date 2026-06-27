import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { getTrimesterInfo } from '../api/api';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';

type RootStackParamList = {
  Home: undefined;
  Trimester: { trimesterId: number };
  Advisory: undefined;
};

type TrimesterScreenRouteProp = RouteProp<RootStackParamList, 'Trimester'>;

interface Props {
  route: TrimesterScreenRouteProp;
}

export default function TrimesterScreen({ route }: Props) {
  const { trimesterId } = route.params;
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getTrimesterInfo(trimesterId);
        setInfo(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [trimesterId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Typography variant="largeTitle" color={theme.colors.primaryDark} style={styles.title}>
        {info?.title || 'Unknown Trimester'}
      </Typography>
      <Card>
        <Typography variant="body" style={styles.description}>
          {info?.description || 'Information not available.'}
        </Typography>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surfaceVariant,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
  },
  title: {
    marginBottom: theme.spacing[4],
  },
  description: {
    lineHeight: 24,
  }
});
