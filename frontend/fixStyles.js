const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Badge.tsx',
  'src/components/BiometricGate.tsx',
  'src/components/Button.tsx',
  'src/components/Card.tsx',
  'src/components/FloatingActionButton.tsx',
  'src/components/KickCounter.tsx',
  'src/components/ProgressBar.tsx',
  'src/components/RemindersPopup.tsx',
  'src/components/Tag.tsx',
  'src/components/TextInput.tsx',
  'src/components/Typography.tsx',
  'src/screens/PartnerModeScreen.tsx',
  'App.tsx'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Revert getStyles -> styles
  content = content.replace(/const getStyles = \(theme: any\) => StyleSheet\.create/g, 'const styles = StyleSheet.create');
  
  // Revert ThemeContext import to theme import
  content = content.replace(/import { useTheme } from '\.\.\/theme\/ThemeContext';/g, "import { theme } from '../theme/theme';");
  content = content.replace(/import { useTheme } from '\.\/src\/theme\/ThemeContext';/g, "import { theme } from './src/theme/theme';");
  
  // Remove dangling useTheme and getStyles calls inside components that were blindly added by regex
  // The regex from before was: content = content.replace(/(const \w+ = .*? => \{)/g, "$1\n  const { theme } = useTheme();\n  const styles = getStyles(theme);");
  // Which resulted in lines like:
  //   const { theme } = useTheme();
  //   const styles = getStyles(theme);
  // We can just strip those exact lines out.
  content = content.replace(/  const \{ theme \} = useTheme\(\);\n/g, "");
  content = content.replace(/  const styles = getStyles\(theme\);\n/g, "");
  
  fs.writeFileSync(fullPath, content);
  console.log('Fixed', file);
});
