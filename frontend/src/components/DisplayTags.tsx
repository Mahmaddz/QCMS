import { useState } from "react";
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { USER } from "../utils/UserRoles";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import uniqueID from "../utils/helper/UniqueID";
import { useAuth } from "../context/Auth/useAuth";
import CloseIcon from "@mui/icons-material/Close";
import { Tagz } from "../interfaces/SurahAyaInfo";
import {
    Save as SaveIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";
import { addTagAgainstAya } from "../services/Tags/addTag.service";
import { deleteTagAgainstAya } from "../services/Tags/deleteTag.service";
import { editTagAgainstAya } from "../services/Tags/editTag.service";
import Toaster from "../utils/helper/Toaster";
import { CurrentSearch } from "../interfaces/SearchForm";
import { Marker } from "react-mark.js";
import { ArabicServices } from "arabic-services";
import CommentDialog from "./CommentDialog";

const DisplayTags = ({showTags=true, tagz, Chapter, Verse, searchMethod}:{showTags?: boolean | undefined; tagz: Tagz[]; Chapter: number, Verse: number, searchMethod?: CurrentSearch;}) => {
    const { userRole } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const handleOpenCommentDialog = (tag: Tagz) => {
        if (userRole !== USER.PUBLIC) {
            setOpenCommentDialog(true);
            setSelectedTag(tag);
        }
    }

    const [tags, setTags] = useState(tagz);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddTagModal, setOpenAddTagModal] = useState(false);
    const [openEditTagModal, setOpenEditTagModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tagz>();
    const [tagFields, setTagFields] = useState<Tagz>({ ar: "", en: "", id: 0, suraNo: 0, ayaNo: 0 });

    const handleOpenDeleteModal = () => setOpenDeleteModal(true);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenAddTagModal = () => setOpenAddTagModal(true);
    const handleCloseAddTagModal = () => setOpenAddTagModal(false);

    const handleCloseEditTagModal = () => setOpenEditTagModal(false);

    const handleOpenEditTagModal = (tag: Tagz) => {
        setSelectedTag(tag);
        setTagFields(tag);
        setOpenEditTagModal(true);
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        if ((name === 'en' && /[a-zA-Z]/.test(value)) || (name === 'ar' && /[\u0600-\u06FF]/.test(value)) || value === '') {
            setTagFields((prev) => ({ ...prev, [name]: value }));
        }
        else {
            Toaster('Wrong Input', 'error');
        }
    };

    const handleDeleteTag = async (tagToDelete: Tagz) => {
        if (!tagToDelete.id) return;
        setIsLoading(true);
        const response = await deleteTagAgainstAya(tagToDelete.id);
        if (response.success) {
            setIsLoading(false);
            setTags(() => tags?.filter((tag) => tag !== tagToDelete));
            handleCloseDeleteModal();
        }
    };
    
    const handleAddTag = async () => {
        setIsLoading(true);
        const response = await addTagAgainstAya(tagFields.en, tagFields.ar, Chapter, Verse);
        if (response.success) {
            setIsLoading(false);
            if (tags && response.insertedTagId) setTags([...tags, { ...tagFields, id: response.insertedTagId }]);
            setTagFields({ ar: "", en: "", id: 0, suraNo: 0, ayaNo: 0 });
            handleCloseAddTagModal();
        }
    };

    const handleEditTag = async (tagToEdit: Tagz) => {
        if (!tagToEdit.id) return;
        setIsLoading(true);
        const response = await editTagAgainstAya(tagToEdit.id, Chapter, Verse, tagToEdit.en, tagToEdit.ar);
        if (response.success) {
            setIsLoading(false);
            setTags(prevTags =>
                prevTags.map(tag =>
                    tag.id === tagToEdit.id ? { ...tag, ...tagToEdit } : tag
                )
            );
            handleCloseEditTagModal();
        }
        else {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "20px",
                    paddingBottom: "10px",
                    gap: "20px",
                    marginLeft: { xs: -4 },
                }}
            >
                {userRole !== USER.PUBLIC && showTags && (
                    <Box
                        marginLeft={2}
                        sx={{
                            marginLeft: 2,
                            marginBottom: { xs: 2 },
                            width: { sm: 10 },
                        }}
                    >
                        <AddCircleTwoToneIcon
                            sx={{
                                position: "absolute",
                                top: "-10px",
                                right: "-10px",
                                fontSize: "32px",
                                color: "primary.main",
                                cursor: "pointer",
                                transition: "transform 0.3s ease",
                                marginRight: 2,
                                "&:hover": {
                                    transform: "scale(1.2)",
                                },
                            }}
                            onClick={handleOpenAddTagModal}
                        />
                    </Box>
                )}

                <Box
                    sx={{
                        marginLeft: { sm: 8 },   
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        width: '90%',
                        padding: { sm: 1 },
                        flexWrap: 'wrap',
                    }}
                >
                {showTags && (
                    tags && tags?.length > 0 ? (
                        tags.map((tag) => (
                        <Box
                            key={uniqueID()}
                            sx={{
                                position: "relative",
                                display: "flex",
                                marginLeft: { xs: 4, sm: 0 },
                            }}
                        >
                            {userRole !== USER.PUBLIC && (
                                <>
                                    <EditTwoToneIcon
                                        sx={{
                                            position: "absolute",
                                            top: "-8px",
                                            left: "-8px",
                                            fontSize: "20px",
                                            color: "primary.main",
                                            cursor: "pointer",
                                            transition: "color 0.3s ease",
                                            zIndex: 1,
                                            "&:hover": {
                                                color: "primary.dark",
                                                transform: "scale(1.1)",
                                                opacity: 0.8,
                                            },
                                        }}
                                        onClick={() => handleOpenEditTagModal(tag as unknown as Tagz)}
                                    />
                                    <CancelTwoToneIcon
                                        sx={{
                                            position: "absolute",
                                            top: "-8px",
                                            right: "-8px",
                                            fontSize: "20px",
                                            color: "error.main",
                                            cursor: "pointer",
                                            transition: "color 0.3s ease",
                                            zIndex: 1,
                                            "&:hover": {
                                                color: "error.dark",
                                                transform: "scale(1.1)",
                                                opacity: 0.8,
                                            },
                                        }}
                                        onClick={() => {
                                            setSelectedTag(tag as Tagz);
                                            handleOpenDeleteModal();
                                        }}
                                    />
                                </>
                            )} 

                            <Chip
                                label={
                                    <Marker mark={searchMethod?.method.includes('isTag') ? ArabicServices.removeTashkeel(searchMethod?.search || '') : undefined} options={{className: 'custom-marker'}}>
                                        <span style={{ whiteSpace: "normal", wordBreak: "break-word", display: "block" }}>
                                            <strong>Arabic:</strong> {tag.ar},<br /> <strong>English:</strong> {tag.en}
                                        </span>
                                    </Marker>
                                }
                                variant="outlined"
                                onClick={()=>handleOpenCommentDialog(tag)}
                                sx={{
                                    ...(userRole !== USER.ADMIN && {
                                        cursor: 'pointer',
                                    }),
                                    borderRadius: { xs: "12px", sm: "16px" },
                                    backgroundColor: "#f5f5f5 !important",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                    transition: "transform 0.3s ease",
                                    maxWidth: "100%",
                                    height: 'auto',
                                    fontSize: { xs: "12px", sm: "14px" },
                                    padding: { xs: "2px 6px", sm: "4px 10px" },
                                    "& .MuiChip-label": {
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                        display: "block",
                                        fontSize: { xs: "12px", sm: "14px" },
                                    },
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        backgroundColor: "#f5f5f5 !important",
                                    },
                                }}
                            />
                        </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No tags available.
                        </Typography>
                    )
                )}
                </Box>
            </Box>

            {
                openCommentDialog &&
                <CommentDialog tagId={selectedTag?.id || 0} Chapter={Chapter} Verse={Verse} openCommentDialog={openCommentDialog} setOpenCommentDialog={setOpenCommentDialog}/>
            }

            {/* ===================================== Deletion Confirmation Modal ===================================== */}
            <Dialog
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" component="div" flex={1}>
                        Confirm Deletion
                    </Typography>
                    <IconButton
                        disabled={isLoading}
                        onClick={handleCloseDeleteModal}
                        sx={{
                            color: "white",
                            backgroundColor: "#FF6B6B",
                            width: "48px",
                            height: "48px",
                            "&:hover": {
                                backgroundColor: "darkred",
                            },
                            borderRadius: "8px",
                        }}
                    >
                        <CloseIcon fontSize="medium"/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1">
                        Are you sure you want to delete this tag? This action cannot be
                        undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ padding: "16px" }}>
                    <Button onClick={handleCloseDeleteModal} variant="outlined" color="primary" disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={() => {
                            if (selectedTag) handleDeleteTag(selectedTag);
                        }}
                        variant="contained"
                        color="error"
                        sx={{ bgcolor: "error.main", "&:hover": { bgcolor: "error.dark" } }}
                        startIcon={<DeleteIcon/>}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ ml: 2 }}/> : "Delete"} 
                    </Button>
                </DialogActions>
            </Dialog>

            {/* =================================== Add New Tag Modal =================================== */}
            <Dialog
                open={openAddTagModal}
                onClose={handleCloseAddTagModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Add New Tag
                    </Typography>
                    <IconButton
                        disabled={isLoading}
                        onClick={handleCloseAddTagModal}
                        sx={{
                            color: "white",
                            backgroundColor: "#FF6B6B",
                            width: "48px",
                            height: "48px",
                            "&:hover": {
                                backgroundColor: "darkred",
                            },
                            borderRadius: "8px",
                        }}
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                </DialogTitle>
                <DialogContent 
                    dividers 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddTag()
                        }
                    }}
                >
                    <TextField
                        disabled={isLoading}
                        margin="dense"
                        label="Arabic"
                        name="ar"
                        value={tagFields.ar}
                        onChange={handleFieldChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        disabled={isLoading}
                        margin="dense"
                        label="English"
                        name="en"
                        value={tagFields.en}
                        onChange={handleFieldChange}
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ padding: "16px" }}>
                    <Button
                        onClick={handleCloseAddTagModal}
                        disabled={isLoading}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddTag}
                        disabled={isLoading}
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ ml: 2 }}/> : "Add"} 
                    </Button>
                </DialogActions>
            </Dialog>

            {/* =========================================== Edit Tag Modal =========================================== */}
            <Dialog
                open={openEditTagModal}
                onClose={handleCloseEditTagModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Edit Tag
                    </Typography>
                    <IconButton 
                        onClick={handleCloseEditTagModal} 
                        disabled={isLoading}
                        sx={{
                            color: "white",
                            backgroundColor: "#FF6B6B",
                            width: "48px",
                            height: "48px",
                            "&:hover": {
                                backgroundColor: "darkred",
                            },
                            borderRadius: "8px",
                        }}
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                </DialogTitle>
                <DialogContent 
                    dividers 
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            await handleEditTag(tagFields)
                        }
                    }}
                >
                    <TextField
                        disabled={isLoading}
                        margin="dense"
                        label="Arabic"
                        name="ar"
                        value={tagFields.ar}
                        onChange={handleFieldChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        disabled={isLoading}
                        margin="dense"
                        label="English"
                        name="en"
                        value={tagFields.en}
                        onChange={handleFieldChange}
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions sx={{ padding: "16px" }}>
                    <Button
                        onClick={handleCloseEditTagModal}
                        disabled={isLoading}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleEditTag(tagFields)}
                        disabled={isLoading}
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ ml: 2 }}/> : "Save"} 
                    </Button>
                </DialogActions>
            </Dialog>
        </>
        
    )
}

export default DisplayTags