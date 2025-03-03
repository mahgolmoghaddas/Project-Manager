import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { Tag, DataEntry } from "./types";

interface EditDialogProps {
  open: boolean;
  editItem: Tag | DataEntry | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, editItem, onClose, onSave, onChange }) => {
  if (!editItem) return null;

  // Type Guard to check if the editItem is a Tag or DataEntry
  const isTag = (item: Tag | DataEntry): item is Tag => "name" in item;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit {isTag(editItem) ? "Tag" : "Data Entry"}</DialogTitle>
      <DialogContent>
        {/* Ensure we're editing a Tag before accessing name */}
        {isTag(editItem) && (
          <TextField
            fullWidth
            label="Tag Name"
            name="name"
            value={editItem.name}
            onChange={onChange}
            margin="normal"
          />
        )}

        {/* Ensure we're editing a DataEntry before accessing its properties */}
        {!isTag(editItem) && (
          <>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={editItem.date}
              onChange={onChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Value"
              type="number"
              name="value"
              value={editItem.value}
              onChange={onChange}
              margin="normal"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} color="primary" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
