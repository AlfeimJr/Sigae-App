import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'sigae-dropdown-select',
  standalone: true,
  imports: [DropdownModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dropdown-select.component.html',
  styleUrl: './dropdown-select.component.scss',
})
export class DropdownSelectComponent {
  @Input() control = new FormControl<string>('');
  @Input() options: any[] = [];
  @Input() placeHolder: string = '';
  @Input() label: string = '';
  @Input() errorMessage: string = '';
}
