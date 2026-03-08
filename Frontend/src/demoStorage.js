/**
 * Demo storage for Eye-HMS - persists add/edit/delete in demo mode
 * Uses localStorage so demo users can add, edit, and delete data that survives page refresh
 */

const STORAGE_KEY = 'eye-hms-demo-store';

const defaultPatients = () => [
  { _id: 'patient1', name: 'John Doe', fatherName: 'Robert Doe', age: 45, contact: '+1234567890', patientID: 'P001', date: '2024-01-15', patientGender: 'male', insuranceContact: '' },
  { _id: 'patient2', name: 'Jane Smith', fatherName: 'John Smith', age: 32, contact: '+1987654321', patientID: 'P002', date: '2024-01-16', patientGender: 'female', insuranceContact: '' },
];

const defaultSales = () => [
  { _id: 'sale1', income: 15000, date: new Date().toISOString(), quantity: 2, category: 'frame', discount: 0, finalPrice: 15000, productRefId: { name: 'Frame A', salePrice: 7500 }, userID: { firstName: 'Demo', lastName: 'Admin' } },
  { _id: 'sale2', income: 500, date: new Date().toISOString(), quantity: 1, category: 'drug', discount: 0, finalPrice: 500, productRefId: { name: 'Eye Drops', salePrice: 500 }, userID: { firstName: 'Demo', lastName: 'Admin' } },
];

const defaultProducts = () => [
  { _id: 'prod1', name: 'Eye Drops A', stock: 50, quantity: 50, category: 'drug', price: 150, manufacturer: 'PharmaCo' },
  { _id: 'prod2', name: 'Lens Cleaner', stock: 30, quantity: 30, category: 'glass', price: 200, manufacturer: 'LensPro' },
];

const defaultGlasses = () => [
  { _id: 'g1', name: 'Frame A', manufacturer: 'Ray-Ban', minLevel: 5, category: 'frame', createdAt: '2024-01-15T10:00:00.000Z', purchasePrice: 1200, salePrice: 1500, quantity: 20 },
  { _id: 'g2', name: 'Sunglasses Pro', manufacturer: 'Oakley', minLevel: 3, category: 'sunglasses', createdAt: '2024-02-20T10:00:00.000Z', purchasePrice: 800, salePrice: 1100, quantity: 15 },
  { _id: 'g3', name: 'Reading Glass B', manufacturer: 'Zeiss', minLevel: 10, category: 'glass', createdAt: '2024-03-10T10:00:00.000Z', purchasePrice: 400, salePrice: 600, quantity: 2 },
];

const defaultPharmacyDrugs = () => [
  { _id: 'drug1', name: 'Paracetamol', quantity: 100, price: 50, salePrice: 50 },
];

const defaultUsers = () => [
  { _id: 'u1', email: 'admin@demo.com', role: 'admin', firstName: 'Demo', lastName: 'Admin', phoneNumber: '1234567890', image: null },
  { _id: 'u2', email: 'doctor@demo.com', role: 'doctor', firstName: 'Dr. Ahmed', lastName: 'Khan', phoneNumber: '9876543210', image: null },
  { _id: 'u3', email: 'pharmacist@demo.com', role: 'pharmacist', firstName: 'Sara', lastName: 'Ali', phoneNumber: '5555555555', image: null },
];

const defaultCategories = () => [
  { _id: 'cat1', name: 'drug', type: 'income' },
  { _id: 'cat2', name: 'glass', type: 'income' },
  { _id: 'cat3', name: 'oct', type: 'income' },
  { _id: 'cat4', name: 'opd', type: 'income' },
  { _id: 'cat5', name: 'operation', type: 'income' },
  { _id: 'cat6', name: 'utilities', type: 'expense' },
  { _id: 'cat7', name: 'salary', type: 'expense' },
];

const defaultOperationTypes = () => [
  { _id: 'opt1', name: 'Cataract', type: 'operation', price: 25000 },
  { _id: 'opt2', name: 'Glaucoma', type: 'operation', price: 30000 },
];

const defaultIncomes = () => [
  { _id: 'inc1', totalNetIncome: 50000, category: 'drug', date: new Date().toISOString() },
];

const defaultExpenses = () => [
  { _id: 'exp1', amount: 5000, category: 'utilities', date: new Date().toISOString() },
];

const defaultPurchases = () => [
  { _id: 'pur1', TotalPurchaseAmount: 50000, date: new Date().toISOString(), products: [] },
];

const defaultPharmacyLogs = () => [
  { _id: 'log1', date: new Date().toISOString(), amount: 45000, description: 'Daily pharmacy sales' },
  { _id: 'log2', date: new Date().toISOString(), amount: 42000, description: 'Weekly restock' },
];

const DEFAULT_STORE = {
  version: 1,
  nextId: { patient: 3, sale: 3, product: 3, glass: 4, drug: 2, user: 4, category: 8, operationType: 3, income: 2, expense: 2, purchase: 2, pharmacyLog: 3 },
  patients: defaultPatients(),
  sales: defaultSales(),
  products: defaultProducts(),
  glasses: defaultGlasses(),
  pharmacyDrugs: defaultPharmacyDrugs(),
  users: defaultUsers(),
  categories: defaultCategories(),
  operationTypes: defaultOperationTypes(),
  incomes: defaultIncomes(),
  expenses: defaultExpenses(),
  purchases: defaultPurchases(),
  pharmacyLogs: defaultPharmacyLogs(),
};

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STORE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STORE,
      ...parsed,
      patients: parsed.patients ?? defaultPatients(),
      sales: parsed.sales ?? defaultSales(),
      products: parsed.products ?? defaultProducts(),
      glasses: parsed.glasses ?? defaultGlasses(),
      pharmacyDrugs: parsed.pharmacyDrugs ?? defaultPharmacyDrugs(),
      users: parsed.users ?? defaultUsers(),
      categories: parsed.categories ?? defaultCategories(),
      operationTypes: parsed.operationTypes ?? defaultOperationTypes(),
      incomes: parsed.incomes ?? defaultIncomes(),
      expenses: parsed.expenses ?? defaultExpenses(),
      purchases: parsed.purchases ?? defaultPurchases(),
      pharmacyLogs: parsed.pharmacyLogs ?? defaultPharmacyLogs(),
      nextId: { ...DEFAULT_STORE.nextId, ...parsed.nextId },
    };
  } catch {
    return { ...DEFAULT_STORE };
  }
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('[Eye-HMS Demo] Failed to save to localStorage:', e);
  }
}

let _store = null;

export function getDemoStore() {
  if (!_store) _store = loadStore();
  return _store;
}

export function persistDemoStore(updates) {
  const store = getDemoStore();
  Object.assign(store, updates);
  saveStore(store);
}

export function getNextId(entity) {
  const store = getDemoStore();
  const n = (store.nextId[entity] || 1) + 1;
  store.nextId[entity] = n;
  saveStore(store);
  return n;
}

// Convenience getters that always return fresh data from localStorage
export function getDemoPatients() {
  return [...getDemoStore().patients];
}

export function getDemoSales() {
  return [...getDemoStore().sales];
}

export function getDemoProducts() {
  return [...getDemoStore().products];
}

export function getDemoGlasses() {
  return [...getDemoStore().glasses];
}

export function getDemoPharmacyDrugs() {
  return [...getDemoStore().pharmacyDrugs];
}

export function getDemoUsers() {
  return [...getDemoStore().users];
}

export function getDemoCategories() {
  return [...getDemoStore().categories];
}

export function getDemoOperationTypes() {
  return [...getDemoStore().operationTypes];
}

export function getDemoIncomes() {
  return [...getDemoStore().incomes];
}

export function getDemoExpenses() {
  return [...getDemoStore().expenses];
}

export function getDemoPurchases() {
  return [...getDemoStore().purchases];
}

export function getDemoPharmacyLogs() {
  return [...getDemoStore().pharmacyLogs];
}

// Mutable updates
export function addDemoPatient(patient) {
  const store = getDemoStore();
  const id = `patient${getNextId('patient')}`;
  const p = { _id: id, ...patient };
  store.patients.push(p);
  persistDemoStore({ patients: store.patients });
  return p;
}

export function updateDemoPatient(id, updates) {
  const store = getDemoStore();
  const idx = store.patients.findIndex((p) => p._id === id);
  if (idx < 0) return null;
  store.patients[idx] = { ...store.patients[idx], ...updates };
  persistDemoStore({ patients: store.patients });
  return store.patients[idx];
}

export function deleteDemoPatient(id) {
  const store = getDemoStore();
  store.patients = store.patients.filter((p) => p._id !== id);
  persistDemoStore({ patients: store.patients });
}

export function addDemoSale(sale) {
  const store = getDemoStore();
  const id = `sale${getNextId('sale')}`;
  const s = { _id: id, ...sale };
  store.sales.push(s);
  persistDemoStore({ sales: store.sales });
  return s;
}

export function updateDemoSale(id, updates) {
  const store = getDemoStore();
  const idx = store.sales.findIndex((s) => s._id === id);
  if (idx < 0) return null;
  store.sales[idx] = { ...store.sales[idx], ...updates };
  persistDemoStore({ sales: store.sales });
  return store.sales[idx];
}

export function deleteDemoSale(id) {
  const store = getDemoStore();
  store.sales = store.sales.filter((s) => s._id !== id);
  persistDemoStore({ sales: store.sales });
}

export function addDemoProduct(product) {
  const store = getDemoStore();
  const id = `prod${getNextId('product')}`;
  const p = {
    _id: id,
    stock: product.stock ?? product.quantity ?? 0,
    quantity: product.quantity ?? product.stock ?? 0,
    ...product,
  };
  store.products.push(p);
  persistDemoStore({ products: store.products });
  return p;
}

export function updateDemoProduct(id, updates) {
  const store = getDemoStore();
  const idx = store.products.findIndex((p) => p._id === id);
  if (idx < 0) return null;
  store.products[idx] = { ...store.products[idx], ...updates };
  persistDemoStore({ products: store.products });
  return store.products[idx];
}

export function deleteDemoProduct(id) {
  const store = getDemoStore();
  store.products = store.products.filter((p) => p._id !== id);
  persistDemoStore({ products: store.products });
}

export function addDemoGlass(glass) {
  const store = getDemoStore();
  const id = `g${getNextId('glass')}`;
  const g = { _id: id, createdAt: new Date().toISOString(), ...glass };
  store.glasses.push(g);
  persistDemoStore({ glasses: store.glasses });
  return g;
}

export function updateDemoGlass(id, updates) {
  const store = getDemoStore();
  const idx = store.glasses.findIndex((g) => g._id === id);
  if (idx < 0) return null;
  store.glasses[idx] = { ...store.glasses[idx], ...updates };
  persistDemoStore({ glasses: store.glasses });
  return store.glasses[idx];
}

export function deleteDemoGlass(id) {
  const store = getDemoStore();
  store.glasses = store.glasses.filter((g) => g._id !== id);
  persistDemoStore({ glasses: store.glasses });
}

export function addDemoPharmacyDrug(drug) {
  const store = getDemoStore();
  const id = `drug${getNextId('drug')}`;
  const d = { _id: id, ...drug };
  store.pharmacyDrugs.push(d);
  persistDemoStore({ pharmacyDrugs: store.pharmacyDrugs });
  return d;
}

export function updateDemoPharmacyDrug(id, updates) {
  const store = getDemoStore();
  const idx = store.pharmacyDrugs.findIndex((d) => d._id === id);
  if (idx < 0) return null;
  store.pharmacyDrugs[idx] = { ...store.pharmacyDrugs[idx], ...updates };
  persistDemoStore({ pharmacyDrugs: store.pharmacyDrugs });
  return store.pharmacyDrugs[idx];
}

export function deleteDemoPharmacyDrug(id) {
  const store = getDemoStore();
  store.pharmacyDrugs = store.pharmacyDrugs.filter((d) => d._id !== id);
  persistDemoStore({ pharmacyDrugs: store.pharmacyDrugs });
}

export function addDemoUser(user) {
  const store = getDemoStore();
  const id = `u${getNextId('user')}`;
  const u = { _id: id, image: null, ...user };
  store.users.push(u);
  persistDemoStore({ users: store.users });
  return u;
}

export function updateDemoUser(id, updates) {
  const store = getDemoStore();
  const idx = store.users.findIndex((u) => u._id === id);
  if (idx < 0) return null;
  store.users[idx] = { ...store.users[idx], ...updates };
  persistDemoStore({ users: store.users });
  return store.users[idx];
}

export function deleteDemoUser(id) {
  const store = getDemoStore();
  store.users = store.users.filter((u) => u._id !== id);
  persistDemoStore({ users: store.users });
}

export function addDemoCategory(category) {
  const store = getDemoStore();
  const id = `cat${getNextId('category')}`;
  const c = { _id: id, ...category };
  store.categories.push(c);
  persistDemoStore({ categories: store.categories });
  return c;
}

export function updateDemoCategory(id, updates) {
  const store = getDemoStore();
  const idx = store.categories.findIndex((c) => c._id === id);
  if (idx < 0) return null;
  store.categories[idx] = { ...store.categories[idx], ...updates };
  persistDemoStore({ categories: store.categories });
  return store.categories[idx];
}

export function deleteDemoCategory(id) {
  const store = getDemoStore();
  store.categories = store.categories.filter((c) => c._id !== id);
  persistDemoStore({ categories: store.categories });
}

export function addDemoOperationType(op) {
  const store = getDemoStore();
  const id = `opt${getNextId('operationType')}`;
  const o = { _id: id, ...op };
  store.operationTypes.push(o);
  persistDemoStore({ operationTypes: store.operationTypes });
  return o;
}

export function updateDemoOperationType(id, updates) {
  const store = getDemoStore();
  const idx = store.operationTypes.findIndex((o) => o._id === id);
  if (idx < 0) return null;
  store.operationTypes[idx] = { ...store.operationTypes[idx], ...updates };
  persistDemoStore({ operationTypes: store.operationTypes });
  return store.operationTypes[idx];
}

export function deleteDemoOperationType(id) {
  const store = getDemoStore();
  store.operationTypes = store.operationTypes.filter((o) => o._id !== id);
  persistDemoStore({ operationTypes: store.operationTypes });
}

export function addDemoIncome(income) {
  const store = getDemoStore();
  const id = `inc${getNextId('income')}`;
  const i = { _id: id, date: new Date().toISOString(), ...income };
  store.incomes.push(i);
  persistDemoStore({ incomes: store.incomes });
  return i;
}

export function updateDemoIncome(id, updates) {
  const store = getDemoStore();
  const idx = store.incomes.findIndex((i) => i._id === id);
  if (idx < 0) return null;
  store.incomes[idx] = { ...store.incomes[idx], ...updates };
  persistDemoStore({ incomes: store.incomes });
  return store.incomes[idx];
}

export function deleteDemoIncome(id) {
  const store = getDemoStore();
  store.incomes = store.incomes.filter((i) => i._id !== id);
  persistDemoStore({ incomes: store.incomes });
}

export function addDemoExpense(expense) {
  const store = getDemoStore();
  const id = `exp${getNextId('expense')}`;
  const e = { _id: id, date: new Date().toISOString(), ...expense };
  store.expenses.push(e);
  persistDemoStore({ expenses: store.expenses });
  return e;
}

export function updateDemoExpense(id, updates) {
  const store = getDemoStore();
  const idx = store.expenses.findIndex((e) => e._id === id);
  if (idx < 0) return null;
  store.expenses[idx] = { ...store.expenses[idx], ...updates };
  persistDemoStore({ expenses: store.expenses });
  return store.expenses[idx];
}

export function deleteDemoExpense(id) {
  const store = getDemoStore();
  store.expenses = store.expenses.filter((e) => e._id !== id);
  persistDemoStore({ expenses: store.expenses });
}

export function addDemoPurchase(purchase) {
  const store = getDemoStore();
  const id = `pur${getNextId('purchase')}`;
  const p = { _id: id, date: new Date().toISOString(), ...purchase };
  store.purchases.push(p);
  persistDemoStore({ purchases: store.purchases });
  return p;
}

export function updateDemoPurchase(id, updates) {
  const store = getDemoStore();
  const idx = store.purchases.findIndex((p) => p._id === id);
  if (idx < 0) return null;
  store.purchases[idx] = { ...store.purchases[idx], ...updates };
  persistDemoStore({ purchases: store.purchases });
  return store.purchases[idx];
}

export function deleteDemoPurchase(id) {
  const store = getDemoStore();
  store.purchases = store.purchases.filter((p) => p._id !== id);
  persistDemoStore({ purchases: store.purchases });
}

export function addDemoPharmacyLog(log) {
  const store = getDemoStore();
  const id = `log${getNextId('pharmacyLog')}`;
  const l = { _id: id, date: new Date().toISOString(), ...log };
  store.pharmacyLogs.push(l);
  persistDemoStore({ pharmacyLogs: store.pharmacyLogs });
  return l;
}

export function updateDemoPharmacyLog(id, updates) {
  const store = getDemoStore();
  const idx = store.pharmacyLogs.findIndex((l) => l._id === id);
  if (idx < 0) return null;
  store.pharmacyLogs[idx] = { ...store.pharmacyLogs[idx], ...updates };
  persistDemoStore({ pharmacyLogs: store.pharmacyLogs });
  return store.pharmacyLogs[idx];
}

export function deleteDemoPharmacyLog(id) {
  const store = getDemoStore();
  store.pharmacyLogs = store.pharmacyLogs.filter((l) => l._id !== id);
  persistDemoStore({ pharmacyLogs: store.pharmacyLogs });
}

/** Reset demo data (optional - e.g. for "Reset Demo" button) */
export function resetDemoStore() {
  _store = { ...DEFAULT_STORE };
  saveStore(_store);
}
