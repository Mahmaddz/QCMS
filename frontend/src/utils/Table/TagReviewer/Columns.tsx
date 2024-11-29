import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Button, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

const handleActionSubmit = (row: unknown, selectedAction: string) => {
  console.log(`Row data (Action: ${selectedAction}):`, row); // Logic can be customized
};

export const TagReviewCol = (): GridColDef[] => [
  { field: 'id', headerName: 'ID', flex: 0.5, headerAlign: 'center' },
  { field: 'a_txt', headerName: 'Ayat Text', flex: 1, headerAlign: 'center' },
  { field: 'sora', headerName: 'Sora', flex: 1, headerAlign: 'center' },
  { field: 'aya', headerName: 'Aya', type: 'number', flex: 0.5, headerAlign: 'center' },
  { field: 'type', headerName: 'Type', flex: 1, headerAlign: 'center' },
  { field: 'user', headerName: 'User', type: 'number', flex: 0.5, headerAlign: 'center' },
  {
    field: 'details',
    headerName: 'Details',
    flex: 2,
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const { details } = params.row as { details: { Ar: string; En: string; Type: string } } | { details: string };

      if (typeof details === 'string')
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span>{details}</span>
          </Box>
        );
      else
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <span><strong>Ar:</strong> {details.Ar}</span>
            <span><strong>En:</strong> {details.En}</span>
            <span><strong>Type:</strong> {details.Type}</span>
          </Box>
        );
    },
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 0.7,
    headerAlign: 'center',
    renderCell: (params: GridRenderCellParams) => {
      const currentStatus = params.row.status || ''; // Use a fallback to avoid undefined
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [selectedAction, setSelectedAction] = useState<string>(currentStatus || "Select Action"); // Initialize with current status or an empty string

      const handleChange = (event: SelectChangeEvent) => {
        setSelectedAction(event.target.value);
      };

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%' }}>
          <Select
            value={selectedAction || ''} // Ensure value is always defined
            onChange={handleChange}
            displayEmpty
            sx={{ width: '100%' }}
            size="small"
          >
            {/* <MenuItem value="" disabled>
              Select Action
            </MenuItem> */}
            <MenuItem value="approve">Approve</MenuItem>
            <MenuItem value="reject">Reject</MenuItem>
          </Select>
          <Button
            onClick={() => handleActionSubmit(params.row, selectedAction)}
            size="small"
            variant="contained"
            disabled={!selectedAction} // Disable if no action is selected
            sx={{
              bgcolor: selectedAction === 'approve' ? '#1a73e8' : '#FF6F61',
              '&:hover': {
                bgcolor: selectedAction === 'approve' ? '#1a73e8' : '#E57373',
              },
              color: '#fff',
              width: '100%',
            }}
          >
            Submit
          </Button>
        </Box>
      );
    },
  },
];
