// Powered by OnSpace.AI — Mock Data for Teek Touky (Dark Edition)

export const mockUser = {
  id: 'user_001',
  name: 'أحمد محمد السيد',
  phone: '+201012345678',
  email: 'ahmed@example.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  familyId: 'FAM_001',
  parentId: null,
  role: 'parent',
  wallet: 850.50,
  referralCode: 'AHMED2024',
  referralCount: 12,
  referralEarnings: 240.00,
  rating: 4.8,
  totalRides: 127,
  joinDate: '2023-01-15',
  isVerified: true,
};

export const mockFamilyMembers = [
  {
    id: 'child_001',
    name: 'مريم أحمد',
    phone: '+201112345678',
    gender: 'أنثى',
    age: 16,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    status: 'in_ride',
    currentLocation: { lat: 30.0444, lng: 31.2357 },
    lastSeen: 'الآن',
    permissions: { canBook: true, canPay: true, timeLimit: '22:00' },
  },
  {
    id: 'child_002',
    name: 'عمر أحمد',
    phone: '+201212345678',
    gender: 'ذكر',
    age: 14,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    status: 'online',
    currentLocation: { lat: 30.0500, lng: 31.2400 },
    lastSeen: 'منذ 5 دقائق',
    permissions: { canBook: true, canPay: false, timeLimit: '20:00' },
  },
  {
    id: 'child_003',
    name: 'نور أحمد',
    phone: '+201312345678',
    gender: 'أنثى',
    age: 12,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    status: 'offline',
    currentLocation: { lat: 30.0380, lng: 31.2300 },
    lastSeen: 'منذ ساعة',
    permissions: { canBook: false, canPay: false, timeLimit: '19:00' },
  },
];

export const mockRideHistory = [
  {
    id: 'ride_001',
    from: 'مدينة نصر، القاهرة',
    to: 'مول مصر، 6 أكتوبر',
    date: 'اليوم، 10:30 ص',
    price: 85.00,
    distance: '18.5 كم',
    duration: '35 دقيقة',
    status: 'completed',
    driver: { name: 'محمد علي', rating: 4.9, car: 'تويوتا كورولا' },
    rating: 5,
  },
  {
    id: 'ride_002',
    from: 'المهندسين، الجيزة',
    to: 'مطار القاهرة الدولي',
    date: 'أمس، 6:00 ص',
    price: 150.00,
    distance: '28.3 كم',
    duration: '45 دقيقة',
    status: 'completed',
    driver: { name: 'أحمد حسن', rating: 4.7, car: 'هيونداي إلنترا' },
    rating: 4,
  },
  {
    id: 'ride_003',
    from: 'التجمع الخامس',
    to: 'وسط البلد',
    date: '2 يناير، 2:15 م',
    price: 120.00,
    distance: '32.1 كم',
    duration: '55 دقيقة',
    status: 'completed',
    driver: { name: 'سامي يوسف', rating: 4.8, car: 'كيا سيراتو' },
    rating: 5,
  },
  {
    id: 'ride_004',
    from: 'الزمالك',
    to: 'العجوزة',
    date: '1 يناير، 8:00 م',
    price: 35.00,
    distance: '4.2 كم',
    duration: '12 دقيقة',
    status: 'cancelled',
    driver: null,
    rating: null,
  },
];

export const mockCarTypes = [
  { id: 'economy', name: 'توكتك توفير', icon: 'directions-car', price: 'من 18 جنيه', eta: '2', capacity: 2, desc: 'خيار اقتصادي', badge: null },
  { id: 'standard', name: 'توكتك عادي', icon: 'local-taxi', price: 'من 22 جنيه', eta: '3', capacity: 2, desc: 'الأفضل للسفرات اليومية', badge: 'الأفضل' },
  { id: 'xl', name: 'توكتك XL', icon: 'airport-shuttle', price: 'من 30 جنيه', eta: '5', capacity: 3, desc: 'أكثر مساحة', badge: null },
];

export const mockPosts = [
  {
    id: 'post_001',
    author: { name: 'سارة محمد', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', verified: true },
    content: 'تجربة رائعة مع تيك توكي اليوم! السائق كان محترم جداً والسيارة نظيفة 🚗✨',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
    likes: 124,
    comments: 18,
    shares: 7,
    time: 'منذ 30 دقيقة',
    liked: false,
    trending: true,
  },
  {
    id: 'post_002',
    author: { name: 'كريم أسامة', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', verified: false },
    content: 'خاصية الأسرة في التطبيق ممتازة! بتقدر تتابع أولادك لحظة بلحظة. أمان كامل 👨‍👩‍👧‍👦',
    image: null,
    likes: 89,
    comments: 23,
    shares: 15,
    time: 'منذ ساعتين',
    liked: true,
    trending: false,
  },
  {
    id: 'post_003',
    author: { name: 'هنا خالد', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', verified: true },
    content: 'ربحت 500 جنيه من نظام الإحالة في أسبوع واحد بس! 🤑 كود الإحالة بتاعي: HANA2024',
    image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400&h=300&fit=crop',
    likes: 312,
    comments: 67,
    shares: 89,
    time: 'منذ 5 ساعات',
    liked: false,
    trending: true,
  },
];

export const mockPostComments = [
  { id: 'c1', postId: 'post_001', author: 'علي حسن', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop', text: 'موافق تماماً! خدمة ممتازة', time: 'منذ 10 دقائق', likes: 5 },
  { id: 'c2', postId: 'post_001', author: 'منى أحمد', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop', text: 'انا كمان جربتها وكانت تجربة رائعة 😍', time: 'منذ 20 دقيقة', likes: 3 },
  { id: 'c3', postId: 'post_003', author: 'خالد مصطفى', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop', text: 'كود الإحالة بتاعي KHALID2024 يلا استخدموه 😂', time: 'منذ ساعة', likes: 12 },
];

export const mockStories = [
  { id: 's1', user: 'أنا', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isOwn: true, viewed: false },
  { id: 's2', user: 'سارة', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', isOwn: false, viewed: false },
  { id: 's3', user: 'كريم', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', isOwn: false, viewed: true },
  { id: 's4', user: 'هنا', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', isOwn: false, viewed: false },
  { id: 's5', user: 'محمود', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', isOwn: false, viewed: true },
];

export const mockWalletTransactions = [
  { id: 't1', type: 'ride', desc: 'رحلة مدينة نصر ← مول مصر', amount: -85.00, date: 'اليوم' },
  { id: 't2', type: 'referral', desc: 'مكافأة إحالة - عصام محمد', amount: +20.00, date: 'أمس' },
  { id: 't3', type: 'topup', desc: 'شحن محفظة', amount: +200.00, date: '2 يناير' },
  { id: 't4', type: 'ride', desc: 'رحلة المهندسين ← المطار', amount: -150.00, date: '1 يناير' },
  { id: 't5', type: 'referral', desc: 'مكافأة إحالة - دينا علي', amount: +20.00, date: '30 ديسمبر' },
  { id: 't6', type: 'withdraw', desc: 'سحب أرباح للمحفظة', amount: -100.00, date: '28 ديسمبر' },
];

export const mockNotifications = [
  { id: 'n1', title: 'رحلتك في الطريق!', body: 'السائق محمد على بعد 3 دقائق منك', time: 'الآن', type: 'ride', read: false },
  { id: 'n2', title: 'مريم وصلت بأمان', body: 'وصلت مريم إلى المنزل الساعة 4:30 م', time: 'منذ ساعة', type: 'family', read: false },
  { id: 'n3', title: 'مكافأة إحالة جديدة!', body: 'ربحت 20 جنيه من إحالة عصام محمد', time: 'أمس', type: 'referral', read: true },
  { id: 'n4', title: 'عرض خاص 🎉', body: 'خصم 30% على رحلتك القادمة', time: 'منذ يومين', type: 'promo', read: true },
];

export const mockDriverInfo = {
  name: 'محمد أحمد علي',
  rating: 4.9,
  totalRides: 1234,
  car: 'تويوتا كورولا 2022',
  plate: 'أ ب ج 1234',
  avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop',
  eta: 3,
};

export const mockChatMessages = [
  { id: 'm1', from: 'driver', text: 'أهلاً! أنا في الطريق إليك', time: '10:32 ص', read: true },
  { id: 'm2', from: 'user', text: 'تمام! انا واقف عند المدخل الرئيسي', time: '10:33 ص', read: true },
  { id: 'm3', from: 'driver', text: 'حسناً سأصل خلال 3 دقائق', time: '10:33 ص', read: true },
];

export const quickReplies = [
  'أنا في الطريق',
  'أنا هنا عند المدخل',
  'من فضلك انتظرني دقيقة',
  'هل وصلت؟',
  'شكراً جزيلاً',
  'أعد تحديد موقعك',
];

// Messages mock data for the dark messages screen
export const mockConversations = [
  {
    id: 'conv_001',
    name: 'أحمد محمد',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    lastMessage: 'سائق في الطريق إليك',
    lastMessageLine2: '📍 إلى اللقاء في موقع الاستلام',
    time: '09:41 ص',
    unread: 2,
    online: true,
    pinned: true,
    type: 'driver',
  },
  {
    id: 'conv_002',
    name: 'خالد علي',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lastMessage: '💛 تم توصيل الطلب بنجاح، شكراً لك',
    lastMessageLine2: null,
    time: 'أمس',
    unread: 1,
    online: true,
    pinned: false,
    type: 'driver',
  },
  {
    id: 'conv_003',
    name: 'دعم تك توكي',
    avatar: null,
    lastMessage: 'مرحبا بك، كيف يمكننا مساعدتك اليوم؟',
    lastMessageLine2: null,
    time: 'أمس',
    unread: 3,
    online: false,
    pinned: false,
    type: 'support',
    isSystem: true,
  },
  {
    id: 'conv_004',
    name: 'محمد السبيعي',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    lastMessage: 'هل أنت في الطريق؟',
    lastMessageLine2: null,
    time: 'السبت',
    unread: 0,
    online: true,
    pinned: false,
    type: 'driver',
  },
  {
    id: 'conv_005',
    name: 'فاطمة أحمد',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    lastMessage: '🌸 شكراً على الرحلة الممتازة',
    lastMessageLine2: null,
    time: 'الجمعة',
    unread: 0,
    online: false,
    pinned: false,
    type: 'driver',
  },
  {
    id: 'conv_006',
    name: 'سارة خالد',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    lastMessage: 'تم إلغاء الرحلة',
    lastMessageLine2: null,
    time: 'الخميس',
    unread: 0,
    online: false,
    pinned: false,
    type: 'driver',
  },
];
