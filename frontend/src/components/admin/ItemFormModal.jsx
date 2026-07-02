import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconUpload, IconX, IconLoader2, IconPhotoX } from '@tabler/icons-react';
import { closeItemModal, createItem, updateItem } from '../../store/adminSlice';
import { showToast } from '../../store/toastSlice';
import api from '../../api/axiosConfig';
import CategoryInput from '../CategoryInput';
import ModalShell from '../ModalShell';

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

const emptyForm = {
  name: '',
  category: '',
  lower_price: '',
  upper_price: '',
  description: '',
  image_url: null,
};

export default function ItemFormModal() {
  const dispatch = useDispatch();
  const { open, editItem } = useSelector((state) => state.admin.modal);
  const saving = useSelector((state) => state.admin.saving);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageMode, setImageMode] = useState('upload');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const isEdit = !!editItem;

  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          name: editItem.name || '',
          category: editItem.category || '',
          lower_price: (editItem.lower_price ?? editItem.price)?.toString() || '',
          upper_price: (editItem.upper_price ?? editItem.price)?.toString() || '',
          description: editItem.description || '',
          image_url: editItem.image_url || null,
        });
        setPreviewUrl(editItem.image_url || null);
        setUrlInput(editItem.image_url || '');
      } else {
        setForm(emptyForm);
        setPreviewUrl(null);
        setUrlInput('');
      }
      setImageFile(null);
      setImageMode('upload');
      setErrors({});
      setSaveError(null);
      setUploadError(null);
    }
  }, [open, editItem]);

  const handleClose = () => {
    dispatch(closeItemModal());
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setUrlInput('');
    setForm((prev) => ({ ...prev, image_url: null }));
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    const url = urlInput.trim();
    if (!url) {
      setUploadError('Image URL is required');
      return;
    }
    if (!/^https?:\/\/.+/i.test(url)) {
      setUploadError('Please enter a valid image URL (http/https)');
      return;
    }
    setUploadError(null);
    setImageFile(null);
    setPreviewUrl(url);
    setForm((prev) => ({ ...prev, image_url: url }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.category.trim()) next.category = 'Category is required';
    if (form.lower_price === '' || form.lower_price == null) {
      next.lower_price = 'Lower price is required';
    } else if (parseFloat(form.lower_price) < 0) {
      next.lower_price = 'Lower price must be 0 or greater';
    }
    if (form.upper_price === '' || form.upper_price == null) {
      next.upper_price = 'Upper price is required';
    } else if (parseFloat(form.upper_price) < 0) {
      next.upper_price = 'Upper price must be 0 or greater';
    }
    if (
      form.lower_price !== '' &&
      form.upper_price !== '' &&
      parseFloat(form.lower_price) > parseFloat(form.upper_price)
    ) {
      next.upper_price = 'Upper price must be greater than or equal to lower price';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaveError(null);
    setUploadError(null);

    let imageUrl = isEdit ? form.image_url : null;

    if (imageMode === 'url' && urlInput.trim()) {
      imageUrl = urlInput.trim();
    }

    if (imageFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const { data } = await api.post('/items/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = data.data.url;
        setPreviewUrl(imageUrl);
      } catch {
        setUploadError('Upload failed');
        imageUrl = isEdit ? form.image_url : null;
      } finally {
        setUploading(false);
      }
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      lower_price: parseFloat(form.lower_price),
      upper_price: parseFloat(form.upper_price),
      description: form.description.trim() || null,
      image_url: imageUrl,
    };

    try {
      if (isEdit) {
        await dispatch(updateItem({ id: editItem.id, ...payload })).unwrap();
      } else {
        await dispatch(createItem(payload)).unwrap();
      }
      dispatch(showToast('Item saved.', 'success'));
    } catch (err) {
      const msg = err || 'Failed to save item';
      setSaveError(msg);
      dispatch(showToast(`Error: ${msg}`, 'error', 5000));
    }
  };

  const labelClass =
    'block font-sans font-semibold text-[12px] text-ink3 uppercase tracking-[0.04em] mb-1.5';
  const inputBase =
    'w-full px-3.5 py-2.5 rounded-md bg-white font-sans text-[13px] text-ink placeholder:text-muted outline-none transition-colors duration-150';
  const inputClass = (hasError) =>
    `${inputBase} border ${
      hasError
        ? 'border-danger focus:border-danger'
        : 'border-border focus:border-amber focus:ring-2 focus:ring-amber/15'
    }`;

  return (
    <ModalShell isOpen={open} onClose={handleClose} maxWidthClass="md:max-w-[480px]">
      {({ onClose }) => (
        <div className="bg-white rounded-t-[20px] md:rounded-xl border border-border overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-white z-10">
            <h2 className="font-condensed font-bold text-[20px] text-ink pr-4">
              {isEdit ? `Edit Item — ${editItem.name}` : 'Add New Item'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-smoke hover:bg-border transition-colors duration-150 text-muted text-sm font-bold flex items-center justify-center shrink-0"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-5">
            {saveError && (
              <div className="mb-3.5 px-4 py-3 rounded-md bg-[#FDEAEA] border border-danger/20 text-danger text-[13px] font-medium">
                {saveError}
              </div>
            )}

            <div className="mb-3.5">
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass(errors.name)}
              />
              {errors.name && (
                <p className="text-danger text-[11px] mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            <div className="mb-3.5">
              <label className={labelClass}>Category</label>
              <CategoryInput
                value={form.category}
                onChange={(val) => setForm({ ...form, category: val })}
                error={errors.category}
              />
            </div>

            <div className="mb-3.5">
              <label className={labelClass}>Lower Price (ETB)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.lower_price}
                onChange={(e) => setForm({ ...form, lower_price: e.target.value })}
                className={inputClass(errors.lower_price)}
              />
              {errors.lower_price && (
                <p className="text-danger text-[11px] mt-1 font-medium">{errors.lower_price}</p>
              )}
            </div>

            <div className="mb-3.5">
              <label className={labelClass}>Upper Price (ETB)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.upper_price}
                onChange={(e) => setForm({ ...form, upper_price: e.target.value })}
                className={inputClass(errors.upper_price)}
              />
              {errors.upper_price && (
                <p className="text-danger text-[11px] mt-1 font-medium">{errors.upper_price}</p>
              )}
            </div>

            <div className="mb-3.5">
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClass(false)} resize-none`}
              />
            </div>

            <div className="mb-4">
              <label className={labelClass}>Image</label>
              <div className="mb-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setImageMode('upload');
                    setUploadError(null);
                  }}
                  className={`h-9 px-4 rounded-md border text-[12px] font-semibold uppercase tracking-[0.04em] transition-colors duration-150 ${
                    imageMode === 'upload'
                      ? 'bg-transparent border-ink text-ink'
                      : 'bg-white border-border text-muted hover:text-ink'
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageMode('url');
                    setUploadError(null);
                  }}
                  className={`h-9 px-4 rounded-md border text-[12px] font-semibold uppercase tracking-[0.04em] transition-colors duration-150 ${
                    imageMode === 'url'
                      ? 'bg-transparent border-ink text-ink'
                      : 'bg-white border-border text-muted hover:text-ink'
                  }`}
                >
                  URL
                </button>
              </div>

              <input
                id="item-image-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading || saving}
                className="hidden"
              />

              {imageMode === 'url' && (
                <div className="mb-3 flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className={`${inputClass(false)} h-10`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="h-10 px-4 rounded-md border border-border text-ink text-[12px] font-semibold uppercase tracking-[0.04em] hover:border-ink transition-colors duration-150"
                  >
                    Use
                  </button>
                </div>
              )}

              {uploadError && !uploading ? (
                <div className="bg-[#FDEAEA] rounded-xl h-32 flex flex-col items-center justify-center">
                  <IconPhotoX size={24} className="text-danger mb-1" />
                  <p className="text-danger text-[12px]">Upload failed</p>
                  <label
                    htmlFor="item-image-input"
                    className="text-danger text-[11px] underline cursor-pointer mt-1"
                  >
                    Retry
                  </label>
                </div>
              ) : previewUrl ? (
                <div className="h-32 rounded-xl overflow-hidden relative">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  {imageMode === 'upload' ? (
                    <label
                      htmlFor="item-image-input"
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer"
                      aria-label="Replace image"
                    >
                      <IconX size={12} />
                    </label>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setUrlInput('');
                        setPreviewUrl(null);
                        setForm((prev) => ({ ...prev, image_url: null }));
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
                      aria-label="Clear image URL"
                    >
                      <IconX size={12} />
                    </button>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-ink/50 rounded-xl flex flex-col items-center justify-center gap-1">
                      <IconLoader2 size={24} className="text-amber animate-spin" />
                      <span className="text-white text-[11px]">Uploading...</span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {imageMode === 'upload' ? (
                    <label
                      htmlFor="item-image-input"
                      className="h-32 rounded-xl border-2 border-dashed border-border bg-smoke flex flex-col items-center justify-center gap-1 hover:border-amber hover:bg-amber-tint transition-colors cursor-pointer"
                    >
                      <IconUpload size={24} className="text-muted" />
                      <span className="text-muted text-[12px]">Upload image</span>
                      <span className="text-[#aaa] text-[11px]">(optional)</span>
                    </label>
                  ) : (
                    <div className="h-32 rounded-xl border border-border bg-smoke flex flex-col items-center justify-center gap-1 text-center px-4">
                      <IconUpload size={24} className="text-muted" />
                      <span className="text-muted text-[12px]">Paste image URL then click Use</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={saving || uploading}
                className="flex-1 h-10 bg-transparent border border-border text-muted text-sm font-semibold rounded-md hover:border-ink hover:text-ink transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className={`flex-1 h-10 border-none text-ink text-sm font-bold rounded-md transition-colors duration-150 flex items-center justify-center ${
                  saving || uploading ? 'bg-amber/70 cursor-wait' : 'bg-amber hover:bg-amber2'
                }`}
              >
                {saving || uploading ? <Spinner /> : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </ModalShell>
  );
}
