const fs = require('fs');
let content = fs.readFileSync('./src/screens/HomeScreen.tsx', 'utf-8');

content = content.replace(/import \{ Ionicons \} from '@expo\/vector-icons';/, 
  "import { Apple, Flower, Activity, Heart, ChevronRight, Bell, ChevronDown, ArrowRight, Smile, Clock, Sparkles, Stethoscope, CheckSquare, HeartPulse } from 'lucide-react-native';\nimport { FadeSlideIn } from '../components/FadeSlideIn';");

content = content.replace(/<Ionicons name="nutrition" size=\{24\} color="#fff" \/>/g, '<Apple size={24} color="#fff" />');
content = content.replace(/<Ionicons name="flower" size=\{24\} color="#fff" \/>/g, '<Flower size={24} color="#fff" />');
content = content.replace(/<Ionicons name="fitness" size=\{24\} color="#fff" \/>/g, '<Activity size={24} color="#fff" />');
content = content.replace(/<Ionicons name="medkit" size=\{24\} color="#fff" \/>/g, '<Stethoscope size={24} color="#fff" />');
content = content.replace(/<Ionicons name="heart" size=\{24\} color="#fff" \/>/g, '<Heart size={24} color="#fff" />');
content = content.replace(/<Ionicons name="chevron-forward" size=\{20\}/g, '<ChevronRight size={20}');
content = content.replace(/<Ionicons name="notifications-outline" size=\{24\}/g, '<Bell size={24}');
content = content.replace(/<Ionicons name="chevron-down" size=\{16\}/g, '<ChevronDown size={16}');
content = content.replace(/<Ionicons name="arrow-forward" size=\{20\}/g, '<ArrowRight size={20}');
content = content.replace(/<Ionicons name="happy-outline" size=\{14\}/g, '<Smile size={14}');
content = content.replace(/<Ionicons name="time-outline" size=\{14\}/g, '<Clock size={14}');
content = content.replace(/<Ionicons name="sparkles" size=\{18\}/g, '<Sparkles size={18}');
content = content.replace(/<Ionicons name="medical-outline" size=\{24\}/g, '<Stethoscope size={24}');
content = content.replace(/<Ionicons name="checkbox-outline" size=\{24\}/g, '<CheckSquare size={24}');
content = content.replace(/<Ionicons name="heart-half-outline" size=\{24\}/g, '<HeartPulse size={24}');

// Wrap main sections in FadeSlideIn
content = content.replace(/{ \/\* Header Row \*\/ }/, '<FadeSlideIn direction="down" delay={100}>\n          {/* Header Row */}');
content = content.replace(/{ \/\* Flo-Style Calendar Strip \*\/ }/, '</FadeSlideIn>\n\n          <FadeSlideIn direction="down" delay={200}>\n          {/* Flo-Style Calendar Strip */}');
content = content.replace(/{ \/\* Section Title & Controls \*\/ }/, '</FadeSlideIn>\n\n          <FadeSlideIn direction="down" delay={300}>\n          {/* Section Title & Controls */}');
content = content.replace(/{ \/\* 3D Baby Hero Area \*\/ }/, '</FadeSlideIn>\n\n          <FadeSlideIn direction="up" delay={400}>\n          {/* 3D Baby Hero Area */}');
content = content.replace(/{ \/\* Baby Size Fact \*\/ }/, '</FadeSlideIn>\n\n          <FadeSlideIn direction="up" delay={500}>\n          {/* Baby Size Fact */}');
content = content.replace(/{ \/\* Daily Focus Goal Widget \*\/ }/, '</FadeSlideIn>\n\n          <FadeSlideIn direction="up" delay={600}>\n          {/* Daily Focus Goal Widget */}');
content = content.replace(/{ \/\* Upcoming & Actions \*\/ }/, '</FadeSlideIn>\n\n          <FadeSlideIn direction="up" delay={700}>\n          {/* Upcoming & Actions */}');
content = content.replace(/{ \/\* Vitals Mini-Chart \*\/ }/, '</FadeSlideIn>\n\n          <FadeSlideIn direction="up" delay={800}>\n          {/* Vitals Mini-Chart */}');
content = content.replace(/<\/ScrollView>\n      <\/SafeAreaView>/, '          </FadeSlideIn>\n        </ScrollView>\n      </SafeAreaView>');

fs.writeFileSync('./src/screens/HomeScreen.tsx', content);
