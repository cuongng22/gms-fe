import { inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANGUAGE, MESSAGE } from '../crew-trip/shared/utils/constant';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  translate = inject(TranslateService);
  constructor (){
    super();
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);

    // Tùy chỉnh văn bản cho "Items per page"
    this.itemsPerPageLabel = MESSAGE.ITEMS_PER_PAGE;
 

    // Bạn có thể tùy chỉnh thêm các văn bản khác tại đây
    this.nextPageLabel = MESSAGE.NEXT_PAGE

    this.previousPageLabel = MESSAGE.PRIVIOUS_PAGE;
  }
  
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
    
  };
}
