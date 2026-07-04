import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconEdit, IconPhone, IconPlus, IconTrash } from '@tabler/icons-react';
import { fetchControls, updateControls } from '../../store/controlsSlice';
import { showToast } from '../../store/toastSlice';
import { formatPhoneDisplay, isValidPhone, normalizePhone } from '../../utils/phone';

function ToggleRow({ title, description, enabled, onToggle, disabled }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl border border-border p-4">
      <div className="w-full">
        <p className="font-sans font-semibold text-[14px] text-ink">{title}</p>
        <p className="font-sans text-[12px] text-muted mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-11 w-20 sm:h-7 sm:w-14 items-center rounded-full transition-colors duration-150 ${
          enabled ? 'bg-amber' : 'bg-border'
        } ${disabled ? 'opacity-60 cursor-wait' : ''}`}
        aria-pressed={enabled}
      >
        <span
          className={`inline-block h-7 w-7 sm:h-5 sm:w-5 transform rounded-full bg-white transition-transform duration-150 ${
            enabled ? 'translate-x-12 sm:translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function ControlManager() {
  const dispatch = useDispatch();
  const { products_enabled, price_visible, contact_phones, loading, saving, error } =
    useSelector((state) => state.controls);

  const [newPhone, setNewPhone] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    dispatch(fetchControls())
      .unwrap()
      .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
  }, [dispatch]);

  const saveControls = (next, successMessage = 'Controls updated.') => {
    dispatch(updateControls(next))
      .unwrap()
      .then(() => {
        dispatch(showToast(successMessage, 'success'));
        return dispatch(fetchControls()).unwrap();
      })
      .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
  };

  const updateToggles = (next) => {
    saveControls({
      products_enabled: next.products_enabled,
      price_visible: next.price_visible,
      contact_phones,
    });
  };

  const savePhones = (phones, successMessage) => {
    saveControls(
      { products_enabled, price_visible, contact_phones: phones },
      successMessage
    );
  };

  const validateInput = (value) => {
    const normalized = normalizePhone(value);
    if (!normalized || !isValidPhone(normalized)) {
      dispatch(showToast('Enter a valid phone number (e.g. +251911189171).', 'error', 5000));
      return null;
    }
    if (contact_phones.includes(normalized)) {
      dispatch(showToast('This phone number already exists.', 'error', 5000));
      return null;
    }
    return normalized;
  };

  const handleAddPhone = () => {
    const normalized = validateInput(newPhone);
    if (!normalized) return;
    savePhones([...contact_phones, normalized], 'Phone number added.');
    setNewPhone('');
  };

  const handleDeletePhone = (index) => {
    const next = contact_phones.filter((_, i) => i !== index);
    savePhones(next, 'Phone number deleted.');
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditValue(contact_phones[index]);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const handleSaveEdit = (index) => {
    const normalized = normalizePhone(editValue);
    if (!normalized || !isValidPhone(normalized)) {
      dispatch(showToast('Enter a valid phone number.', 'error', 5000));
      return;
    }
    const duplicate = contact_phones.some(
      (phone, i) => i !== index && phone === normalized
    );
    if (duplicate) {
      dispatch(showToast('This phone number already exists.', 'error', 5000));
      return;
    }
    const next = contact_phones.map((phone, i) => (i === index ? normalized : phone));
    savePhones(next, 'Phone number updated.');
    cancelEdit();
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-condensed font-bold text-[24px] text-ink">Control</h1>
        <p className="font-sans text-[13px] text-muted mt-1">
          Manage what customers can see on the storefront.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="skeleton-shimmer h-20 rounded-xl" />
          <div className="skeleton-shimmer h-20 rounded-xl" />
          <div className="skeleton-shimmer h-40 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-3">
          <ToggleRow
            title="Display Products"
            description={
              products_enabled
                ? 'ON: products are visible on website.'
                : 'OFF: website shows "The products are holded".'
            }
            enabled={products_enabled}
            disabled={saving}
            onToggle={() =>
              updateToggles({ products_enabled: !products_enabled, price_visible })
            }
          />
          <ToggleRow
            title="Display Price"
            description={
              price_visible
                ? 'ON: product prices are visible.'
                : 'OFF: shows "Price not available, contact admin".'
            }
            enabled={price_visible}
            disabled={saving}
            onToggle={() =>
              updateToggles({ products_enabled, price_visible: !price_visible })
            }
          />

          <section className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-amber-tint flex items-center justify-center shrink-0">
                <IconPhone size={18} className="text-amber" />
              </div>
              <div>
                <p className="font-sans font-semibold text-[14px] text-ink">
                  Contact Phone Numbers
                </p>
                <p className="font-sans text-[12px] text-muted mt-0.5">
                  Shown in the hero section and contact modal on the storefront.
                </p>
              </div>
            </div>

            {contact_phones.length === 0 ? (
              <p className="text-muted text-[13px] mb-3">No phone numbers yet.</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {contact_phones.map((phone, index) => (
                  <li
                    key={`${phone}-${index}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border border-border bg-smoke"
                  >
                    {editingIndex === index ? (
                      <input
                        type="tel"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-md border border-border bg-white text-ink text-[13px] font-semibold focus:border-amber outline-none"
                        placeholder="+251911189171"
                      />
                    ) : (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <IconPhone size={16} className="text-[#0056B3] shrink-0" />
                        <span className="font-condensed font-bold text-[16px] text-ink truncate">
                          {formatPhoneDisplay(phone)}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-1.5 sm:shrink-0">
                      {editingIndex === index ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(index)}
                            disabled={saving}
                            className="flex-1 sm:flex-none h-9 px-3 rounded-md bg-amber text-ink text-[11px] font-bold uppercase tracking-[0.03em] hover:bg-amber2 transition-colors disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="flex-1 sm:flex-none h-9 px-3 rounded-md border border-border text-muted text-[11px] font-bold uppercase tracking-[0.03em] hover:border-ink hover:text-ink transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(index)}
                            disabled={saving}
                            className="w-9 h-9 rounded-md bg-amber-tint text-amber2 hover:bg-amber/20 transition-colors flex items-center justify-center disabled:opacity-60"
                            aria-label="Edit phone"
                          >
                            <IconEdit size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePhone(index)}
                            disabled={saving}
                            className="w-9 h-9 rounded-md bg-[#FDEAEA] text-danger hover:bg-danger/20 transition-colors flex items-center justify-center disabled:opacity-60"
                            aria-label="Delete phone"
                          >
                            <IconTrash size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPhone()}
                placeholder="+251911189171"
                disabled={saving}
                className="flex-1 h-10 px-3 rounded-md border border-border bg-white text-ink text-[13px] font-semibold focus:border-amber outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={handleAddPhone}
                disabled={saving || !newPhone.trim()}
                className="h-10 px-4 rounded-md bg-amber text-ink text-[12px] font-bold uppercase tracking-[0.04em] hover:bg-amber2 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <IconPlus size={15} /> Add Phone
              </button>
            </div>
          </section>

          {error && <p className="text-danger text-[13px] font-medium">{error}</p>}
        </div>
      )}
    </div>
  );
}
