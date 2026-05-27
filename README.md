# 📝 Work & Todo App

A modern, Progressive Web App (PWA) for managing work and todo tasks using GitHub as the backend. Built with React and designed for both desktop and mobile use.

## ✨ Features

- ✅ **Add, Edit, Delete Tasks** - Full CRUD operations
- ✅ **Check/Uncheck Tasks** - Mark tasks as complete/incomplete
- ✅ **GitHub Backend** - Uses your GitHub repository as storage
- ✅ **Change History** - Track all modifications via Git commits
- ✅ **PWA Support** - Install on mobile devices, works offline
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile
- ✅ **No External Server** - Hosted on GitHub Pages for free
- ✅ **Markdown Storage** - Tasks stored in TASKS.md file
- ✅ **Future-Ready** - Architecture supports React Native migration

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- GitHub account
- Git installed locally

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/work-todo-app.git
   cd work-todo-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`

## 🔧 GitHub Setup

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `work-todo-app` (or any name you prefer)
3. Make it public or private (both work)
4. Initialize with a README (optional)

### 2. Generate Personal Access Token

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "Work Todo App"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### 3. Configure the App

1. Open the app in your browser
2. Click the ⚙️ Settings button
3. Enter:
   - **Personal Access Token**: Your generated token
   - **Repository Owner**: Your GitHub username
   - **Repository Name**: Your repository name
4. Click "Save & Connect"

The app will create a `TASKS.md` file in your repository automatically.

## 📦 Deployment to GitHub Pages

### Option 1: Automated Deployment (Recommended)

1. **Update `package.json`**
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/work-todo-app"
   }
   ```

2. **Create GitHub Actions workflow**
   
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
       - uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           
       - name: Install dependencies
         run: npm ci
         
       - name: Build
         run: npm run build
         
       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

4. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Option 2: Manual Deployment

```bash
npm run build
npm run deploy
```

## 📱 Installing as PWA

### On Mobile (iOS/Android)

1. Open the app in your mobile browser
2. **iOS**: Tap Share → Add to Home Screen
3. **Android**: Tap Menu (⋮) → Add to Home Screen
4. The app will install like a native app!

### On Desktop

1. Open the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click "Install"

## 🏗️ Project Structure

```
work-todo-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── TaskList.jsx
│   │   ├── TaskItem.jsx
│   │   ├── Settings.jsx
│   │   └── History.jsx
│   ├── services/        # Business logic
│   │   ├── githubAPI.js
│   │   └── markdownParser.js
│   ├── App.jsx          # Main app component
│   ├── App.css
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── TASKS.md             # Task data (markdown)
├── package.json
├── vite.config.js       # Vite + PWA config
└── README.md
```

## 🔌 API Integration

### GitHub API Endpoints Used

- **Read File**: `GET /repos/{owner}/{repo}/contents/TASKS.md`
- **Update File**: `PUT /repos/{owner}/{repo}/contents/TASKS.md`
- **Commit History**: `GET /repos/{owner}/{repo}/commits?path=TASKS.md`

### For Future Android App

The same GitHub API can be used in React Native:

```javascript
// Shared service layer
import githubAPI from './services/githubAPI';

// Works in both web and React Native
const tasks = await githubAPI.fetchFile();
await githubAPI.updateFile(content, message);
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

### Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa
- **Styling**: CSS (CSS Variables)
- **Backend**: GitHub API
- **Storage**: Markdown file in GitHub repo
- **Hosting**: GitHub Pages

## 🔐 Security Notes

- **Never commit your Personal Access Token** to the repository
- Tokens are stored in browser's localStorage
- Use tokens with minimal required scopes
- Regenerate tokens periodically
- For production, consider using GitHub OAuth flow

## 🐛 Troubleshooting

### "Could not connect to repository"
- Verify your Personal Access Token is valid
- Check token has `repo` scope
- Ensure repository owner and name are correct

### "File not found" error
- The app will create TASKS.md automatically on first save
- Ensure you have write access to the repository

### PWA not installing
- Ensure you're using HTTPS (GitHub Pages provides this)
- Check browser console for service worker errors
- Try clearing browser cache

## 🚀 Future Enhancements

- [ ] React Native mobile app
- [ ] Drag-and-drop task reordering
- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Multiple task lists
- [ ] Collaboration features
- [ ] Dark mode
- [ ] Export to other formats

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Review existing issues for solutions

---

**Built with ❤️ using React, Vite, and GitHub API**