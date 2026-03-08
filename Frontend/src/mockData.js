/**
 * Mock data for Eye-HMS Demo Mode
 * Used when running frontend without backend
 * Uses localStorage via demoStorage.js - users can add, edit, delete and data persists
 */

import {
  getDemoPatients,
  getDemoSales,
  getDemoProducts,
  getDemoGlasses,
  getDemoPharmacyDrugs,
  getDemoUsers,
  getDemoCategories,
  getDemoOperationTypes,
  getDemoIncomes,
  getDemoExpenses,
  getDemoPurchases,
  getDemoPharmacyLogs,
  addDemoPatient,
  updateDemoPatient,
  deleteDemoPatient,
  addDemoSale,
  updateDemoSale,
  deleteDemoSale,
  addDemoProduct,
  updateDemoProduct,
  deleteDemoProduct,
  addDemoGlass,
  updateDemoGlass,
  deleteDemoGlass,
  addDemoPharmacyDrug,
  updateDemoPharmacyDrug,
  deleteDemoPharmacyDrug,
  addDemoUser,
  updateDemoUser,
  deleteDemoUser,
  addDemoCategory,
  updateDemoCategory,
  deleteDemoCategory,
  addDemoOperationType,
  updateDemoOperationType,
  deleteDemoOperationType,
  addDemoIncome,
  updateDemoIncome,
  deleteDemoIncome,
  addDemoExpense,
  updateDemoExpense,
  deleteDemoExpense,
  addDemoPurchase,
  updateDemoPurchase,
  deleteDemoPurchase,
  addDemoPharmacyLog,
  updateDemoPharmacyLog,
  deleteDemoPharmacyLog,
} from './demoStorage';

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

const mockMoveRecord = {
  _id: 'move1',
  inventory_id: { name: 'Eye Drops A' },
  quantity_moved: 10,
  totalAmount: 1500,
  moved_by: { firstName: 'Admin', lastName: 'User' },
  category: 'pharmacy',
  date_moved: new Date().toISOString(),
};

/** Build product map for sales from glasses + pharmacy drugs */
function getDemoProductMap() {
  const map = {};
  for (const g of getDemoGlasses()) {
    map[g._id] = { name: g.name, salePrice: g.salePrice || 0 };
  }
  for (const d of getDemoPharmacyDrugs()) {
    map[d._id] = { name: d.name, salePrice: d.salePrice || d.price || 0 };
  }
  for (const p of getDemoProducts()) {
    map[p._id] = { name: p.name, salePrice: p.price || 0 };
  }
  return map;
}

export const getMockResponse = (url, method = 'GET', body) => {
  const u = typeof url === 'string' ? url : (url?.url || (url?.baseURL || '') + (url?.url || url || ''));
  const match = String(u).match(/\/api\/v1(\/.*?)(?:\?|$)/);
  const path = match ? match[1] : String(u).split('?')[0].replace(/^.*\/api\/v1/, '') || '/';
  const pathBase = path.split('?')[0];

  // Helper: extract ID from path like /entity/id (exclude numeric year/month patterns)
  const getId = (entityPath) => {
    const re = new RegExp(`^${entityPath}/([a-zA-Z0-9_-]+)$`);
    const m = pathBase.match(re);
    return m ? m[1] : null;
  };

  // Store (AddStore component)
  if (path.includes('/store/add') && method === 'POST') {
    return { status: 'success', data: { message: 'Store added' } };
  }

  // Backup download (Header - mockApi returns blob for this path)
  if (path.includes('/backup/download')) {
    return { status: 'success' };
  }

  // Dashboard
  if (path.includes('/dashboard/summary')) {
    return { status: 'success', data: { totalProductsCount: 156, totalSales: 2450000, totalPurchases: 1200000, totalExpenses: 180000, totalIncome: 1070000 } };
  }

  // Daily summary
  if (path.includes('/daily-summary/range')) {
    return { status: 'success', data: dailySummaries };
  }

  // Income/Expense by month/year (chart data)
  if (path.match(/\/(income|expense)\/\d{4}(\/\d{1,2})?/)) {
    const daysInMonth = 31;
    return { data: Array.from({ length: path.includes('/') && path.split('/').length > 3 ? daysInMonth : 12 }, (_, i) => Math.floor(Math.random() * 5000) + 1000) };
  }

  // Move product (POST = move to pharmacy; GET = list history)
  if (path.includes('/move-product')) {
    if (path.match(/\/move-product\/\d{4}\/\d{1,2}/)) {
      return { data: Array.from({ length: 31 }, () => Math.floor(Math.random() * 5) + 1) };
    }
    if (path.match(/\/move-product\/\d{4}$/)) {
      return { data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20) + 5) };
    }
    if (method === 'POST' && body) {
      return { status: 'success', data: { ...body, _id: 'move1', date_moved: new Date().toISOString() } };
    }
    const moves = [mockMoveRecord];
    return { data: { results: moves, total: moves.length }, totalPages: 1 };
  }

  // ========== PHARMACY LOGS (before /pharmacy) ==========
  if (path.includes('/pharmacy-logs')) {
    const logs = getDemoPharmacyLogs();
    const logId = getId('/pharmacy-logs');
    if (logId) {
      if (method === 'DELETE') {
        deleteDemoPharmacyLog(logId);
        return { message: 'Pharmacy log deleted' };
      }
      if (method === 'PUT' && body) {
        const updated = updateDemoPharmacyLog(logId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      if (method === 'GET') {
        const log = logs.find((l) => l._id === logId);
        return log || { message: 'Not found' };
      }
    }
    if (method === 'POST' && body) {
      const created = addDemoPharmacyLog(body);
      return { data: created };
    }
    return { data: { results: logs, total: logs.length }, totalPages: 1 };
  }

  // ========== CATEGORIES ==========
  if (path.includes('/categories/active')) {
    const categories = getDemoCategories().filter((c) => c.type === 'income' || c.type === 'expense');
    return { data: { results: categories }, status: 'success' };
  }
  if (path.includes('/categories')) {
    const categories = getDemoCategories();
    const catId = getId('/categories');
    if (catId) {
      if (method === 'DELETE') {
        deleteDemoCategory(catId);
        return { message: 'Category deleted' };
      }
      if (method === 'PUT' && body) {
        const updated = updateDemoCategory(catId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      const cat = categories.find((c) => c._id === catId);
      return cat || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoCategory(body);
      return { data: created };
    }
    return { data: { results: categories } };
  }

  // Doctors (static)
  if (path.includes('/doctorsHave-percentage') || path.includes('/user/doctors')) {
    return mockDoctors;
  }

  // User profile, update profile, auth helpers
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
  if (path.includes('/user/updateCurrentUserProfile') && method === 'PATCH') {
    return { status: 'success', data: { ...body, _id: 'demo1' } };
  }
  if (path.includes('/user/forgotPassword') && method === 'POST') {
    return { status: 'success', message: 'Reset email sent (demo)' };
  }
  if (path.includes('/user/resetePassword/') && method === 'POST') {
    return { status: 'success', message: 'Password reset (demo)' };
  }

  // ========== PATIENTS ==========
  if (path.includes('/patient')) {
    if (path.match(/\/patient\/\d{4}\/\d{1,2}/)) {
      return { data: Array(31).fill(0).map((_, i) => Math.floor(Math.random() * 5)) };
    }
    if (path.match(/\/patient\/\d{4}$/)) {
      return { data: Array(12).fill(0).map((_, i) => Math.floor(Math.random() * 20)) };
    }
    const patients = getDemoPatients();
    const patientId = pathBase.match(/\/patient\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (patientId) {
      if (method === 'PATCH' && body) {
        const updated = updateDemoPatient(patientId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      if (method === 'DELETE') {
        deleteDemoPatient(patientId);
        return { message: 'Patient deleted' };
      }
      const p = patients.find((x) => x._id === patientId);
      return p || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoPatient(body);
      return { data: created };
    }
    return { data: { results: patients, total: patients.length }, totalPages: 1 };
  }

  // ========== INVENTORY PRODUCTS ==========
  if (path.includes('/inventory/product')) {
    if (path.includes('/expire')) {
      const products = getDemoProducts().filter((p) => (p.expiryDate && new Date(p.expiryDate) < new Date()) || (!p.expiryDate && Math.random() > 0.8)).map((p) => ({ ...p, stock: p.stock ?? p.quantity }));
      return { expiringSoon: products, totalPages: 1, results: products.length, length: products.length };
    }
    if (path.includes('/low-stock')) {
      const products = getDemoProducts().filter((p) => (p.stock ?? p.quantity ?? 0) < 10).map((p) => ({ ...p, stock: p.stock ?? p.quantity ?? 0 }));
      return { data: { results: products, total: products.length }, totalPages: 1 };
    }
    if (path.includes('/summary')) {
      const products = getDemoProducts();
      const qty = (p) => p.stock ?? p.quantity ?? 0;
      const lowStock = products.filter((p) => qty(p) < 5).length;
      const outOfStock = products.filter((p) => qty(p) === 0).length;
      return { data: { totalProducts: products.length, lowStock, outOfStock } };
    }
    const products = getDemoProducts().map((p) => ({ ...p, stock: p.stock ?? p.quantity ?? 0 }));
    const prodId = pathBase.match(/\/product\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (prodId) {
      if (method === 'PATCH' && body) {
        const updated = updateDemoProduct(prodId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      if (method === 'DELETE') {
        deleteDemoProduct(prodId);
        return { message: 'Product deleted' };
      }
      const p = products.find((x) => x._id === prodId);
      return p || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoProduct(body);
      return { data: created };
    }
    return { data: { results: products, total: products.length }, totalPages: 1 };
  }

  // ========== PURCHASE ==========
  if (path.includes('/purchase')) {
    const purchases = getDemoPurchases();
    const purId = pathBase.match(/\/purchase\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (purId) {
      if (method === 'PATCH' && body) {
        const updated = updateDemoPurchase(purId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      if (method === 'DELETE') {
        deleteDemoPurchase(purId);
        return { message: 'Purchase deleted' };
      }
      const p = purchases.find((x) => x._id === purId);
      return p || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoPurchase(body);
      return { data: created };
    }
    return { data: { results: purchases, total: purchases.length }, totalPages: 1 };
  }

  // ========== SALES ==========
  if (path.match(/\/sales\/\d{4}\/\d{1,2}$/)) {
    return { data: Array.from({ length: 31 }, (_, i) => Math.floor(Math.random() * 3000) + 500) };
  }
  if (path.match(/\/sales\/\d{4}$/)) {
    return { data: Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 25000) + 5000) };
  }
  if (path.includes('/sales')) {
    const sales = getDemoSales();
    const saleId = pathBase.match(/\/sales\/([a-zA-Z0-9_-]+)$/)?.[1];

    if (method === 'POST' && body?.soldItems) {
      const DEMO_PRODUCT_MAP = getDemoProductMap();
      const receiptItems = [];
      for (const item of body.soldItems) {
        const product = DEMO_PRODUCT_MAP[item.productRefId] || { name: item.productRefId || 'Product', salePrice: 0 };
        const income = (item.quantity || 1) * (product.salePrice || 0) - (item.discount || 0);
        const newSale = addDemoSale({
          productRefId: { name: product.name, salePrice: product.salePrice },
          quantity: item.quantity || 1,
          income,
          category: item.category || 'drug',
          date: new Date().toISOString(),
          userID: { firstName: 'Demo', lastName: 'Admin' },
          discount: item.discount || body.discount || 0,
          finalPrice: income,
        });
        receiptItems.push({ productName: product.name, quantity: newSale.quantity, income: newSale.income });
      }
      const discount = body.discount || 0;
      const totalIncome = receiptItems.reduce((s, i) => s + i.income, 0) - discount;
      return {
        data: {
          date: new Date().toISOString(),
          receipt: { discount, totalIncome, soldItems: receiptItems },
        },
      };
    }

    if (method === 'PATCH' && saleId && body) {
      const updated = updateDemoSale(saleId, body);
      if (updated && (body.quantity !== undefined || body.discount !== undefined)) {
        const s = updated;
        const income = (s.quantity || 1) * (s.productRefId?.salePrice || 0) - (s.discount || 0);
        updateDemoSale(saleId, { income, finalPrice: income });
      }
      return updated ? { data: updated } : { message: 'Not found' };
    }

    if (method === 'DELETE' && saleId) {
      deleteDemoSale(saleId);
      return { message: 'Sale deleted' };
    }

    if (saleId) {
      const sale = sales.find((s) => s._id === saleId);
      return sale || { message: 'Not found' };
    }
    return { data: { results: [...getDemoSales()], total: getDemoSales().length }, totalPages: 1 };
  }

  // ========== PHARMACY (drugs) ==========
  if (path.includes('/pharmacyTotal')) {
    const drugs = getDemoPharmacyDrugs();
    const totalSalesAmount = drugs.reduce((s, d) => s + (d.quantity || 0) * (d.salePrice || d.price || 0), 0);
    return { totalSalesAmount: totalSalesAmount || 450000 };
  }
  if (path.includes('/pharmacy/drugs-summary')) {
    const drugs = getDemoPharmacyDrugs();
    const lowStock = drugs.filter((d) => (d.quantity || 0) < 10).length;
    return { data: { totalDrugs: drugs.length, lowStock } };
  }
  if (path.includes('/pharmacy/expire')) {
    const drugs = getDemoPharmacyDrugs().filter((d) => (d.expiryDate && new Date(d.expiryDate) < new Date()) || (!d.expiryDate && Math.random() > 0.8));
    return { expiringSoon: drugs, totalPages: 1, results: drugs.length, length: drugs.length };
  }
  if (path.includes('/pharmacy/low-stock')) {
    const drugs = getDemoPharmacyDrugs().filter((d) => (d.quantity ?? 0) < 10);
    return { data: { results: drugs, total: drugs.length }, totalPages: 1 };
  }
  if (path.includes('/pharmacy')) {
    const drugs = getDemoPharmacyDrugs();
    const drugId = pathBase.match(/\/pharmacy\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (drugId) {
      if (method === 'PATCH' && body) {
        const updated = updateDemoPharmacyDrug(drugId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      if (method === 'DELETE') {
        deleteDemoPharmacyDrug(drugId);
        return { message: 'Drug deleted' };
      }
      const d = drugs.find((x) => x._id === drugId);
      return d || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoPharmacyDrug(body);
      return { data: created };
    }
    return { data: { results: drugs, total: drugs.length }, totalPages: 1 };
  }

  // ========== GLASSES ==========
  if (path.includes('/glasses/low-stock')) {
    const glasses = getDemoGlasses().filter((g) => (g.quantity ?? 0) <= (g.minLevel ?? 5));
    return { data: { results: glasses, total: glasses.length }, totalPages: 1 };
  }
  if (path.includes('/glasses/summary')) {
    const glasses = getDemoGlasses();
    const totalSalePrice = glasses.reduce((s, g) => s + (g.quantity || 0) * (g.salePrice || 0), 0);
    const lowStockCount = glasses.filter((g) => (g.quantity || 0) <= (g.minLevel || 0)).length;
    return {
      totalSalePrice: totalSalePrice || 45000,
      length: glasses.length,
      totalStock: glasses.reduce((s, g) => s + (g.quantity || 0), 0),
      lowStockCount,
    };
  }
  if (path.includes('/glasses')) {
    const glasses = getDemoGlasses();
    const glassId = pathBase.match(/\/glasses\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (glassId && !path.includes('/summary')) {
      if (method === 'PATCH' && body) {
        const updated = updateDemoGlass(glassId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      if (method === 'DELETE') {
        deleteDemoGlass(glassId);
        return { message: 'Glass deleted' };
      }
      const g = glasses.find((x) => x._id === glassId);
      return g || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoGlass(body);
      return { data: created };
    }
    return { data: { results: glasses, total: glasses.length }, totalPages: 1 };
  }

  // ========== OPERATION TYPES ==========
  if (path.includes('/operation-types')) {
    const opTypes = getDemoOperationTypes();
    const optId = pathBase.match(/\/operation-types\/([a-zA-Z0-9_-]+)$/)?.[1];
    const isDeletePath = path.includes('/delete/');
    const deleteOptId = path.match(/\/delete\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (isDeletePath && deleteOptId && method === 'PATCH') {
      deleteDemoOperationType(deleteOptId);
      return { message: 'Operation type deleted' };
    }
    if (optId) {
      if (method === 'PATCH' && body) {
        const updated = updateDemoOperationType(optId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      const o = opTypes.find((x) => x._id === optId);
      return o || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoOperationType(body);
      return { data: created };
    }
    return { data: opTypes, totalPages: 1 };
  }

  // Doctor branch
  if (path.includes('/doctor-branch')) {
    return { data: [], totalPages: 1 };
  }

  // Khata / Doctor finance
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
    const stats = Array.from({ length: 31 }, (_, i) => ({
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
    return {
      results: [
        { _id: 'r1', doctorName: 'Dr. Ahmed Khan', branchName: 'OPD', amount: 2500, amountType: 'income', date: new Date().toISOString() },
        { _id: 'r2', doctorName: 'Dr. Sara Ali', branchName: 'Operation', amount: 1200, amountType: 'outcome', date: new Date().toISOString() },
      ],
      pages: 1,
      totalResults: 2,
    };
  }
  if (path.includes('/khata')) {
    return { data: { results: [], total: 0 }, summary: { totalAmount: 0 } };
  }

  // Branch services
  const branchPaths = ['bedroom', 'ultrasound', 'operation', 'oct', 'opd', 'yeglizer', 'perimetry', 'FA', 'PRP', 'labratory'];
  for (const branch of branchPaths) {
    if (path.includes(`/${branch}`)) {
      if (path.includes('-doctors')) return mockDoctors;
      if (path.includes('/search/')) return [];
      if (path.match(new RegExp(`/${branch}/[a-f0-9]{24}$`))) return { _id: 'rec1', patientId: 'patient1', totalAmount: 5000 };
      return { data: { results: [], total: 0 } };
    }
  }

  // Prescriptions (PrescriptionList, PrescriptionForm, PrescriptionDetail)
  if (path.includes('/prescriptions/patients/name/') && path.includes('/prescriptions')) {
    return { data: { results: [], total: 0 } };
  }
  if (path.includes('/prescriptions/prescription/') || path.includes('/prescriptions/patient/name/')) {
    const prescId = pathBase.match(/\/prescription\/([a-zA-Z0-9_-]+)/)?.[1];
    if (prescId && method === 'DELETE') {
      return { status: 'success', message: 'Deleted' };
    }
    if (prescId && method === 'PATCH') {
      return { status: 'success', data: { _id: prescId, ...body } };
    }
    if (prescId && method === 'GET') {
      const mockPrescription = {
        _id: prescId,
        date: new Date().toISOString().split('T')[0],
        doctor: 'Demo Doctor',
        rightEye: { sphere: '', cylinder: '', axis: '' },
        leftEye: { sphere: '', cylinder: '', axis: '' },
        pdDistance: '', pdNear: '', pdPower: '', lensType: '',
      };
      return { data: mockPrescription };
    }
    if (method === 'POST' && body) {
      return { status: 'success', data: { _id: 'rx1', ...body } };
    }
    return { data: { results: [], total: 0 } };
  }
  if (path.includes('/prescriptions')) {
    return { data: { results: [], total: 0 } };
  }

  // Expired products
  if (path.includes('/expire')) {
    return [];
  }

  // Income categories totals
  if (path.includes('/income/categories/totals')) {
    const incomes = getDemoIncomes();
    const byCat = {};
    for (const i of incomes) {
      byCat[i.category] = (byCat[i.category] || 0) + (i.totalNetIncome || 0);
    }
    return {
      data: Object.entries(byCat).map(([category, total]) => ({ category, total })),
    };
  }

  // ========== INCOME ==========
  if (path.includes('/income')) {
    const incomes = getDemoIncomes();
    const incId = pathBase.match(/\/income\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (incId) {
      if (method === 'PATCH' && body) {
        const updated = updateDemoIncome(incId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      if (method === 'DELETE') {
        deleteDemoIncome(incId);
        return { message: 'Deleted' };
      }
      const i = incomes.find((x) => x._id === incId);
      return i || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoIncome(body);
      return { data: created };
    }
    return { data: { results: incomes, total: incomes.length }, totalPages: 1 };
  }

  // ========== EXPENSE ==========
  if (path.includes('/expense')) {
    const expenses = getDemoExpenses();
    const expId = pathBase.match(/\/expense\/([a-zA-Z0-9_-]+)$/)?.[1];
    if (expId) {
      if (method === 'PATCH' && body) {
        const updated = updateDemoExpense(expId, body);
        return updated ? { data: updated } : { message: 'Not found' };
      }
      if (method === 'DELETE') {
        deleteDemoExpense(expId);
        return { message: 'Deleted' };
      }
      const e = expenses.find((x) => x._id === expId);
      return e || { message: 'Not found' };
    }
    if (method === 'POST' && body) {
      const created = addDemoExpense(body);
      return { data: created };
    }
    return { data: { results: expenses, total: expenses.length }, totalPages: 1 };
  }

  // ========== USERS ==========
  if (path === '/user' || (path.startsWith('/user') && (path.includes('page=') || path === '/user'))) {
    const users = getDemoUsers();
    return { data: { results: users, total: users.length }, totalPages: 1 };
  }
  if (path.includes('/user/register') && method === 'POST') {
    const created = addDemoUser({
      email: body?.email,
      role: body?.role,
      firstName: body?.firstName,
      lastName: body?.lastName,
      phoneNumber: body?.phoneNumber || '',
    });
    return { status: 'success', data: { _id: created._id, message: 'User created' } };
  }
  const userIdMatch = pathBase.match(/\/user\/([a-zA-Z0-9_-]+)$/);
  if (userIdMatch && !path.includes('/register') && !path.includes('/login') && !path.includes('/logout') && !path.includes('/forgotPassword')) {
    const userId = userIdMatch[1];
    if (method === 'DELETE') {
      deleteDemoUser(userId);
      return { status: 'success', message: 'User deleted' };
    }
    if (method === 'PATCH' && body) {
      const updated = updateDemoUser(userId, body);
      return updated ? { data: updated } : { message: 'Not found' };
    }
  }
  if (path.includes('/user') && !path.includes('/login') && !path.includes('/logout') && !path.includes('/register') && !path.includes('/forgotPassword') && !path.includes('/profile') && !path.includes('/me')) {
    const users = getDemoUsers();
    return { data: { results: users, total: users.length }, totalPages: 1 };
  }

  return { status: 'success', data: [], message: 'Demo mode - mock response' };
};
