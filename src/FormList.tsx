import React, { ChangeEvent, useState } from "react";
import { Card, CardContent, Typography, Box, IconButton, Chip, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Menu, MenuItem, Select, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { DataEntry, Form, Tag } from "./types";

interface FormListProps {
  state: { forms: Form[], data: DataEntry[] };
  onEditClick: (item: Tag, formId: string) => void;
  editTag: (formId: string, updatedTag: Tag) => void;
  editDataEntry: (updatedEntry: DataEntry) => void
  addForm: (newForm:object) => void
  deleteForm: (id: string) => void
  addChoiceToTag: (updatedForm: Form, selectedForm:Form) =>void
  saveEditForm:(updatedForm:Form, editForm:Form) => void
  deleteTag: (formId: string, tagName: string) => void
  addNewTag: (selectedFormTag: Form, updatedForm: Form) => void
  deleteChoiceFromTag: (updatedForm: Form,selectedForm: Form) => void
  deleteDataEntry: (id: string) => void
  addDataEntry: (newEntry: DataEntry) => void
  saveEditEntry: (editEntry: DataEntry) => void
  saveEditTag: (editTag: Tag, selectedFormId: string) => void
  editChoiceTag:(updatedForm: Form,selectedForm: Form) => void
}

const FormList: React.FC<FormListProps> = ({ state,addNewTag,deleteDataEntry,saveEditTag,editChoiceTag,addDataEntry,saveEditEntry,addChoiceToTag,deleteChoiceFromTag, saveEditForm ,deleteTag, addForm, deleteForm }) => {
    console.log(state)
  const [editForm, setEditForm] = useState<Form | null>(null);
    const [tagValue, setTagValue] = useState<string>("");
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedFormData, setSelectedFormData] = useState<Form | null>(null);
  const [newChoices, setNewChoices] = useState("");
  const [newChoice, setNewChoice] = useState("");
  const [editEntry, setEditEntry] = useState<DataEntry | null>(null);
  const [sortOption, setSortOption] = useState<"date" | "value">("date");
  const [selectedFormTag, setSelectedFormTag] = useState<Form | null>(null);
  const [formName, setFormName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTagsData, setNewTagsData] = useState<Record<string, string>>({});
  const [newValue, setNewValue] = useState<number | null>(null);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [editChoiceIndex, setEditChoiceIndex] = useState<number | null>(null);
  const [editedChoice, setEditedChoice] = useState<string>("");

  
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTag(null);
    setSelectedForm(null);
  };



  const handleEditForm = (form: Form) => {
    setEditForm(form);
    setFormName(form.name);
  };

  const editFormHandler=() =>{
    if (!editForm || !formName.trim()) return;
    //
    const updatedForm = { ...editForm, name: formName };
    console.log("updatedForm", updatedForm);
    saveEditForm(updatedForm, editForm)
    setEditForm(null);
  }

  const startEditingChoice = (index: number, choice: string) => {
    setEditChoiceIndex(index);
    setEditedChoice(choice);
  };



  const handleTagClick = (
    event: React.MouseEvent<HTMLElement>,
    tag: Tag,
    form: Form,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTag(tag);
    setSelectedForm(form);
  };

  const handleLabelClick = (form: Form) => {
    setSelectedFormTag(form);
    console.log(selectedFormTag);
    setNewTagName("");
    setNewChoices("");
  };

  const handleEditClick = (entry: DataEntry) => {
    setEditEntry(entry);
  };

  const deleteData=(id: string)=>{
    if (!id) {
        console.error("Error: ID is undefined or invalid.");
        return;
      }
      deleteDataEntry(id)
  }

const saveEdit=()=>{
    if (!editEntry) return;
    else saveEditEntry(editEntry)
    setEditEntry(null)
}

  const setTheValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const amount = Number(e.target.value);
    if (amount == 0) {
      setNewValue(0);
    } else setNewValue(amount);
  };

const saveTag=()=>{
    if (!editTag || !selectedFormId) return;
    saveEditTag(editTag, selectedFormId)
    setEditTag(null);
    setSelectedFormId(null);
}

    const openAddDataModal = (form: Form) => {
        setSelectedFormData(form);
        setNewDate("");
        setNewTagsData({});
        setNewValue(null);
      };


  
      const addData =()=>{
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
          addDataEntry(newEntry)
      }


      const handleEditTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!editTag) return;
        setEditTag({ ...editTag, [e.target.name]: e.target.value });
      };

  const handleEditDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editEntry) return;
    setEditEntry({ ...editEntry, [e.target.name]: e.target.value });
  };

const addChoice=()=>{
    if (!selectedTag || !selectedForm || !newChoice.trim()) return;

    const updatedTags = selectedForm.tags.map((tag) =>
      tag.name === selectedTag.name
        ? { ...tag, choices: [...tag.choices, newChoice] }
        : tag,
    );

    const updatedForm = { ...selectedForm, tags: updatedTags };

    addChoiceToTag(updatedForm, selectedForm)

    setNewChoice("");
    setSelectedTag(
      updatedTags.find((tag) => tag.name === selectedTag.name) ?? null,
    );

    setAnchorEl(null);
}

  const deleteChoice=(choiceIndex: number)=>{
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

    deleteChoiceFromTag(updatedForm, selectedForm)
    setSelectedTag(
        updatedTags.find((tag) => tag.name === selectedTag.name) ?? null,
      );
    setAnchorEl(null)
  }

  const editChoice = (index: number) => {
    if (!selectedTag || !selectedForm) return;

{    const updatedTags = selectedForm.tags.map((tag) =>
      tag.name === selectedTag.name
        ? { ...tag, choices: tag.choices.map((c, i) => (i === index ? editedChoice : c)) }
        : tag
    );
  
    const updatedForm = { ...selectedForm, tags: updatedTags };
    editChoiceTag(selectedForm, updatedForm)}
    
  };

  const newTag =()=>{
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
    addNewTag(selectedFormTag, updatedForm)
    setSelectedFormTag(null);
  }

//   const saveEdit = () => {
//     if (!editItem) return;
  
//     if ("id" in editItem) {
//       editDataEntry(editItem as DataEntry);
//     } else {
//       editTag("someFormId", editItem as Tag); // Replace "someFormId" with the correct value.
//     }
  
//     setEditItem(null);
//   };

  const handleEditTagClick = (formId: string, tag: Tag) => {
    setSelectedFormId(formId);
    setEditTag(tag);
  };
  
  const createForm =()=>{
    if (!formName.trim()) return;
      const newForm = {
        id: String(state.forms.length + 1),
        name: formName,
        tags: [],
    } 
    setFormName("");
    setOpenCreateForm(false);
    addForm(newForm)
  }


  return (
    <>
          <Button variant="contained" color="primary" onClick={() => setOpenCreateForm(true)}>Add Form</Button>
          
      {state.forms.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", marginTop: 3 }}>
          No forms available. Click "Add Form" to create one.
        </Typography>
      ) : (
        state.forms.map((form) => (
            
          <Card key={form.id} sx={{ marginBottom: 2, padding: 2 }}>
            <CardContent>
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
              {/* Form Name */}
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {form.name}
              </Typography>


              {/* Add Tag Button */}
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

              {/* Tags List */}
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
            </CardContent>
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
            <Button onClick={editFormHandler} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
    {selectedTag?.choices?.map((choice, index) => (
  <MenuItem key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {editChoiceIndex === index ? (
      <TextField
        size="small"
        value={editedChoice}
        onChange={(e) => setEditedChoice(e.target.value)}
        onBlur={() => editChoice(index)}
        autoFocus
      />
    ) : (
      <Typography>{choice}</Typography>
    )}

    {/* Edit Choice Button */}
    <IconButton onClick={() => startEditingChoice(index, choice)} color="primary">
      <EditIcon />
    </IconButton>

    {/* Delete Choice Button */}
    <IconButton onClick={() => deleteChoice(index)} color="error">
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
        <IconButton onClick={addChoice}>
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
                >                  <MenuItem value="date">Sort by Date</MenuItem>
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
                                onClick={() => deleteData(e.id)}
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
            <Button onClick={newTag} color="primary" variant="contained">
              Add Tag
            </Button>
          </DialogActions>
        </Dialog>
      )}

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
            <Button onClick={saveEdit} color="primary" variant="contained">
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
            <Button onClick={saveTag} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        
      )}
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
          <Button onClick={addData} color="primary" variant="contained">
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
          </Card>
        ))
      )}
    </>
  );
};


export default FormList;
