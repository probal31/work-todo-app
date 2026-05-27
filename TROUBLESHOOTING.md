# 🔧 Troubleshooting Guide

## Build Errors

### Error: "Dynamic require of 'workbox-build' is not supported"

**Symptom:**
```
Error: Dynamic require of "workbox-build" is not supported
    at file:///node_modules/vite-plugin-pwa/dist/index.js
```

**Cause:** 
Version mismatch between `vite-plugin-pwa` and Node.js/Vite.

**Solution:**
Already fixed in the project! The package.json uses compatible versions:
- `vite-plugin-pwa`: `^0.19.0` (updated version)
- `workbox-window`: `^7.0.0` (added dependency)

**If you still see this error:**

1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall dependencies:
   ```bash
   npm install
   ```

3. Try building again:
   ```bash
   npm run build
   ```

### Error: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Error: "Module not found"

**Cause:** Missing dependencies

**Solution:**
```bash
npm install
```

## Deployment Errors

### GitHub Actions Build Fails

**Check:**
1. Go to repository → Actions tab
2. Click on the failed workflow
3. Read the error message

**Common fixes:**

**Error: "npm ci" fails**
```yaml
# Solution: Use npm install instead
- run: npm install
```

**Error: "Permission denied"**
- Go to Settings → Actions → General
- Enable "Read and write permissions"

**Error: "Pages deployment failed"**
- Go to Settings → Pages
- Ensure Source is set to "GitHub Actions"

### App Not Loading After Deployment

**Check:**
1. Wait 2-3 minutes after deployment
2. Clear browser cache (Ctrl+Shift+R)
3. Check browser console for errors (F12)

**Common issues:**

**404 errors for assets:**
- Verify `base: './'` in `vite.config.js`
- Check GitHub Pages URL matches repository name

**Blank page:**
- Check browser console for JavaScript errors
- Verify all files deployed correctly in Actions tab

## Runtime Errors

### "Could not connect to repository"

**Causes & Solutions:**

1. **Invalid token**
   - Generate new token at https://github.com/settings/tokens
   - Ensure `repo` scope is selected

2. **Wrong repository details**
   - Verify owner (username) is correct
   - Verify repository name is correct
   - Check repository exists and is accessible

3. **Token expired**
   - Tokens can expire based on settings
   - Generate new token and update in Settings

### "File not found" (TASKS.md)

**Solution:**
The app creates TASKS.md automatically on first save. Just add a task and it will be created.

### PWA Not Installing

**Requirements:**
- Must be served over HTTPS (GitHub Pages provides this)
- Must have valid manifest.json
- Must have service worker

**Solutions:**

1. **Clear browser cache:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"

2. **Check manifest:**
   - Open DevTools (F12)
   - Go to Application tab
   - Check Manifest section for errors

3. **Check service worker:**
   - Open DevTools (F12)
   - Go to Application tab
   - Check Service Workers section

4. **Try different browser:**
   - Chrome/Edge: Best PWA support
   - Firefox: Good support
   - Safari: Limited support

### Tasks Not Syncing

**Check:**
1. Internet connection
2. GitHub credentials are configured
3. Repository has write access
4. Check browser console for API errors

**Solution:**
- Click 🔄 Refresh button
- Re-enter credentials in Settings
- Check GitHub API status: https://www.githubstatus.com/

## Development Issues

### "npm run dev" fails

**Error: "Port 5173 already in use"**
```bash
# Kill the process using the port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

**Error: "Cannot find module"**
```bash
npm install
```

### Hot Reload Not Working

**Solution:**
1. Stop dev server (Ctrl+C)
2. Delete `.vite` cache folder
3. Restart: `npm run dev`

### TypeScript Errors (if using TypeScript)

**Solution:**
This project uses JavaScript (.jsx), not TypeScript (.tsx).
If you want TypeScript, you'll need to:
1. Rename files: `.jsx` → `.tsx`
2. Add type definitions
3. Configure `tsconfig.json`

## Browser Compatibility

### Supported Browsers

✅ **Fully Supported:**
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

⚠️ **Partial Support:**
- Safari 13 (no PWA install)
- Firefox 87 (limited PWA features)

❌ **Not Supported:**
- Internet Explorer (any version)
- Chrome < 90
- Safari < 13

### Feature Detection

The app uses modern JavaScript features:
- `async/await`
- `fetch` API
- `localStorage`
- ES6 modules

If you need to support older browsers, you'll need to add polyfills.

## Getting Help

If you're still stuck:

1. **Check existing issues:**
   - https://github.com/YOUR_USERNAME/work-todo-app/issues

2. **Create new issue:**
   - Include error message
   - Include browser/OS version
   - Include steps to reproduce

3. **Check documentation:**
   - README.md
   - SETUP_GUIDE.md
   - REACT_NATIVE_GUIDE.md

## Useful Commands

```bash
# Clear everything and start fresh
rm -rf node_modules package-lock.json dist
npm install
npm run dev

# Check for outdated packages
npm outdated

# Update packages
npm update

# Check Node.js version
node --version  # Should be 16+

# Check npm version
npm --version   # Should be 8+

# Test production build locally
npm run build
npm run preview
```

## Debug Mode

To enable verbose logging:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for error messages
4. Look for network errors in Network tab

## Common Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Build fails | `rm -rf node_modules && npm install` |
| Port in use | Kill process or use different port |
| PWA not installing | Clear cache, check HTTPS |
| Tasks not syncing | Check credentials, refresh |
| Blank page | Check console, verify deployment |
| GitHub Actions fails | Check permissions, read logs |

---

**Still need help?** Open an issue with:
- Error message (full text)
- Steps to reproduce
- Browser/OS version
- Screenshots if applicable