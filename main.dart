import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// ============================================================================
// HMS - Home Maintenance System (تمام سول اور ہوم سروسز)
// Production Release v1.0.0 for Google Play Store (.aab / .apk)
// Single-file Complete Production Code
// ============================================================================

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF070A11),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const HMSHomeApp());
}

class HMSHomeApp extends StatelessWidget {
  const HMSHomeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'HMS - Home Maintenance Services',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF070A11),
        primaryColor: const Color(0xFF00E5FF),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00E5FF),
          secondary: Color(0xFF0055FF),
          surface: Color(0xFF0E1524),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0B101C),
          elevation: 0,
        ),
      ),
      home: const HMSDashboardScreen(),
    );
  }
}

// ----------------------------------------------------------------------------
// DATA MODELS
// ----------------------------------------------------------------------------
class HMSService {
  final String id;
  final String titleUrdu;
  final String titleEng;
  final String titleArabic;
  final IconData icon;
  final Color accentColor;
  final String category;
  final String categoryUrdu;
  final String typicalRate;
  final String rateUnit;
  final String descriptionUrdu;
  final List<String> commonTasks;

  const HMSService({
    required this.id,
    required this.titleUrdu,
    required this.titleEng,
    required this.titleArabic,
    required this.icon,
    required this.accentColor,
    required this.category,
    required this.categoryUrdu,
    required this.typicalRate,
    required this.rateUnit,
    required this.descriptionUrdu,
    required this.commonTasks,
  });
}

class WorkerProfile {
  final String id;
  final String name;
  final String serviceId;
  final String phone;
  final String whatsapp;
  final int experienceYears;
  final String rateText;
  final String city;
  final String area;
  final double rating;
  final int jobsCompleted;
  final bool cnicVerified;
  final String bio;
  final String badgeLevel;

  WorkerProfile({
    required this.id,
    required this.name,
    required this.serviceId,
    required this.phone,
    required this.whatsapp,
    required this.experienceYears,
    required this.rateText,
    required this.city,
    required this.area,
    required this.rating,
    required this.jobsCompleted,
    required this.cnicVerified,
    required this.bio,
    this.badgeLevel = 'Verified Pro',
  });
}

class BookingOrder {
  final String serviceTitle;
  final String workerName;
  final String customerName;
  final String phone;
  final String city;
  final String address;
  final String urgency;
  final String notes;

  BookingOrder({
    required this.serviceTitle,
    required this.workerName,
    required this.customerName,
    required this.phone,
    required this.city,
    required this.address,
    required this.urgency,
    required this.notes,
  });
}

// ----------------------------------------------------------------------------
// PRE-DEFINED CIVIL & HOME MAINTENANCE SERVICES (13 CATEGORIES)
// ----------------------------------------------------------------------------
final List<HMSService> kHmsServices = [
  const HMSService(
    id: 'contractor',
    titleUrdu: 'ٹھیکیدار',
    titleEng: 'Contractor',
    titleArabic: 'المقاول العام',
    icon: Icons.apartment_rounded,
    accentColor: Color(0xFFFFD54F),
    category: 'Management',
    categoryUrdu: 'انتظامیہ اور ٹھیکہ',
    typicalRate: 'Rs. 2,400 - 3,500',
    rateUnit: 'فی مربع فٹ (Per Sq.ft)',
    descriptionUrdu: 'مکمل گھر کی تعمیر، گرے سٹرکچر اور کنٹریکٹ مانیٹرنگ کی پیشہ ورانہ خدمات',
    commonTasks: ['گرے سٹرکچر تعمیر', 'مکمل فنشنگ ٹھیکہ', 'لیبر سپروائزن', 'فاؤنڈیشن ورک'],
  ),
  const HMSService(
    id: 'civil_engineer',
    titleUrdu: 'سول انجینئر',
    titleEng: 'Civil Engineer',
    titleArabic: 'مهندس مدني',
    icon: Icons.engineering_rounded,
    accentColor: Color(0xFF00E5FF),
    category: 'Engineering',
    categoryUrdu: 'انجینئرنگ و معائنہ',
    typicalRate: 'Rs. 5,000 - 15,000',
    rateUnit: 'فی وزٹ / BOQ رپورٹ',
    descriptionUrdu: 'سٹرکچرل ڈیزائن، فاؤنڈیشن معائنہ، میٹریل ٹیسٹنگ اور نقشہ تصدیق',
    commonTasks: ['سٹرکچر لوڈ کیلکولیشن', 'میٹریل کوالٹی ٹیسٹ', 'BOQ لاگت کی رپورٹ', 'کریکس تشخیص'],
  ),
  const HMSService(
    id: 'architect',
    titleUrdu: 'آرکیٹیکٹ',
    titleEng: 'Architect Design',
    titleArabic: 'مهندس معماري',
    icon: Icons.architecture_rounded,
    accentColor: Color(0xFFFF4081),
    category: 'Design',
    categoryUrdu: 'نقشہ اور 3D ماڈلنگ',
    typicalRate: 'Rs. 25,000 - 80,000',
    rateUnit: 'فی ہاؤس پلان',
    descriptionUrdu: 'جدید 2D/3D ہاؤس پلاننگ، ایلیویشن، کیڈ ڈرائنگ اور میپ اپروول',
    commonTasks: ['2D فلور میپ پلاننگ', '3D فرنٹ ایلیویشن', 'LDA / CDA میپ منظوری', 'اسپیس پلاننگ'],
  ),
  const HMSService(
    id: 'mason',
    titleUrdu: 'راج مستری',
    titleEng: 'Mason / Builder',
    titleArabic: 'بَنّاء ومساح',
    icon: Icons.foundation_rounded,
    accentColor: Color(0xFFFF9100),
    category: 'Civil Work',
    categoryUrdu: 'چنائی اور پلاسٹر',
    typicalRate: 'Rs. 2,200 - 2,800',
    rateUnit: 'روزانہ دیہاڑی (Daily)',
    descriptionUrdu: 'اینٹوں کی پکی چنائی، سیمنٹ پلاسٹر، فاؤنڈیشن کٹائی اور لینٹر ڈالنا',
    commonTasks: ['اینٹوں کی چنائی', 'سیمنٹ ریت پلاسٹر', 'لینٹر کی بھرائی', 'سیڑھیوں کی بناوٹ'],
  ),
  const HMSService(
    id: 'electrician',
    titleUrdu: 'الیکٹریشن',
    titleEng: 'Electrician',
    titleArabic: 'فني كهرباء',
    icon: Icons.electric_bolt_rounded,
    accentColor: Color(0xFFFFEA00),
    category: 'Electrical',
    categoryUrdu: 'بجلی و وائرنگ',
    typicalRate: 'Rs. 700 - 1,500',
    rateUnit: 'فی وزٹ / پوائنٹ',
    descriptionUrdu: 'مکمل گھر کی Concealed وائرنگ، شارٹ سرکٹ فالٹ ٹریسنگ اور DB باکس سیٹنگ',
    commonTasks: ['شارٹ سرکٹ کی فوری ٹھیک', 'ڈسٹری بیوشن باکس (DB)', 'سیلنگ لائیٹس فکسنگ', 'یو پی ایس و سولر کنکشن'],
  ),
  const HMSService(
    id: 'plumber',
    titleUrdu: 'پلمبر',
    titleEng: 'Plumber',
    titleArabic: 'سباك صحي',
    icon: Icons.plumbing_rounded,
    accentColor: Color(0xFF448AFF),
    category: 'Plumbing',
    categoryUrdu: 'سینیٹری اور پائپ لائن',
    typicalRate: 'Rs. 800 - 1,600',
    rateUnit: 'فی وزٹ فیس',
    descriptionUrdu: 'پائپ لیکیج مرمت، موٹر و گیزر فٹنگ، باتھ روم سینیٹری اور سیوریج حل',
    commonTasks: ['پائپ لیکج و سیپج کا حل', 'واٹر پمپ و موٹر فٹنگ', 'الیکٹرک / گیس گیزر مرمت', 'باتھ روم فکسچر تبدیلی'],
  ),
  const HMSService(
    id: 'tile_fixer',
    titleUrdu: 'ٹائل فکسر',
    titleEng: 'Tile & Marble',
    titleArabic: 'مبلط سيراميك ورخام',
    icon: Icons.grid_view_rounded,
    accentColor: Color(0xFF00BFA5),
    category: 'Flooring',
    categoryUrdu: 'فرش، ٹائل و ماربل',
    typicalRate: 'Rs. 45 - 90',
    rateUnit: 'فی مربع فٹ (Per Sq.ft)',
    descriptionUrdu: 'کچن و واش روم ٹائلز فکسنگ، ماربل فرش تراش اور پالش، گرینائٹ کٹنگ',
    commonTasks: ['واش روم دیوار و فرش ٹائلز', 'ماربل ڈائمنڈ پالش', 'کچن گرینائٹ سلیب فٹنگ', 'سیڑھیوں پر ماربل فکسنگ'],
  ),
  const HMSService(
    id: 'welder',
    titleUrdu: 'ویلڈر',
    titleEng: 'Welder / Metal',
    titleArabic: 'حداد ولحام',
    icon: Icons.hardware_rounded,
    accentColor: Color(0xFFFF3D00),
    category: 'Metalwork',
    categoryUrdu: 'لوہا، گیٹ و ویلڈنگ',
    typicalRate: 'Rs. 1,800 - 2,500',
    rateUnit: 'دیہاڑی یا فی پراجیکٹ',
    descriptionUrdu: 'مین گیٹ، سیفٹی گرل، چھت شیڈ، سیڑھیوں کے ریلنگ اور لوہے کا ہر کام',
    commonTasks: ['مین گیٹ ویلڈنگ و مرمت', 'کھڑکیوں کی سیفٹی گرل', 'چھت کا شیڈ و ٹرس ورک', 'لوہے کے جنگلے'],
  ),
  const HMSService(
    id: 'carpenter',
    titleUrdu: 'کارپینٹر',
    titleEng: 'Carpenter',
    titleArabic: 'نجار خشب',
    icon: Icons.carpenter_rounded,
    accentColor: Color(0xFFA1887F),
    category: 'Woodwork',
    categoryUrdu: 'لکڑی کا کام و الماری',
    typicalRate: 'Rs. 2,000 - 2,800',
    rateUnit: 'روزانہ دیہاڑی',
    descriptionUrdu: 'دروازے، کچن کیبنٹس، الماریاں، صوفہ لکڑی ریپیئر اور تالے فکسنگ',
    commonTasks: ['کچن کیبنٹ ڈیزائن و فٹنگ', 'دروازے ایڈجسٹمنٹ', 'الماریوں کے دراز و لاک ٹھیک', 'ڈور لاک تبدیلی'],
  ),
  const HMSService(
    id: 'false_ceiling',
    titleUrdu: 'فالس سیلنگ',
    titleEng: 'False Ceiling',
    titleArabic: 'أسقف معلقة وجبس',
    icon: Icons.layers_rounded,
    accentColor: Color(0xFFE040FB),
    category: 'Ceiling',
    categoryUrdu: 'جپسم و پی وی سی سیلنگ',
    typicalRate: 'Rs. 120 - 210',
    rateUnit: 'فی مربع فٹ (Per Sq.ft)',
    descriptionUrdu: 'جپسم بورڈ، پی وی سی سیلنگ، ایل ای ڈی لائٹ کٹس اور جدید روف ڈیزائن',
    commonTasks: ['ڈرائنگ روم جپسم فال سیلنگ', 'باتھ روم پی وی سی سیلنگ', 'سیلنگ ڈائون لائٹ کٹس', 'کارنیس پٹی ڈیزائن'],
  ),
  const HMSService(
    id: 'painter',
    titleUrdu: 'پینٹر و پالش',
    titleEng: 'Paint & Polish',
    titleArabic: 'دهان وتشطيب',
    icon: Icons.format_paint_rounded,
    accentColor: Color(0xFF00E676),
    category: 'Finishing',
    categoryUrdu: 'رنگ روغن و ووڈ پالش',
    typicalRate: 'Rs. 18 - 35',
    rateUnit: 'فی مربع فٹ (Double Coat)',
    descriptionUrdu: 'وال پٹی، پلاسٹک ایمولشن، ویدر شیٹ، ٹیکسچر پینٹ اور فرنیچر پالش',
    commonTasks: ['اندرونی دیواروں پر پینٹ و پٹی', 'بیرونی دیواروں پر ویدر شیٹ', 'لکڑی کے دروازوں کی لکور پالش', 'سیپج ٹریٹمنٹ'],
  ),
  const HMSService(
    id: 'interior_designer',
    titleUrdu: 'انٹیریئر ڈیزائنر',
    titleEng: 'Interior Decor',
    titleArabic: 'مصمم ديكور داخلي',
    icon: Icons.palette_rounded,
    accentColor: Color(0xFF40C4FF),
    category: 'Decor',
    categoryUrdu: 'اندرونی ڈیکوریشن',
    typicalRate: 'Rs. 30,000 - 90,000',
    rateUnit: 'مکمل روم پیکج',
    descriptionUrdu: 'وال پیپر، میڈیا وال، ایکوسٹک پینل، جدید پردے اور لائیٹنگ پلاننگ',
    commonTasks: ['ایل ای ڈی میڈیا وال ڈیزائن', 'امپورٹڈ وال پیپر فکسنگ', 'ایکوسٹک وال پینلز', 'موڈ لائٹنگ و پردے'],
  ),
  const HMSService(
    id: 'ac_machinery',
    titleUrdu: 'AC و مشینری',
    titleEng: 'AC & Machinery',
    titleArabic: 'تكييف وصيانة أجهزة',
    icon: Icons.ac_unit_rounded,
    accentColor: Color(0xFF7C4DFF),
    category: 'HVAC',
    categoryUrdu: 'اے سی و گھریلو مشینری',
    typicalRate: 'Rs. 1,500 - 3,500',
    rateUnit: 'فی سروس / گیس ری فل',
    descriptionUrdu: 'انورٹر اے سی سروس، گیس چارجنگ، فریج و واشنگ مشین ریپیئر اور انسٹالیشن',
    commonTasks: ['پریشر واشر سے اے سی سروس', 'انورٹر گیس ٹاپ اپ', 'اے سی نئی انسٹالیشن', 'پی سی بی سرکٹ بورڈ ریپیئر'],
  ),
];

// Seeded verified pros
final List<WorkerProfile> kInitialWorkers = [
  WorkerProfile(
    id: 'w1',
    name: 'حاجی محمد شفیق',
    serviceId: 'contractor',
    phone: '0300-8451928',
    whatsapp: '923008451928',
    experienceYears: 18,
    rateText: 'Rs. 2,400 / Sq.ft',
    city: 'Lahore (لاہور)',
    area: 'DHA, Gulberg & Bahria Town',
    rating: 4.9,
    jobsCompleted: 64,
    cnicVerified: true,
    bio: '18 سال سے A+ کوالٹی کے رہائشی بنگلے اور کمرشل پراجیکٹس مکمل کر رہا ہوں۔ سٹرکچرل گارنٹی۔',
    badgeLevel: 'Master Craftsman',
  ),
  WorkerProfile(
    id: 'w2',
    name: 'انجینئر بلال ارشد (UET)',
    serviceId: 'civil_engineer',
    phone: '0321-4927381',
    whatsapp: '923214927381',
    experienceYears: 12,
    rateText: 'Rs. 6,000 / وزٹ معائنہ',
    city: 'Islamabad / Rawalpindi',
    area: 'F-7, Bahria Town & DHA',
    rating: 5.0,
    jobsCompleted: 118,
    cnicVerified: true,
    bio: 'PEC رجسٹرڈ سٹرکچرل انجینئر۔ فاؤنڈیشن لوڈ اور کریکس انسپکشن کا مکمل حل۔',
    badgeLevel: 'Top Rated',
  ),
  WorkerProfile(
    id: 'w3',
    name: 'استاد فیاض الیکٹریشن',
    serviceId: 'electrician',
    phone: '0312-5509123',
    whatsapp: '923125509123',
    experienceYears: 10,
    rateText: 'Rs. 800 وزٹ / Rs. 150 پوائنٹ',
    city: 'Lahore (لاہور)',
    area: 'Model Town, Johar Town & Cantt',
    rating: 4.9,
    jobsCompleted: 210,
    cnicVerified: true,
    bio: 'فوری 30 منٹ ایمرجنسی فالٹ ٹریسنگ، سولر انورٹر اور ڈی بی باکس سیٹنگ۔',
    badgeLevel: 'Top Rated',
  ),
  WorkerProfile(
    id: 'w4',
    name: 'محمد عثمان پلمبر',
    serviceId: 'plumber',
    phone: '0333-6829104',
    whatsapp: '923336829104',
    experienceYears: 11,
    rateText: 'Rs. 900 وزٹ فیس',
    city: 'Rawalpindi (راولپنڈی)',
    area: 'Saddar, Westridge & Chaklala',
    rating: 4.9,
    jobsCompleted: 156,
    cnicVerified: true,
    bio: 'پائپ لیکیج کا مستقل حل، موٹر پمپ انسٹالیشن، گیزر و ہیٹر فٹنگ۔',
    badgeLevel: 'Verified Pro',
  ),
  WorkerProfile(
    id: 'w5',
    name: 'کاشف علی ٹائل ماسٹر',
    serviceId: 'tile_fixer',
    phone: '0304-9912837',
    whatsapp: '923049912837',
    experienceYears: 9,
    rateText: 'Rs. 55 / Sq.ft',
    city: 'Karachi (کراچی)',
    area: 'Gulshan, Johar & Clifton',
    rating: 4.8,
    jobsCompleted: 88,
    cnicVerified: true,
    bio: 'پورسلین ٹائل، گرینائٹ اور اطالوی ماربل کی زیرو جائنٹ فکسنگ۔ لیزر لیولنگ۔',
    badgeLevel: 'Top Rated',
  ),
];

// ----------------------------------------------------------------------------
// MAIN DASHBOARD SCREEN
// ----------------------------------------------------------------------------
class HMSDashboardScreen extends StatefulWidget {
  const HMSDashboardScreen({super.key});

  @override
  State<HMSDashboardScreen> createState() => _HMSDashboardScreenState();
}

class _HMSDashboardScreenState extends State<HMSDashboardScreen> {
  String _selectedLanguage = 'Urdu / اردو';
  String _searchQuery = '';
  String _selectedCategory = 'all';
  final List<WorkerProfile> _workers = List.from(kInitialWorkers);
  final List<BookingOrder> _orders = [];

  List<HMSService> get _filteredServices {
    return kHmsServices.where((svc) {
      final matchesSearch = svc.titleUrdu.contains(_searchQuery) ||
          svc.titleEng.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          svc.category.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesCat = _selectedCategory == 'all' ||
          svc.category.toLowerCase() == _selectedCategory.toLowerCase();
      return matchesSearch && matchesCat;
    }).toList();
  }

  void _addNewWorker(WorkerProfile worker) {
    setState(() {
      _workers.insert(0, worker);
    });
  }

  void _addBookingOrder(BookingOrder order) {
    setState(() {
      _orders.insert(0, order);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          decoration: const BoxDecoration(
            gradient: RadialGradient(
              center: Alignment(0, -0.3),
              radius: 1.6,
              colors: [
                Color(0xFF141F33),
                Color(0xFF090E18),
                Color(0xFF030509),
              ],
            ),
          ),
          child: Column(
            children: [
              // Top Header with 3D Glowing HMS Logo & Play Store Badge
              _buildHeaderSection(),

              const SizedBox(height: 8),

              // Title and Language Dropdown Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Text(
                          "شعبہ منتخب کریں / Select Work",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFF00E5FF).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFF00E5FF).withOpacity(0.4)),
                          ),
                          child: const Text(
                            "13 Services",
                            style: TextStyle(color: Color(0xFF00E5FF), fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        )
                      ],
                    ),
                    DropdownButton<String>(
                      value: _selectedLanguage,
                      dropdownColor: const Color(0xFF162133),
                      style: const TextStyle(color: Color(0xFF00E5FF), fontSize: 12, fontWeight: FontWeight.bold),
                      underline: const SizedBox.shrink(),
                      icon: const Icon(Icons.arrow_drop_down, color: Color(0xFF00E5FF), size: 18),
                      items: ["Urdu / اردو", "English", "Arabic / عربي"]
                          .map((lang) => DropdownMenuItem(value: lang, child: Text(lang)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedLanguage = val);
                      },
                    )
                  ],
                ),
              ),

              // Search Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
                child: TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: const TextStyle(fontSize: 12, color: Colors.white),
                  decoration: InputDecoration(
                    hintText: "سروس یا کاریگر تلاش کریں (مثلاً: پلمبر، ٹائل، وائرنگ)...",
                    hintStyle: const TextStyle(color: Colors.white38, fontSize: 11),
                    prefixIcon: const Icon(Icons.search, color: Color(0xFF00E5FF), size: 18),
                    filled: true,
                    fillColor: const Color(0xFF111826),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: Colors.white.withOpacity(0.15)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: Colors.white.withOpacity(0.15)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFF00E5FF)),
                    ),
                  ),
                ),
              ),

              // Filter Category Chips
              SizedBox(
                height: 38,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  children: [
                    _buildCategoryChip('all', 'تمام سروسز (All)'),
                    _buildCategoryChip('civil work', 'سول اور چنائی'),
                    _buildCategoryChip('electrical', 'الیکٹریکل'),
                    _buildCategoryChip('plumbing', 'پلمبنگ'),
                    _buildCategoryChip('flooring', 'ٹائل و ماربل'),
                    _buildCategoryChip('finishing', 'پینٹ و پالش'),
                    _buildCategoryChip('management', 'ٹھیکیدار و مینجمنٹ'),
                    _buildCategoryChip('engineering', 'انجینئرنگ'),
                    _buildCategoryChip('design', 'آرکیٹیکٹ ڈیزائن'),
                    _buildCategoryChip('woodwork', 'کارپینٹر'),
                    _buildCategoryChip('metalwork', 'ویلڈر'),
                    _buildCategoryChip('ceiling', 'فالس سیلنگ'),
                    _buildCategoryChip('hvac', 'اے سی و مشینری'),
                  ],
                ),
              ),

              const SizedBox(height: 6),

              // 3D Crystal Water Grid of Services
              Expanded(
                child: _filteredServices.isEmpty
                    ? const Center(
                        child: Text(
                          "کوئی سروس نہیں ملی۔ براہ کرم دوبارہ تلاش کریں۔",
                          style: TextStyle(color: Colors.white54, fontSize: 13),
                        ),
                      )
                    : GridView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        itemCount: _filteredServices.length,
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 14,
                          mainAxisSpacing: 14,
                          childAspectRatio: 1.05,
                        ),
                        itemBuilder: (context, index) {
                          final service = _filteredServices[index];
                          return CrystalWater3DButton(
                            service: service,
                            selectedLanguage: _selectedLanguage,
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => ServiceDetailAndPageCreatorScreen(
                                    service: service,
                                    workers: _workers,
                                    onAddWorker: _addNewWorker,
                                    onAddBooking: _addBookingOrder,
                                  ),
                                ),
                              );
                            },
                          );
                        },
                      ),
              ),

              // Bottom Quick Utility Bar
              _buildBottomActionBar(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryChip(String catId, String label) {
    final isSelected = _selectedCategory == catId;
    return Padding(
      padding: const EdgeInsets.only(right: 6.0),
      child: ChoiceChip(
        label: Text(
          label,
          style: TextStyle(
            color: isSelected ? const Color(0xFF00E5FF) : Colors.white70,
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        selected: isSelected,
        selectedColor: const Color(0xFF00E5FF).withOpacity(0.18),
        backgroundColor: Colors.white.withOpacity(0.04),
        side: BorderSide(
          color: isSelected ? const Color(0xFF00E5FF) : Colors.white.withOpacity(0.12),
        ),
        onSelected: (_) => setState(() => _selectedCategory = catId),
      ),
    );
  }

  Widget _buildHeaderSection() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(22)),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          // 3D Glowing HMS Logo
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [Color(0xFF00E5FF), Color(0xFF0055FF)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF00E5FF).withOpacity(0.55),
                  blurRadius: 16,
                  spreadRadius: 2,
                )
              ],
              border: Border.all(color: Colors.white.withOpacity(0.6), width: 1.5),
            ),
            child: const Center(
              child: Text(
                "HMS",
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  letterSpacing: 1.5,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text(
                      "HMS - Home Maintenance",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                      decoration: BoxDecoration(
                        color: Colors.greenAccent.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        "Verified",
                        style: TextStyle(color: Colors.greenAccent, fontSize: 9, fontWeight: FontWeight.bold),
                      ),
                    )
                  ],
                ),
                const SizedBox(height: 3),
                const Text(
                  "تمام سول اور ہوم سروسز ایک جگہ (Online Pro Dispatch)",
                  style: TextStyle(color: Colors.white60, fontSize: 11),
                ),
              ],
            ),
          ),
          // Google Play Store Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.7),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white24),
            ),
            child: Row(
              children: const [
                Icon(Icons.play_arrow_rounded, color: Colors.greenAccent, size: 16),
                SizedBox(width: 3),
                Text(
                  "4.9 ★",
                  style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildBottomActionBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF090E18),
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.08))),
      ),
      child: Row(
        children: [
          // Emergency SOS Button
          Expanded(
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE53935).withOpacity(0.2),
                foregroundColor: const Color(0xFFFF5252),
                side: const BorderSide(color: Color(0xFFFF5252), width: 1.2),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 10),
              ),
              onPressed: () => _showEmergencyDialog(context),
              icon: const Icon(Icons.warning_amber_rounded, size: 16),
              label: const Text("ایمرجنسی سروس (SOS)", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(width: 10),
          // Cost Estimator Button
          Expanded(
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00E5FF).withOpacity(0.15),
                foregroundColor: const Color(0xFF00E5FF),
                side: const BorderSide(color: Color(0xFF00E5FF), width: 1.2),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 10),
              ),
              onPressed: () => _showCostEstimatorDialog(context),
              icon: const Icon(Icons.calculate_rounded, size: 16),
              label: const Text("لاگت کیلکولیٹر", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  void _showEmergencyDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: const [
                  Icon(Icons.shield_rounded, color: Colors.redAccent, size: 24),
                  SizedBox(width: 8),
                  Text("HMS فوری ہنگامی مرمت (SOS)", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                "شارٹ سرکٹ، پائپ لیکیج یا گیس ایمرجنسی میں قریبی مصدقہ کاریگر 25 تا 35 منٹ میں آپ کے گھر پہنچے گا۔",
                style: TextStyle(fontSize: 12, color: Colors.white70),
              ),
              const SizedBox(height: 16),
              ListTile(
                tileColor: Colors.white.withOpacity(0.04),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                leading: const Icon(Icons.phone_in_talk, color: Colors.greenAccent),
                title: const Text("ایمرجنسی کنٹرول روم ہیلپ لائن", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                subtitle: const Text("0300-000-HMS1 (24/7 Live)", style: TextStyle(fontSize: 12, color: Colors.cyanAccent)),
                onTap: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("ہیلپ لائن پر ڈائل کیا جا رہا ہے..."), backgroundColor: Colors.green),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showCostEstimatorDialog(BuildContext context) {
    double sqft = 1125; // 5 Marla
    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final totalGreyCost = sqft * 2650;
            return AlertDialog(
              backgroundColor: const Color(0xFF0E1626),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text("تعمیراتی لاگت کیلکولیٹر (Estimator)", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF00E5FF))),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("رقبہ: ${sqft.toInt()} مربع فٹ (Sq.ft)", style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                  Slider(
                    value: sqft,
                    min: 250,
                    max: 4500,
                    divisions: 17,
                    activeColor: const Color(0xFF00E5FF),
                    onChanged: (val) => setModalState(() => sqft = val),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _presetChip("5 مرلہ", 1125, () => setModalState(() => sqft = 1125)),
                      _presetChip("10 مرلہ", 2250, () => setModalState(() => sqft = 2250)),
                      _presetChip("1 کنال", 4500, () => setModalState(() => sqft = 4500)),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF00E5FF).withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("تخمینی گرے سٹرکچر لاگت:", style: TextStyle(color: Colors.white70, fontSize: 11)),
                        const SizedBox(height: 4),
                        Text(
                          "Rs. ${totalGreyCost.toStringAsFixed(0)}",
                          style: const TextStyle(color: Color(0xFF00E5FF), fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  )
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text("بند کریں (Close)", style: TextStyle(color: Colors.white70)),
                )
              ],
            );
          },
        );
      },
    );
  }

  Widget _presetChip(String label, double val, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.06),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(label, style: const TextStyle(fontSize: 10, color: Colors.cyanAccent)),
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// 3D CRYSTAL WATER BUTTON (Blinking Side LED + Press Shine)
// ----------------------------------------------------------------------------
class CrystalWater3DButton extends StatefulWidget {
  final HMSService service;
  final String selectedLanguage;
  final VoidCallback onTap;

  const CrystalWater3DButton({
    super.key,
    required this.service,
    required this.selectedLanguage,
    required this.onTap,
  });

  @override
  State<CrystalWater3DButton> createState() => _CrystalWater3DButtonState();
}

class _CrystalWater3DButtonState extends State<CrystalWater3DButton>
    with TickerProviderStateMixin {
  late AnimationController _blinkController;
  late Animation<double> _blinkAnimation;

  late AnimationController _pressController;
  late Animation<double> _shineAnimation;

  bool _isPressed = false;

  @override
  void initState() {
    super.initState();

    // LED Blinking Animation
    _blinkController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 750),
    )..repeat(reverse: true);

    _blinkAnimation = Tween<double>(begin: 0.15, end: 1.0).animate(_blinkController);

    // Wave Sheen on Tap Animation
    _pressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _shineAnimation = Tween<double>(begin: -1.2, end: 2.2).animate(
      CurvedAnimation(parent: _pressController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _blinkController.dispose();
    _pressController.dispose();
    super.dispose();
  }

  void _handleTap() {
    HapticFeedback.lightImpact();
    _pressController.forward(from: 0.0).then((_) => widget.onTap());
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.selectedLanguage == "English"
        ? widget.service.titleEng
        : widget.selectedLanguage == "Arabic / عربي"
            ? widget.service.titleArabic
            : widget.service.titleUrdu;

    final subtitle = widget.selectedLanguage == "English"
        ? widget.service.titleUrdu
        : widget.service.titleEng;

    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) {
        setState(() => _isPressed = false);
        _handleTap();
      },
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedScale(
        scale: _isPressed ? 0.92 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: Stack(
          children: [
            // 3D Crystal Beveled Container
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    widget.service.accentColor.withOpacity(0.35),
                    Colors.white.withOpacity(0.08),
                    widget.service.accentColor.withOpacity(0.12),
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: widget.service.accentColor.withOpacity(_isPressed ? 0.15 : 0.32),
                    blurRadius: _isPressed ? 6 : 16,
                    offset: _isPressed ? const Offset(0, 2) : const Offset(0, 6),
                  ),
                ],
                border: Border.all(
                  color: Colors.white.withOpacity(0.35),
                  width: 1.3,
                ),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(22),
                child: Stack(
                  children: [
                    // Water Fluid Fluidity Backdrop
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              widget.service.accentColor.withOpacity(0.22),
                            ],
                          ),
                        ),
                      ),
                    ),

                    // Icon & Typography
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: widget.service.accentColor.withOpacity(0.15),
                                border: Border.all(color: widget.service.accentColor.withOpacity(0.3)),
                              ),
                              child: Icon(
                                widget.service.icon,
                                size: 28,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              title,
                              textAlign: TextAlign.center,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              subtitle,
                              textAlign: TextAlign.center,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white60,
                                fontSize: 10,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.4),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.white12),
                              ),
                              child: Text(
                                widget.service.typicalRate.split('-')[0].trim(),
                                style: const TextStyle(color: Colors.white70, fontSize: 8),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),

                    // Press Shine Wave
                    AnimatedBuilder(
                      animation: _pressController,
                      builder: (context, child) {
                        return FractionalTranslation(
                          translation: Offset(_shineAnimation.value, 0),
                          child: Container(
                            width: 50,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.transparent,
                                  Colors.white.withOpacity(0.55),
                                  Colors.transparent,
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            // Pulsing LED Micro Indicator Light (Top Right)
            Positioned(
              top: 10,
              right: 10,
              child: AnimatedBuilder(
                animation: _blinkAnimation,
                builder: (context, child) {
                  return Container(
                    width: 9,
                    height: 9,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: widget.service.accentColor.withOpacity(_blinkAnimation.value),
                      boxShadow: [
                        BoxShadow(
                          color: widget.service.accentColor.withOpacity(_blinkAnimation.value),
                          blurRadius: 7,
                          spreadRadius: 2.5,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// DUAL MODE SCREEN: BOOK WORKER & CREATE WORKER PAGE
// ----------------------------------------------------------------------------
class ServiceDetailAndPageCreatorScreen extends StatefulWidget {
  final HMSService service;
  final List<WorkerProfile> workers;
  final ValueChanged<WorkerProfile> onAddWorker;
  final ValueChanged<BookingOrder> onAddBooking;

  const ServiceDetailAndPageCreatorScreen({
    super.key,
    required this.service,
    required this.workers,
    required this.onAddWorker,
    required this.onAddBooking,
  });

  @override
  State<ServiceDetailAndPageCreatorScreen> createState() =>
      _ServiceDetailAndPageCreatorScreenState();
}

class _ServiceDetailAndPageCreatorScreenState
    extends State<ServiceDetailAndPageCreatorScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Contractor Form Controllers
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _expController = TextEditingController(text: "6");
  final _rateController = TextEditingController();
  final _cityController = TextEditingController(text: "Lahore (لاہور)");
  final _areaController = TextEditingController();
  final _bioController = TextEditingController();
  int _uploadedPhotosCount = 2;
  bool _hasVideoUploaded = false;

  // HMS Worker Wallet & Commission State
  double _workerWalletBalance = 2450.0;
  final double _commissionRate = 5.0; // 5% App Commission

  // HMS Worker Wallet & Commission Status Card
  Widget buildWorkerWalletCard(double walletBalance, double commissionRate) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.cyanAccent.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("والیٹ بیلنس (Wallet Balance)",
                  style: TextStyle(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 4),
              Text("Rs. ${walletBalance.toStringAsFixed(0)}",
                  style: const TextStyle(
                      color: Colors.cyanAccent,
                      fontSize: 22,
                      fontWeight: FontWeight.bold)),
              Text("ایپ کمیشن: $commissionRate%",
                  style: const TextStyle(color: Colors.white54, fontSize: 11)),
            ],
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.greenAccent,
              foregroundColor: Colors.black,
            ),
            onPressed: () {
              // EasyPaisa / JazzCash Re-charge Gateway Open
              _openWorkerWalletRechargeSheet();
            },
            icon: const Icon(Icons.add_card),
            label: const Text("ریچارج کریں",
                style: TextStyle(fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }

  void _openWorkerWalletRechargeSheet() {
    String selectedMethod = 'EasyPaisa';
    double selectedAmount = 1000.0;
    final tidController = TextEditingController();
    final phoneController = TextEditingController(text: '0345-1234567');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0B101C),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.cyanAccent.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.account_balance_wallet, color: Colors.cyanAccent, size: 20),
                          ),
                          const SizedBox(width: 10),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "کاریگر والیٹ ریچارج گیٹ وے",
                                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                              ),
                              Text(
                                "EasyPaisa / JazzCash / Raast Gateway",
                                style: TextStyle(fontSize: 10, color: Colors.white54),
                              ),
                            ],
                          )
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white70, size: 20),
                        onPressed: () => Navigator.pop(ctx),
                      )
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Current Balance Bar
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.cyanAccent.withOpacity(0.3)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("موجودہ بیلنس:", style: TextStyle(color: Colors.white70, fontSize: 12)),
                        Text(
                          "Rs. ${_workerWalletBalance.toStringAsFixed(0)}",
                          style: const TextStyle(color: Colors.cyanAccent, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Method Selection
                  const Text("ادائیگی کا طریقہ منتخب کریں:", style: TextStyle(color: Colors.white70, fontSize: 11)),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(
                              color: selectedMethod == 'EasyPaisa' ? Colors.greenAccent : Colors.white24,
                            ),
                            backgroundColor: selectedMethod == 'EasyPaisa' ? Colors.greenAccent.withOpacity(0.12) : null,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () => setSheetState(() => selectedMethod = 'EasyPaisa'),
                          child: const Text("ایزی پیسہ", style: TextStyle(color: Colors.white, fontSize: 11)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(
                              color: selectedMethod == 'JazzCash' ? Colors.redAccent : Colors.white24,
                            ),
                            backgroundColor: selectedMethod == 'JazzCash' ? Colors.redAccent.withOpacity(0.12) : null,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () => setSheetState(() => selectedMethod = 'JazzCash'),
                          child: const Text("جاز کیش", style: TextStyle(color: Colors.white, fontSize: 11)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(
                              color: selectedMethod == 'Raast' ? Colors.amberAccent : Colors.white24,
                            ),
                            backgroundColor: selectedMethod == 'Raast' ? Colors.amberAccent.withOpacity(0.12) : null,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () => setSheetState(() => selectedMethod = 'Raast'),
                          child: const Text("راست ID", style: TextStyle(color: Colors.white, fontSize: 11)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Quick Amount Chips
                  const Text("رقم منتخب کریں (PKR):", style: TextStyle(color: Colors.white70, fontSize: 11)),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [500.0, 1000.0, 2000.0, 5000.0].map((amt) {
                      final isSel = selectedAmount == amt;
                      return ChoiceChip(
                        label: Text("Rs. ${amt.toInt()}"),
                        selected: isSel,
                        selectedColor: Colors.greenAccent,
                        backgroundColor: Colors.white.withOpacity(0.08),
                        labelStyle: TextStyle(
                          color: isSel ? Colors.black : Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 10,
                        ),
                        onSelected: (val) {
                          if (val) setSheetState(() => selectedAmount = amt);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 10),

                  TextField(
                    controller: phoneController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: "آپ کا موبائل اکاؤنٹ نمبر",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      isDense: true,
                    ),
                  ),
                  const SizedBox(height: 10),

                  TextField(
                    controller: tidController,
                    decoration: InputDecoration(
                      labelText: "ٹرانزیکشن شناختی کوڈ (TID / SMS Code)",
                      hintText: "مثلاً: 4982194820",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      isDense: true,
                    ),
                  ),
                  const SizedBox(height: 16),

                  SizedBox(
                    width: double.infinity,
                    height: 46,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.greenAccent,
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        final added = selectedAmount;
                        setState(() {
                          _workerWalletBalance += added;
                        });
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("Rs. ${added.toInt()} کامیابی سے والیٹ میں جمع ہو گئے ہیں!"),
                            backgroundColor: Colors.green,
                          ),
                        );
                      },
                      icon: const Icon(Icons.check_circle_outline_rounded),
                      label: Text(
                        "Rs. ${selectedAmount.toInt()} فوری ریچارج کریں",
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _expController.dispose();
    _rateController.dispose();
    _cityController.dispose();
    _areaController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  List<WorkerProfile> get _matchingWorkers {
    return widget.workers
        .where((w) => w.serviceId == widget.service.id || w.serviceId == 'all')
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "${widget.service.titleUrdu} (${widget.service.titleEng})",
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        backgroundColor: widget.service.accentColor.withOpacity(0.18),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: widget.service.accentColor,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          tabs: const [
            Tab(icon: Icon(Icons.person_search_rounded), text: "کاریگر طلب کریں / Book"),
            Tab(icon: Icon(Icons.create_new_folder_rounded), text: "اپنا پیج بنائیں / Create Page"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Tab 1: Customer View (Hire Pro Worker)
          _buildCustomerBookingTab(),

          // Tab 2: Worker View (Page Creator & Media Upload)
          _buildWorkerPageCreatorTab(),
        ],
      ),
    );
  }

  Widget _buildCustomerBookingTab() {
    final list = _matchingWorkers;
    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        // Service Hero Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.04),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: widget.service.accentColor.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.service.accentColor.withOpacity(0.2),
                ),
                child: Icon(widget.service.icon, size: 32, color: widget.service.accentColor),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "فوری ${widget.service.titleUrdu} طلب کریں",
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      widget.service.descriptionUrdu,
                      style: const TextStyle(fontSize: 11, color: Colors.white60),
                    )
                  ],
                ),
              )
            ],
          ),
        ),

        const SizedBox(height: 18),

        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              "دستیاب تصدیق شدہ ماہرین (Verified Pros):",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white70),
            ),
            Text(
              "${list.length} Online",
              style: TextStyle(fontSize: 11, color: widget.service.accentColor, fontWeight: FontWeight.bold),
            )
          ],
        ),

        const SizedBox(height: 10),

        if (list.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 40.0),
            child: Center(
              child: Text("اس شعبے میں جلد کاریگر شامل ہو رہے ہیں۔", style: TextStyle(color: Colors.white54)),
            ),
          )
        else
          ...list.map((worker) => _buildWorkerCard(worker)),
      ],
    );
  }

  Widget _buildWorkerCard(WorkerProfile worker) {
    return Card(
      color: const Color(0xFF111726),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.white.withOpacity(0.08)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: widget.service.accentColor.withOpacity(0.25),
                  child: Text(
                    worker.name.isNotEmpty ? worker.name[0] : 'W',
                    style: TextStyle(color: widget.service.accentColor, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(worker.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                          const SizedBox(width: 6),
                          if (worker.cnicVerified)
                            const Icon(Icons.verified, size: 14, color: Colors.greenAccent),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "${worker.experienceYears} سال تجربہ · ${worker.city}",
                        style: const TextStyle(fontSize: 11, color: Colors.white54),
                      ),
                      Text(
                        worker.rateText,
                        style: TextStyle(fontSize: 11, color: widget.service.accentColor, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 13),
                      const SizedBox(width: 3),
                      Text(
                        worker.rating.toString(),
                        style: const TextStyle(color: Colors.amber, fontSize: 11, fontWeight: FontWeight.bold),
                      )
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 10),
            Text(
              worker.bio,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 11, color: Colors.white70),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.greenAccent,
                      side: const BorderSide(color: Colors.greenAccent),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text("${worker.name} کا واٹس ایپ کھل رہا ہے..."), backgroundColor: Colors.green),
                      );
                    },
                    icon: const Icon(Icons.chat_bubble_outline_rounded, size: 14),
                    label: const Text("واٹس ایپ", style: TextStyle(fontSize: 11)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: widget.service.accentColor,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                    onPressed: () => _openBookingSheet(worker),
                    child: const Text("طلب کریں (Book)", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  void _openBookingSheet(WorkerProfile worker) {
    final customerNameCtrl = TextEditingController();
    final customerPhoneCtrl = TextEditingController();
    final customerAddressCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "آرڈر فارم: ${worker.name}",
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const SizedBox(height: 4),
              Text(
                "سروس: ${widget.service.titleUrdu} (${widget.service.titleEng})",
                style: TextStyle(fontSize: 12, color: widget.service.accentColor),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: customerNameCtrl,
                decoration: InputDecoration(
                  labelText: "آپ کا نام (Customer Name)",
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: customerPhoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  labelText: "فون نمبر (Phone / WhatsApp)",
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: customerAddressCtrl,
                decoration: InputDecoration(
                  labelText: "گھر کا پتہ (Address / Location)",
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  isDense: true,
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: widget.service.accentColor,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  onPressed: () {
                    if (customerNameCtrl.text.isEmpty || customerPhoneCtrl.text.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("براہ کرم نام اور فون درج کریں"), backgroundColor: Colors.red),
                      );
                      return;
                    }
                    final order = BookingOrder(
                      serviceTitle: widget.service.titleUrdu,
                      workerName: worker.name,
                      customerName: customerNameCtrl.text,
                      phone: customerPhoneCtrl.text,
                      city: worker.city,
                      address: customerAddressCtrl.text,
                      urgency: 'فوری (30 منٹ)',
                      notes: 'درخواست موصول ہو گئی',
                    );
                    widget.onAddBooking(order);
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text("طلب بھیج دی گئی ہے! ${worker.name} جلد آپ سے رابطہ کرے گا۔"),
                        backgroundColor: Colors.green,
                      ),
                    );
                  },
                  child: const Text("آرڈر کنفرم کریں (Confirm Booking)", style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              )
            ],
          ),
        );
      },
    );
  }

  Widget _buildWorkerPageCreatorTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // HMS Worker Wallet & Commission Status Card
          buildWorkerWalletCard(_workerWalletBalance, _commissionRate),
          const SizedBox(height: 16),

          Row(
            children: [
              Icon(Icons.badge_rounded, color: widget.service.accentColor, size: 22),
              const SizedBox(width: 8),
              const Text(
                "اپنا کام کا پیج اور پورٹ فولیو تیار کریں",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            "HMS پر اپنی کاریگری کا پیج مفت پبلش کریں اور کسٹمرز سے براہ راست کام حاصل کریں۔",
            style: TextStyle(fontSize: 11, color: Colors.white60),
          ),
          const SizedBox(height: 16),

          // Name and Phone Input
          TextField(
            controller: _nameController,
            decoration: InputDecoration(
              labelText: "نام / Full Name",
              prefixIcon: const Icon(Icons.person_outline, size: 20),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              isDense: true,
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              labelText: "واٹس ایپ یا موبائل نمبر",
              prefixIcon: const Icon(Icons.phone_outlined, size: 20),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              isDense: true,
            ),
          ),
          const SizedBox(height: 12),

          // Experience & Rate
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _expController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: "تجربہ (سال)",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    isDense: true,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: _rateController,
                  decoration: InputDecoration(
                    labelText: "ریٹ / دیہاڑی",
                    hintText: "Rs. 2,500 یومیہ",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    isDense: true,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // City and Area
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _cityController,
                  decoration: InputDecoration(
                    labelText: "شہر (City)",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    isDense: true,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: _areaController,
                  decoration: InputDecoration(
                    labelText: "علاقہ / ٹاؤن",
                    hintText: "ماڈل ٹاؤن، گلبرگ",
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    isDense: true,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Bio
          TextField(
            controller: _bioController,
            maxLines: 2,
            decoration: InputDecoration(
              labelText: "کام کی تفصیل اور مہارت (Bio)",
              hintText: "اپنے تجربے اور کام کے طریقہ کار کی تفصیل لکھیں...",
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              isDense: true,
            ),
          ),

          const SizedBox(height: 18),

          // Media Upload Section (Photos & Videos)
          const Text(
            "اپنے کام کی تصاویر اور ویڈیوز لگائیں (Portfolio Media):",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
          ),
          const SizedBox(height: 10),

          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: BorderSide(color: widget.service.accentColor),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    setState(() => _uploadedPhotosCount++);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("تصویر #$_uploadedPhotosCount پورٹ فولیو میں شامل کر دی گئی!"), backgroundColor: Colors.cyan),
                    );
                  },
                  icon: const Icon(Icons.add_photo_alternate_rounded),
                  label: Text("تصاویر لگائیں ($_uploadedPhotosCount)"),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    side: BorderSide(color: _hasVideoUploaded ? Colors.greenAccent : Colors.white24),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    setState(() => _hasVideoUploaded = !_hasVideoUploaded);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(_hasVideoUploaded ? "ویڈیو پورٹ فولیو منسلک ہو گیا!" : "ویڈیو ہٹا دی گئی"),
                        backgroundColor: _hasVideoUploaded ? Colors.green : Colors.grey,
                      ),
                    );
                  },
                  icon: Icon(Icons.videocam_rounded, color: _hasVideoUploaded ? Colors.greenAccent : Colors.white70),
                  label: Text(_hasVideoUploaded ? "ویڈیو منسلک ✓" : "ویڈیو ریکارڈ / اپ لوڈ"),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Publish Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: widget.service.accentColor,
                foregroundColor: Colors.black,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                if (_nameController.text.isEmpty || _phoneController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("براہ کرم اپنا نام اور فون نمبر درج کریں"), backgroundColor: Colors.red),
                  );
                  return;
                }

                final newWorker = WorkerProfile(
                  id: "worker_${DateTime.now().millisecondsSinceEpoch}",
                  name: _nameController.text,
                  serviceId: widget.service.id,
                  phone: _phoneController.text,
                  whatsapp: _phoneController.text.replaceAll(RegExp(r'[^0-9]'), ''),
                  experienceYears: int.tryParse(_expController.text) ?? 5,
                  rateText: _rateController.text.isNotEmpty ? _rateController.text : "Rs. 2,500 یومیہ",
                  city: _cityController.text,
                  area: _areaController.text.isNotEmpty ? _areaController.text : "تمام علاقے",
                  rating: 5.0,
                  jobsCompleted: 1,
                  cnicVerified: true,
                  bio: _bioController.text.isNotEmpty ? _bioController.text : "${widget.service.titleUrdu} کا تجربہ کار کاریگر۔",
                  badgeLevel: "Verified Pro",
                );

                widget.onAddWorker(newWorker);

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("آپ کا HMS ورکنگ پیج کامیابی سے پبلش ہو گیا ہے!"),
                    backgroundColor: Colors.green,
                  ),
                );

                _tabController.animateTo(0);
              },
              icon: const Icon(Icons.cloud_upload_rounded),
              label: const Text(
                "پیج پبلش کریں / Publish Work Page",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
            ),
          )
        ],
      ),
    );
  }
}
