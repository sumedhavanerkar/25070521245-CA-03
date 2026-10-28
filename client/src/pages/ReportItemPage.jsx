import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, AlertCircle, MapPin, Calendar, FileText, Tag, Image, User, Phone, Mail } from 'lucide-react';
import { itemsApi } from '../services/api';
import { CATEGORIES, LOCATIONS } from '../utils/constants';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  title: '',
  description: '',
  category: '',
  location: '',
  eventDate: '',
  imageUrl: '',
  distinguishingFeatures: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
};

function FormField({ label, required, error, hint, children }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && <span className="form-hint">{hint}</span>}
      {error && (
        <span className="form-error" role="alert">
          <AlertCircle size={13} aria-hidden="true" /> {error}
        </span>
      )}
    </div>
  );
}

export default function ReportItemPage({ itemType }) {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  // No authentication required — this is an educational project
  const isEdit = !!editId;
  const isLost = itemType === 'lost';

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  // Load existing item for edit mode
  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await itemsApi.getById(editId);
        const item = res.data.data;
        setForm({
          title: item.title || '',
          description: item.description || '',
          category: item.category || '',
          location: item.location || '',
          eventDate: item.eventDate ? item.eventDate.slice(0, 10) : '',
          imageUrl: item.imageUrl || '',
          distinguishingFeatures: item.distinguishingFeatures || '',
          contactName: item.contactName || '',
          contactEmail: '',
          contactPhone: '',
        });
        if (item.imageUrl) setImagePreview(item.imageUrl);
      } catch {
        toast.error('Failed to load item for editing');
      }
    };
    load();
  }, [editId, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Item title is required';
    else if (form.title.trim().length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.category) e.category = 'Please select a category';
    if (!form.location) e.location = 'Please select a location';
    if (!form.eventDate) e.eventDate = `Date ${isLost ? 'lost' : 'found'} is required`;
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) e.contactEmail = 'Invalid email address';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleImageUrl = (url) => {
    setForm((f) => ({ ...f, imageUrl: url }));
    setImagePreview(url || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = document.querySelector('[role="alert"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        type: isEdit ? undefined : (isLost ? 'lost' : 'found'),
        eventDate: form.eventDate,
      };
      // Remove empty fields
      Object.keys(payload).forEach((k) => { if (payload[k] === '' || payload[k] === undefined) delete payload[k]; });

      let res;
      if (isEdit) {
        res = await itemsApi.update(editId, payload);
        toast.success('Item updated successfully!');
      } else {
        res = await itemsApi.create(payload);
        toast.success('Item reported successfully! 🎉');
      }

      navigate(`/items/${isEdit ? editId : res.data.data._id}`);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const title = isEdit ? 'Edit Item' : (isLost ? '🔴 Report Lost Item' : '🟢 Report Found Item');
  const subtitle = isEdit
    ? 'Update the details of your reported item.'
    : isLost
    ? 'Fill in the details below to report an item you lost on campus.'
    : 'Fill in the details below to report an item you found on campus.';

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - var(--nav-height))' }}>
      <div className="page-header">
        <div className="container">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="form-page">
        <form onSubmit={handleSubmit} noValidate aria-label={`${isEdit ? 'Edit' : 'Report'} item form`}>

          {/* Item Details */}
          <div className="form-section">
            <div className="form-section-title">
              <Tag size={18} color="var(--primary)" aria-hidden="true" />
              Item Details
            </div>
            <div className="form-grid">
              <div className="form-full">
                <FormField label="Item Name" required error={errors.title}>
                  <input
                    type="text"
                    name="title"
                    className={`form-control${errors.title ? ' error' : ''}`}
                    placeholder={isLost ? 'e.g., Black iPhone 13, Blue Water Bottle' : 'e.g., Found Blue Wallet, Keys with Red Tag'}
                    value={form.title}
                    onChange={handleChange}
                    maxLength={100}
                    aria-required="true"
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? 'title-error' : undefined}
                  />
                </FormField>
              </div>

              <FormField label="Category" required error={errors.category}>
                <select
                  name="category"
                  className={`form-control${errors.category ? ' error' : ''}`}
                  value={form.category}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.category}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormField>

              <FormField label={isLost ? 'Date Lost' : 'Date Found'} required error={errors.eventDate}>
                <input
                  type="date"
                  name="eventDate"
                  className={`form-control${errors.eventDate ? ' error' : ''}`}
                  value={form.eventDate}
                  onChange={handleChange}
                  max={today}
                  aria-required="true"
                  aria-invalid={!!errors.eventDate}
                />
              </FormField>

              <div className="form-full">
                <FormField label="Description" required error={errors.description} hint="Describe the item in detail — color, brand, size, any identifying marks.">
                  <textarea
                    name="description"
                    className={`form-control${errors.description ? ' error' : ''}`}
                    placeholder={isLost
                      ? 'Describe the item you lost — include color, brand, size, and any identifying marks...'
                      : 'Describe the item you found — include color, brand, size, and condition...'}
                    value={form.description}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={4}
                    aria-required="true"
                    aria-invalid={!!errors.description}
                  />
                </FormField>
              </div>

              <div className="form-full">
                <FormField label="Distinguishing Features" hint="Any unique marks, stickers, engravings, or damage that sets it apart.">
                  <textarea
                    name="distinguishingFeatures"
                    className="form-control"
                    placeholder="e.g., scratch on back cover, initials engraved, sunflower sticker..."
                    value={form.distinguishingFeatures}
                    onChange={handleChange}
                    maxLength={500}
                    rows={2}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <div className="form-section-title">
              <MapPin size={18} color="var(--primary)" aria-hidden="true" />
              Location
            </div>
            <div className="form-grid">
              <FormField label={isLost ? 'Where did you lose it?' : 'Where did you find it?'} required error={errors.location}>
                <select
                  name="location"
                  className={`form-control${errors.location ? ' error' : ''}`}
                  value={form.location}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.location}
                >
                  <option value="">Select campus location</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </FormField>
            </div>
          </div>

          {/* Image */}
          <div className="form-section">
            <div className="form-section-title">
              <Image size={18} color="var(--primary)" aria-hidden="true" />
              Image (Optional)
            </div>
            <FormField label="Image URL" hint="Paste a direct image URL (e.g., from Google Photos, Imgur, or any image hosting site). File upload support coming soon.">
              <input
                type="url"
                name="imageUrl"
                className="form-control"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) => handleImageUrl(e.target.value)}
              />
            </FormField>
            {imagePreview && (
              <div className="image-preview" style={{ marginTop: '0.875rem' }}>
                <img
                  src={imagePreview}
                  alt="Item preview"
                  onError={() => { setImagePreview(null); toast.error('Could not load image from that URL'); }}
                />
                <button
                  type="button"
                  className="image-preview-remove"
                  onClick={() => { setImagePreview(null); setForm((f) => ({ ...f, imageUrl: '' })); }}
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {!imagePreview && (
              <div className="image-upload-area" style={{ marginTop: '0.875rem', cursor: 'default' }}>
                <Upload size={32} aria-hidden="true" />
                <p>Add an image URL above to see a preview</p>
                <span>Images help others identify items quickly</span>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="form-section">
            <div className="form-section-title">
              <User size={18} color="var(--primary)" aria-hidden="true" />
              Contact Information (Private)
            </div>
            <div style={{ background: '#fffbeb', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#92400e', border: '1px solid #fde68a' }}>
              🔒 Your contact details are stored privately and will only be shared through our secure contact workflow. They will not appear publicly on the listing.
            </div>
            <div className="form-grid">
              <FormField label="Your Name" hint="How you'd like to be identified on the listing">
                <input
                  type="text"
                  name="contactName"
                  className="form-control"
                  placeholder="Your name or nickname"
                  value={form.contactName}
                  onChange={handleChange}
                  maxLength={60}
                />
              </FormField>

              <FormField label="Contact Email" error={errors.contactEmail} hint="Private — not shown publicly">
                <input
                  type="email"
                  name="contactEmail"
                  className={`form-control${errors.contactEmail ? ' error' : ''}`}
                  placeholder="your.email@college.edu"
                  value={form.contactEmail}
                  onChange={handleChange}
                  aria-invalid={!!errors.contactEmail}
                />
              </FormField>

              <FormField label="Contact Phone" hint="Optional — private, not shown publicly">
                <input
                  type="tel"
                  name="contactPhone"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </FormField>
            </div>
          </div>

          {/* Submit */}
          <div className="form-submit-section">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting
                ? (isEdit ? 'Saving...' : 'Reporting...')
                : (isEdit ? 'Save Changes' : `Submit ${isLost ? 'Lost' : 'Found'} Report`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
