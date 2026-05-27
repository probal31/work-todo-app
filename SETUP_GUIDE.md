# 🚀 Quick Setup Guide

Follow these steps to get your Work & Todo App up and running.

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including React, Vite, and PWA plugins.

## Step 2: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 3: Configure GitHub

### 3.1 Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `work-todo-app` (or any name)
3. Choose Public or Private
4. Click "Create repository"

### 3.2 Generate Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "Work Todo App"
4. Select scope: ✅ **repo** (Full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** - you won't see it again!

### 3.3 Configure in the App

1. Open the app in your browser
2. Click the ⚙️ **Settings** button
3. Enter:
   - **Personal Access Token**: Paste your token
   - **Repository Owner**: Your GitHub username
   - **Repository Name**: Your repository name (e.g., `work-todo-app`)
4. Click **Save & Connect**

The app will verify the connection and create `TASKS.md` in your repository.

## Step 4: Start Using the App

### Add Tasks
- Type in the input field
- Click "➕ Add" or press Enter

### Manage Tasks
- ☐ Click checkbox to mark complete/incomplete
- ✎ Click task text to edit
- 🗑 Click trash icon to delete

### View History
- Click 📜 button to see all changes
- Each change is tracked as a Git commit

### Refresh
- Click 🔄 button to sync with GitHub

## Step 5: Deploy to GitHub Pages

### 5.1 Update package.json

Edit `package.json` and update the homepage:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/work-todo-app"
}
```

Replace `YOUR_USERNAME` with your GitHub username.

### 5.2 Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/work-todo-app.git

# Push to GitHub
git push -u origin main
```

### 5.3 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. The workflow will automatically deploy your app

Wait a few minutes, then visit:
```
https://YOUR_USERNAME.github.io/work-todo-app
```

## Step 6: Install as PWA (Optional)

### On Mobile (iOS/Android)

**iOS:**
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

**Android:**
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"
4. Tap "Add"

### On Desktop

**Chrome/Edge:**
1. Open the app
2. Look for the install icon (⊕) in the address bar
3. Click "Install"

## Troubleshooting

### "Could not connect to repository"
- ✅ Check your Personal Access Token is valid
- ✅ Verify token has `repo` scope
- ✅ Confirm repository owner and name are correct
- ✅ Make sure repository exists

### "npm install" fails
- ✅ Ensure Node.js v16+ is installed: `node --version`
- ✅ Clear npm cache: `npm cache clean --force`
- ✅ Delete `node_modules` and try again

### GitHub Actions deployment fails
- ✅ Check repository Settings → Actions → General
- ✅ Ensure "Read and write permissions" is enabled
- ✅ Verify GitHub Pages is enabled in Settings → Pages

### PWA not installing
- ✅ Must be served over HTTPS (GitHub Pages provides this)
- ✅ Clear browser cache and try again
- ✅ Check browser console for errors

## Next Steps

✅ **Customize**: Edit colors, fonts, and styles in CSS files  
✅ **Backup**: Your tasks are automatically backed up in GitHub  
✅ **Share**: Share your repository URL with team members  
✅ **Mobile**: Install as PWA on your phone for quick access  
✅ **Android App**: Follow REACT_NATIVE_GUIDE.md to build native app  

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🐛 Check [GitHub Issues](https://github.com/YOUR_USERNAME/work-todo-app/issues)
- 💬 Ask questions in GitHub Discussions

---

**Congratulations! 🎉 Your Work & Todo App is ready to use!**