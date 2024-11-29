type FieldOption = {
  label: string;
  value: string;
};

type EventField = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'datetime' | 'dropdown';
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
};
