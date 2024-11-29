export type FormField = {
  label: string; // Rótulo do campo
  name: string; // Nome do campo
  type: string; // Tipo do campo (ex: text, email, dropdown)
  required?: boolean; // Indica se o campo é obrigatório
  mask?: string; // Máscara opcional (ex: CPF, telefone)
  options: any[]; // Opções para dropdowns
  validations?: { [key: string]: any }; // Validações personalizadas
};

export type FormStep = {
  step: number; // Número da etapa
  title: string; // Título da etapa
  fields: FormField[]; // Lista de campos dentro da etapa
};

export type FormResponse = {
  message: string; // Mensagem da API
  formFields: FormStep[]; // Lista de etapas com campos
};
