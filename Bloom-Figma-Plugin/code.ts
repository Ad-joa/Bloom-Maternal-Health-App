figma.showUI(__html__, { width: 300, height: 260 });

// Helper to create basic frame
function createScreenFrame(name: string) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(393, 852); // iPhone 14 Pro size
  frame.fills = [{type: 'SOLID', color: {r: 250/255, g: 248/255, b: 245/255}}]; // Soft Background
  return frame;
}

// Helper to add text
function addText(parent: FrameNode, text: string, fontStyle: string, fontSize: number, x: number, y: number, colorRgb: {r:number, g:number, b:number}) {
  const t = figma.createText();
  t.fontName = { family: "Inter", style: fontStyle };
  t.characters = text;
  t.fontSize = fontSize;
  t.fills = [{type: 'SOLID', color: colorRgb}];
  t.x = x;
  t.y = y;
  parent.appendChild(t);
  return t;
}

// Glass card helper
function createCard(parent: FrameNode, w: number, h: number, x: number, y: number) {
  const card = figma.createRectangle();
  card.resize(w, h);
  card.cornerRadius = 24;
  card.fills = [{type: 'SOLID', color: {r: 255/255, g: 255/255, b: 255/255}, opacity: 0.6}];
  card.effects = [{
    type: 'DROP_SHADOW',
    color: {r: 0, g: 0, b: 0, a: 0.05},
    offset: {x: 0, y: 10},
    radius: 30,
    visible: true,
    blendMode: 'NORMAL'
  }];
  card.x = x;
  card.y = y;
  parent.appendChild(card);
  return card;
}

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'setup-styles') {
      const pBrandOrange = figma.createPaintStyle();
      pBrandOrange.name = "Bloom / Brand Orange";
      pBrandOrange.paints = [{type: 'SOLID', color: {r: 249/255, g: 115/255, b: 22/255}}];

      const pBlushPink = figma.createPaintStyle();
      pBlushPink.name = "Bloom / Blush Pink";
      pBlushPink.paints = [{type: 'SOLID', color: {r: 255/255, g: 228/255, b: 230/255}}];
      
      const pBackground = figma.createPaintStyle();
      pBackground.name = "Bloom / Background Soft";
      pBackground.paints = [{type: 'SOLID', color: {r: 250/255, g: 248/255, b: 245/255}}];

      const pTextHeavy = figma.createPaintStyle();
      pTextHeavy.name = "Bloom / Text Dark";
      pTextHeavy.paints = [{type: 'SOLID', color: {r: 30/255, g: 30/255, b: 30/255}}];

      figma.notify("Bloom color styles created!");
      return;
    }

    if (msg.type === 'generate-screen') {
      // 1. Load Fonts First
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });

      const dummyText = figma.createText();
      await figma.loadFontAsync(dummyText.fontName as FontName);
      dummyText.remove();

      const screenType = msg.screenType;
      let frame = createScreenFrame("Bloom " + screenType);

      // Colors
      const textDark = {r: 30/255, g: 30/255, b: 30/255};
      const textLight = {r: 100/255, g: 100/255, b: 100/255};
      const brandOrange = {r: 249/255, g: 115/255, b: 22/255};

      // 2. Routing based on screenType
      switch (screenType) {
        
        case 'SplashScreen':
          frame.fills = [{
            type: 'GRADIENT_LINEAR',
            gradientTransform: [[1, 0, 0], [0, 1, 0]],
            gradientStops: [
              { position: 0, color: { r: 255/255, g: 228/255, b: 230/255, a: 1 } },
              { position: 1, color: { r: 250/255, g: 248/255, b: 245/255, a: 1 } }
            ]
          }];
          const logo = figma.createEllipse();
          logo.resize(100, 100);
          logo.fills = [{type: 'SOLID', color: brandOrange}];
          logo.x = (393-100)/2; logo.y = 350;
          frame.appendChild(logo);
          addText(frame, "Bloom", "Bold", 32, 145, 470, textDark);
          break;

        case 'LandingScreen':
          const imgP = figma.createRectangle();
          imgP.resize(393, 500);
          imgP.fills = [{type: 'SOLID', color: {r: 200/255, g: 200/255, b: 200/255}}];
          frame.appendChild(imgP);
          addText(frame, "Your maternal health\ncompanion.", "Bold", 32, 24, 530, textDark);
          const btn = createCard(frame, 345, 56, 24, 730);
          btn.fills = [{type:'SOLID', color: brandOrange}];
          addText(frame, "Get Started", "Bold", 16, 140, 748, {r:1,g:1,b:1});
          break;

        case 'OnboardingScreen':
          addText(frame, "What is your goal?", "Bold", 28, 24, 100, textDark);
          createCard(frame, 345, 80, 24, 180);
          addText(frame, "Track my pregnancy", "Bold", 18, 48, 208, textDark);
          createCard(frame, 345, 80, 24, 280);
          addText(frame, "Try to conceive", "Bold", 18, 48, 308, textDark);
          break;

        case 'LoginScreen':
        case 'RegisterScreen':
          const hero = figma.createRectangle();
          hero.resize(393, 300);
          hero.fills = [{type: 'SOLID', color: {r: 40/255, g: 40/255, b: 40/255}}];
          frame.appendChild(hero);
          addText(frame, screenType === 'LoginScreen' ? "Welcome Back" : "Get Started", "Bold", 32, 24, 340, textDark);
          
          createCard(frame, 345, 56, 24, 420); // Input 1
          addText(frame, "Email Address", "Regular", 14, 44, 438, textLight);
          
          createCard(frame, 345, 56, 24, 500); // Input 2
          addText(frame, "Password", "Regular", 14, 44, 518, textLight);
          
          const sBtn = createCard(frame, 345, 56, 24, 600);
          sBtn.fills = [{type:'SOLID', color: brandOrange}];
          break;

        case 'HomeScreen':
          addText(frame, "Today, Oct 24", "Medium", 14, 24, 60, textLight);
          addText(frame, "Good Morning, Sarah 👋", "Bold", 24, 24, 80, textDark);

          const tracker = figma.createEllipse();
          tracker.resize(250, 250);
          tracker.x = (393 - 250) / 2; tracker.y = 150;
          tracker.fills = [{
            type: 'GRADIENT_LINEAR',
            gradientTransform: [[1, 0, 0], [0, 1, 0]],
            gradientStops: [
              { position: 0, color: { r: 249/255, g: 115/255, b: 22/255, a: 1 } },
              { position: 1, color: { r: 255/255, g: 190/255, b: 150/255, a: 1 } }
            ]
          }];
          frame.appendChild(tracker);

          createCard(frame, 345, 120, 24, 440);
          addText(frame, "Week 12 • First Trimester", "Bold", 16, 44, 460, textDark);
          addText(frame, "Your baby is the size of a plum!", "Regular", 14, 44, 490, textLight);
          break;

        case 'SymptomCheckerScreen':
          addText(frame, "How are you feeling?", "Bold", 28, 24, 80, textDark);
          addText(frame, "Log your symptoms for today", "Regular", 16, 24, 120, textLight);
          
          // Generate 6 pill buttons
          for (let i = 0; i < 6; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const pill = figma.createRectangle();
            pill.cornerRadius = 30;
            pill.resize(160, 60);
            pill.fills = [{type: 'SOLID', color: {r: 255/255, g: 255/255, b: 255/255}}];
            pill.strokes = [{type: 'SOLID', color: {r: 230/255, g: 230/255, b: 230/255}}];
            pill.x = 24 + (col * 180);
            pill.y = 180 + (row * 80);
            frame.appendChild(pill);
            addText(frame, ["Nausea", "Fatigue", "Cramps", "Headache", "Mood", "Sleep"][i], "Medium", 14, pill.x + 50, pill.y + 22, textDark);
          }
          break;

        case 'DangerSignsScreen':
          frame.fills = [{type: 'SOLID', color: {r: 255/255, g: 240/255, b: 240/255}}]; // soft red tint
          addText(frame, "Danger Signs", "Bold", 28, 24, 80, {r: 200/255, g: 50/255, b: 50/255});
          createCard(frame, 345, 100, 24, 140);
          addText(frame, "Severe Bleeding", "Bold", 16, 44, 160, textDark);
          addText(frame, "Seek immediate medical attention.", "Regular", 14, 44, 190, textLight);
          break;

        case 'VisitsScreen':
          addText(frame, "My Appointments", "Bold", 28, 24, 80, textDark);
          const line = figma.createRectangle();
          line.resize(2, 400);
          line.fills = [{type:'SOLID', color: {r:220/255, g:220/255, b:220/255}}];
          line.x = 40; line.y = 150;
          frame.appendChild(line);

          createCard(frame, 300, 80, 60, 160);
          addText(frame, "12 Week Scan", "Bold", 16, 80, 180, textDark);
          break;

        case 'TrimesterInfoScreen':
          addText(frame, "First Trimester", "Bold", 28, 24, 80, textDark);
          
          const art1 = createCard(frame, 345, 200, 24, 140);
          addText(frame, "What to expect in Week 12", "Bold", 18, 44, 280, textDark);

          const art2 = createCard(frame, 345, 200, 24, 360);
          addText(frame, "Nutrition Guide", "Bold", 18, 44, 500, textDark);
          break;

        case 'ProfileScreen':
          const avatar = figma.createEllipse();
          avatar.resize(100, 100);
          avatar.fills = [{type: 'SOLID', color: {r: 230/255, g: 230/255, b: 230/255}}];
          avatar.x = (393-100)/2; avatar.y = 100;
          frame.appendChild(avatar);
          addText(frame, "Sarah Jenkins", "Bold", 24, 115, 220, textDark);

          createCard(frame, 345, 60, 24, 280);
          addText(frame, "Personal Details", "Medium", 16, 44, 300, textDark);
          createCard(frame, 345, 60, 24, 360);
          addText(frame, "Pregnancy Settings", "Medium", 16, 44, 380, textDark);
          createCard(frame, 345, 60, 24, 440);
          addText(frame, "Notifications", "Medium", 16, 44, 460, textDark);
          break;
      }

      figma.currentPage.appendChild(frame);
      figma.viewport.scrollAndZoomIntoView([frame]);
      figma.notify(screenType + " generated successfully!");
    }
  } catch (error: any) {
    console.error(error);
    figma.notify("Plugin Error: " + String(error), { error: true });
  }
};
