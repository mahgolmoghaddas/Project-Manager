import React, { useReducer, useState } from "react";
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from "@mui/material";
import EditDialog from "./EditDialog";
import { useFormManager } from "./hooks/useFormManager";
import { Tag, Form,  DataEntry } from "./types";
import FormList from "./FormList";


const App: React.FC = () => {
  const {state, editTag,saveEditForm,deleteTag,addChoiceToTag, editChoiceTag,addDataEntry,saveEditEntry,saveEditTag,addNewTag ,deleteChoiceFromTag,deleteDataEntry ,editDataEntry, addForm, deleteForm } = useFormManager();
  const [editItem, setEditItem] = useState<Tag | DataEntry | null>(null);



  const handleEditClick = (item: Tag | DataEntry) => setEditItem(item);
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [e.target.name]: e.target.value });
   
  };

  const handleDeleteTag = (formId: string, tagName: string) => {
    console.log(`Deleting tag "${tagName}" from form ID: ${formId}`);
    // Call your API or dispatch action to delete the tag
  };
  
  const handleOpenAddTag = (formId: string) => {
    console.log(`Opening "Add Tag" modal for form ID: ${formId}`);
    // Show modal to add a new tag
  };


  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>Form Manager</Typography>
      <FormList 
          state={state} 
          onEditClick={handleEditClick} 
          onDeleteTag={handleDeleteTag} 
          onOpenAddTag={handleOpenAddTag} 
          addNewTag={addNewTag}
          saveEditForm={saveEditForm}
          saveEditEntry={saveEditEntry}
          addChoiceToTag={addChoiceToTag}
          deleteTag={deleteTag}
          saveEditTag={saveEditTag}
          editChoiceTag={editChoiceTag}
          addDataEntry={addDataEntry}
          deleteDataEntry={deleteDataEntry}
          deleteChoiceFromTag={deleteChoiceFromTag}
          editTag={editTag} editDataEntry={editDataEntry} addForm={addForm} deleteForm={deleteForm}
/>




    </Container>
  );
};

export default App;
