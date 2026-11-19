# L'Oréal Routine Builder - Quick Start Guide

## 🎯 What This Project Does

This is an AI-powered routine builder that helps users discover L'Oréal products and get personalized skincare/beauty routines. The app now includes advanced features for searching, AI conversations, and beautiful styling.

## 🚀 Getting Started

### 1. **Browse Products**
   - Click the **Category Filter dropdown** to see products by type (Cleansers, Moisturizers, Makeup, etc.)
   - Products display in a grid with images, names, and brands

### 2. **Search for Products** (NEW!)
   - Use the **search box** at the top to find products by name or keyword
   - Type as you search - results update in real-time
   - Search works with the category filter for precise results

### 3. **Select Products**
   - Click any product card to select it
   - Selected products appear in the **"Selected Products"** section below
   - You can remove individual products or clear all with the "Clear All" button

### 4. **Generate Your Routine** (NEW!)
   - Once you've selected products, click the stunning red **"Generate Routine"** button
   - Wait while the AI creates a personalized step-by-step routine
   - The routine appears in the chat window

### 5. **Ask Follow-Up Questions** (NEW!)
   - After your routine is generated, you can ask questions in the chat
   - Ask about application order, timing, benefits, or beauty tips
   - The AI remembers everything and responds with context!

## 🎨 Visual Features

### Search Bar
- **Location**: Top section, next to category filter
- **Icon**: Magnifying glass for visual clarity
- **Styling**: L'Oréal red border (#ff003b), smooth focus animations

### Generate Button
- **State 1 (Disabled)**: 50% opacity with helpful tooltip "Select at least one product"
- **State 2 (Enabled)**: Beautiful red gradient (#ff003b → #d4002d)
- **State 3 (Hover)**: Smooth transition to gold gradient (#e3a535 → #c48e1f) with lift effect
- **State 4 (Clicked)**: Pressed animation with shadow effect

### Chat Messages
- **User Messages**: Red background (#ff003b), white text, right-aligned
- **Assistant Messages**: Light gray background (#f0f0f0), dark text, left-aligned
- **Animation**: Smooth slide-in effect as messages appear
- **Scrolling**: Auto-scrolls to newest message

## 💾 Saved Data

Your selected products are **automatically saved** to your browser's storage. If you:
- Reload the page → Your selections remain
- Close the tab → Selections are saved for next time
- Clear browser data → Selections are cleared (this is normal)

## 🔧 Behind the Scenes

The app talks to a **Cloudflare Worker** (a serverless function hosted online) that:
1. Receives your selected products
2. Sends them to OpenAI's GPT-4.1 model
3. Gets back your personalized routine
4. Returns it to your browser for display

**Important**: The API key is stored securely on the Worker, NOT in this code. This keeps your data safe! ✅

## 🎓 Learning Concepts

This project teaches:
- **DOM Manipulation**: Create and update HTML dynamically with JavaScript
- **Event Listeners**: Respond to user interactions (clicks, typing)
- **APIs & Fetch**: Send data to and receive data from web services
- **Array Methods**: `.filter()`, `.map()`, `.find()`, `.forEach()`
- **Local Storage**: Save and retrieve data in the browser
- **Async/Await**: Handle long-running operations smoothly
- **CSS Styling**: Create beautiful, responsive user interfaces
- **Conversation Memory**: Keep track of multi-turn conversations

## 🐛 Troubleshooting

**Q: The search box doesn't work**
- A: Make sure you've selected a category first, or search will work across all categories

**Q: "Generate Routine" button is grayed out**
- A: Select at least one product before clicking. The button automatically enables!

**Q: Chat isn't responding**
- A: Check the browser console (F12 → Console tab) for error messages. The Cloudflare Worker URL might be down.

**Q: My selected products disappeared**
- A: They're saved in browser storage. If you cleared your browser cache, they reset. No worries - just select them again!

## 📝 Code Files Overview

- **index.html**: The page structure (HTML markup)
- **style.css**: All the colors, layouts, and animations (styling)
- **script.js**: The logic that makes everything work (interactivity)
- **products.json**: Data about all L'Oréal products (content)

## 🌟 Pro Tips

1. **Search Before Selecting**: Use the search bar to find exactly what you need
2. **Mix Categories**: Select products from different categories for a complete routine
3. **Ask Detailed Questions**: The AI understands follow-ups like "How often should I use this?" or "Can I use this with other products?"
4. **Try Different Routines**: Clear all and start over to compare different routines!

---

**Happy Routine Building! ✨**
