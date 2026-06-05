"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // code.ts
  var require_code = __commonJS({
    "code.ts"() {
      figma.showUI(__html__, { width: 300, height: 260 });
      figma.ui.onmessage = async (msg) => {
        try {
          if (msg.type === "setup-styles") {
            const pBrandOrange = figma.createPaintStyle();
            pBrandOrange.name = "Bloom / Brand Orange";
            pBrandOrange.paints = [{ type: "SOLID", color: { r: 249 / 255, g: 115 / 255, b: 22 / 255 } }];
            const pBlushPink = figma.createPaintStyle();
            pBlushPink.name = "Bloom / Blush Pink";
            pBlushPink.paints = [{ type: "SOLID", color: { r: 255 / 255, g: 228 / 255, b: 230 / 255 } }];
            const pBackground = figma.createPaintStyle();
            pBackground.name = "Bloom / Background Soft";
            pBackground.paints = [{ type: "SOLID", color: { r: 250 / 255, g: 248 / 255, b: 245 / 255 } }];
            const pTextHeavy = figma.createPaintStyle();
            pTextHeavy.name = "Bloom / Text Dark";
            pTextHeavy.paints = [{ type: "SOLID", color: { r: 30 / 255, g: 30 / 255, b: 30 / 255 } }];
            figma.notify("Bloom color styles created!");
          }
          if (msg.type === "generate-home") {
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            await figma.loadFontAsync({ family: "Inter", style: "Medium" });
            await figma.loadFontAsync({ family: "Inter", style: "Bold" });
            const dummyText = figma.createText();
            await figma.loadFontAsync(dummyText.fontName);
            dummyText.remove();
            const frame = figma.createFrame();
            frame.name = "Bloom Home Screen";
            frame.resize(393, 852);
            frame.fills = [{ type: "SOLID", color: { r: 250 / 255, g: 248 / 255, b: 245 / 255 } }];
            const headerDate = figma.createText();
            headerDate.fontName = { family: "Inter", style: "Medium" };
            headerDate.characters = "Today, Oct 24";
            headerDate.fontSize = 14;
            headerDate.fills = [{ type: "SOLID", color: { r: 100 / 255, g: 100 / 255, b: 100 / 255 } }];
            headerDate.x = 24;
            headerDate.y = 60;
            frame.appendChild(headerDate);
            const title = figma.createText();
            title.fontName = { family: "Inter", style: "Bold" };
            title.characters = "Good Morning, Sarah \u{1F44B}";
            title.fontSize = 24;
            title.fills = [{ type: "SOLID", color: { r: 30 / 255, g: 30 / 255, b: 30 / 255 } }];
            title.x = 24;
            title.y = 80;
            frame.appendChild(title);
            const tracker = figma.createEllipse();
            tracker.resize(250, 250);
            tracker.x = (393 - 250) / 2;
            tracker.y = 150;
            tracker.fills = [{
              type: "GRADIENT_LINEAR",
              gradientTransform: [[1, 0, 0], [0, 1, 0]],
              gradientStops: [
                { position: 0, color: { r: 249 / 255, g: 115 / 255, b: 22 / 255, a: 1 } },
                { position: 1, color: { r: 255 / 255, g: 190 / 255, b: 150 / 255, a: 1 } }
              ]
            }];
            frame.appendChild(tracker);
            const card = figma.createRectangle();
            card.resize(345, 120);
            card.cornerRadius = 24;
            card.fills = [{ type: "SOLID", color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, opacity: 0.6 }];
            card.effects = [{
              type: "DROP_SHADOW",
              color: { r: 0, g: 0, b: 0, a: 0.05 },
              offset: { x: 0, y: 10 },
              radius: 30,
              visible: true,
              blendMode: "NORMAL"
            }];
            card.x = 24;
            card.y = 440;
            frame.appendChild(card);
            const cardTitle = figma.createText();
            cardTitle.fontName = { family: "Inter", style: "Bold" };
            cardTitle.characters = "Week 12 \u2022 First Trimester";
            cardTitle.fontSize = 16;
            cardTitle.fills = [{ type: "SOLID", color: { r: 30 / 255, g: 30 / 255, b: 30 / 255 } }];
            cardTitle.x = 44;
            cardTitle.y = 460;
            frame.appendChild(cardTitle);
            const cardDesc = figma.createText();
            cardDesc.fontName = { family: "Inter", style: "Regular" };
            cardDesc.characters = "Your baby is the size of a plum!";
            cardDesc.fontSize = 14;
            cardDesc.fills = [{ type: "SOLID", color: { r: 100 / 255, g: 100 / 255, b: 100 / 255 } }];
            cardDesc.x = 44;
            cardDesc.y = 490;
            frame.appendChild(cardDesc);
            figma.currentPage.appendChild(frame);
            figma.viewport.scrollAndZoomIntoView([frame]);
            figma.notify("Home Screen scaffolded!");
          }
          if (msg.type === "cancel") {
            figma.closePlugin();
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
