import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

interface UseAnalyticsReturn {
  /** Track a custom event */
  trackEvent: (eventName: string, params?: EventParams) => void;
  /** Track a page view (called automatically on route change) */
  trackPageView: (path?: string, title?: string) => void;
  /** Track CTA button clicks */
  trackCTAClick: (ctaText: string, ctaLocation: string) => void;
  /** Track form submissions */
  trackFormSubmit: (formName: string) => void;
  /** Track file downloads */
  trackDownload: (fileName: string, fileType?: string) => void;
  /** Track outbound link clicks */
  trackOutboundLink: (url: string, linkText?: string) => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if analytics consent was given
 */
const hasAnalyticsConsent = (): boolean => {
  try {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return false;
    const preferences = JSON.parse(consent);
    const analytics = preferences.find((c: { id: string; enabled: boolean }) => c.id === 'analytics');
    return analytics?.enabled ?? false;
  } catch {
    return false;
  }
};

/**
 * Push event to dataLayer
 */
const pushToDataLayer = (event: string, params: EventParams = {}): void => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
  });
};

// =============================================================================
// HOOK
// =============================================================================

/**
 * Analytics hook for tracking events via GTM/GA4
 *
 * Features:
 * - Automatic page view tracking on route changes
 * - Respects user consent (only tracks if analytics consent given)
 * - Pre-built methods for common events
 *
 * @example
 * const { trackCTAClick, trackFormSubmit } = useAnalytics();
 *
 * // Track CTA click
 * <button onClick={() => trackCTAClick('Termin buchen', 'hero')}>
 *   Termin buchen
 * </button>
 *
 * // Track form submit
 * const handleSubmit = () => {
 *   trackFormSubmit('contact_form');
 * };
 */
export const useAnalytics = (): UseAnalyticsReturn => {
  const location = useLocation();

  // =============================================================================
  // TRACK PAGE VIEW
  // =============================================================================

  const trackPageView = useCallback((path?: string, title?: string) => {
    const pagePath = path || location.pathname;
    const pageTitle = title || document.title;

    pushToDataLayer('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href,
    });
  }, [location.pathname]);

  // Automatic page view tracking on route change
  useEffect(() => {
    // Small delay to ensure page title is updated
    const timer = setTimeout(() => {
      trackPageView();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, trackPageView]);

  // =============================================================================
  // TRACK CUSTOM EVENT
  // =============================================================================

  const trackEvent = useCallback((eventName: string, params: EventParams = {}) => {
    // Still push to dataLayer even without consent
    // GTM will handle whether to forward to GA4 based on consent state
    pushToDataLayer(eventName, params);
  }, []);

  // =============================================================================
  // TRACK CTA CLICK
  // =============================================================================

  const trackCTAClick = useCallback((ctaText: string, ctaLocation: string) => {
    pushToDataLayer('cta_click', {
      cta_text: ctaText,
      cta_location: ctaLocation,
    });
  }, []);

  // =============================================================================
  // TRACK FORM SUBMIT
  // =============================================================================

  const trackFormSubmit = useCallback((formName: string) => {
    pushToDataLayer('contact_form_submit', {
      form_name: formName,
    });
  }, []);

  // =============================================================================
  // TRACK DOWNLOAD
  // =============================================================================

  const trackDownload = useCallback((fileName: string, fileType?: string) => {
    pushToDataLayer('download', {
      file_name: fileName,
      file_type: fileType || fileName.split('.').pop() || 'unknown',
    });
  }, []);

  // =============================================================================
  // TRACK OUTBOUND LINK
  // =============================================================================

  const trackOutboundLink = useCallback((url: string, linkText?: string) => {
    pushToDataLayer('outbound_link', {
      link_url: url,
      link_text: linkText,
    });
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackCTAClick,
    trackFormSubmit,
    trackDownload,
    trackOutboundLink,
  };
};

// =============================================================================
// STANDALONE FUNCTIONS (for use outside React components)
// =============================================================================

/**
 * Track event without React hook (for use in callbacks, event handlers, etc.)
 */
export const trackAnalyticsEvent = (eventName: string, params: EventParams = {}): void => {
  pushToDataLayer(eventName, params);
};

/**
 * Check if user has given analytics consent
 */
export const checkAnalyticsConsent = hasAnalyticsConsent;

export default useAnalytics;
