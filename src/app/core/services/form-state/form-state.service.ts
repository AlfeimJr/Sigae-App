import { Injectable, signal, Signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormStateService implements FormStateService {
  private readonly STORAGE_KEY = 'formState';
  private formStateSignal = signal<any>(this.loadFromLocalStorage() || {});

  constructor() {
    effect(() => {
      this.saveToLocalStorage(this.formStateSignal());
    });
  }

  get formState(): Signal<any> {
    return this.formStateSignal.asReadonly();
  }

  updateFormState(updatedData: any) {
    this.formStateSignal.update((currentState) => ({
      ...currentState,
      ...updatedData,
    }));
  }

  resetFormState() {
    this.formStateSignal.set({});
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getFormState(): any {
    return this.formStateSignal();
  }

  private saveToLocalStorage(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadFromLocalStorage(): any {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : null;
  }
}
