import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { USER } from "../utils/UserRoles";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import uniqueID from "../utils/helper/UniqueID";
import { Tag } from "../interfaces/Tag";
import { useAuth } from "../context/Auth/useAuth";
import CloseIcon from "@mui/icons-material/Close";
import { Tagz } from "../interfaces/SurahAyaInfo";
import {
    Save as SaveIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";
import { useState } from "react";

const DisplayTags = ({showTags=true, tagz}:{showTags?: boolean | undefined; tagz: Tagz[];}) => {
    const { userRole } = useAuth();

    const [tags, setTags] = useState(tagz);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openAddTagModal, setOpenAddTagModal] = useState(false);
    const [openEditTagModal, setOpenEditTagModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag>();
    const [tagFields, setTagFields] = useState<Tag>({ ar: "", en: "", type: "" });

    const handleOpenDeleteModal = () => setOpenDeleteModal(true);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const handleOpenAddTagModal = () => setOpenAddTagModal(true);
    const handleCloseAddTagModal = () => setOpenAddTagModal(false);

    const handleCloseEditTagModal = () => setOpenEditTagModal(false);

    const handleOpenEditTagModal = (tag: Tag) => {
        setSelectedTag(tag);
        setTagFields(tag);
        setOpenEditTagModal(true);
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTagFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteTag = (tagToDelete: Tag) => {
        setTags(() => tags?.filter((tag) => tag !== tagToDelete));
        handleCloseDeleteModal();
    };
    
    const handleAddTag = () => {
        if (tags) 
            setTags([...tags, tagFields]);
        setTagFields({ ar: "", en: "", type: "" });
        handleCloseAddTagModal();
    };

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
                }}
            >
                {userRole !== USER.PUBLIC && showTags && (
                    <AddCircleTwoToneIcon
                        sx={{
                            position: "absolute",
                            top: "-10px",
                            right: "-10px",
                            fontSize: "32px",
                            color: "primary.main",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.2)",
                            },
                        }}
                        onClick={handleOpenAddTagModal}
                    />
                )}

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
                                            "&:hover": {
                                            color: "primary.dark",
                                            },
                                        }}
                                        onClick={() => handleOpenEditTagModal(tag as unknown as Tag)}
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
                                            "&:hover": {
                                            color: "error.dark",
                                            },
                                        }}
                                        onClick={() => {
                                            setSelectedTag(tag as Tag);
                                            handleOpenDeleteModal();
                                        }}
                                    />
                                </>
                            )}

                            <Chip
                            label={`Arabic: ${tag.ar},   English: ${tag.en}`}
                            variant="outlined"
                            sx={{
                                borderRadius: "16px",
                                backgroundColor: "#f5f5f5",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                transform: "scale(1.05)",
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

            {/* Deletion Confirmation Modal */}
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
                <Button onClick={handleCloseDeleteModal} variant="outlined" color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                    console.log(selectedTag)
                    if (selectedTag) handleDeleteTag(selectedTag);
                    }}
                    variant="contained"
                    color="error"
                    sx={{ bgcolor: "error.main", "&:hover": { bgcolor: "error.dark" } }}
                    startIcon={<DeleteIcon/>}
                >
                    Delete
                </Button>
                </DialogActions>
            </Dialog>

            {/* Add New Tag Modal */}
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
                <DialogContent dividers>
                <TextField
                    margin="dense"
                    label="Arabic"
                    name="ar"
                    value={tagFields.ar}
                    onChange={handleFieldChange}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    margin="dense"
                    label="English"
                    name="en"
                    value={tagFields.en}
                    onChange={handleFieldChange}
                    fullWidth
                    variant="outlined"
                />
                {/* <TextField
                    margin="dense"
                    label="Type"
                    name="type"
                    value={tagFields.type}
                    onChange={handleFieldChange}
                    fullWidth
                    variant="outlined"
                /> */}
                </DialogContent>
                <DialogActions sx={{ padding: "16px" }}>
                <Button
                    onClick={handleCloseAddTagModal}
                    variant="outlined"
                    color="primary"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleAddTag}
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                >
                    Add
                </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Tag Modal */}
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
                <IconButton onClick={handleCloseEditTagModal} sx={{
                    color: "white",
                    backgroundColor: "#FF6B6B",
                    width: "48px",
                    height: "48px",
                    "&:hover": {
                        backgroundColor: "darkred",
                    },
                    borderRadius: "8px",
                    }}>
                    <CloseIcon fontSize="medium" />
                </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                <TextField
                    margin="dense"
                    label="Arabic"
                    name="ar"
                    value={tagFields.ar}
                    onChange={handleFieldChange}
                    fullWidth
                    variant="outlined"
                />
                <TextField
                    margin="dense"
                    label="English"
                    name="en"
                    value={tagFields.en}
                    onChange={handleFieldChange}
                    fullWidth
                    variant="outlined"
                />
                {/* <TextField
                    margin="dense"
                    label="Type"
                    name="type"
                    value={tagFields.type}
                    onChange={handleFieldChange}
                    fullWidth
                    variant="outlined"
                /> */}
                </DialogContent>
                <DialogActions sx={{ padding: "16px" }}>
                <Button
                    onClick={handleCloseEditTagModal}
                    variant="outlined"
                    color="primary"
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                    console.log("Tag edited", tagFields);
                    handleCloseEditTagModal();
                    }}
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                >
                    Save
                </Button>
                </DialogActions>
            </Dialog>
        </>
        
    )
}

export default DisplayTags