import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BASE_URL } from '../config';

export default function EditSale({ sale, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState(sale?.quantity ?? 0);
  const [discount, setDiscount] = useState(sale?.discount ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sale) {
      setQuantity(sale.quantity ?? 0);
      setDiscount(sale.discount ?? 0);
    }
  }, [sale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sale?._id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/sales/${sale._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity, discount }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Error: ${response.status}`);
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to update sale');
    } finally {
      setLoading(false);
    }
  };

  if (!sale) return null;

  const finalPrice = sale.category === 'drug'
    ? (quantity * (sale.productRefId?.salePrice ?? 0)) - discount
    : (sale.income ?? 0) - discount + (sale.productRefId?.salePrice ?? 0) * (quantity - (sale.quantity ?? 0));

  return (
    <Transition.Root show={!!sale} as="div">
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 mb-4">
                  Edit Sale
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-4">
                  {sale.productRefId?.name} • {sale.category}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
