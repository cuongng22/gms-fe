import { Injectable } from '@angular/core';
import sanitizeHtml from 'sanitize-html';

@Injectable({
  providedIn: 'root',
})
export class SanitizeService {
  constructor() {}

  sanitizeInput(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: ['p', 'b', 'strong', 'i', 'ul', 'ol', 'li', 'a'], // Chỉ cho phép các thẻ này
      allowedAttributes: {
        a: ['href', 'title'], // Chỉ cho phép thuộc tính href, title trên thẻ <a>
      },
      allowedSchemes: ['http', 'https'], // Chỉ chấp nhận http:// và https://
      allowedSchemesAppliedToAttributes: ['href'], // Áp dụng whitelist vào thuộc tính href
      disallowedTagsMode: 'discard', // Loại bỏ các thẻ không hợp lệ
    });
  }
}
