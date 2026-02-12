# 🚀 Quick Start Guide - Deploy Your Own DAM Tool

This guide helps you create your own working copy of the Kwitykwity DAM Tool in **under 10 minutes**.

---

## 📋 Prerequisites

- Google Account
- Google Cloud account (free tier is fine)
- Chrome or Firefox browser

---

## ⚡ Fast Track Setup (10 Minutes)

### Step 1: Create Google Cloud Project (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it: `DAM Tool`
4. Click **"Create"**

### Step 2: Enable Vision API & Get API Key (3 minutes)

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Cloud Vision API"**
3. Click **Enable**
4. Go to **APIs & Services** → **Credentials**
5. Click **"+ Create Credentials"** → **API Key**
6. **Copy the API key** (starts with `AIza...`)
7. Click **"Restrict Key"**:
   - Under "API restrictions", select **"Cloud Vision API"**
   - Click **Save**

### Step 3: Create Google Drive Folder (1 minute)

1. Go to [Google Drive](https://drive.google.com)
2. Click **New** → **Folder**
3. Name it: `DAM_Assets`
4. Open the folder
5. **Copy the folder ID** from URL:
   ```
   https://drive.google.com/drive/folders/13kaO35TdPp3X-T0_A0fdBFG3Th8jUJNm
                                          ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                          This is your folder ID
   ```

### Step 4: Create Google Sheet (1 minute)

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **Blank** to create new sheet
3. Name it: `DAM Database`

### Step 5: Add the Code (2 minutes)

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete the placeholder code
3. Copy **all the code** from `Code.gs` in this repository
4. Paste it into the Apps Script editor
5. **Update lines 17-18** with your credentials:
   ```javascript
   VISION_API_KEY: 'AIzaSy_YOUR_ACTUAL_KEY_HERE',
   DRIVE_FOLDER_ID: 'YOUR_ACTUAL_FOLDER_ID_HERE',
   ```
6. Click **Save** (💾 icon or Ctrl+S)
7. Name the project: `DAM Tool`

### Step 6: Add the HTML (1 minute)

1. In Apps Script, click **+** next to "Files"
2. Select **HTML**
3. Name it: `DAMTool`
4. Copy **all the code** from `DAMTool.html` in this repository
5. Paste it in
6. Click **Save**

### Step 7: Deploy the Web App (2 minutes)

1. Click **Deploy** → **New deployment**
2. Click the **gear icon** ⚙️ → Select **"Web app"**
3. Fill in:
   ```
   Description: DAM Tool v1
   Execute as: Me (your-email@gmail.com)
   Who has access: Anyone
   ```
4. Click **Deploy**
5. Click **Authorize access**
6. Choose your Google account
7. Click **Advanced** → **Go to DAM Tool (unsafe)** → **Allow**
8. **Copy the Web App URL** (ends with `/exec`)

### Step 8: Update HTML with Your URL (1 minute)

1. In Apps Script, open `DAMTool.html`
2. Find line ~257:
   ```javascript
   const baseUrl = '';
   ```
3. Replace with your Web App URL:
   ```javascript
   const baseUrl = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
4. Click **Save**

### Step 9: Test It! (30 seconds)

1. **Add some images** to your `DAM_Assets` folder in Google Drive
2. **Open your Web App URL** in a new browser tab
3. You should see the purple interface!
4. **Click "Sync"** button
5. Wait for "Synced! Found X assets" message

### Step 10: Tag Your Images (1 minute)

1. Go back to your **Google Sheet**
2. Click **🎨 DAM Tool** → **🏷️ Tag All Assets**
3. Wait for completion (1 second per image)
4. **Refresh your Web App** page
5. **Search for a tag** (like "glasses", "smile", "purple")
6. See your thumbnails! 🎉

---

## ✅ You're Done!

Your DAM tool is now running at your Web App URL!

**Bookmark it** for easy access.

---

## 🎨 What You Can Do Now:

- 🔍 **Search** by AI-generated tags
- 🖼️ **Browse** thumbnails in a beautiful gallery
- ⬇️ **Download** images by clicking thumbnails
- 🔄 **Sync** new images from Drive
- 🏷️ **Auto-tag** all images with AI

---

## 🐛 Troubleshooting

### "Error loading assets"
- Make sure you clicked "Sync" at least once
- Check that your Drive folder has images
- Verify your folder ID is correct

### "Sync error"
- Check your API key is valid
- Make sure Vision API is enabled
- Verify API key restrictions allow Vision API

### Thumbnails not showing
- Make sure images are in supported formats (JPG, PNG, GIF, WEBP, BMP)
- Check they're in the correct Drive folder
- Try clicking "Sync" again

### "Failed to fetch"
- Make sure you're using the `/exec` URL, not the editor URL
- Redeploy the web app
- Try incognito/private browsing mode

---

## 💰 Cost

**Free tier includes:**
- 1,000 Vision API requests per month (FREE)
- Google Drive storage (15GB FREE)
- Google Sheets (FREE)
- Apps Script (FREE)

**After free tier:**
- Vision API: $1.50 per 1,000 images
- Drive storage: $1.99/month for 100GB

For personal use with 100-200 images, you'll **stay in the free tier**!

---

## 🔒 Security Notes

- Your API key is stored in **your** Apps Script (private to you)
- Only **you** can access the Google Sheet
- Web app can be accessed by **Anyone** (but they can't edit your data)
- To make it private, change "Who has access" to "Only myself"

---

## 📚 Next Steps

- Add more images to your Drive folder
- Tag them using the menu or Sync button
- Organize by creating folders for different categories
- Share your Web App URL with team members

---

## 🆘 Need Help?

Open an issue on GitHub with:
1. What you're trying to do
2. What error you're seeing
3. Screenshot of the error (if applicable)

---

**Congratulations! You now have your own AI-powered Digital Asset Management system!** 🎉
