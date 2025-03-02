//this has full functionality of tag, add and delete them

import React, {
  useEffect,
  useReducer,
  useCallback,
  useState,
  ChangeEvent,
} from "react";
import axios from "axios";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  Menu,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
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
  id: string;
  name: string;
  tags: Tag[];
  label?: string;
}

interface State {
  forms: Form[];
}

interface DataEntry {
  id: string;
  formId: string;
  date: string;
  tags: Record<string, string>;
  value: number; // ✅ Changed from number to string
}

interface State {
  forms: Form[];
  data: DataEntry[]; // ✅ New state for data entries
}

type Action =
  | { type: "SET_FORMS"; payload: Form[] }
  | { type: "ADD_TAG"; payload: DataEntry[] }
  | { type: "ADD_DATA"; payload: DataEntry }
  | { type: "DELETE_DATA"; payload: string }
  | { type: "EDIT_TAG"; payload: { formId: string; updatedTag: Tag } }
  | { type: "EDIT_DATA"; payload: DataEntry };

const initialState: State = { forms: [], data: [] };

const reducer = (state: State, action: Action): State => {
  console.log(action.type);
  switch (action.type) {
    case "SET_FORMS":
      //console.log('state', state)
      return { ...state, forms: action.payload };
    case "ADD_TAG":
      //console.log('data', state.data)
      return { ...state, data: action.payload };
    case "ADD_DATA":
      return { ...state, data: [...state.data, action.payload] };
    case "DELETE_DATA":
      console.log("Deleting data entry with ID:", action.payload);
      return {
        ...state,
        data: state.data.filter((entry) => entry.id !== action.payload),
      };
    case "EDIT_DATA":
      return {
        ...state,
        data: state.data.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry,
        ),
      };
    case "EDIT_TAG":
      return {
        ...state,
        forms: state.forms.map((form) =>
          form.id === action.payload.formId
            ? {
                ...form,
                tags: form.tags.map((tag) =>
                  tag.name === action.payload.updatedTag.name
                    ? action.payload.updatedTag
                    : tag,
                ),
              }
            : form,
        ),
      };
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
  const [selectedFormData, setSelectedFormData] = useState<Form | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newChoices, setNewChoices] = useState("");
  const [editForm, setEditForm] = useState<Form | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTagsData, setNewTagsData] = useState<Record<string, string>>({});
  const [newValue, setNewValue] = useState<number | null>(null);
  const [tagValue, setTagValue] = useState<string>("");
  const [sortOption, setSortOption] = useState<"date" | "value">("date");
  const [editEntry, setEditEntry] = useState<DataEntry | null>(null);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // ✅ Open modal to add data
  const openAddDataModal = (form: Form) => {
    setSelectedFormData(form);
    setNewDate("");
    setNewTagsData({});
    setNewValue(null);
  };

  // ✅ Add new data entry
  const addDataEntry = async () => {
    if (
      !selectedFormData ||
      !newDate ||
      newValue === null ||
      !selectedTag ||
      !tagValue
    )
      return;

    const updatedTags = { ...newTagsData, [selectedTag?.name || ""]: tagValue };

    const newEntry: DataEntry = {
      id: String(state.data.length + 1),
      formId: selectedFormData.id,
      date: newDate,
      tags: updatedTags,
      value: newValue,
    };

    try {
      const response = await axios.post<DataEntry>(`${API_URL}/data`, newEntry);
      dispatch({ type: "ADD_DATA", payload: response.data });
      setSelectedFormData(null);
    } catch (error) {
      console.error("Error adding data entry:", error);
    }
  };

  // const deleteDataEntry = async (id: number) => {
  //   if (!id) {
  //     console.error("Error: ID is undefined or invalid.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.delete(`${API_URL}/data/${id}`);

  //     if (response.status === 200 || response.status === 204) {
  //       dispatch({ type: "DELETE_DATA", payload: id });
  //     } else {
  //       console.error("Error deleting data: Unexpected response", response);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting data:", error);
  //   }
  // };

  const deleteDataEntry = async (id: string) => {
    //console.log('id', id)
    if (!id) {
      console.error("Error: ID is undefined or invalid.");
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/data/${id}`);
      console.log("response", response);
      if (response.status === 200 || response.status === 204) {
        dispatch({ type: "DELETE_DATA", payload: id });
        console.log("Deleted entry with ID:", id);
      } else {
        console.error("Error deleting data: Unexpected response", response);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleEditClick = (entry: DataEntry) => {
    setEditEntry(entry);
  };

  const handleEditDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editEntry) return;
    setEditEntry({ ...editEntry, [e.target.name]: e.target.value });
  };

  const saveEditEntry = async () => {
    if (!editEntry) return;
    try {
      const response = await axios.put<DataEntry>(
        `${API_URL}/data/${editEntry.id}`,
        editEntry,
      );
      dispatch({ type: "EDIT_DATA", payload: response.data });
      setEditEntry(null);
    } catch (error) {
      console.error("Error editing data entry:", error);
    }
  };

  const handleEditTagClick = (formId: string, tag: Tag) => {
    setSelectedFormId(formId);
    setEditTag(tag);
  };

  const handleEditTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editTag) return;
    setEditTag({ ...editTag, [e.target.name]: e.target.value });
  };

  const saveEditTag = async () => {
    if (!editTag || !selectedFormId) return;
    try {
      const response = await axios.put<Tag>(
        `${API_URL}/forms/${selectedFormId}/tags/${editTag.name}`,
        editTag,
      );
      dispatch({
        type: "EDIT_TAG",
        payload: { formId: selectedFormId, updatedTag: response.data },
      });
      setEditTag(null);
      setSelectedFormId(null);
    } catch (error) {
      console.error("Error editing tag:", error);
    }
  };

  const handleEditForm = (form: Form) => {
    setEditForm(form);
    setFormName(form.name);
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

  const saveEditForm = async () => {
    //console.log('saveEditForm')
    if (!editForm || !formName.trim()) return;
    //
    const updatedForm = { ...editForm, name: formName };
    console.log("updatedForm", updatedForm);
    try {
      await axios.put(`${API_URL}/forms/${editForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === editForm.id ? updatedForm : form,
        ),
      });

      setEditForm(null);
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };


  
  const handleLabelClick = (form: Form) => {
    setSelectedFormTag(form);
    console.log(selectedFormTag);
    setNewTagName("");
    setNewChoices("");
  };

  const addNewTag = async () => {
    if (!selectedFormTag || !newTagName.trim()) return;

    const newTag: Tag = {
      name: newTagName,
      choices: newChoices
        .split(",")
        .map((choice) => choice.trim())
        .filter((choice) => choice !== ""),
    };

    const updatedTags = [...selectedFormTag.tags, newTag];

    const updatedForm = { ...selectedFormTag, tags: updatedTags };

    try {
      await axios.put(`${API_URL}/forms/${selectedFormTag.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === selectedFormTag.id ? updatedForm : form,
        ),
      });
      setSelectedFormTag(null);
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<DataEntry[]>(`${API_URL}/data`);
      console.log("response.dataa", response.data);
      dispatch({ type: "ADD_TAG", payload: response.data }); // ✅ Correctly extracts data array
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

      const updatedForms = response.data.map((form) => ({
        ...form,
        tags: form.tags ?? [],
        label: form.label ?? "Add New Tag",
      }));
      console.log("response", updatedForms);
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
      const newForm = {
        id: String(state.forms.length + 1),
        name: formName,
        tags: [],
      };
      const response = await axios.post<Form>(`${API_URL}/forms`, newForm);
      dispatch({ type: "SET_FORMS", payload: [...state.forms, response.data] });
      setFormName("");
      setOpenCreateForm(false);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  // ✅ Open the tag menu & link to selected form
  const handleTagClick = (
    event: React.MouseEvent<HTMLElement>,
    tag: Tag,
    form: Form,
  ) => {
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

    const updatedTags = selectedForm.tags.map((tag) =>
      tag.name === selectedTag.name
        ? { ...tag, choices: [...tag.choices, newChoice] }
        : tag,
    );

    const updatedForm = { ...selectedForm, tags: updatedTags };

    try {
      await axios.put(`${API_URL}/forms/${selectedForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === selectedForm.id ? updatedForm : form,
        ),
      });
      setNewChoice("");
      setSelectedTag(
        updatedTags.find((tag) => tag.name === selectedTag.name) ?? null,
      );
    } catch (error) {
      console.error("Error adding choice:", error);
    }
    setAnchorEl(null);
  };

  // ✅ Delete a choice from a tag & update the API
  const deleteChoiceFromTag = async (choiceIndex: number) => {
    if (!selectedTag || !selectedForm) return;

    const updatedTags = selectedForm.tags.map((tag) =>
      tag.name === selectedTag.name
        ? {
            ...tag,
            choices: tag.choices.filter((_, index) => index !== choiceIndex),
          }
        : tag,
    );

    const updatedForm = { ...selectedForm, tags: updatedTags };

    try {
      await axios.put(`${API_URL}/forms/${selectedForm.id}`, updatedForm);
      dispatch({
        type: "SET_FORMS",
        payload: state.forms.map((form) =>
          form.id === selectedForm.id ? updatedForm : form,
        ),
      });
      setSelectedTag(
        updatedTags.find((tag) => tag.name === selectedTag.name) ?? null,
      );
    } catch (error) {
      console.error("Error deleting choice:", error);
    } finally {
      setAnchorEl(null);
    }
  };
  //console.log('state.data', state.data)

  const setTheValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const amount = Number(e.target.value);
    if (amount == 0) {
      setNewValue(0);
    } else setNewValue(amount);
  };

  return (


    <Box sx={{minWidth: '100%',alignSelf:'center', alignItems:'center'}}>
      <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px", color: "#1976d2", minWidth: '100%', justifyContent: "center"}}>
        Form Manager
      </Typography>

      <Button sx={{marginBottom: "20px"}} variant="contained" color="primary" onClick={() => setOpenCreateForm(true)}>
       Add Form
    </Button>
    </Box>

      {/* Forms Grid */}
      <Grid container spacing={3} justifyContent="center">
        
        {state.forms.map((form) => (
          <Grid item key={form.id} xs={12} sm={6} md={4}>
            <Card
              sx={{ background: "#f5f5f5", borderRadius: "12px", boxShadow: 3 }}
            >
             
              <CardContent sx={{justifyContent:'center'}}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#333",
                  }}
                >
                  {form.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    marginBottom: "10px",
                  }}
                >
                  <IconButton
                    onClick={() => handleEditForm(form)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteForm(form.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Box
                sx={{
                  background: "#1976d2",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  justifyContent:'center'
                }}
                onClick={() => handleLabelClick(form)}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    
                  }}
                >
                Add Tag
                </Typography>
              </Box>

                {/* Tags Display */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >


                  {form.tags?.map((tag, index) => (
                    <>
                    <Box key={tag.name} display="flex" alignItems="center" gap={1} sx={{ border: "1px solid #ddd", padding: "5px 10px", borderRadius: "8px" }}>

                      <Chip
                        key={index}
                        label={tag.name}
                        color="primary"
                        onClick={(e) => handleTagClick(e, tag, form)}
                      />
                      <IconButton
                        onClick={() => handleEditTagClick(form.id, tag)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        sx={{ color: "blue" }}
                        onClick={() => deleteTag(form.id, tag.name)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      </Box>
                    </>
                  ))}
                </Box>

                {/* ✅ Dropdown for Choices */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {selectedTag?.choices?.map((choice, index) => (
                    <MenuItem key={index}>
                      {choice}
                      <IconButton onClick={() => deleteChoiceFromTag(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <TextField
                      value={newChoice}
                      onChange={(e) => setNewChoice(e.target.value)}
                      placeholder="New Choice"
                      size="small"
                    />
                    <IconButton onClick={addChoiceToTag}>
                      <AddIcon />
                    </IconButton>
                  </MenuItem>
                </Menu>



                {/*The Table*/}
                <Typography
                  variant="subtitle1"
                  sx={{
                    marginTop: "20px",
                    fontWeight: "bold",
                    color: "#1976d2",
                  }}
                >
                  Data Entries
                </Typography>
                <Select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(e.target.value as "date" | "value")
                  }
                  displayEmpty
                  variant="outlined"
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="date">Sort by Date</MenuItem>
                  <MenuItem value="value">Sort by Value</MenuItem>
                </Select>
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
                      {(state.data ?? [])
                        .sort((a, b) =>
                          sortOption === "date"
                            ? a.date.localeCompare(b.date)
                            : a.value - b.value,
                        )
                        .filter((entry) => entry.formId == form.id)
                        .map((e) => (
                          <>
                            <TableRow key={e.id}>
                              <TableCell>{e.date}</TableCell>
                              <TableCell>{JSON.stringify(e.tags)}</TableCell>
                              <TableCell>{e.value}</TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleEditClick(e)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => deleteDataEntry(e.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          </>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  onClick={() => openAddDataModal(form)}
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: "10px" }}
                >
                  Add Data
                </Button>
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
          <TextField
            value={newChoice}
            onChange={(e) => setNewChoice(e.target.value)}
            placeholder="New Choice"
            size="small"
          />
          <IconButton onClick={addChoiceToTag}>
            <AddIcon />
          </IconButton>
        </MenuItem>
      </Menu>

      {selectedFormTag && (
        <Dialog
          open={Boolean(selectedFormTag)}
          onClose={() => setSelectedFormTag(null)}
        >
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
            <Button onClick={addNewTag} color="primary" variant="contained">
              Add Tag
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {editForm && (
        <Dialog open={Boolean(editForm)} onClose={() => setEditForm(null)}>
          <DialogTitle>Edit Form</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditForm(null)}>Cancel</Button>
            <Button onClick={saveEditForm} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Create Form Dialog */}
      <Dialog open={openCreateForm} onClose={() => setOpenCreateForm(false)}>
        <DialogTitle>Create Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateForm(false)}>Cancel</Button>
          <Button onClick={createForm} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(selectedFormData)}
        onClose={() => setSelectedFormData(null)}
      >
        <DialogTitle>Add Data Entry</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            margin="normal"
          />
          <Select
            fullWidth
            value={selectedTag?.name || ""}
            onChange={(e) =>
              setSelectedTag(
                selectedFormData?.tags.find(
                  (tag) => tag.name === e.target.value,
                ) || null,
              )
            }
          >
            {selectedFormData?.tags.map((tag) => (
              <MenuItem key={tag.name} value={tag.name}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Tag Value"
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Value"
            type="text"
            value={newValue}
            onChange={(e) => setTheValue(e)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFormData(null)}>Cancel</Button>
          <Button onClick={addDataEntry} color="primary" variant="contained">
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
      {editEntry && (
        <Dialog open={Boolean(editEntry)} onClose={() => setEditEntry(null)}>
          <DialogTitle>Edit Data Entry</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={editEntry.date}
              onChange={handleEditDataChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Value"
              type="number"
              name="value"
              value={editEntry.value}
              onChange={handleEditDataChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditEntry(null)}>Cancel</Button>
            <Button onClick={saveEditEntry} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {editTag && (
        <Dialog open={Boolean(editTag)} onClose={() => setEditTag(null)}>
          <DialogTitle>
            Edit {"id" in editTag ? "Data Entry" : "Tag"}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Tag Name"
              name="name"
              value={editTag.name}
              onChange={handleEditTagChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditTag(null)}>Cancel</Button>
            <Button onClick={saveEditTag} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default App;
