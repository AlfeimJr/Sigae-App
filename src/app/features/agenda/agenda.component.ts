import {
  Component,
  signal,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  Calendar,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarModule } from 'primeng/calendar';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Footer, MessageService, PrimeNGConfig } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateEventDialogComponent } from './create-event-dialog/create-event-dialog.component';
import { EventsService } from '../../core/services/events/events.service';
import { EventCalendar } from '../../shared/types/event-calendar';
@Component({
  selector: 'sigae-agenda',
  standalone: true,
  imports: [
    FullCalendarModule,
    CalendarModule,
    TranslateModule,
    ButtonModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PrimeNGConfig, DialogService, MessageService],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent implements OnInit, OnDestroy, AfterViewInit {
  calendarVisible = signal(true);
  datePipe = DatePipe;
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },

    dayHeaderFormat: { weekday: 'short' },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locales: [ptBrLocale],
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  });
  ref: DynamicDialogRef | undefined;
  currentEvents = signal<EventApi[]>([]);
  isEditEvent: boolean = false;
  private changeDetector = inject(ChangeDetectorRef);
  private config = inject(PrimeNGConfig);
  public dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private eventService = inject(EventsService);
  constructor() {}
  @ViewChild('fullCalendar') fullCalendarComponent!: FullCalendarComponent;
  ngOnInit(): void {
    this.applyConfigCalendar();
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  applyConfigCalendar() {
    this.config.setTranslation({
      apply: 'Aplicar',
      clear: 'Limpar',
      accept: 'Sim',
      reject: 'Não',
      firstDayOfWeek: 0,
      dayNames: [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
      ],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      weak: 'Semana',
      weekHeader: 'Sem',
      monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
      today: 'Hoje',
    });
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.openDialog(selectInfo);
  }
  openDialog(selectInfo?: DateSelectArg | EventClickArg) {
    let dateSelectArg = selectInfo as DateSelectArg;
    let eventClickArg = selectInfo as EventClickArg;
    this.ref = this.dialogService.open(CreateEventDialogComponent, {
      header: 'Criar evento',
      width: '30vw',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      templates: {
        footer: Footer,
      },
      data: {
        startDate: dateSelectArg?.start || eventClickArg?.event.start || null,
        endDate: dateSelectArg?.end || eventClickArg?.event.end || null,
        color: eventClickArg?.event ? eventClickArg?.event.backgroundColor : '',
        title: eventClickArg?.event ? eventClickArg?.event.title : '',
        description: eventClickArg?.event
          ? eventClickArg?.event.extendedProps['description']
          : '',
      },
    });
    this.ref.onClose.subscribe(
      (data: {
        color: string;
        description: string;
        endDate: Date;
        startDate: Date;
        title: string;
      }) => {
        if (data) {
          const newEvent: EventCalendar = {
            title: data.title,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate?.toISOString(),
            description: data.description,
            color: data.color,
          };
          eventClickArg.event
            ? this.updateEvent(eventClickArg, newEvent)
            : this.createEvent(dateSelectArg, newEvent);
        }
      }
    );
  }

  createEvent(event: DateSelectArg, newEvent: EventCalendar) {
    this.eventService.createEvent(newEvent).subscribe({
      next: (createdEvent) => {
        const calendarApi = this.fullCalendarComponent.getApi();
        calendarApi?.addEvent({
          id: createdEvent.id,
          title: createdEvent.title,
          start: createdEvent.startDate,
          end: createdEvent.endDate,
          backgroundColor: createdEvent.color,
          extendedProps: { description: createdEvent.description },
        });
      },
    });
  }

  updateEvent(eventClickArg: EventClickArg, newEvent: EventCalendar) {
    this.eventService.updateEvent(eventClickArg?.event.id, newEvent).subscribe({
      next: (updatedEvent) => {
        const calendarApi = this.fullCalendarComponent.getApi();

        const existingEvent = calendarApi?.getEventById(
          updatedEvent.id as string
        );

        if (existingEvent) {
          existingEvent.setProp('title', updatedEvent.title);
          existingEvent.setStart(updatedEvent.startDate);
          existingEvent.setEnd(updatedEvent.endDate as string);
          existingEvent.setProp('backgroundColor', updatedEvent.color);
          existingEvent.setExtendedProp(
            'description',
            updatedEvent.description
          );
        }
      },
    });
    this.isEditEvent = false;
  }

  addEvent() {
    this.openDialog();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        const calendarEvents = events.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          backgroundColor: event.color,
          extendedProps: { description: event.description },
        }));
        const calendarApi = this.fullCalendarComponent.getApi();
        calendarApi?.removeAllEvents();
        calendarApi?.addEventSource(calendarEvents);
      },
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.openDialog(clickInfo);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  getTodayEvents(): EventApi[] {
    const today = new Date();
    return this.currentEvents().filter((event) => {
      const eventDate = new Date(event.start!).setHours(0, 0, 0, 0);
      return eventDate === today.setHours(0, 0, 0, 0);
    });
  }

  getOtherEvents(): EventApi[] {
    const today = new Date();
    return this.currentEvents().filter((event) => {
      const eventDate = new Date(event.start!).setHours(0, 0, 0, 0);
      return eventDate !== today.setHours(0, 0, 0, 0);
    });
  }
  onDateSelected(date: Date) {
    this.calendarOptions.update((options) => ({
      ...options,
      initialView: 'timeGridDay',
    }));

    const calendarApi = this.fullCalendarComponent.getApi();
    if (calendarApi) {
      calendarApi.changeView('timeGridDay');
      calendarApi.gotoDate(date);
    }
  }

  getCalendarApi(): Calendar | null {
    const calendarContainer = document.querySelector(
      'full-calendar'
    ) as HTMLElement & { getApi?: () => Calendar };
    return calendarContainer?.getApi ? calendarContainer.getApi() : null;
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
