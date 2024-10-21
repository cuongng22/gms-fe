import { Routes } from '@angular/router';
import { KeHoachComponent } from 'src/app/crew-trip/features/plan/ke-hoach/ke-hoach.component';
import { FirstPageComponent } from "src/app/crew-trip/features/first-page/first-page.component";
import { UsersComponent } from "src/app/crew-trip/features/users/users.component";
import { SignInComponent } from "src/app/crew-trip/core/auth/sign-in/sign-in.component";
import { RolesComponent } from "src/app/crew-trip/features/roles/roles.component";
import { AuthGuard } from "src/app/crew-trip/core/guards/menu.guard";
import { VehicleComponent } from "src/app/crew-trip/features/category/vehicle/vehicle.component";
import { HotelComponent } from "src/app/crew-trip/features/category/hotel/hotel.component";
import { NationComponent } from "src/app/crew-trip/features/category/nation/nation.component";
import { ServiceFeeComponent } from 'src/app/crew-trip/features/category/service-fee/service-fee.component';
import { CrewsComponent } from "src/app/crew-trip/features/category/crews/crews.component";
import { NotFoundComponent } from "src/app/not-found/not-found.component";
import { ForgotPasswordComponent } from "src/app/crew-trip/core/auth/forgot-password/forgot-password.component";
import { FunctionsComponent } from "src/app/crew-trip/features/functions/functions.component";
import { ContractComponent } from "src/app/crew-trip/features/contract/contract.component";
import { ProfileComponent } from "src/app/crew-trip/core/auth/profile/profile.component";
import { ResetPasswordComponent } from "src/app/crew-trip/core/auth/reset-password/reset-password.component";
import { FlightMarketComponent } from './crew-trip/features/category/flight-market/flight-market.component';
import { FlightMarketDetailComponent } from './crew-trip/features/category/flight-market/flight-market-detail/flight-market-detail.component';
import { FlightMarketListComponent } from './crew-trip/features/category/flight-market/flight-market-list/flight-market-list.component';
import { ActRateComponent } from "src/app/crew-trip/features/category/act-rate/act-rate.component";
import { RateUthComponent } from "src/app/crew-trip/features/plan/rate-uth/rate-uth.component";
import { RatePlannedComponent } from "src/app/crew-trip/features/plan/rate-planned/rate-planned.component";
import { CrewsDetailComponent } from './crew-trip/features/category/crews/crews-detail/crews-detail.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: "/ke-hoach",
    pathMatch: 'full',
  },
  {
    path: '',
    component: FirstPageComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'ke-hoach', component: KeHoachComponent },
      { path: 'contract', component: ContractComponent },
      {
        path: 'admin', children: [
          { path: 'users', component: UsersComponent },
          { path: 'roles', component: RolesComponent },
          { path: 'functions', component: FunctionsComponent },
        ]
      },
      {
        path: 'plan', children: [
          { path: 'rate/uth', component: RateUthComponent },
          { path: 'rate/planned', component: RatePlannedComponent },
        ]
      },
      {
        path: 'category', children: [
          { path: 'vehicle', component: VehicleComponent },
          { path: 'contract', component: ContractComponent },
          { path: 'act-rate', component: ActRateComponent },
          { path: 'hotel', component: HotelComponent },
          { path: 'nation', component: NationComponent },
          { path: 'service-fee', component: ServiceFeeComponent },
          { path: 'crews', component: CrewsComponent },
          { path: 'vehicle', component: VehicleComponent },
          { path: 'contract', component: ContractComponent },
          { path: 'hotel', component: HotelComponent },
          { path: 'nation', component: NationComponent },
          { path: 'service-fee', component: ServiceFeeComponent },
          {
            path: 'crews', component: CrewsComponent,
            children: [
              { path: '', component: CrewsComponent },
              { path: 'detail', component: CrewsDetailComponent },
            ]
          },
          {
            path: 'flight-market', component: FlightMarketComponent,
            children: [
              { path: '', component: FlightMarketListComponent },
              { path: 'detail', component: FlightMarketDetailComponent },
              { path: 'detail/:id', component: FlightMarketDetailComponent }
            ]
          },
        ]
      },
      { path: 'profile', component: ProfileComponent },
    ]
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: SignInComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent }
    ]
  },
  { path: '**', component: NotFoundComponent }

  /*,
  {
    path: '',
    component: FrontPagesComponent,
    children: [
      {path: '', component: HomeComponent},
      {path: 'features', component: FeaturesComponent},
      {path: 'team', component: TeamComponent},
      {path: 'faq', component: FaqComponent},
      {path: 'contact', component: ContactComponent}
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {path: '', component: EcommerceComponent},
      {path: 'crm', component: CrmComponent},
      {path: 'project-management', component: ProjectManagementComponent},
      {path: 'lms', component: LmsComponent},
      {path: 'helpdesk', component: HelpdeskComponent},
      {
        path: 'apps',
        component: AppsComponent,
        children: [
          {path: '', component: ToDoListComponent},
          {path: 'calendar', component: CalendarComponent},
          {path: 'contacts', component: ContactsComponent},
          {path: 'chat', component: ChatComponent},
          {
            path: 'email',
            component: EmailComponent,
            children: [
              {
                path: '',
                component: InboxComponent,
                children: [
                  {path: '', component: PrimaryEmailsComponent},
                  {path: 'promotions', component: PromotionsEmailsComponent}
                ]
              },
              {path: 'compose', component: ComposeComponent},
              {path: 'read', component: ReadComponent}
            ]
          },
          {path: 'kanban-board', component: KanbanBoardComponent},
          {
            path: 'file-manager',
            component: FileManagerComponent,
            children: [
              {path: '', component: MyDriveComponent},
              {path: 'language', component: AssetsComponent},
              {path: 'projects', component: ProjectsComponent},
              {path: 'personal', component: PersonalComponent},
              {path: 'applications', component: ApplicationsComponent},
              {path: 'documents', component: DocumentsComponent},
              {path: 'media', component: MediaComponent},
              {path: 'recents', component: RecentsComponent},
              {path: 'important', component: ImportantComponent}
            ]
          }
        ]
      },
      {
        path: 'ecommerce-page',
        component: EcommercePageComponent,
        children: [
          {path: '', component: EProductsGridComponent},
          {path: 'products-list', component: EProductsListComponent},
          {path: 'product-details', component: EProductDetailsComponent},
          {path: 'create-product', component: ECreateProductComponent},
          {path: 'edit-product', component: EEditProductComponent},
          {path: 'orders', component: EOrdersComponent},
          {path: 'order-details', component: EOrderDetailsComponent},
          {path: 'create-order', component: ECreateOrderComponent},
          {path: 'order-tracking', component: EOrderTrackingComponent},
          {path: 'customers', component: ECustomersComponent},
          {path: 'customer-details', component: ECustomerDetailsComponent},
          {path: 'cart', component: ECartComponent},
          {path: 'checkout', component: ECheckoutComponent},
          {path: 'sellers', component: ESellersComponent},
          {path: 'seller-details', component: ESellerDetailsComponent},
          {path: 'create-seller', component: ECreateSellerComponent},
          {path: 'categories', component: ECategoriesComponent},
          {path: 'reviews', component: EReviewsComponent},
          {path: 'refunds', component: ERefundsComponent}
        ]
      },
      {
        path: 'crm-page',
        component: CrmPageComponent,
        children: [
          {path: '', component: CContactsComponent},
          {path: 'customers', component: CCustomersComponent},
          {path: 'leads', component: CLeadsComponent},
          {path: 'deals', component: CDealsComponent}
        ]
      },
      {
        path: 'project-management-page',
        component: ProjectManagementPageComponent,
        children: [
          {path: '', component: PmProjectOverviewComponent},
          {path: 'projects-list', component: PmProjectsListComponent},
          {path: 'create-project', component: PmCreateProjectComponent},
          {path: 'clients', component: PmClientsComponent},
          {path: 'teams', component: PmTeamsComponent},
          {path: 'kanban-board', component: PmKanbanBoardComponent},
          {path: 'users', component: PmUsersComponent}
        ]
      },
      {
        path: 'lms-page',
        component: LmsPageComponent,
        children: [
          {path: '', component: LCoursesComponent},
          {path: 'course-details', component: LCourseDetailsComponent},
          {path: 'create-course', component: LCreateCourseComponent},
          {path: 'edit-course', component: LEditCourseComponent},
          {path: 'instructors', component: LInstructorsComponent},
          {path: 'lesson-preview', component: LLessonPreviewComponent}
        ]
      },
      {
        path: 'helpdesk-page',
        component: HelpdeskPageComponent,
        children: [
          {path: '', component: HdTicketsComponent},
          {path: 'ticket-details', component: HdTicketDetailsComponent},
          {path: 'agents', component: HdAgentsComponent},
          {path: 'reports', component: HdReportsComponent}
        ]
      },
      {
        path: 'events',
        component: EventsPageComponent,
        children: [
          {path: '', component: EventsGridComponent},
          {path: 'events-list', component: EventsListComponent},
          {path: 'event-details', component: EventDetailsComponent},
          {path: 'create-an-event', component: CreateAnEventComponent},
          {path: 'edit-an-event', component: EditAnEventComponent}
        ]
      },
      {
        path: 'social',
        component: SocialPageComponent,
        children: [
          {
            path: '',
            component: ProfileComponent,
            children: [
              {path: '', component: TimelineComponent},
              {path: 'about', component: AboutComponent},
              {path: 'activity', component: ActivityComponent}
            ]
          },
          {path: 'settings', component: ProfileSettingsComponent}
        ]
      },
      {
        path: 'invoices',
        component: InvoicesPageComponent,
        children: [
          {path: '', component: InvoicesComponent},
          {path: 'invoice-details', component: InvoiceDetailsComponent},
          {path: 'create-invoice', component: CreateInvoiceComponent},
          {path: 'edit-invoice', component: EditInvoiceComponent}
        ]
      },
      {
        path: 'users',
        component: UsersPageComponent,
        children: [
          {path: '', component: TeamMembersComponent},
          {path: 'users-list', component: UsersListComponent},
          {path: 'add-user', component: AddUserComponent}
        ]
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
        children: [
          {path: '', component: PUserProfileComponent},
          {path: 'teams', component: PTeamsComponent},
          {path: 'projects', component: PProjectsComponent}
        ]
      },
      {path: 'starter', component: StarterComponent},
      {
        path: 'icons',
        component: IconsComponent,
        children: [
          {path: '', component: MaterialSymbolsComponent},
          {path: 'remixicon', component: RemixiconComponent}
        ]
      },
      {
        path: 'ui-kit',
        component: UiElementsComponent,
        children: [
          {path: '', component: AlertsComponent},
          {path: 'autocomplete', component: AutocompleteComponent},
          {path: 'avatars', component: AvatarsComponent},
          {path: 'accordion', component: AccordionComponent},
          {path: 'badges', component: BadgesComponent},
          {path: 'breadcrumb', component: BreadcrumbComponent},
          {path: 'button-toggle', component: ButtonToggleComponent},
          {path: 'bottom-sheet', component: BottomSheetComponent},
          {path: 'buttons', component: ButtonsComponent},
          {path: 'card', component: CardComponent},
          {path: 'carousel', component: CarouselComponent},
          {path: 'checkbox', component: CheckboxComponent},
          {path: 'chips', component: ChipsComponent},
          {path: 'clipboard', component: ClipboardComponent},
          {path: 'color-picker', component: ColorPickerComponent},
          {path: 'datepicker', component: DatepickerComponent},
          {path: 'dialog', component: DialogComponent},
          {path: 'divider', component: DividerComponent},
          {path: 'drag-drop', component: DragDropComponent},
          {path: 'expansion', component: ExpansionComponent},
          {path: 'form-field', component: FormFieldComponent},
          {path: 'grid-list', component: GridListComponent},
          {path: 'input', component: InputComponent},
          {path: 'icon', component: IconComponent},
          {path: 'list', component: ListComponent},
          {path: 'listbox', component: ListboxComponent},
          {path: 'menus', component: MenusComponent},
          {path: 'pagination', component: PaginationComponent},
          {path: 'progress-bar', component: ProgressBarComponent},
          {path: 'radio', component: RadioComponent},
          {path: 'ratio', component: RatioComponent},
          {path: 'select', component: SelectComponent},
          {path: 'sidenav', component: SidenavComponent},
          {path: 'slide-toggle', component: SlideToggleComponent},
          {path: 'slider', component: SliderComponent},
          {path: 'snackbar', component: SnackbarComponent},
          {path: 'stepper', component: StepperComponent},
          {path: 'table', component: TableComponent},
          {path: 'tabs', component: TabsComponent},
          {path: 'toolbar', component: ToolbarComponent},
          {path: 'tooltip', component: TooltipComponent},
          {path: 'tree', component: TreeComponent},
          {path: 'typography', component: TypographyComponent},
          {path: 'videos', component: VideosComponent},
          {path: 'utilities', component: UtilitiesComponent}
        ]
      },
      {
        path: 'charts',
        component: ChartsComponent,
        children: [
          {path: '', component: LineChartsComponent},
          {path: 'area', component: AreaChartsComponent},
          {path: 'column', component: ColumnChartsComponent},
          {path: 'mixed', component: MixedChartsComponent},
          {path: 'radialbar', component: RadialbarChartsComponent},
          {path: 'radar', component: RadarChartsComponent},
          {path: 'pie', component: PieChartsComponent},
          {path: 'polar', component: PolarChartsComponent},
          {path: 'more', component: MoreChartsComponent}
        ]
      },
      {
        path: 'tables',
        component: TablesComponent,
        children: [
          {path: '', component: BasicTableComponent},
          {path: 'data-table', component: DataTableComponent}
        ]
      },
      {
        path: 'forms',
        component: FormsComponent,
        children: [
          {path: '', component: BasicElementsComponent},
          {path: 'advanced-elements', component: AdvancedElementsComponent},
          {path: 'wizard', component: WizardComponent},
          {path: 'editors', component: EditorsComponent},
          {path: 'file-uploader', component: FileUploaderComponent},
        ]
      },
      {path: 'timeline', component: TimelinePageComponent},
      {path: 'pricing', component: PricingPageComponent},
      {path: 'faq', component: FaqPageComponent},
      {path: 'gallery', component: GalleryPageComponent},
      {path: 'testimonials', component: TestimonialsPageComponent},
      {path: 'search', component: SearchPageComponent},
      {path: 'blank-page', component: BlankPageComponent},
      {path: 'internal-error', component: InternalErrorComponent},
      {path: 'widgets', component: WidgetsComponent},
      {path: 'maps', component: MapsPageComponent},
      {path: 'notifications', component: NotificationsPageComponent},
      {path: 'members', component: MembersPageComponent},
      {path: 'my-profile', component: MyProfileComponent},
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {path: '', component: AccountSettingsComponent},
          {path: 'change-password', component: ChangePasswordComponent},
          {path: 'connections', component: ConnectionsComponent},
          {path: 'privacy-policy', component: PrivacyPolicyComponent},
          {path: 'terms-conditions', component: TermsConditionsComponent}
        ]
      },
    ]
  },
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      {path: '', component: SignInComponent},
      {path: 'sign-up', component: SignUpComponent},
      {path: 'forgot-password', component: ForgotPasswordComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'confirm-email', component: ConfirmEmailComponent},
      {path: 'lock-screen', component: LockScreenComponent},
      {path: 'logout', component: LogoutComponent}
    ]
  },
  {path: 'coming-soon', component: ComingSoonComponent},
  // Here add new pages component

  {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list*/
];
