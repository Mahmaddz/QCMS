import { useState, ChangeEvent, useRef } from 'react';
import {
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Toaster from '../utils/helper/Toaster';
import { nature, uploadXlsFile } from '../services/File/uploadFile';
import uniqueID from '../utils/helper/UniqueID';

const FileUploader = ({ title }: { title: string }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const sheets = ['verses', 'Qurana', 'khadija', 'Sample-index', 'mushaf+', 'RK'];
    const [selectedSheet, setSelectedSheet] = useState<string>("");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async (): Promise<void> => {
        if (files.length === 0) {
            Toaster("Choose a file to uplaod", "info");
            return;
        };
        if (files.length > 1) {
            Toaster("No more than one file will be accepted", "error");
            return;
        }
        if (title.startsWith("Verses") && selectedSheet === "") {
            Toaster("Choose A Sheet To Continue", "error");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', files[0]);
        if (title.startsWith("Verses")) formData.append('selectedSheet', selectedSheet);

        const fileType = title.split(" ")[0].trim().toLowerCase();
        const response = await uploadXlsFile(fileType as nature, formData);
        if (response.success) {
            // formData.delete('file');
            setLoading(false);
            // setFiles(() => []);
        }
        else {
            formData.delete('file');
            setLoading(false);
            setFiles(() => []);
        }
    };

    const handleRemoveFile = (fileName: string): void => {
        const updatedFiles = files.filter((file) => file.name !== fileName);
        setFiles(updatedFiles);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSheetChange = (event: SelectChangeEvent) => {
        setSelectedSheet(event.target.value);
    }

    return (
        <Paper
            elevation={3}
            sx={{
                width: { xs: '100%', sm: '400px' },
                padding: '20px',
                borderRadius: '10px',
                marginBottom: 5,
                boxSizing: 'border-box',
            }}
        >
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: '700', color: 'primary.main' }}>
                {title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                    sx={{ flex: 1 }}
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    disabled={loading}
                >
                    Choose Files
                    <input type="file" onChange={handleFileChange} accept='' multiple hidden ref={fileInputRef} />
                </Button>
                {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                <Box>
                    {
                        title.startsWith("Verses") &&
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small-label">Sheets</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={selectedSheet}
                                label="Age"
                                onChange={handleSheetChange}
                            >
                                {
                                    sheets.map(sht => (
                                        <MenuItem key={uniqueID()} value={sht}>{sht}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    }
                </Box>
            </Box>

            {/* {files.length > 0 && (
                <Tooltip title="Add">
                    <IconButton
                        component="label"
                        color="secondary"
                        sx={{ mb: 2, ml: 1 }}
                    >
                        <AddIcon />
                        <input
                            type="file"
                            onChange={handleAddFiles}
                            multiple
                            hidden
                        />
                    </IconButton>
                </Tooltip>
            )} */}

            <Typography sx={{ marginBottom: 5 }}>
                Selected Files - {files.length}
            </Typography>

            <Button variant="contained" color="primary" onClick={handleUpload} sx={{ width: '100%' }} disabled={loading}>
                Upload
            </Button>

            {files.length > 0 && (
                <List sx={{ marginTop: 2 }}>
                    {files.map((file, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                padding: { xs: '4px 8px', md: '8px 16px' },
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <ListItemText primary={file.name} />
                            <IconButton
                                edge="end"
                                onClick={() => handleRemoveFile(file.name)}
                                sx={{
                                    "&:hover": {
                                        color: "red",
                                    },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default FileUploader;
