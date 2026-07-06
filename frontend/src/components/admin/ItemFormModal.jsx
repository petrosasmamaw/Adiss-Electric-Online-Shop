import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconUpload, IconX, IconLoader2, IconPhotoX } from '@tabler/icons-react';
import { closeItemModal, createItem, updateItem } from '../../store/adminSlice';
import { showToast } from '../../store/toastSlice';
import api from '../../api/axiosConfig';
import CategoryInput from '../CategoryInput';
import ModalShell from '../ModalShell';
import { getItemImages, MAX_ITEM_IMAGES } from '../../utils/itemImages';

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
};

function createImageEntry({ preview, url = null, file = null }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    preview,
    url,
    file,
  };
}

function readFilePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/items/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.url;
}

export default function ItemFormModal() {
  const dispatch = useDispatch();
  const { open, editItem } = useSelector((state) => state.admin.modal);
  const saving = useSelector((state) => state.admin.saving);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imageMode, setImageMode] = useState('upload');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const isEdit = !!editItem;
  const slotsLeft = MAX_ITEM_IMAGES - images.length;

  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          name: editItem.name || '',
          category: editItem.category || '',
          lower_price: (editItem.lower_price ?? editItem.price)?.toString() || '',
          upper_price: (editItem.upper_price ?? editItem.price)?.toString() || '',
          description: editItem.description || '',
        });
        setImages(
          getItemImages(editItem).map((url) => createImageEntry({ preview: url, url }))
        );
      } else {
        setForm(emptyForm);
        setImages([]);
      }
      setUrlInput('');
      setImageMode('upload');
      setErrors({});
      setSaveError(null);
      setUploadError(null);
    }
  }, [open, editItem]);

  const handleClose = () => {
    dispatch(closeItemModal());
  };

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;

    const remaining = MAX_ITEM_IMAGES - images.length;
    if (remaining <= 0) {
      setUploadError(`You can upload up to ${MAX_ITEM_IMAGES} images per item.`);
      return;
    }

    setUploadError(null);
    const selected = files.slice(0, remaining);

    try {
      const entries = await Promise.all(
        selected.map(async (file) => {
          const preview = await readFilePreview(file);
          return createImageEntry({ preview, file });
        })
      );
      setImages((prev) => [...prev, ...entries]);
    } catch {
      setUploadError('Failed to read selected image(s).');
    }
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
    if (images.length >= MAX_ITEM_IMAGES) {
      setUploadError(`You can add up to ${MAX_ITEM_IMAGES} images per item.`);
      return;
    }

    setUploadError(null);
    setImages((prev) => [...prev, createImageEntry({ preview: url, url })]);
    setUrlInput('');
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
    setUploadError(null);
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
    setUploading(true);

    try {
      const imageUrls = [];

      for (const image of images) {
        if (image.file) {
          const uploadedUrl = await uploadImageFile(image.file);
          imageUrls.push(uploadedUrl);
        } else if (image.url) {
          imageUrls.push(image.url);
        }
      }

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        lower_price: parseFloat(form.lower_price),
        upper_price: parseFloat(form.upper_price),
        description: form.description.trim() || null,
        image_urls: imageUrls,
        image_url: imageUrls[0] || null,
      };

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
    } finally {
      setUploading(false);
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
    <ModalShell isOpen={open} onClose={handleClose} maxWidthClass="md:max-w-[560px]">
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
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className={labelClass}>Images</label>
                <span className="text-[11px] font-semibold text-muted">
                  {images.length}/{MAX_ITEM_IMAGES}
                </span>
              </div>

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
                multiple
                onChange={handleFilesChange}
                disabled={uploading || saving || slotsLeft <= 0}
                className="hidden"
              />

              {imageMode === 'url' && slotsLeft > 0 && (
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
                    Add
                  </button>
                </div>
              )}

              {uploadError && (
                <div className="mb-3 px-3 py-2 rounded-md bg-[#FDEAEA] border border-danger/20 text-danger text-[12px] font-medium flex items-center gap-2">
                  <IconPhotoX size={16} className="shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative h-24 rounded-lg overflow-hidden border border-border bg-smoke"
                    >
                      <img
                        src={image.preview}
                        alt={`Item image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/75 transition-colors"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <IconX size={12} />
                      </button>
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px] font-bold">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {slotsLeft > 0 && imageMode === 'upload' && (
                <label
                  htmlFor="item-image-input"
                  className="h-28 rounded-xl border-2 border-dashed border-border bg-smoke flex flex-col items-center justify-center gap-1 hover:border-amber hover:bg-amber-tint transition-colors cursor-pointer"
                >
                  <IconUpload size={24} className="text-muted" />
                  <span className="text-muted text-[12px]">
                    {images.length === 0 ? 'Upload images' : 'Add more images'}
                  </span>
                  <span className="text-[#aaa] text-[11px]">
                    Up to {slotsLeft} more (max {MAX_ITEM_IMAGES})
                  </span>
                </label>
              )}

              {slotsLeft <= 0 && (
                <p className="text-[11px] text-muted font-medium">
                  Maximum of {MAX_ITEM_IMAGES} images reached. Remove one to add another.
                </p>
              )}

              {uploading && (
                <div className="mt-3 flex items-center gap-2 text-[12px] text-muted font-medium">
                  <IconLoader2 size={16} className="text-amber animate-spin" />
                  Uploading images...
                </div>
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
