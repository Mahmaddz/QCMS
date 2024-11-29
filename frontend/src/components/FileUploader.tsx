import { useState, ChangeEvent } from 'react';
import {
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Box,
    // Tooltip,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import AddIcon from '@mui/icons-material/Add';
import Toaster from '../utils/helper/Toaster';
import { nature, uploadXlsFile } from '../services/File/uploadFile';

const FileUploader = ({ title }: { title: string }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    // const handleAddFiles = (event: ChangeEvent<HTMLInputElement>): void => {
    //     const selectedFiles = event.target.files;
    //     if (selectedFiles) {
    //         setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
    //     }
    // };

    const handleUpload = async (): Promise<void> => {
        if (files.length === 0) {
            Toaster("Choose a file to uplaod", "info");
            return;
        };
        if (files.length > 1) {
            Toaster("No more than one file will be accepted", "error");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', files[0]);

        const fileType = title.split(" ")[0].trim().toLowerCase();
        const response = await uploadXlsFile(fileType as nature, formData);
        if (response.success) {
            formData.delete('file');
            setLoading(false);
            setFiles([]);
        }
        else {
            formData.delete('file');
            setLoading(false);
            setFiles([]);
        }
    };

    const handleRemoveFile = (fileName: string): void => {
        const updatedFiles = files.filter((file) => file.name !== fileName);
        setFiles(updatedFiles);
    };

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
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    disabled={loading} // Disable button while loading
                >
                    Choose Files
                    <input type="file" onChange={handleFileChange} accept='' multiple hidden />
                </Button>
                {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
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
