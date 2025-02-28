//this has full functionality of tag, add and delete them

import React, { useEffect, useReducer, useCallback, useState } from "react";
import axios from "axios";
import {
  Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Container, List, ListItem, IconButton, Card,
  CardContent, CardActions, Grid, Chip, Box, Menu, MenuItem
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

type Action = { type: "SET_FORMS"; payload: Form[] };

const initialState: State = { forms: [] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FORMS":
      return { ...state, forms: action.payload };
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
  

  // ✅ Fetch Forms & Ensure Tags Exist
  const fetchForms = useCallback(async () => {
    try {
      const response = await axios.get<Form[]>(`${API_URL}/forms`);
      const updatedForms = response.data.map(form => ({
        ...form,
        tags: form.tags ?? [],
        label: form.label ?? "Add New Tag" // ✅ Default label added
      }));
      dispatch({ type: "SET_FORMS", payload: updatedForms });
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  }, []);
  

  useEffect(() => { fetchForms(); }, [fetchForms]);

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
                    <Chip key={index} label={tag.name} color="primary" onClick={(e) => handleTagClick(e, tag, form)} />
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
