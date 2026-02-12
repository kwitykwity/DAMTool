# ✅ Deployment Checklist

Print this or keep it open while deploying!

---

## 🎯 Before You Start

- [ ] Google Account ready
- [ ] 10 minutes of time
- [ ] Chrome or Firefox browser

---

## 📝 Gather Your Credentials

### ☁️ Google Cloud Vision API Key

1. [ ] Go to https://console.cloud.google.com/
2. [ ] Create new project: "DAM Tool"
3. [ ] Enable "Cloud Vision API"
4. [ ] Create API Key
5. [ ] Copy API key: `AIza________________________`

**Paste it here for reference:**
```
API_KEY: ___________________________________
```

---

### 📁 Google Drive Folder ID

1. [ ] Go to https://drive.google.com
2. [ ] Create folder: "DAM_Assets"
3. [ ] Open the folder
4. [ ] Copy ID from URL (after `/folders/`)

**Paste it here for reference:**
```
FOLDER_ID: ___________________________________
```

---

## 🔧 Setup Apps Script

### Create the Project

1. [ ] Create new Google Sheet: "DAM Database"
2. [ ] Extensions → Apps Script
3. [ ] Delete placeholder code
4. [ ] Copy code from `Code.gs`
5. [ ] Paste into editor
6. [ ] Update line 17: `VISION_API_KEY: 'YOUR_KEY_HERE'`
7. [ ] Update line 18: `DRIVE_FOLDER_ID: 'YOUR_ID_HERE'`
8. [ ] Save (Ctrl+S)

### Add the HTML

1. [ ] Click `+` next to Files
2. [ ] Select HTML
3. [ ] Name it: `DAMTool`
4. [ ] Copy code from `DAMTool.html`
5. [ ] Paste into editor
6. [ ] Save (Ctrl+S)

---

## 🚀 Deploy

### Create Deployment

1. [ ] Click "Deploy" → "New deployment"
2. [ ] Click gear icon ⚙️
3. [ ] Select "Web app"
4. [ ] Description: `DAM Tool v1`
5. [ ] Execute as: `Me (your-email@gmail.com)`
6. [ ] Who has access: `Anyone`
7. [ ] Click "Deploy"
8. [ ] Authorize (click through permissions)
9. [ ] Copy Web App URL

**Paste your Web App URL here:**
```
WEB_APP_URL: ___________________________________
```

### Update HTML

1. [ ] Open `DAMTool.html` in Apps Script
2. [ ] Find line 257: `const baseUrl = '';`
3. [ ] Replace with your URL
4. [ ] Save (Ctrl+S)

---

## 🧪 Test

### Add Images & Sync

1. [ ] Add 2-3 images to your Drive folder
2. [ ] Open your Web App URL in new tab
3. [ ] See the purple interface? ✅
4. [ ] Click "Sync" button
5. [ ] See "Synced! Found X assets"? ✅

### Tag Images

1. [ ] Go back to Google Sheet
2. [ ] Click 🎨 DAM Tool → 🏷️ Tag All Assets
3. [ ] Wait for completion
4. [ ] Check column G has tags? ✅

### Search

1. [ ] Refresh Web App page
2. [ ] Type a tag in search box (e.g., "face", "smile")
3. [ ] Press Enter
4. [ ] See thumbnails? ✅
5. [ ] Click a thumbnail
6. [ ] Does it download? ✅

---

## 🎉 Success!

If all checkboxes above are ✅, your DAM tool is working!

**Bookmark your Web App URL:** ⭐

---

## 🐛 If Something Doesn't Work

### Check These Common Issues:

**"Error loading assets"**
- [ ] Did you click Sync first?
- [ ] Are there images in your Drive folder?
- [ ] Is the folder ID correct?

**"Sync error"**
- [ ] Is your API key valid?
- [ ] Is Vision API enabled?
- [ ] Did you save Code.gs after updating credentials?

**No thumbnails**
- [ ] Did you tag the images? (DAM Tool → Tag All Assets)
- [ ] Are they supported formats? (JPG, PNG, GIF, WEBP, BMP)
- [ ] Try clicking Sync again

**Can't access Web App**
- [ ] Are you using the `/exec` URL (not editor URL)?
- [ ] Try redeploying
- [ ] Try incognito/private mode

---

## 📞 Still Stuck?

1. Take a screenshot of the error
2. Open a GitHub issue
3. Include what step you're on
4. Paste the error message

We'll help you get it working! 🚀

---

**Date completed:** ___________________

**Web App URL:** ___________________

**Time taken:** _________ minutes
