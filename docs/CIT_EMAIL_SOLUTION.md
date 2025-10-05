# 🎯 CIT.EDU.LY Email Configuration - Complete Solution

## ✅ IMPORTANT DISCOVERY: CIT.EDU.LY Uses Google Workspace!

After testing, we discovered that **cit.edu.ly uses Google Workspace** (formerly G Suite), not a custom mail server. The MX records point to Google's servers:
- ASPMX.L.GOOGLE.COM
- ALT1.ASPMX.L.GOOGLE.COM
- ALT2.ASPMX.L.GOOGLE.COM

## 📧 Your Email Credentials

- **Email**: ebic@cit.edu.ly
- **Current Password**: G8VUG5=gWW2r2gP<
- **Domain**: cit.edu.ly (Google Workspace)

## 🔴 THE PROBLEM

The password `G8VUG5=gWW2r2gP<` appears to be either:
1. Your Google account password (but Google blocks direct SMTP access with regular passwords)
2. An expired app-specific password
3. A cPanel/webmail password (not for Google SMTP)

## ✅ THE SOLUTION

You need to generate an **App-Specific Password** from Google. Here's how:

### Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/
2. Sign in with: **ebic@cit.edu.ly**
3. Click on **Security** in the left menu
4. Under "Signing in to Google", click **2-Step Verification**
5. Follow the setup process (use your phone number)

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go to: https://myaccount.google.com/apppasswords
2. Sign in again if prompted
3. Select app: **Mail**
4. Select device: **Other (Custom name)**
5. Enter name: **EBIC Website**
6. Click **Generate**
7. **Copy the 16-character password** (it looks like: xxxx xxxx xxxx xxxx)

### Step 3: Update Your .env File

Replace the password in your `.env` file:

```env
# -----------------------------------------------
# 4. EMAIL SYSTEM - CIT.EDU.LY (GOOGLE WORKSPACE)
# -----------------------------------------------
SMTP_HOST="cit.edu.ly"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="ebic@cit.edu.ly"
SMTP_PASS="zpvauhxpatovxjju"
EMAIL_FROM="ebic@cit.edu.ly"
```

### Step 4: Test the Configuration

```bash
# Test with the simple script
node scripts/test-email.js your-email@example.com

# Or test with the API
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@example.com"}'
```

## 🔧 Alternative Solutions

### Option A: If You Can't Enable 2-Step Verification

If your Google Workspace admin has disabled 2-Step Verification:

1. Contact your IT administrator at CIT
2. Ask them to:
   - Enable 2-Step Verification for your account
   - OR create an app-specific password for you
   - OR enable "Less secure app access" (not recommended)

### Option B: Use OAuth2 (More Complex)

For production environments, consider implementing OAuth2:

```javascript
// Install required packages
npm install @google-auth-library/oauth2-client

// Use OAuth2 instead of password
const oauth2Client = new OAuth2(
  clientId,
  clientSecret,
  redirectUrl
);
```

## 📝 Quick Checklist

- [ ] Log into https://mail.google.com with ebic@cit.edu.ly to verify access
- [ ] Enable 2-Step Verification at https://myaccount.google.com/
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
- [ ] Update .env file with the new App Password
- [ ] Test email sending with the test script
- [ ] Remove old .env files (.env.example, .env.smtp.example)

## 🌐 Access Your Email

Since you use Google Workspace, you can access your email at:

- **Webmail**: https://mail.google.com/
- **Admin Console**: https://admin.google.com/ (if you have admin access)
- **Calendar**: https://calendar.google.com/
- **Drive**: https://drive.google.com/

Sign in with: **ebic@cit.edu.ly**

## 📞 Need Help?

If you can't generate an App Password:

1. **Contact CIT IT Support**
   - Tell them: "I need to enable SMTP access for ebic@cit.edu.ly"
   - Ask if 2-Step Verification is enabled for your domain
   - Request help generating an app-specific password

2. **Check with Google Workspace Admin**
   - The domain admin can generate app passwords
   - They can check if SMTP is enabled for your account
   - They can verify your account settings

## 🎉 Expected Result

Once configured correctly, your emails will:
- Send from **ebic@cit.edu.ly**
- Use Google's reliable SMTP servers
- Work with all email features in your application
- Have high deliverability rates

## 🔒 Security Notes

1. **Never share your App Password**
2. App Passwords are as powerful as your regular password
3. You can revoke App Passwords anytime from Google Account settings
4. Each application should have its own App Password

## 📊 Benefits of Using Google Workspace

- ✅ **Reliability**: 99.9% uptime guarantee
- ✅ **Deliverability**: Excellent email reputation
- ✅ **Storage**: 30GB+ per user
- ✅ **Security**: Built-in spam and phishing protection
- ✅ **Features**: Calendar, Drive, Meet integration
- ✅ **Support**: 24/7 support for Workspace accounts

---

**Remember**: The key issue is that you need an **App-Specific Password** from Google, not your regular password. Once you have that, everything will work perfectly!
