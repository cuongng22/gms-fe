import {Component, inject, OnInit} from '@angular/core';
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {FormBuilder} from "@angular/forms";
import {CrewsService} from "src/app/crew-trip/core/services/crews-service";

@Component({
  selector: 'app-crews',
  standalone: true,
  imports: [],
  templateUrl: './crews.component.html',
  styleUrl: './crews.component.scss'
})
export class CrewsComponent extends CommonComponent implements OnInit{
  override baseService = inject(CrewsService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);
}
