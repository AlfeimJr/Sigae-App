import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
@Component({
  selector: 'sigae-input-text',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    MessageModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextFloatComponent implements OnChanges {
  @Input() value: FormControl<string> = new FormControl(
    ''
  ) as FormControl<string>;
  @Input() mask: string | undefined;
  @Input() errorMessage: string = '';
  @Input() type: string = 'text';
  @Input() idLabel: string = '';
  @Input() showAddButton: boolean = false; // Controla a exibição do botão de "adicionar"
  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
  ngOnChanges(): void {}

  onAdd(): void {
    this.add.emit(); // Emite o evento para o componente pai
  }

  onRemove(): void {
    this.remove.emit(); // Emite o evento para o componente pai
  }
}
