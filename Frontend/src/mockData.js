/**
 * Mock data for Eye-HMS Demo Mode
 * Used when running frontend without backend
 */

const createCategorySummary = (count = 0, totalSales = 0) => ({ count, totalSales });

const createDailySummary = (date) => ({
  date,
  categories: {
    opd: createCategorySummary(12, 24000),
    oct: createCategorySummary(8, 16000),
    laboratory: createCategorySummary(15, 45000),
    bedroom: createCategorySummary(5, 25000),
    ultrasound: createCategorySummary(6, 12000),
    operation: createCategorySummary(4, 80000),
    yeglizer: createCategorySummary(3, 9000),
    perimetry: createCategorySummary(2, 6000),
    fa: createCategorySummary(2, 8000),
    prp: createCategorySummary(1, 15000),
    glasses: createCategorySummary(10, 35000),
    pharmacy: createCategorySummary(25, 42000),
  },
  totals: { totalRecords: 93, totalSales: 314000 },
});

// Generate 7 days of mock daily summaries
const today = new Date();
const dailySummaries = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (6 - i));
  return createDailySummary(d.toISOString());
});

const mockDoctors = [
  { _id: 'doc1', firstName: 'Dr. Ahmed', lastName: 'Khan', percentage: 30 },
  { _id: 'doc2', firstName: 'Dr. Sara', lastName: 'Ali', percentage: 25 },
  { _id: 'doc3', firstName: 'Dr. Omar', lastName: 'Hassan', percentage: 20 },
];

const mockCategories = [
  { _id: 'cat1', name: 'drug', type: 'income' },
  { _id: 'cat2', name: 'glass', type: 'income' },
  { _id: 'cat3', name: 'oct', type: 'income' },
  { _id: 'cat4', name: 'opd', type: 'income' },
  { _id: 'cat5', name: 'operation', type: 'income' },
  { _id: 'cat6', name: 'utilities', type: 'expense' },
  { _id: 'cat7', name: 'salary', type: 'expense' },
];

const mockPatient = {
  _id: 'patient1',
  name: 'John Doe',
  fatherName: 'Robert Doe',
  age: 45,
  contact: '+1234567890',
  patientID: 'P001',
  date: '2024-01-15',
  patientGender: 'male',
  insuranceContact: '',
};

const mockProducts = [
  { _id: 'prod1', name: 'Eye Drops A', quantity: 50, category: 'drug', price: 150 },
  { _id: 'prod2', name: 'Lens Cleaner', quantity: 30, category: 'glass', price: 200 },
];

const mockMoveRecord = {
  _id: 'move1',
  inventory_id: { name: 'Eye Drops A' },
  quantity_moved: 10,
  totalAmount: 1500,
  moved_by: { firstName: 'Admin', lastName: 'User' },
  category: 'pharmacy',
  date_moved: new Date().toISOString(),
};

const mockPharmacyLog = {
  _id: 'log1',
  date: new Date().toISOString(),
  amount: 45000,
  description: 'Daily pharmacy sales',
};

const mockOperationTypes = [
  { _id: 'opt1', name: 'Cataract', type: 'operation', price: 25000 },
  { _id: 'opt2', name: 'Glaucoma', type: 'operation', price: 30000 },
];

// Demo store for sales - persists add/edit/delete in demo mode
const DEMO_PRODUCT_MAP = {
  drug1: { name: 'Paracetamol', salePrice: 50 },
  prod1: { name: 'Eye Drops A', salePrice: 150 },
  prod2: { name: 'Lens Cleaner', salePrice: 200 },
  g1: { name: 'Frame A', salePrice: 1500 },
  g2: { name: 'Sunglasses Pro', salePrice: 1100 },
  g3: { name: 'Reading Glass B', salePrice: 600 },
};
let demoSalesStore = [
  { _id: 'sale1', income: 15000, date: new Date().toISOString(), quantity: 2, category: 'frame', discount: 0, finalPrice: 15000, productRefId: { name: 'Frame A', salePrice: 7500 }, userID: { firstName: 'Demo', lastName: 'Admin' } },
  { _id: 'sale2', income: 500, date: new Date().toISOString(), quantity: 1, category: 'drug', discount: 0, finalPrice: 500, productRefId: { name: 'Eye Drops', salePrice: 500 }, userID: { firstName: 'Demo', lastName: 'Admin' } },
];
let demoSaleIdCounter = 3;

export const getMockResponse = (url, method = 'GET', body) => {
  const u = typeof url === 'string' ? url : (url?.url || (url?.baseURL || '') + (url?.url || url || ''));
  const match = String(u).match(/\/api\/v1(\/.*?)(?:\?|$)/);
  const path = match ? match[1] : String(u).split('?')[0].replace(/^.*\/api\/v1/, '') || '/';

  // Dashboard
  if (path.includes('/dashboard/summary')) {
    return { status: 'success', data: { totalProductsCount: 156, totalSales: 2450000, totalPurchases: 1200000, totalExpenses: 180000, totalIncome: 1070000 } };
  }

  // Daily summary
  if (path.includes('/daily-summary/range')) {
    return { status: 'success', data: dailySummaries };
  }

  // Income/Expense by month/year
  if (path.match(/\/(income|expense)\/\d{4}(\/\d{1,2})?/)) {
    const daysInMonth = 31;
    return { data: Array.from({ length: path.includes('/') && path.split('/').length > 3 ? daysInMonth : 12 }, (_, i) => Math.floor(Math.random() * 5000) + 1000) };
  }

  // Move product
  if (path.includes('/move-product')) {
    // move-product/{year}/{month} or move-product/{year} - for charts
    if (path.match(/\/move-product\/\d{4}\/\d{1,2}/)) {
      const daysInMonth = 31;
      return { data: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 5) + 1) };
    }
    if (path.match(/\/move-product\/\d{4}$/)) {
      return { data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 5) };
    }
    return { data: { results: [mockMoveRecord], total: 1 }, totalPages: 1 };
  }

  // Pharmacy logs
  if (path.includes('/pharmacy-logs')) {
    const logs = Array.from({ length: 5 }, (_, i) => ({ ...mockPharmacyLog, _id: `log${i + 1}`, amount: 40000 + i * 2000 }));
    return { data: { results: logs, total: 5 }, totalPages: 1 };
  }

  // Categories
  if (path.includes('/categories')) {
    return { data: { results: mockCategories } };
  }

  // Doctors
  if (path.includes('/doctorsHave-percentage') || path.includes('/user/doctors')) {
    return mockDoctors;
  }

  // User profile (Header expects res.data.data)
  if (path.includes('/user/profile') || path.includes('/user/me')) {
    return {
      data: {
        _id: 'demo1',
        email: 'admin@demo.com',
        role: 'admin',
        firstName: 'Demo',
        lastName: 'Admin',
      },
    };
  }

  // Patients
  if (path.includes('/patient')) {
    if (path.match(/\/patient\/[a-f0-9]{24}$/)) {
      return mockPatient;
    }
    if (path.match(/\/patient\/\d{4}\/\d{1,2}/)) {
      return { data: Array(31).fill(0).map((_, i) => Math.floor(Math.random() * 5)) };
    }
    if (path.match(/\/patient\/\d{4}$/)) {
      return { data: Array(12).fill(0).map((_, i) => Math.floor(Math.random() * 20)) };
    }
    const patients = Array.from({ length: 10 }, (_, i) => ({ ...mockPatient, _id: `patient${i + 1}`, name: `Patient ${i + 1}`, patientID: `P00${i + 1}` }));
    return { data: { results: patients, total: 10 }, totalPages: 1 };
  }

  // Inventory
  if (path.includes('/inventory/product')) {
    if (path.includes('/summary')) {
      return { data: { totalProducts: 156, lowStock: 12, outOfStock: 2 } };
    }
    return { data: { results: mockProducts, total: 2 }, totalPages: 1 };
  }

  // Purchase
  if (path.includes('/purchase')) {
    const purchases = [{ _id: 'pur1', TotalPurchaseAmount: 50000, date: new Date().toISOString(), products: [] }];
    return path.match(/\/purchase\/[a-f0-9]{24}$/) ? purchases[0] : { data: { results: purchases, total: 1 }, totalPages: 1 };
  }

  // Sales - Glasses page chart: /sales/{year}/{month} and /sales/{year}
  if (path.match(/\/sales\/\d{4}\/\d{1,2}$/)) {
    const daysInMonth = 31;
    return { data: Array.from({ length: daysInMonth }, (_, i) => Math.floor(Math.random() * 3000) + 500) };
  }
  if (path.match(/\/sales\/\d{4}$/)) {
    return { data: Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 25000) + 5000) };
  }
  if (path.includes('/sales')) {
    const saleIdMatch = path.match(/\/sales\/([a-zA-Z0-9]+)$/);
    const saleId = saleIdMatch && !path.match(/\/sales\/\d{4}/) ? saleIdMatch[1] : null;

    // POST - Add new sales
    if (method === 'POST' && body?.soldItems) {
      const receiptItems = [];
      let totalIncome = 0;
      for (const item of body.soldItems) {
        const product = DEMO_PRODUCT_MAP[item.productRefId] || { name: 'Product', salePrice: 0 };
        const income = (item.quantity || 1) * (product.salePrice || 0) - (item.discount || 0);
        totalIncome += income;
        const newSale = {
          _id: `sale${demoSaleIdCounter++}`,
          productRefId: { name: product.name, salePrice: product.salePrice },
          quantity: item.quantity || 1,
          income,
          category: item.category || 'drug',
          date: new Date().toISOString(),
          userID: { firstName: 'Demo', lastName: 'Admin' },
          discount: item.discount || body.discount || 0,
          finalPrice: income,
        };
        demoSalesStore.push(newSale);
        receiptItems.push({ productName: product.name, quantity: newSale.quantity, income: newSale.income });
      }
      const discount = body.discount || 0;
      const finalTotal = totalIncome - discount;
      return {
        data: {
          date: new Date().toISOString(),
          receipt: {
            discount,
            totalIncome: finalTotal,
            soldItems: receiptItems,
          },
        },
      };
    }

    // PATCH - Edit sale
    if (method === 'PATCH' && saleId) {
      const idx = demoSalesStore.findIndex((s) => s._id === saleId);
      if (idx >= 0 && body) {
        demoSalesStore[idx] = { ...demoSalesStore[idx], ...body };
        if (body.quantity !== undefined || body.discount !== undefined) {
          const s = demoSalesStore[idx];
          const income = (s.quantity || 1) * (s.productRefId?.salePrice || 0) - (s.discount || 0);
          demoSalesStore[idx].income = income;
          demoSalesStore[idx].finalPrice = income;
        }
        return { data: demoSalesStore[idx] };
      }
    }

    // DELETE - Remove sale
    if (method === 'DELETE' && saleId) {
      demoSalesStore = demoSalesStore.filter((s) => s._id !== saleId);
      return { message: 'Sale deleted' };
    }

    // GET - List or single
    if (saleId) {
      const sale = demoSalesStore.find((s) => s._id === saleId);
      return sale || { message: 'Not found' };
    }
    return { data: { results: [...demoSalesStore], total: demoSalesStore.length }, totalPages: 1 };
  }

  // Pharmacy
  if (path.includes('/pharmacyTotal')) {
    return { totalSalesAmount: 450000 };
  }
  if (path.includes('/pharmacy/drugs-summary')) {
    return { data: { totalDrugs: 85, lowStock: 8 } };
  }
  if (path.includes('/pharmacy')) {
    const drugs = [{ _id: 'drug1', name: 'Paracetamol', quantity: 100, price: 50, salePrice: 50 }];
    return { data: { results: drugs, total: 1 }, totalPages: 1 };
  }

  // Glasses - /glasses/summary must come before /glasses
  if (path.includes('/glasses/summary')) {
    return {
      totalSalePrice: 45000,
      length: 5,
      totalStock: 85,
      lowStockCount: 3,
    };
  }
  if (path.includes('/glasses')) {
    const mockGlasses = [
      { _id: 'g1', name: 'Frame A', manufacturer: 'Ray-Ban', minLevel: 5, category: 'frame', createdAt: '2024-01-15T10:00:00.000Z', purchasePrice: 1200, salePrice: 1500, quantity: 20 },
      { _id: 'g2', name: 'Sunglasses Pro', manufacturer: 'Oakley', minLevel: 3, category: 'sunglasses', createdAt: '2024-02-20T10:00:00.000Z', purchasePrice: 800, salePrice: 1100, quantity: 15 },
      { _id: 'g3', name: 'Reading Glass B', manufacturer: 'Zeiss', minLevel: 10, category: 'glass', createdAt: '2024-03-10T10:00:00.000Z', purchasePrice: 400, salePrice: 600, quantity: 2 },
    ];
    const isSingleItem = path.match(/\/glasses\/[a-zA-Z0-9]+$/) && !path.includes('/summary');
    return isSingleItem ? mockGlasses[0] : { data: { results: mockGlasses, total: 3 }, totalPages: 1 };
  }

  // Operation types (OperationTypeManagement expects data.data to be the array)
  if (path.includes('/operation-types')) {
    return { data: mockOperationTypes, totalPages: 1 };
  }

  // Doctor branch (DoctorBranchAssignment expects data.data to be the array)
  if (path.includes('/doctor-branch')) {
    return { data: [], totalPages: 1 };
  }

  // Khata / Doctor finance - order matters: summary, monthly, yearly, then list
  if (path.includes('/khata/doctor-khata/summary')) {
    return {
      data: {
        totalIncome: 125000,
        totalOutcome: 45000,
        youWillGet: 32000,
        youWillGive: 8500,
      },
    };
  }
  if (path.match(/\/khata\/doctor-khata\/monthly\/\d{4}\/\d{1,2}/)) {
    const daysInMonth = 31;
    const stats = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      income: Math.floor(Math.random() * 2000) + 500,
      outcome: Math.floor(Math.random() * 800) + 100,
    }));
    return { data: { stats } };
  }
  if (path.match(/\/khata\/doctor-khata\/yearly\/\d{4}/)) {
    const stats = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: Math.floor(Math.random() * 15000) + 3000,
      outcome: Math.floor(Math.random() * 5000) + 1000,
    }));
    return { data: { stats } };
  }
  if (path.includes('/khata/doctor-khata') && !path.includes('/summary') && !path.includes('/monthly') && !path.includes('/yearly')) {
    const mockRecords = [
      { _id: 'r1', doctorName: 'Dr. Ahmed Khan', branchName: 'OPD', amount: 2500, amountType: 'income', date: new Date().toISOString() },
      { _id: 'r2', doctorName: 'Dr. Sara Ali', branchName: 'Operation', amount: 1200, amountType: 'outcome', date: new Date().toISOString() },
    ];
    return { results: mockRecords, pages: 1, totalResults: 2 };
  }
  if (path.includes('/khata')) {
    return { data: { results: [], total: 0 }, summary: { totalAmount: 0 } };
  }

  // Branch services (bedroom, ultrasound, operation, oct, opd, yeglizer, perimetry, FA, PRP, laboratory)
  const branchPaths = ['bedroom', 'ultrasound', 'operation', 'oct', 'opd', 'yeglizer', 'perimetry', 'FA', 'PRP', 'labratory'];
  for (const branch of branchPaths) {
    if (path.includes(`/${branch}`)) {
      if (path.includes('-doctors')) return mockDoctors;
      if (path.includes('/search/')) return [];
      if (path.match(new RegExp(`/${branch}/[a-f0-9]{24}$`))) return { _id: 'rec1', patientId: 'patient1', totalAmount: 5000 };
      return { data: { results: [], total: 0 } };
    }
  }

  // Prescriptions
  if (path.includes('/prescriptions')) {
    return { data: { results: [], total: 0 } };
  }

  // Expired products (Header expects res.data to be array with .length)
  if (path.includes('/expire')) {
    return [];
  }

  // Income categories totals - PieChart expects array of { category, total }
  if (path.includes('/income/categories/totals')) {
    return {
      data: [
        { category: 'drug', total: 125000 },
        { category: 'glass', total: 85000 },
        { category: 'oct', total: 95000 },
        { category: 'opd', total: 110000 },
        { category: 'operation', total: 180000 },
        { category: 'laboratory', total: 72000 },
      ],
    };
  }

  // Income report
  if (path.includes('/income')) {
    const incomes = [{ _id: 'inc1', totalNetIncome: 50000, category: 'drug', date: new Date().toISOString() }];
    return path.match(/\/income\/[a-f0-9]{24}$/) ? incomes[0] : { data: { results: incomes, total: 1 }, totalPages: 1 };
  }

  // Expense
  if (path.includes('/expense')) {
    const expenses = [{ _id: 'exp1', amount: 5000, category: 'utilities', date: new Date().toISOString() }];
    return path.match(/\/expense\/[a-f0-9]{24}$/) ? { message: 'Deleted' } : { data: { results: expenses, total: 1 }, totalPages: 1 };
  }

  // User list (admin panel) - GET /user
  if (path === '/user' || (path.startsWith('/user') && path.includes('page='))) {
    const users = [
      { _id: 'u1', email: 'admin@demo.com', role: 'admin', firstName: 'Demo', lastName: 'Admin', phoneNumber: '1234567890', image: null },
      { _id: 'u2', email: 'doctor@demo.com', role: 'doctor', firstName: 'Dr. Ahmed', lastName: 'Khan', phoneNumber: '9876543210', image: null },
      { _id: 'u3', email: 'pharmacist@demo.com', role: 'pharmacist', firstName: 'Sara', lastName: 'Ali', phoneNumber: '5555555555', image: null },
    ];
    return { data: { results: users, total: 3 }, totalPages: 1 };
  }

  // User register (admin panel add user) - POST /user/register
  if (path.includes('/user/register') && method === 'POST') {
    return { status: 'success', data: { _id: 'new-user', message: 'User created' } };
  }

  // User delete - DELETE /user/:id
  if (path.match(/\/user\/[a-zA-Z0-9]+$/) && method === 'DELETE') {
    return { status: 'success', message: 'User deleted' };
  }

  // Other /user endpoints (exclude profile, me, login, logout, register, forgotPassword)
  if (path.includes('/user') && !path.includes('/login') && !path.includes('/logout') && !path.includes('/register') && !path.includes('/forgotPassword') && !path.includes('/profile') && !path.includes('/me')) {
    const users = [{ _id: 'u1', email: 'admin@demo.com', role: 'admin', firstName: 'Demo', lastName: 'Admin', phoneNumber: '1234567890', image: null }];
    return { data: { results: users, total: 1 }, totalPages: 1 };
  }

  // Default for any other API call
  return { status: 'success', data: [], message: 'Demo mode - mock response' };
};
