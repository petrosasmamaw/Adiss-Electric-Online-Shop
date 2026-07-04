const DEFAULT_CONTACT_PHONES = [
  '+251911189171',
  '+25178942424',
  '+251974732323',
];

function normalizePhone(phone) {
  const raw = String(phone || '').trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('251')) return `+${digits}`;
  if (digits.startsWith('0')) return `+251${digits.slice(1)}`;
  return `+${digits}`;
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function sanitizePhones(phones) {
  if (!Array.isArray(phones)) return null;
  const seen = new Set();
  const cleaned = [];
  for (const entry of phones) {
    const normalized = normalizePhone(entry);
    if (!normalized || !isValidPhone(normalized) || seen.has(normalized)) continue;
    seen.add(normalized);
    cleaned.push(normalized);
  }
  return cleaned;
}

module.exports = {
  DEFAULT_CONTACT_PHONES,
  normalizePhone,
  isValidPhone,
  sanitizePhones,
};
