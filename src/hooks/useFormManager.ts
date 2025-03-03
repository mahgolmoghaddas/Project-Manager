import { useReducer, useEffect, useCallback} from "react";
import axios from "axios";
import { reducer, initialState } from "../reducers/FormReducer";
import {  DataEntry, Form, Tag } from "../types";

const API_URL = "http://localhost:3001";

export const useFormManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  //const [formName, setFormName] = useState("");

  // Fetch Forms
  const fetchForms = useCallback(async () => {
    try {
      const response = await axios.get<Form[]>(`${API_URL}/forms`);

      const updatedForms = response.data.map((form) => ({
        ...form,
        tags: form.tags ?? [],
        label: form.label ?? "Add New Tag",
      }));
      
      dispatch({ type: "SET_FORMS", payload: updatedForms });
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  }, []);

  // Fetch Data Entries
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<DataEntry[]>(`${API_URL}/data`);
      
      dispatch({ type: "SET_DATA", payload: response.data }); // ✅ Correctly extracts data array
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchForms();
    fetchData();
  }, [fetchForms, fetchData]);

  const addForm = async (newForm:object) => {
    try {
      const response = await axios.post<Form>(`${API_URL}/forms`, newForm);
      dispatch({ type: "SET_FORMS", payload: [...state.forms, response.data] });
     
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const deleteForm = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/forms/${id}`);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.filter((form) => form.id !== id),
      });
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const saveEditForm = async (updatedForm:Form, editForm:Form) => {
    try {
      await axios.put(`${API_URL}/forms/${editForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === editForm.id ? updatedForm : form,
        ),
      });
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };
  
  const deleteTag = async (formId: string, tagName: string) => {
    const updatedForms = state.forms.map((form) => {
      if (form.id === formId) {
        return {
          ...form,
          tags: form.tags.filter((tag) => tag.name !== tagName),
        };
      }
      return form;
    });

    const updatedForm = updatedForms.find((form) => form.id === formId);

    if (!updatedForm) return;

    try {
      await axios.put(`${API_URL}/forms/${formId}`, updatedForm);
      dispatch({ type: "SET_FORMS", payload: updatedForms });
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  // Edit Tag
  const editTag = async (formId: string, updatedTag: Tag) => {
    try {
      const response = await axios.put<Tag>(`${API_URL}/forms/${formId}/tags/${updatedTag.name}`, updatedTag);
      dispatch({ type: "EDIT_TAG", payload: { formId, updatedTag } });
      console.log("response.data", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Edit Data Entry
  const editDataEntry = async (updatedEntry: DataEntry) => {
    try {
      const response = await axios.put<DataEntry>(`${API_URL}/data/${updatedEntry.id}`, updatedEntry);
      dispatch({ type: "EDIT_DATA", payload: response.data });
      console.log("response.data", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteChoiceFromTag = async (updatedForm: Form, selectedForm:Form)=> {


    try {
      await axios.put(`${API_URL}/forms/${selectedForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === selectedForm.id ? updatedForm : form,
        ),
      });
      
    } catch (error) {
      console.error("Error deleting choice:", error);
    } 
  };

  const addChoiceToTag = async (updatedForm: Form, selectedForm:Form) => {

    try {
      await axios.put(`${API_URL}/forms/${selectedForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === selectedForm.id ? updatedForm : form,
        ),
      });

    } catch (error) {
      console.error("Error adding choice:", error);
    }
  
  };

  const addNewTag = async (selectedFormTag: Form, updatedForm: Form) => {


    try {
      await axios.put(`${API_URL}/forms/${selectedFormTag.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === selectedFormTag.id ? updatedForm : form,
        ),
      });
      
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const deleteDataEntry = async (id: string) => {
   

    try {
      const response = await axios.delete(`${API_URL}/data/${id}`);
      console.log("response", response);
      if (response.status === 200 || response.status === 204) {
        dispatch({ type: "DELETE_DATA", payload: id });
      } else {
        console.error("Error deleting data: Unexpected response", response);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const addDataEntry = async (newEntry: DataEntry) => {


    try {
      const response = await axios.post<DataEntry>(`${API_URL}/data`, newEntry);
      dispatch({ type: "ADD_DATA", payload: response.data });
      
    } catch (error) {
      console.error("Error adding data entry:", error);
    }
  };

  const saveEditEntry = async (editEntry: DataEntry) => {
    
    try {
      const response = await axios.put<DataEntry>(
        `${API_URL}/data/${editEntry.id}`,
        editEntry,
      );
      dispatch({ type: "EDIT_DATA", payload: response.data });
     
    } catch (error) {
      console.error("Error editing data entry:", error);
    }
  };

  const saveEditTag = async (editTag: Tag, selectedFormId: string) => {
    
    try {
      const response = await axios.put<Tag>(
        `${API_URL}/forms/${selectedFormId}/tags/${editTag.name}`,
        editTag,
      );
      dispatch({
        type: "EDIT_TAG",
        payload: { formId: selectedFormId, updatedTag: response.data },
      });
     
    } catch (error) {
      console.error("Error editing tag:", error);
    }
  };

  const editChoiceTag = async (selectedForm:Form, updatedForm: Form)=>{
    try {
      await axios.put(`${API_URL}/forms/${selectedForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === selectedForm.id ? updatedForm : form
        ),
      });
      
    } catch (error) {
      console.error(error);
    } 

  }
  return { state,deleteTag,saveEditForm,addNewTag,deleteDataEntry,editChoiceTag,addDataEntry,saveEditTag,saveEditEntry,addChoiceToTag,deleteChoiceFromTag, dispatch, editTag, editDataEntry, addForm, deleteForm };
};
