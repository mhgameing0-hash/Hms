# HMS Home Maintenance System (Flutter Android App)

مکمل اینڈرائیڈ فلٹر پراجیکٹ برائے ہوم مینٹیننس سسٹم (پاکستان)

---

## حقیقی 35MB+ ریلیز APK تیار کرنے کے طریقے (How to Build the Real 35MB Release APK)

اینڈرائیڈ پر 19KB کی فائل اس لیے Parse نہیں ہوتی کیونکہ حقیقی اینڈرائیڈ بائنری (Compiled Bytecode / DEX) تقریباً 25MB سے 40MB کی ہوتی ہے۔ نیچے دیے گئے کسی بھی طریقے سے اصلی بائنری حاصل کریں:

### طریقہ نمبر 1: گٹ ہب ایکشنز سے مفت خودکار بلڈ (GitHub Actions - 100% Free & Automatic)
1. اپنے گٹ ہب (`github.com`) اکاؤنٹ پر جائیں اور نیو ریپوزٹری بنائیں: **`hms-flutter-app`**
2. اس ZIP فائل کے تمام فولڈرز اور فائلز گٹ ہب ریپوزٹری میں اپلوڈ / پش کریں (یا گٹ ہب ویب سائٹ پر ڈریگ اینڈ ڈراپ کریں)۔
3. جیسے ہی آپ پش کریں گے، ریپوزٹری میں موجود **`.github/workflows/build-apk.yml`** خودکار طریقے سے چل پڑے گا۔
4. گٹ ہب کے **"Actions"** ٹیب میں جائیں -> **"Build Real Flutter Android Release APK"** پر کلک کریں۔
5. بلڈ مکمل ہونے پر (2 سے 3 منٹ بعد) نیچے **Artifacts** سیکشن سے اصلی **`hms-app-release-apk`** (حجم تقریباً 35MB) ڈاؤنلوڈ کریں اور کسی بھی اینڈرائیڈ فون پر انسٹال کریں!

---

### طریقہ نمبر 2: گٹ ہب کوڈ سپیسز (GitHub Codespaces - براؤزر میں 1 کلک بلڈ)
1. گٹ ہب پر اپنی ریپوزٹری میں سبز بٹن **"Code"** پر کلک کریں۔
2. **"Codespaces"** -> **"Create codespace on main"** منتخب کریں۔
3. براؤزر میں ٹرمینل کھل جائے گا۔ صرف یہ 2 کمانڈز ٹائپ کریں:
   ```bash
   flutter pub get
   flutter build apk --release
   ```
4. بائیں فائل پینل میں `build/app/outputs/flutter-apk/app-release.apk` پر رائٹ کلک کر کے **"Download"** کریں!

---

### طریقہ نمبر 3: اپنے کمپیوٹر پر (Local Machine / Android Studio)
اگر آپ کے کمپیوٹر پر Flutter انسٹال ہے:
```bash
flutter pub get
flutter build apk --release
```
فائل یہاں بنے گی:
`build/app/outputs/flutter-apk/app-release.apk`

---

## ایپ کی خصوصیات (Features)
- 13 سول اور ہوم مینٹیننس شعبہ جات (Civil, Electrical, Plumbing, Paint, etc.)
- 3D واٹر گلاس ایفیکٹس اور اینیمیشنز
- کاریگر پروفائلز، تصدیق اور پورٹ فولیو
- کاریگر ورکر والٹ (Worker Wallet) اور جاب بکنگ
- مکمل اردو اور انگلش سپورٹ
