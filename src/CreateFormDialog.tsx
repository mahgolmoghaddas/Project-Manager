import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formName: string) => void;
}

const CreateFormDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [formName, setFormName] = useState("");

  const handleSubmit = () => {
    if (formName.trim()) {
      onSubmit(formName);
      setFormName("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFormDialog;
