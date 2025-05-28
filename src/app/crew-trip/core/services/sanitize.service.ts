import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root',
})
export class SanitizeService {
  constructor(private sanitizer: DomSanitizer) {}

  sanitize(htmlContent: string): SafeHtml {
    const config = {
      ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'div', 'span', 'ul', 'li', 'br'],
      ALLOWED_ATTR: ['href', 'class', 'style'],
      ALLOWED_URI_REGEXP: /^(https?:\/\/)/i,
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onchange', 'onmouseover', 'onmouseout'],
      KEEP_CONTENT: true
    };
    // Decode HTML entities trước khi sanitize
    const decodedContent = this.decodeHtml(htmlContent || '');
    const cleanHtml = DOMPurify.sanitize(decodedContent, config);
    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  sanitizeToString(htmlContent: string): string {
    const config = {
      ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'div', 'span', 'ul', 'li', 'br'],
      ALLOWED_ATTR: ['href', 'class', 'style'],
      ALLOWED_URI_REGEXP: /^(https?:\/\/)/i,
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onchange', 'onmouseover', 'onmouseout'],
      KEEP_CONTENT: true
    };
    // Decode HTML entities trước khi sanitize
    const decodedContent = this.decodeHtml(htmlContent || '');
    return DOMPurify.sanitize(decodedContent, config);
  }

  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
