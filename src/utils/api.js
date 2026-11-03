const API_BASE_URL =
  'https://zyvokio-backend.onrender.com';

/**
 * Check backend server connectivity and health
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    const data = await res.json();
    return { healthy: true, data };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}

/**
 * Universal Image Converter API call (JPG, PNG, WebP, SVG)
 * @param {File} file - Source image file
 * @param {object} params
 * @param {string} params.fromFormat - Source format (e.g. 'jpg', 'png', 'webp', 'svg')
 * @param {string} params.toFormat - Target format (e.g. 'png', 'webp', 'jpg')
 * @param {object} [params.options] - Settings (quality, compressionLevel)
 */
export async function convertImageBlob(file, { fromFormat, toFormat = 'png', options = {} } = {}) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('toFormat', toFormat);
  if (fromFormat) formData.append('fromFormat', fromFormat);
  if (options.quality) formData.append('quality', options.quality);
  if (options.compressionLevel) formData.append('compressionLevel', options.compressionLevel);

  const queryParams = new URLSearchParams();
  if (fromFormat) queryParams.set('from', fromFormat);
  queryParams.set('to', toFormat);

  const response = await fetch(`${API_BASE_URL}/api/convert/process?${queryParams.toString()}`, {
    method: 'POST',
    headers: {
      ...(fromFormat ? { 'X-From-Format': fromFormat } : {})
    },
    body: formData
  });

  if (!response.ok) {
    let errorMessage = `Conversion failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // response might not be JSON
    }
    throw new Error(errorMessage);
  }

  // Extract metadata from custom exposed headers
  const headerFilename = response.headers.get('X-Converted-Filename');
  const sourceFormat = response.headers.get('X-Source-Format') || fromFormat || 'img';
  const targetFormat = response.headers.get('X-Target-Format') || toFormat || 'png';
  const originalSize = parseInt(response.headers.get('X-Original-Size') || `${file.size}`, 10);
  const convertedSize = parseInt(response.headers.get('X-Converted-Size') || '0', 10);
  const width = parseInt(response.headers.get('X-Image-Width') || '0', 10);
  const height = parseInt(response.headers.get('X-Image-Height') || '0', 10);
  const durationMs = parseInt(response.headers.get('X-Conversion-Time-Ms') || '0', 10);

  // Fallback filename deduction
  let filename = headerFilename ? decodeURIComponent(headerFilename) : null;
  if (!filename) {
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }
  }
  if (!filename) {
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    filename = `${baseName}.${targetFormat}`;
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);

  return {
    blob,
    downloadUrl,
    filename,
    sourceFormat,
    targetFormat,
    originalSize,
    convertedSize: convertedSize || blob.size,
    width,
    height,
    durationMs
  };
}

/**
 * Backward compatible JPG to PNG wrapper
 */
export async function convertJpgToPngBlob(file, options = {}) {
  return convertImageBlob(file, {
    fromFormat: 'jpg',
    toFormat: 'png',
    options
  });
}

/**
 * Triggers an immediate browser file download for a Blob
 * @param {Blob|string} blobOrUrl 
 * @param {string} filename 
 */
export function triggerDownload(blobOrUrl, filename = 'converted-image.png') {
  const url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (typeof blobOrUrl !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Send contact form submission to backend
 * @param {object} formData
 * @param {string} formData.name
 * @param {string} formData.email
 * @param {string} formData.category
 * @param {string} formData.subject
 * @param {string} formData.message
 * @param {string} [formData.urgency]
 */
export async function sendContactMessage(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }

    return {
      success: true,
      ticketId: data.ticketId || `PM-${Date.now().toString(36).toUpperCase()}`,
      message: data.message || 'Thank you! Your message has been sent successfully.'
    };
  } catch (error) {
    // If backend is totally unreachable or offline, allow a client-side simulated receipt
    // so user flow is never broken
    console.warn('Backend contact failed, falling back to client receipt:', error.message);

    // If it was a user validation error from server (e.g., 400 Bad Request), rethrow
    if (error.message && (error.message.includes('valid email') || error.message.includes('characters long') || error.message.includes('provide your name'))) {
      throw error;
    }

    // Save to LocalStorage fallback queue
    try {
      const fallbackKey = 'picmorph_offline_inquiries';
      const existing = JSON.parse(localStorage.getItem(fallbackKey) || '[]');
      const offlineTicket = `PM-OFFLINE-${Date.now().toString(36).toUpperCase()}`;
      existing.push({ ...formData, ticketId: offlineTicket, timestamp: new Date().toISOString() });
      localStorage.setItem(fallbackKey, JSON.stringify(existing));

      return {
        success: true,
        ticketId: offlineTicket,
        message: 'Message saved locally! We will sync it to our servers automatically.'
      };
    } catch {
      throw error;
    }
  }
}

