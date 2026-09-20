const fs = require('fs');
const path = require('path');

// 1. App.tsx Duplicate identifier theme
let app = fs.readFileSync(path.join(__dirname, 'App.tsx'), 'utf8');
app = app.replace("import { ThemeProvider, useTheme } from './src/theme/ThemeContext';\nimport { theme } from './src/theme/theme';", "import { ThemeProvider, useTheme } from './src/theme/ThemeContext';\n// removed dupe theme");
fs.writeFileSync(path.join(__dirname, 'App.tsx'), app);

// 2. Badge.tsx, Tag.tsx theme.borderRadius.pill -> theme.borderRadius.full
['src/components/Badge.tsx', 'src/components/Tag.tsx'].forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    content = content.replace(/theme\.radii\.pill/g, 'theme.borderRadius.full');
    content = content.replace(/theme\.borderRadius\.pill/g, 'theme.borderRadius.full');
    fs.writeFileSync(path.join(__dirname, file), content);
});

// 3. Card.tsx shadows
let card = fs.readFileSync(path.join(__dirname, 'src/components/Card.tsx'), 'utf8');
card = card.replace(/\.\.\.theme\.shadows\.small/g, 'shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2');
fs.writeFileSync(path.join(__dirname, 'src/components/Card.tsx'), card);

// 4. KickCounter, RemindersPopup, PartnerModeScreen
['src/components/KickCounter.tsx', 'src/components/RemindersPopup.tsx', 'src/screens/PartnerModeScreen.tsx'].forEach(file => {
    let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    content = content.replace(/const \{ theme \} = useTheme\(\);\n/g, '');
    content = content.replace(/const styles = getStyles\(theme\);\n/g, '');
    content = content.replace(/const styles = getStyles\(\);\n/g, '');
    fs.writeFileSync(path.join(__dirname, file), content);
});

// 5. PrivacyConsentScreen.tsx fullWidth
let priv = fs.readFileSync(path.join(__dirname, 'src/screens/PrivacyConsentScreen.tsx'), 'utf8');
priv = priv.replace('fullWidth', 'style={{width: "100%"}}');
fs.writeFileSync(path.join(__dirname, 'src/screens/PrivacyConsentScreen.tsx'), priv);

// 6. WelcomeScreen.tsx
let welc = fs.readFileSync(path.join(__dirname, 'src/screens/WelcomeScreen.tsx'), 'utf8');
welc = welc.replace(/theme\.colors\.text/g, 'theme.colors.textHigh');
welc = welc.replace(/variant="outline"/g, 'variant="outlined"');
welc = welc.replace("navigation.navigate('PrivacyConsent')", "navigation.navigate('PrivacyConsent' as never)");
welc = welc.replace("navigation.navigate('Login')", "navigation.navigate('Login' as never)");
fs.writeFileSync(path.join(__dirname, 'src/screens/WelcomeScreen.tsx'), welc);

console.log("Fixed last errors.");
