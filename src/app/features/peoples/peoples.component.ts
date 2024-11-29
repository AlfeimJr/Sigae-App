import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { People } from '../../shared/types/people';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'primeng/steps';
import { filter } from 'rxjs';
import { PeopleService } from '../../core/services/people/people.service';
import { FormStateService } from '../../core/services/form-state/form-state.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'sigae-peoples',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    CommonModule,
    RouterOutlet,
    StepsModule,
    ToastModule,
  ],
  templateUrl: './peoples.component.html',
  providers: [MessageService],
  styleUrl: './peoples.component.scss',
})
export class PeoplesComponent implements OnInit {
  router: Router = inject(Router);
  isAddPeople = signal<boolean>(false);
  peoples: People[] = [];
  private peopleService = inject(PeopleService);
  private formStateService = inject(FormStateService);
  private messageService = inject(MessageService);
  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects;

        if (!currentRoute.startsWith('/peoples/add')) {
          this.isAddPeople.set(false);
          this.getPeoples();
          this.formStateService.resetFormState();
        } else {
          this.isAddPeople.set(true);
        }
      });
  }

  ngOnInit(): void {}

  editPeople(people: People) {
    if (!people.id) return;
    this.peopleService.getPersonById(people.id).subscribe({
      next: (res) => {
        this.router.navigateByUrl(`/peoples/add/${people.id}`);
        let teste = Object.values(res.people);
        const updatedPeople = teste.map((item) => {
          const { id, ...rest } = item;
          return rest;
        });
        const obj = updatedPeople.reduce(
          (acc: { [key in string]: People }, item, index) => {
            acc[index] = item;
            return acc;
          },
          {}
        );

        localStorage.setItem('formState', JSON.stringify(obj));
      },
    });
  }

  deletePeople(peoples: People) {
    if (!peoples.id) return;
    this.peopleService.deletePeople(peoples.id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: 'Pessoa excluida com sucesso.',
        });
        this.getPeoples();
      },
    });
  }

  addPeople() {
    this.isAddPeople.set(true);
    this.router.navigateByUrl('/peoples/add');
  }

  getPeoples() {
    this.peopleService.getPeople().subscribe({
      next: (res) => {
        this.peoples = res.people;
      },
    });
  }
}
