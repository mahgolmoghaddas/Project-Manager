import React, { useReducer, useState } from "react";
import { Container, Typography, } from "@mui/material";
import { useFormManager } from "./hooks/useFormManager";
import { Tag, DataEntry } from "./types";
import FormList from "./FormList";


const App: React.FC = () => {
  const {state, editTag,saveEditForm,deleteTag,addChoiceToTag, addDataEntry,saveEditEntry,saveEditTag,addNewTag ,deleteChoiceFromTag,deleteDataEntry ,editDataEntry, addForm, deleteForm } = useFormManager();
  const [editItem, setEditItem] = useState<Tag | DataEntry | null>(null);



  const handleEditClick = (item: Tag | DataEntry) => setEditItem(item);





  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>Form Manager</Typography>
      <FormList 
          state={state} 
          onEditClick={handleEditClick} 
          addNewTag={addNewTag}
          saveEditForm={saveEditForm}
          saveEditEntry={saveEditEntry}
          addChoiceToTag={addChoiceToTag}
          deleteTag={deleteTag}
          saveEditTag={saveEditTag}
          addDataEntry={addDataEntry}
          deleteDataEntry={deleteDataEntry}
          deleteChoiceFromTag={deleteChoiceFromTag}
          editTag={editTag} editDataEntry={editDataEntry} addForm={addForm} deleteForm={deleteForm}
/>




    </Container>
  );
};

export default App;
