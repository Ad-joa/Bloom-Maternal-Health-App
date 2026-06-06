"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // code.ts
  var require_code = __commonJS({
    "code.ts"() {
      figma.showUI(__html__, { width: 320, height: 380 });
      var textDark = { r: 30 / 255, g: 30 / 255, b: 30 / 255 };
      var textLight = { r: 120 / 255, g: 120 / 255, b: 120 / 255 };
      var brandOrange = { r: 249 / 255, g: 115 / 255, b: 22 / 255 };
      var blushPink = { r: 255 / 255, g: 228 / 255, b: 230 / 255 };
      function createScreenFrame(name) {
        const frame = figma.createFrame();
        frame.name = name;
        frame.resize(393, 852);
        frame.fills = [{ type: "SOLID", color: { r: 252 / 255, g: 250 / 255, b: 248 / 255 } }];
        return frame;
      }
      function addText(parent, text, fontStyle, fontSize, x, y, colorRgb) {
        const t = figma.createText();
        t.fontName = { family: "Inter", style: fontStyle };
        t.characters = text;
        t.fontSize = fontSize;
        t.fills = [{ type: "SOLID", color: colorRgb }];
        t.x = x;
        t.y = y;
        parent.appendChild(t);
        return t;
      }
      function createCard(parent, w, h, x, y, radius = 24) {
        const card = figma.createRectangle();
        card.resize(w, h);
        card.cornerRadius = radius;
        card.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, opacity: 0.7 }];
        card.effects = [{
          type: "DROP_SHADOW",
          color: { r: 0, g: 0, b: 0, a: 0.04 },
          offset: { x: 0, y: 8 },
          radius: 20,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        }];
        card.x = x;
        card.y = y;
        parent.appendChild(card);
        return card;
      }
      function createTopAppBar(parent, title, showBack) {
        const headerDate = figma.createText();
        headerDate.fontName = { family: "Inter", style: "Medium" };
        headerDate.characters = "9:41";
        headerDate.fontSize = 14;
        headerDate.fills = [{ type: "SOLID", color: textDark }];
        headerDate.x = 36;
        headerDate.y = 14;
        parent.appendChild(headerDate);
        const bar = figma.createRectangle();
        bar.resize(393, 60);
        bar.fills = [{ type: "SOLID", color: { r: 252 / 255, g: 250 / 255, b: 248 / 255 }, opacity: 0.9 }];
        bar.y = 47;
        parent.appendChild(bar);
        if (showBack) {
          const back = figma.createEllipse();
          back.resize(40, 40);
          back.fills = [{ type: "SOLID", color: { r: 245 / 255, g: 245 / 255, b: 245 / 255 } }];
          back.x = 20;
          back.y = 57;
          parent.appendChild(back);
        }
        if (title) {
          addText(parent, title, "Bold", 20, showBack ? 70 : 24, 65, textDark);
        }
      }
      function createBottomNav(parent, activeTab = 0) {
        const nav = figma.createRectangle();
        nav.resize(393, 90);
        nav.y = 852 - 90;
        nav.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, opacity: 0.92 }];
        nav.effects = [{
          type: "DROP_SHADOW",
          color: { r: 0, g: 0, b: 0, a: 0.08 },
          offset: { x: 0, y: -2 },
          radius: 16,
          spread: 0,
          visible: true,
          blendMode: "NORMAL"
        }];
        parent.appendChild(nav);
        const pill = figma.createRectangle();
        pill.resize(48, 4);
        pill.cornerRadius = 2;
        pill.fills = [{ type: "SOLID", color: brandOrange }];
        const tabWidth = 393 / 5;
        pill.x = Math.round(tabWidth * activeTab + (tabWidth - 48) / 2);
        pill.y = 852 - 90;
        parent.appendChild(pill);
        const labels = ["Home", "Insights", "Chats", "Tracker", "Profile"];
        for (let i = 0; i < 5; i++) {
          const isActive = i === activeTab;
          const centerX = Math.round(tabWidth * i + tabWidth / 2);
          const icon = figma.createEllipse();
          icon.resize(24, 24);
          icon.fills = [{ type: "SOLID", color: isActive ? brandOrange : { r: 200 / 255, g: 200 / 255, b: 200 / 255 } }];
          icon.x = centerX - 12;
          icon.y = 852 - 72;
          parent.appendChild(icon);
          const labelColor = isActive ? brandOrange : { r: 150 / 255, g: 150 / 255, b: 150 / 255 };
          const labelX = centerX - labels[i].length * 3.3;
          addText(parent, labels[i], isActive ? "Bold" : "Medium", 10, labelX, icon.y + 28, labelColor);
        }
      }
      function createButton(parent, text, x, y, width, isPrimary = true) {
        const btn = figma.createRectangle();
        btn.resize(width, 56);
        btn.cornerRadius = 28;
        btn.fills = [{ type: "SOLID", color: isPrimary ? brandOrange : { r: 255 / 255, g: 237 / 255, b: 213 / 255 } }];
        btn.x = x;
        btn.y = y;
        parent.appendChild(btn);
        const btnText = figma.createText();
        btnText.fontName = { family: "Inter", style: "Bold" };
        btnText.characters = text;
        btnText.fontSize = 16;
        btnText.fills = [{ type: "SOLID", color: isPrimary ? { r: 255 / 255, g: 255 / 255, b: 255 / 255 } : brandOrange }];
        btnText.x = x + (width - text.length * 9) / 2;
        btnText.y = y + 18;
        parent.appendChild(btnText);
        return btn;
      }
      function createInputField(parent, placeholder, x, y, width) {
        const field = figma.createRectangle();
        field.resize(width, 56);
        field.cornerRadius = 16;
        field.fills = [{ type: "SOLID", color: { r: 245 / 255, g: 245 / 255, b: 245 / 255 } }];
        field.x = x;
        field.y = y;
        parent.appendChild(field);
        addText(parent, placeholder, "Regular", 15, x + 20, y + 18, textLight);
        return field;
      }
      function createProgressBar(parent, progress, x, y, width) {
        const bg = figma.createRectangle();
        bg.resize(width, 8);
        bg.cornerRadius = 4;
        bg.fills = [{ type: "SOLID", color: { r: 230 / 255, g: 230 / 255, b: 230 / 255 } }];
        bg.x = x;
        bg.y = y;
        parent.appendChild(bg);
        const fg = figma.createRectangle();
        fg.resize(width * progress, 8);
        fg.cornerRadius = 4;
        fg.fills = [{ type: "SOLID", color: brandOrange }];
        fg.x = x;
        fg.y = y;
        parent.appendChild(fg);
      }
      function createListItem(parent, title, subtitle, hasIcon, x, y, width) {
        const item = createCard(parent, width, 72, x, y, 16);
        if (hasIcon) {
          const iconBg = figma.createEllipse();
          iconBg.resize(40, 40);
          iconBg.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 237 / 255, b: 213 / 255 } }];
          iconBg.x = x + 16;
          iconBg.y = y + 16;
          parent.appendChild(iconBg);
          addText(parent, title, "Bold", 16, x + 68, y + 16, textDark);
          addText(parent, subtitle, "Regular", 13, x + 68, y + 36, textLight);
        } else {
          addText(parent, title, "Bold", 16, x + 16, y + 16, textDark);
          addText(parent, subtitle, "Regular", 13, x + 16, y + 36, textLight);
        }
        return item;
      }
      function createAvatar(parent, radius, x, y) {
        const av = figma.createEllipse();
        av.resize(radius * 2, radius * 2);
        av.fills = [{ type: "SOLID", color: { r: 230 / 255, g: 230 / 255, b: 230 / 255 } }];
        av.x = x;
        av.y = y;
        parent.appendChild(av);
        return av;
      }
      function buildSplashScreen(frame) {
        frame.fills = [{ type: "SOLID", color: blushPink }];
        const dec1 = figma.createEllipse();
        dec1.resize(200, 200);
        dec1.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, opacity: 0.3 }];
        dec1.x = -50;
        dec1.y = -50;
        frame.appendChild(dec1);
        const dec2 = figma.createEllipse();
        dec2.resize(300, 300);
        dec2.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, opacity: 0.3 }];
        dec2.x = 200;
        dec2.y = 650;
        frame.appendChild(dec2);
        const logo = figma.createEllipse();
        logo.resize(100, 100);
        logo.fills = [{ type: "SOLID", color: brandOrange }];
        logo.x = (393 - 100) / 2;
        logo.y = 280;
        frame.appendChild(logo);
        addText(frame, "Bloom", "Bold", 40, 135, 410, brandOrange);
        addText(frame, "Your maternal health companion", "Medium", 16, 68, 460, textDark);
        createProgressBar(frame, 0.6, 100, 700, 193);
        addText(frame, "v1.0.0", "Regular", 12, 175, 780, textLight);
      }
      function buildLandingScreen(frame) {
        frame.fills = [{ type: "SOLID", color: blushPink }];
        const heroImg = figma.createRectangle();
        heroImg.resize(393, 400);
        heroImg.fills = [{ type: "SOLID", color: { r: 245 / 255, g: 245 / 255, b: 245 / 255 } }];
        frame.appendChild(heroImg);
        const sheet = figma.createRectangle();
        sheet.resize(393, 480);
        sheet.cornerRadius = 40;
        sheet.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 } }];
        sheet.y = 380;
        frame.appendChild(sheet);
        addText(frame, "Welcome to Bloom", "Bold", 32, 24, 420, textDark);
        addText(frame, "Your personal guide to a healthy\nand informed pregnancy journey.", "Regular", 16, 24, 460, textLight);
        createButton(frame, "Get Started", 24, 600, 345, true);
        createButton(frame, "Log In", 24, 670, 345, false);
      }
      function buildOnboardingScreen(frame) {
        addText(frame, "Track your progress", "Bold", 28, 24, 480, textDark);
        addText(frame, "Get daily insights and track your baby's growth.", "Regular", 16, 24, 520, textLight);
        const illus = figma.createEllipse();
        illus.resize(250, 250);
        illus.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 237 / 255, b: 213 / 255 } }];
        illus.x = (393 - 250) / 2;
        illus.y = 150;
        frame.appendChild(illus);
        createProgressBar(frame, 0.33, 24, 650, 345);
        createButton(frame, "Next", 24, 700, 345, true);
      }
      function buildLoginScreen(frame) {
        const hero = figma.createRectangle();
        hero.resize(393, 280);
        hero.fills = [{ type: "SOLID", color: blushPink }];
        frame.appendChild(hero);
        const logoMark = figma.createEllipse();
        logoMark.resize(72, 72);
        logoMark.fills = [{ type: "SOLID", color: brandOrange }];
        logoMark.x = (393 - 72) / 2;
        logoMark.y = 100;
        frame.appendChild(logoMark);
        const sheet = figma.createRectangle();
        sheet.resize(393, 600);
        sheet.cornerRadius = 40;
        sheet.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 } }];
        sheet.y = 260;
        frame.appendChild(sheet);
        addText(frame, "Welcome Back", "Bold", 32, 24, 295, textDark);
        addText(frame, "Log in to continue your journey", "Regular", 15, 24, 337, textLight);
        createInputField(frame, "Email Address", 24, 400, 345);
        createInputField(frame, "Password", 24, 470, 345);
        createButton(frame, "Log In", 24, 560, 345, true);
        addText(frame, "Forgot password?", "Medium", 14, 143, 630, brandOrange);
        const divider = figma.createRectangle();
        divider.resize(300, 1);
        divider.fills = [{ type: "SOLID", color: { r: 230 / 255, g: 230 / 255, b: 230 / 255 } }];
        divider.x = 46;
        divider.y = 680;
        frame.appendChild(divider);
        addText(frame, "Don't have an account yet?", "Regular", 14, 88, 700, textLight);
        addText(frame, "Create one", "Bold", 14, 172, 724, brandOrange);
      }
      function buildRegisterScreen(frame) {
        const hero = figma.createRectangle();
        hero.resize(393, 240);
        hero.fills = [{ type: "SOLID", color: blushPink }];
        frame.appendChild(hero);
        const decCircle = figma.createEllipse();
        decCircle.resize(150, 150);
        decCircle.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, opacity: 0.3 }];
        decCircle.x = 280;
        decCircle.y = -40;
        frame.appendChild(decCircle);
        const back = figma.createEllipse();
        back.resize(40, 40);
        back.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, opacity: 0.6 }];
        back.x = 20;
        back.y = 60;
        frame.appendChild(back);
        addText(frame, "Create Account", "Bold", 32, 24, 160, textDark);
        addText(frame, "Join Bloom and start your journey", "Regular", 15, 24, 200, textLight);
        const sheet = figma.createRectangle();
        sheet.resize(393, 650);
        sheet.cornerRadius = 40;
        sheet.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 } }];
        sheet.y = 235;
        frame.appendChild(sheet);
        createInputField(frame, "Full Name", 24, 270, 345);
        createInputField(frame, "Email Address", 24, 340, 345);
        createInputField(frame, "Password", 24, 410, 345);
        createInputField(frame, "Confirm Password", 24, 480, 345);
        const checkbox = figma.createRectangle();
        checkbox.resize(20, 20);
        checkbox.cornerRadius = 4;
        checkbox.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 237 / 255, b: 213 / 255 } }];
        checkbox.x = 24;
        checkbox.y = 556;
        frame.appendChild(checkbox);
        addText(frame, "I agree to the Terms & Privacy Policy", "Regular", 13, 52, 558, textLight);
        createButton(frame, "Create Account", 24, 610, 345, true);
        const divider = figma.createRectangle();
        divider.resize(300, 1);
        divider.fills = [{ type: "SOLID", color: { r: 230 / 255, g: 230 / 255, b: 230 / 255 } }];
        divider.x = 46;
        divider.y = 680;
        frame.appendChild(divider);
        addText(frame, "Already have an account?", "Regular", 14, 98, 700, textLight);
        addText(frame, "Log In", "Bold", 14, 200, 724, brandOrange);
      }
      function buildInsightsScreen(frame) {
        addText(frame, "Insights", "Bold", 28, 24, 120, textDark);
        addText(frame, "Curated for Week 12", "Medium", 15, 24, 158, brandOrange);
        const featCard = figma.createRectangle();
        featCard.resize(345, 180);
        featCard.cornerRadius = 20;
        featCard.fills = [{
          type: "GRADIENT_ANGULAR",
          gradientTransform: [[1, 0, 0.5], [0, 1, 0.5]],
          gradientStops: [
            { position: 0, color: { r: 249 / 255, g: 115 / 255, b: 22 / 255, a: 1 } },
            { position: 0.5, color: { r: 255 / 255, g: 160 / 255, b: 80 / 255, a: 1 } },
            { position: 1, color: { r: 249 / 255, g: 115 / 255, b: 22 / 255, a: 1 } }
          ]
        }];
        featCard.x = 24;
        featCard.y = 196;
        frame.appendChild(featCard);
        addText(frame, "Featured", "Medium", 11, 40, 210, { r: 255 / 255, g: 255 / 255, b: 255 / 255 });
        addText(frame, "Nutrition in your first trimester", "Bold", 20, 40, 230, { r: 255 / 255, g: 255 / 255, b: 255 / 255 });
        addText(frame, "5 min read", "Regular", 12, 40, 348, { r: 255 / 255, g: 255 / 255, b: 255 / 255 });
        addText(frame, "This Week's Tips", "Bold", 18, 24, 400, textDark);
        const tips = [
          ["Iron-Rich Foods", "Boost your energy naturally"],
          ["Sleep Positions", "Best positions for trimester 1"],
          ["Stay Hydrated", "How much water do you need?"]
        ];
        for (let i = 0; i < tips.length; i++) {
          createListItem(frame, tips[i][0], tips[i][1], true, 24, 432 + i * 90, 345);
        }
      }
      function buildChatsScreen(frame) {
        addText(frame, "Chats", "Bold", 28, 24, 120, textDark);
        const searchBg = figma.createRectangle();
        searchBg.resize(345, 48);
        searchBg.cornerRadius = 24;
        searchBg.fills = [{ type: "SOLID", color: { r: 245 / 255, g: 245 / 255, b: 245 / 255 } }];
        searchBg.x = 24;
        searchBg.y = 168;
        frame.appendChild(searchBg);
        addText(frame, "Search messages...", "Regular", 14, 48, 180, textLight);
        addText(frame, "Recent", "Bold", 16, 24, 240, textDark);
        const contacts = [
          ["Midwife Abena", "Your next visit is Oct 30", true],
          ["Dr. Mensah", "Your scan results look great!", false],
          ["Bloom AI", "How can I help you today?", true],
          ["Support Group", "You: Thanks everyone", false]
        ];
        for (let i = 0; i < contacts.length; i++) {
          const y = 270 + i * 88;
          createCard(frame, 345, 76, 24, y, 16);
          const av = figma.createEllipse();
          av.resize(48, 48);
          av.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 237 / 255, b: 213 / 255 } }];
          av.x = 40;
          av.y = y + 14;
          frame.appendChild(av);
          if (contacts[i][2]) {
            const dot = figma.createEllipse();
            dot.resize(12, 12);
            dot.fills = [{ type: "SOLID", color: { r: 34 / 255, g: 197 / 255, b: 94 / 255 } }];
            dot.x = 76;
            dot.y = y + 50;
            frame.appendChild(dot);
          }
          addText(frame, contacts[i][0], "Bold", 15, 100, y + 18, textDark);
          addText(frame, contacts[i][1], "Regular", 13, 100, y + 40, textLight);
        }
      }
      function buildTrackerScreen(frame) {
        addText(frame, "Pregnancy Tracker", "Bold", 26, 24, 120, textDark);
        addText(frame, "Week 12 of 40", "Medium", 15, 24, 156, brandOrange);
        const ring = figma.createEllipse();
        ring.resize(220, 220);
        ring.x = (393 - 220) / 2;
        ring.y = 195;
        ring.fills = [{
          type: "GRADIENT_ANGULAR",
          gradientTransform: [[1, 0, 0.5], [0, 1, 0.5]],
          gradientStops: [
            { position: 0, color: { r: 249 / 255, g: 115 / 255, b: 22 / 255, a: 1 } },
            { position: 0.3, color: { r: 255 / 255, g: 190 / 255, b: 130 / 255, a: 1 } },
            { position: 0.3, color: { r: 240 / 255, g: 240 / 255, b: 240 / 255, a: 1 } },
            { position: 1, color: { r: 240 / 255, g: 240 / 255, b: 240 / 255, a: 1 } }
          ]
        }];
        frame.appendChild(ring);
        const inner = figma.createEllipse();
        inner.resize(170, 170);
        inner.x = (393 - 170) / 2;
        inner.y = 220;
        inner.fills = [{ type: "SOLID", color: { r: 252 / 255, g: 250 / 255, b: 248 / 255 } }];
        frame.appendChild(inner);
        addText(frame, "Week", "Regular", 14, 175, 276, textLight);
        addText(frame, "12", "Bold", 44, 162, 290, textDark);
        addText(frame, "of 40", "Regular", 13, 170, 342, textLight);
        createCard(frame, 345, 80, 24, 444, 16);
        addText(frame, "Baby is the size of a lime", "Bold", 16, 44, 468, textDark);
        addText(frame, "About 5.4 cm crown-to-rump length", "Regular", 13, 44, 494, textLight);
        addText(frame, "Trimester Progress", "Bold", 16, 24, 548, textDark);
        createProgressBar(frame, 12 / 40, 24, 578, 345);
        addText(frame, "30%", "Medium", 13, 342, 591, brandOrange);
        createButton(frame, "Log Today's Symptoms", 24, 624, 345, false);
      }
      function buildHomeScreen(frame) {
        addText(frame, "Today, Oct 24", "Medium", 14, 24, 110, textLight);
        addText(frame, "Good Morning, Sarah \u{1F44B}", "Bold", 24, 24, 130, textDark);
        const tracker = figma.createEllipse();
        tracker.resize(250, 250);
        tracker.x = (393 - 250) / 2;
        tracker.y = 190;
        tracker.fills = [{
          type: "GRADIENT_ANGULAR",
          gradientTransform: [[1, 0, 0.5], [0, 1, 0.5]],
          gradientStops: [
            { position: 0, color: { r: 249 / 255, g: 115 / 255, b: 22 / 255, a: 1 } },
            { position: 1, color: { r: 255 / 255, g: 190 / 255, b: 150 / 255, a: 1 } }
          ]
        }];
        frame.appendChild(tracker);
        const trackerInner = figma.createEllipse();
        trackerInner.resize(210, 210);
        trackerInner.x = (393 - 210) / 2;
        trackerInner.y = 210;
        trackerInner.fills = [{ type: "SOLID", color: { r: 252 / 255, g: 250 / 255, b: 248 / 255 } }];
        frame.appendChild(trackerInner);
        addText(frame, "Week 12", "Bold", 32, 125, 290, textDark);
        const c = createCard(frame, 345, 140, 24, 480);
        addText(frame, "Daily Insight", "Bold", 18, 44, 500, textDark);
        addText(frame, "Your baby is the size of a plum! Eat plenty of iron-rich foods.", "Regular", 14, 44, 530, textLight);
      }
      function buildSymptomCheckerScreen(frame) {
        addText(frame, "How are you feeling today?", "Bold", 24, 24, 120, textDark);
        for (let i = 0; i < 6; i++) {
          const row = Math.floor(i / 2);
          const col = i % 2;
          const p = createCard(frame, 160, 60, 24 + col * 180, 180 + row * 80, 30);
          addText(frame, ["Nausea", "Fatigue", "Cramps", "Headache", "Mood", "Sleep"][i], "Medium", 15, p.x + 40, p.y + 20, textDark);
        }
        createButton(frame, "Log Symptoms", 24, 450, 345, true);
      }
      function buildProfileScreen(frame) {
        createAvatar(frame, 50, (393 - 100) / 2, 120);
        addText(frame, "Sarah Jenkins", "Bold", 24, 115, 230, textDark);
        const options = ["Personal Info", "My Pregnancy", "Reminders", "Log Out"];
        for (let i = 0; i < options.length; i++) {
          createListItem(frame, options[i], "Tap to view", true, 24, 300 + i * 88, 345);
        }
      }
      function buildTrimesterInfoScreen(frame) {
        addText(frame, "Trimester 1", "Bold", 28, 24, 120, textDark);
        addText(frame, "Weeks 1 - 12", "Medium", 16, 24, 155, brandOrange);
        createProgressBar(frame, 0.8, 24, 190, 345);
        addText(frame, "What to expect", "Bold", 20, 24, 230, textDark);
        createListItem(frame, "Baby's Development", "Organs are forming", false, 24, 270, 345);
        createListItem(frame, "Your Body", "Fatigue and nausea", false, 24, 350, 345);
        createListItem(frame, "Diet & Nutrition", "Folic acid is key", false, 24, 430, 345);
      }
      function buildDangerSignsScreen(frame) {
        addText(frame, "Danger Signs", "Bold", 28, 24, 120, textDark);
        addText(frame, "Seek immediate medical help if you experience:", "Regular", 15, 24, 155, textLight);
        const signs = ["Severe bleeding", "Extreme swelling", "High fever", "Severe abdominal pain"];
        for (let i = 0; i < signs.length; i++) {
          const card = createCard(frame, 345, 80, 24, 200 + i * 96, 16);
          const dot = figma.createEllipse();
          dot.resize(16, 16);
          dot.fills = [{ type: "SOLID", color: { r: 220 / 255, g: 38 / 255, b: 38 / 255 } }];
          dot.x = 40;
          dot.y = 200 + i * 96 + 32;
          frame.appendChild(dot);
          addText(frame, signs[i], "Bold", 16, 68, 200 + i * 96 + 30, textDark);
        }
        createButton(frame, "Call Emergency", 24, 620, 345, true);
      }
      function buildVisitsScreen(frame) {
        addText(frame, "Upcoming Visits", "Bold", 28, 24, 120, textDark);
        createListItem(frame, "Routine Checkup", "Oct 30, 10:00 AM", true, 24, 180, 345);
        createListItem(frame, "Ultrasound", "Nov 15, 2:00 PM", true, 24, 268, 345);
        addText(frame, "Past Visits", "Bold", 20, 24, 360, textDark);
        createListItem(frame, "First Appointment", "Sep 10", false, 24, 400, 345);
      }
      figma.ui.onmessage = async (msg) => {
        try {
          if (msg.type === "setup-styles") {
            const pBrandOrange = figma.createPaintStyle();
            pBrandOrange.name = "Bloom / Brand Orange";
            pBrandOrange.paints = [{ type: "SOLID", color: brandOrange }];
            const pBlushPink = figma.createPaintStyle();
            pBlushPink.name = "Bloom / Blush Pink";
            pBlushPink.paints = [{ type: "SOLID", color: blushPink }];
            figma.notify("Bloom Design Tokens Setup Complete!");
            return;
          }
          if (msg.type === "generate-screen") {
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            await figma.loadFontAsync({ family: "Inter", style: "Medium" });
            await figma.loadFontAsync({ family: "Inter", style: "Bold" });
            const d = figma.createText();
            await figma.loadFontAsync(d.fontName);
            d.remove();
            const screenType = msg.screenType;
            let frame = createScreenFrame("Bloom " + screenType);
            if (msg.incAppbar && !["SplashScreen", "LandingScreen", "HomeScreen", "InsightsScreen", "ChatsScreen", "TrackerScreen"].includes(screenType)) {
              createTopAppBar(frame, screenType.replace("Screen", ""), true);
            } else if (msg.incAppbar && screenType === "HomeScreen") {
              createTopAppBar(frame, "", false);
            }
            switch (screenType) {
              case "SplashScreen":
                buildSplashScreen(frame);
                break;
              case "LandingScreen":
                buildLandingScreen(frame);
                break;
              case "OnboardingScreen":
                buildOnboardingScreen(frame);
                break;
              case "LoginScreen":
                buildLoginScreen(frame);
                break;
              case "RegisterScreen":
                buildRegisterScreen(frame);
                break;
              case "HomeScreen":
                buildHomeScreen(frame);
                break;
              case "InsightsScreen":
                buildInsightsScreen(frame);
                break;
              case "ChatsScreen":
                buildChatsScreen(frame);
                break;
              case "TrackerScreen":
                buildTrackerScreen(frame);
                break;
              case "SymptomCheckerScreen":
                buildSymptomCheckerScreen(frame);
                break;
              case "ProfileScreen":
                buildProfileScreen(frame);
                break;
              case "TrimesterInfoScreen":
                buildTrimesterInfoScreen(frame);
                break;
              case "DangerSignsScreen":
                buildDangerSignsScreen(frame);
                break;
              case "VisitsScreen":
                buildVisitsScreen(frame);
                break;
            }
            const tabMap = {
              "HomeScreen": 0,
              "InsightsScreen": 1,
              "ChatsScreen": 2,
              "TrackerScreen": 3,
              "ProfileScreen": 4
            };
            if (msg.incNav && !["SplashScreen", "LandingScreen", "OnboardingScreen", "LoginScreen", "RegisterScreen"].includes(screenType)) {
              createBottomNav(frame, tabMap[screenType] ?? 0);
            }
            figma.currentPage.appendChild(frame);
            figma.viewport.scrollAndZoomIntoView([frame]);
            figma.notify(screenType + " highly detailed scaffold generated!");
          }
        } catch (error) {
          console.error(error);
          figma.notify("Plugin Error: " + String(error), { error: true });
        }
      };
    }
  });
  require_code();
})();
