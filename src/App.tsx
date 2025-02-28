//this has full functionality of tag, add and delete them

import React, { useEffect, useReducer, useCallback, useState } from "react";
import axios from "axios";
import {
  Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Container, List, ListItem, IconButton, Card,
  CardContent, CardActions, Grid, Chip, Box, Menu, MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const API_URL = "http://localhost:3001";

interface Tag {
  name: string;
  choices: string[];
}

interface Form {
  id: number;
  name: string;
  tags: Tag[];
  label?: string
}

interface State {
  forms: Form[];
}

interface DataEntry {
  id: number;
  formId: number;
  date: string;
  tags: Record<string, string>;
  value: number;
}

interface State {
  forms: Form[];
  data: DataEntry[]; // ✅ New state for data entries
}



type Action =
  | { type: "SET_FORMS"; payload: Form[] }
  | { type: "SET_DATA"; payload: DataEntry[] }; 


  const initialState: State = { forms: [], data: [] };


  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "SET_FORMS":
        return { ...state, forms: action.payload };
      case "SET_DATA":
        return { ...state, data: action.payload }; // ✅ Ensures correct data structure
      default:
        return state;
    }
  };
 
const App: React.FC = () => {


  
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [newChoice, setNewChoice] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [selectedFormTag, setSelectedFormTag] = useState<Form | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newChoices, setNewChoices] = useState("");
  const [editForm, setEditForm] = useState<Form | null>(null);


  const handleEditForm = (form: Form) => {
    setEditForm(form);
    setFormName(form.name);
  };

  const deleteTag = async (formId: number, tagName: string) => {
    const updatedForms = state.forms.map(form => {
      if (form.id === formId) {
        return { ...form, tags: form.tags.filter(tag => tag.name !== tagName) };
      }
      return form;
    });
  
    const updatedForm = updatedForms.find(form => form.id === formId);
  
    if (!updatedForm) return;
  
    try {
      await axios.put(`${API_URL}/forms/${formId}`, updatedForm);
      dispatch({ type: "SET_FORMS", payload: updatedForms });
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const deleteForm = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/forms/${id}`);
      dispatch({ type: "SET_FORMS", payload: state.forms.filter(form => form.id !== id) });
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };
  
  // ✅ Save form name changes
  const saveEditForm = async () => {
    if (!editForm || !formName.trim()) return;

    const updatedForm = { ...editForm, name: formName };

    try {
      await axios.put(`${API_URL}/forms/${editForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map(form => form.id === editForm.id ? updatedForm : form)
      });

      setEditForm(null);
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };
  
  const handleLabelClick = (form: Form) => {
    setSelectedFormTag(form);
    console.log(selectedFormTag)
    setNewTagName("");
    setNewChoices("");
    
  };


  const addNewTag = async () => {
    if (!selectedFormTag || !newTagName.trim()) return;
  
    const newTag: Tag = {
      name: newTagName,
      choices: newChoices.split(",").map(choice => choice.trim()).filter(choice => choice !== ""),
    };
  
    const updatedTags = [...selectedFormTag.tags, newTag];
  
    const updatedForm = { ...selectedFormTag, tags: updatedTags };
  
    try {
      await axios.put(`${API_URL}/forms/${selectedFormTag.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map(form => form.id === selectedFormTag.id ? updatedForm : form)
      });
      setSelectedFormTag(null);
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };
  
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<{ data: DataEntry[] }>(`${API_URL}/data`);
      dispatch({ type: "SET_DATA", payload: response.data.data }); // ✅ Correctly extracts data array
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // const fetchForms = useCallback(async () => {
  //   const response = await axios.get<{ forms: Form[] }>(`${API_URL}/forms`);
  //   dispatch({ type: "SET_FORMS", payload: response.data.forms }); // ✅ Now correctly extracting `.forms`
  // }, []);
  

 // ✅ Fetch Forms & Ensure Tags Exist
  const fetchForms = useCallback(async () => {
    try {
      const response = await axios.get<Form[]>(`${API_URL}/forms`);
      //console.log('response', updatedForms)
      const updatedForms = response.data.map(form => ({
        ...form,
        tags: form.tags ?? [],
        label: form.label ?? "Add New Tag",
       
      }));
      console.log('response', updatedForms)
      dispatch({ type: "SET_FORMS", payload: updatedForms });
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  }, []);
  

  
  useEffect(() => {
    fetchForms();
    fetchData(); // ✅ Fetching data alongside forms
  }, [fetchForms, fetchData]);

  // ✅ Create a new form
  const createForm = async () => {
    if (!formName.trim()) return;
    try {
      const newForm = { name: formName, tags: [] };
      const response = await axios.post<Form>(`${API_URL}/forms`, newForm);
      dispatch({ type: "SET_FORMS", payload: [...state.forms, response.data] });
      setFormName("");
      setOpenCreateForm(false);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  // ✅ Open the tag menu & link to selected form
  const handleTagClick = (event: React.MouseEvent<HTMLElement>, tag: Tag, form: Form) => {
    setAnchorEl(event.currentTarget);
    setSelectedTag(tag);
    setSelectedForm(form);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTag(null);
    setSelectedForm(null);
  };

  // ✅ Add a choice to a tag & update the API
  const addChoiceToTag = async () => {
    if (!selectedTag || !selectedForm || !newChoice.trim()) return;

    const updatedTags = selectedForm.tags.map(tag =>
      tag.name === selectedTag.name ? { ...tag, choices: [...tag.choices, newChoice] } : tag
    );

    const updatedForm = { ...selectedForm, tags: updatedTags };

    try {
      await axios.put(`${API_URL}/forms/${selectedForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map(form => form.id === selectedForm.id ? updatedForm : form)
      });
      setNewChoice("");
      setSelectedTag(updatedTags.find(tag => tag.name === selectedTag.name) ?? null);
    } catch (error) {
      console.error("Error adding choice:", error);
    }

  };

  // ✅ Delete a choice from a tag & update the API
  const deleteChoiceFromTag = async (choiceIndex: number) => {
    if (!selectedTag || !selectedForm) return;

    const updatedTags = selectedForm.tags.map(tag =>
      tag.name === selectedTag.name
        ? { ...tag, choices: tag.choices.filter((_, index) => index !== choiceIndex) }
        : tag
    );

    const updatedForm = { ...selectedForm, tags: updatedTags };

    try {
      await axios.put(`${API_URL}/forms/${selectedForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map(form => form.id === selectedForm.id ? updatedForm : form)
      });
      setSelectedTag(updatedTags.find(tag => tag.name === selectedTag.name) ?? null);
    } catch (error) {
      console.error("Error deleting choice:", error);
    }
  };
  console.log('state.data', state.data)

  return (
    <Container maxWidth="md" sx={{ padding: "30px", textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px", color: "#1976d2" }}>
        Form Manageraf 📋
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpenCreateForm(true)}>
      <AddIcon /> Add Form
    </Button>

      {/* Forms Grid */}
      <Grid container spacing={3} justifyContent="center">
        {state.forms.map((form) => (
          <Grid item key={form.id} xs={12} sm={6} md={4}>
            <Card sx={{ background: "#f5f5f5", borderRadius: "12px", boxShadow: 3 }}>
            <Box
                sx={{
                   background: "#1976d2",
                  color: "#fff", padding: "5px 10px", borderRadius: "5px", cursor: "pointer"
                }}
                onClick={() => handleLabelClick(form)}
              >
                Add Tag
              </Box>
              <CardContent>
              
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", color: "#333" }}>
                  {form.name}
                </Typography>

               

                     

                {/* Tags Display */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", marginTop: "10px" }}>
                  {form.tags?.map((tag, index) => (
                   <> 
                   <Chip  key={index} label={tag.name} color="primary" onClick={(e) => handleTagClick(e, tag, form)} />
                    <IconButton sx={{color:'blue'}} onClick={() => deleteTag(form.id, tag.name)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                      </>
                  ))}
                  
                </Box>

      {/* ✅ Dropdown for Choices */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {selectedTag?.choices?.map((choice, index) => (
          <MenuItem key={index}>
            {choice}
            <IconButton onClick={() => deleteChoiceFromTag(index)}>
              <DeleteIcon />
            </IconButton>
          </MenuItem>
        ))}
        <MenuItem>
          <TextField value={newChoice} onChange={(e) => setNewChoice(e.target.value)} placeholder="New Choice" size="small" />
          <IconButton onClick={addChoiceToTag}><AddIcon /></IconButton>
        </MenuItem>
      </Menu>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, marginBottom: "10px" }}>
  <IconButton onClick={() => handleEditForm(form)} color="primary">
    <EditIcon />
  </IconButton>
  <IconButton onClick={() => deleteForm(form.id)} color="error">
    <DeleteIcon />
  </IconButton>
</Box>
<Typography variant="subtitle1" sx={{ marginTop: "20px", fontWeight: "bold", color: "#1976d2" }}>
  Data Entries
</Typography>
<TableContainer component={Paper} sx={{ marginTop: "10px" }}>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell>Tags</TableCell>
        <TableCell>Value</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
  {(state.data ?? []) // ✅ Ensure data is an array even if it's initially undefined
    .filter(entry => entry.formId === form.id)
    .map((entry) => (
      <TableRow key={entry.id}>
        <TableCell>{entry.date}</TableCell>
        <TableCell>{entry.value}</TableCell>
      </TableRow>
    ))}
</TableBody>

  </Table>
</TableContainer>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ✅ Dropdown for Choices */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {selectedTag?.choices?.map((choice, index) => (
          <MenuItem key={index}>
            {choice}
            <IconButton onClick={() => deleteChoiceFromTag(index)}>
              <DeleteIcon />
            </IconButton>
          </MenuItem>
        ))}
        <MenuItem>
          <TextField value={newChoice} onChange={(e) => setNewChoice(e.target.value)} placeholder="New Choice" size="small" />
          <IconButton onClick={addChoiceToTag}><AddIcon /></IconButton>
        </MenuItem>
      </Menu>


      {selectedFormTag && (
            <Dialog open={Boolean(selectedFormTag)} onClose={() => setSelectedFormTag(null)}>
              <DialogTitle>Add a New Tag</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Tag Name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Choices (comma-separated)"
                  value={newChoices}
                  onChange={(e) => setNewChoices(e.target.value)}
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedFormTag(null)}>Cancel</Button>
                <Button onClick={addNewTag} color="primary" variant="contained">Add Tag</Button>
              </DialogActions>
            </Dialog>
)}

{editForm && (
  <Dialog open={Boolean(editForm)} onClose={() => setEditForm(null)}>
    <DialogTitle>Edit Form</DialogTitle>
    <DialogContent>
      <TextField fullWidth label="Form Name" value={formName} onChange={(e) => setFormName(e.target.value)} margin="normal" />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setEditForm(null)}>Cancel</Button>
      <Button onClick={saveEditForm} color="primary" variant="contained">Save</Button>
    </DialogActions>
  </Dialog>
)}

      {/* Create Form Dialog */}
      <Dialog open={openCreateForm} onClose={() => setOpenCreateForm(false)}>
        <DialogTitle>Create Form</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Form Name" value={formName} onChange={(e) => setFormName(e.target.value)} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateForm(false)}>Cancel</Button>
          <Button onClick={createForm} color="primary" variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
