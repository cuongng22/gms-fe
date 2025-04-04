import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UsersService } from '../../core/services/users-service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private permissionCodes: string[];

  constructor(
    private readonly usersService: UsersService,
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainerRef: ViewContainerRef
  ) { }

  @Input()
  set appHasPermission(value: string | string[]) {
    debugger
    this.permissionCodes = typeof value === 'string' ? [value] : value;
    this.updateView();
  }

  private updateView(): void {
    const check = this.usersService.hasPermission(this.permissionCodes);
    this.viewContainerRef.clear();
    if (check) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
