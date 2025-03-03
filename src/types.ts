export interface Tag {
    name: string;
    choices: string[];
  }
  
  export interface Form {
    id: string;
    name: string;
    tags: Tag[];
    label?: string;
  }
  
  export interface DataEntry {
    id: string;
    formId: string;
    date: string;
    tags: Record<string, string>;
    value: number;
  }
  
  export interface State {
    forms: Form[];
    data: DataEntry[];
  }
  
  export type Action =
    | { type: "SET_FORMS"; payload: Form[] }
    | { type: "ADD_DATA"; payload: DataEntry }
    | { type: "DELETE_DATA"; payload: string }
    | { type: "EDIT_TAG"; payload: { formId: string; updatedTag: Tag } }
    | { type: "EDIT_DATA"; payload: DataEntry }
    | { type: "SET_DATA"; payload: DataEntry[] }
    | { type: "SET_DATA"; payload: DataEntry[] }
