import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchControls, updateControls } from '../../store/controlsSlice';
import { showToast } from '../../store/toastSlice';

function ToggleRow({ title, description, enabled, onToggle, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-white rounded-xl border border-border p-4">
      <div>
        <p className="font-sans font-semibold text-[14px] text-ink">{title}</p>
        <p className="font-sans text-[12px] text-muted mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-150 ${
          enabled ? 'bg-amber' : 'bg-border'
        } ${disabled ? 'opacity-60 cursor-wait' : ''}`}
        aria-pressed={enabled}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-150 ${
            enabled ? 'translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function ControlManager() {
  const dispatch = useDispatch();
  const { products_enabled, price_visible, loading, saving, error } = useSelector(
    (state) => state.controls
  );

  useEffect(() => {
    dispatch(fetchControls())
      .unwrap()
      .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
  }, [dispatch]);

  const update = (next) => {
    dispatch(updateControls(next))
      .unwrap()
      .then(() => dispatch(showToast('Controls updated.', 'success')))
      .catch((err) => dispatch(showToast(`Error: ${err}`, 'error', 5000)));
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
        </div>
      ) : (
        <div className="space-y-3">
          <ToggleRow
            title="Display Products"
            description={
              products_enabled
                ? 'ON: products are visible on website.'
                : 'OFF: website shows \"The products are holded\".'
            }
            enabled={products_enabled}
            disabled={saving}
            onToggle={() =>
              update({ products_enabled: !products_enabled, price_visible })
            }
          />
          <ToggleRow
            title="Display Price"
            description={
              price_visible
                ? 'ON: product prices are visible.'
                : 'OFF: shows \"Price not available, contact admin\".'
            }
            enabled={price_visible}
            disabled={saving}
            onToggle={() =>
              update({ products_enabled, price_visible: !price_visible })
            }
          />
          {error && <p className="text-danger text-[13px] font-medium">{error}</p>}
        </div>
      )}
    </div>
  );
}

