# Name Place Animal Thing - React Frontend

React frontend for the multiplayer word game.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend URL

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and set your backend URL:

```env
REACT_APP_BACKEND_URL=https://npat-backend.onrender.com/api
```

### 3. Run Development Server

```bash
npm start
```

App will open at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Alert.jsx       # Alert notifications
│   ├── GameScreen.jsx  # Main game interface
│   ├── Header.jsx      # App header
│   ├── Lobby.jsx       # Room lobby
│   ├── ResultsScreen.jsx # Results display
│   ├── StartScreen.jsx # Start menu
│   └── WaitingScreen.jsx # Waiting state
├── services/           
│   └── WebSocketService.js # WebSocket connection
├── styles/
│   └── global.css      # Global styles
├── App.jsx             # Main app component
├── App.css             # App styles
└── index.js            # Entry point
```

## 🎮 Features

- ✅ Real-time multiplayer via WebSockets
- ✅ Create and join rooms
- ✅ Synchronized timer
- ✅ Live results
- ✅ Responsive design
- ✅ Beautiful UI with animations

## 🔧 Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🌐 Deployment

### Netlify (Recommended)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag the `build/` folder to Netlify
   - Or connect your GitHub repo

3. **Set environment variable in Netlify:**
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_BACKEND_URL=https://your-backend-url.com/api`

### Vercel

```bash
npm i -g vercel
vercel
```

Set environment variable:
```
REACT_APP_BACKEND_URL=https://your-backend-url.com/api
```

## 🔗 Backend Integration

This frontend connects to the Java Spring Boot backend via WebSockets.

**Required backend endpoints:**
- WebSocket: `/api/game-websocket`
- Health: `/api/health` (optional)

**Message types:**
- CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM
- START_GAME, SUBMIT_ANSWERS
- ROOM_CREATED, ROOM_JOINED, PLAYER_JOINED, PLAYER_LEFT
- GAME_STARTED, GAME_UPDATE, RESULTS_READY
- ERROR

## 🎨 Customization

### Change Colors

Edit `src/styles/global.css`:

```css
:root {
  --primary: #FF6B9D;    /* Main color */
  --secondary: #FEC84D;  /* Secondary */
  --tertiary: #4ECDC4;   /* Accent */
  --accent: #9B59B6;     /* Highlight */
}
```

### Change Timer Duration

Timer duration is set by backend in `application.properties`

## 🐛 Troubleshooting

### WebSocket Connection Failed

- Check backend URL is correct in `.env`
- Verify backend is running
- Check CORS settings on backend

### Build Errors

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Cannot Connect to Backend

- Ensure backend allows your frontend domain in CORS
- Check browser console for errors
- Verify WebSocket endpoint is accessible

## 📚 Dependencies

- **React 18.2** - UI framework
- **SockJS Client** - WebSocket polyfill
- **STOMP.js** - Messaging protocol
- **React Scripts** - Build tooling

## 💡 Development Tips

1. **Hot Reload**: Changes auto-reload in dev mode
2. **Console Logs**: Check browser console for WebSocket messages
3. **React DevTools**: Install for better debugging
4. **Lint**: Use ESLint for code quality

## ✅ Production Checklist

- [ ] Backend URL set correctly
- [ ] CORS configured on backend
- [ ] Build runs without errors
- [ ] Tested on mobile
- [ ] All features working
- [ ] Environment variables set

## 🎊 Ready to Deploy!

Follow the main deployment guides for step-by-step instructions!
