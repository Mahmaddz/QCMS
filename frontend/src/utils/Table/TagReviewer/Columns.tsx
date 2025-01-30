/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { changeTagStatus } from '../../../services/Tags/changeTagStatus.service';
import { TagDetails } from '../../../interfaces/TagDetails';
import { deleteTagAgainstAya } from '../../../services/Tags/deleteTag.service';
import Toaster from '../../helper/Toaster';

const handleActionSubmit = async (row: TagDetails, selectedAction: string) => {
  const newStatus = selectedAction === 'approve' ? 2 : selectedAction === 'reject' ? 3 : 1;
  if (row.actions === 'Add Tag') {
    if (newStatus === 2) {
      const response = await changeTagStatus(row.id, newStatus);
      return response.success; 
    }
    else if (newStatus === 3) {
      const response = await deleteTagAgainstAya(row.id, true);
      return response.success;
    }
    else {
      Toaster('Error', 'error');
      return true;
    }
  }
  else if (row.actions === 'Delete Tag') {
    if (newStatus === 2) {
      const response = await deleteTagAgainstAya(row.id, true);
      return response.success;
    }
    else if (newStatus === 3) {
      const response = await changeTagStatus(row.id, 2);
      return response.success; 
    }
    else {
      Toaster('Error', 'error');
      return true;
    }
  }
  else if (row.actions === 'Update Tag') {
    const response = await changeTagStatus(row.id, newStatus);
    return response.success;
  }
  else {
    Toaster('Unexpected Value', 'error');
    return true;
  }
};

export const TagReviewCol = (setTagDetails: React.Dispatch<React.SetStateAction<TagDetails[]>>): GridColDef[] => [
  { field: 'id', headerName: 'ID', flex: 0.3, headerAlign: 'center' },
  {
    field: 'ayaText',
    headerName: 'Ayat Text',
    flex: 2,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <Box sx={{ fontSize: { xs: '16px', md: '18px' }, fontWeight: 'bold', whiteSpace: 'normal', wordWrap: 'break-word' }}>
          {params.value}
        </Box>
      );
    },
  },
  { field: 'suraNo', headerName: 'Sora', flex: 0.3, headerAlign: 'center', editable: false },
  { field: 'ayaNo', headerName: 'Aya', type: 'number', flex: 0.3, headerAlign: 'center', editable: false },
  { field: 'actions', headerName: 'Type', flex: 0.5, headerAlign: 'center', editable: false },
  { field: 'username', headerName: 'User', flex: 0.7, headerAlign: 'center', editable: false },
  {
    field: 'details',
    headerName: 'Details',
    flex: 1,
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const { details } = params.row as { details: { en: string; ar: string; } };
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
          <span><strong>Ar:</strong> {details.ar}</span><br />
          <span><strong>En:</strong> {details.en}</span>
        </Box>
      );
    },
  },
  {
    field: 'status',
    headerName: 'Action',
    flex: 0.7,
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const currentStatus = params.row.status || '';
      const [selectedAction, setSelectedAction] = useState<string>(currentStatus || "Select Action");
      const [isLoading, setIsLoading] = useState<boolean>(false);
      const handleChange = (event: SelectChangeEvent) => {
        setSelectedAction(event.target.value);
      };

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%' }}>
          <Select
            value={selectedAction || ''}
            onChange={handleChange}
            displayEmpty
            sx={{ width: '100%' }}
            size="small"
          >
            <MenuItem value="approve">Approve</MenuItem>
            <MenuItem value="reject">Reject</MenuItem>
          </Select>
          <Button
            onClick={async () => {
              setIsLoading(true);
              const isSuccess = await handleActionSubmit(params.row, selectedAction);
              if (isSuccess) {
                setTagDetails((prev) => prev.filter(p => p.id !== params.row.id));
              }
              setIsLoading(false);
            }}
            size="small"
            variant="contained"
            sx={{
              bgcolor: selectedAction === 'approve' ? '#1a73e8' : '#FF6F61',
              '&:hover': {
                bgcolor: selectedAction === 'approve' ? '#1a73e8' : '#E57373',
              },
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      );
    },
  },
];
