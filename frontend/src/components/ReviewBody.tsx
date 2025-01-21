import React, { useState } from "react";
import { Dialog,DialogTitle,DialogContent,DialogActions,Typography,TextField,Button,IconButton,Box,Chip } from "@mui/material";
import {
  Save as SaveIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import ReplyTwoToneIcon from "@mui/icons-material/ReplyTwoTone";
import { styled } from "@mui/material/styles";
import { ReviewBodyProps } from "../interfaces/ReviewBody";
import InsertCommentTwoToneIcon from "@mui/icons-material/InsertCommentTwoTone";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import { USER } from "../utils/UserRoles";
import { Tag } from "../interfaces/Tag";
import { useAuth } from "../context/Auth/useAuth";
// import { Marker } from "react-mark.js";
import CloseIcon from "@mui/icons-material/Close";
// import uniqueID from "../utils/helper/UniqueID";
import { openNewTab } from "../utils/functions/openNewTab";
import uniqueID from "../utils/helper/UniqueID";
import VersePart from "./VersePart";

const StyledReplyTwoToneIcon = styled(ReplyTwoToneIcon)({
  transform: "scale(-1, 1)"
});

export default function ReviewBody({ verses, showTags, selectedKeywords, selectedLanguage, searchMethod }: ReviewBodyProps) {

  const { userRole } = useAuth();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddTagModal, setOpenAddTagModal] = useState(false);
  const [openEditTagModal, setOpenEditTagModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const [tagFields, setTagFields] = useState<Tag>({ ar: "", en: "", type: "" });
  const [tags, setTags] = useState(verses.tags);
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

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

  const handleOpenCommentDialog = () => setOpenCommentDialog(true);
  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
    setNewComment("");
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTagFields((prev) => ({ ...prev, [name]: value }));
    console.log(selectedTag);
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

  const handleShowCompleteSurah = (ayatReference: string) => {
    const [suraNo, ayaNo] = ayatReference.split('-')[0].trim().split(':');
    const data = {
      sura: suraNo,
      aya: ayaNo,
    }
    openNewTab('/ayat-reference', data);
  };

  return (
    <Box
      sx={{
        boxShadow: 3,
        borderRadius: "8px",
        padding: "20px",
        margin: "auto",
        backgroundColor: "#ffffff",
        width: { xs: "90%", sm: "75%" },
        marginBottom: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: { xs: 2, sm: 4 },
          gap: { xs: 1, sm: 2 },
          borderBottom: '1px solid #E0E0E0',
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
          backgroundColor: '#f9f9f9',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
        }}
      >
        {userRole !== USER.PUBLIC && (
          <InsertCommentTwoToneIcon
            sx={{ color: "primary.main" }}
            onClick={handleOpenCommentDialog}
          />
        )}

        <Typography
          variant="body2"
          sx={{
            flexShrink: 0,
            fontWeight: "bold",
            color: "gray",
            maxWidth: { sm: 120 },
            marginBottom: { xs: 1, sm: 0 }
          }}
        >
          {verses.suraName}
        </Typography>

        <VersePart selectedKeywords={selectedKeywords} selectedLanguage={selectedLanguage} verses={verses} searchMethod={searchMethod}/>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            "&:hover": {
              color: "primary.dark"
            },
            marginTop: { xs: 2, sm: 0 }
          }}
          onClick={() => handleShowCompleteSurah(verses?.suraName || "")}
        >
          <StyledReplyTwoToneIcon
            sx={{
              fontSize: { xs: "28px", sm: "32px" },
              color: "primary.main",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: "500",
              color: "gray",
              textWrap: 'nowrap',
            }}
          >
            Jump To Verse
          </Typography>
        </Box>
      </Box>

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

      { /* comment dialog */}
      <Dialog
        open={openCommentDialog}
        onClose={handleCloseCommentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Comment Section
          </Typography>
          <IconButton onClick={handleCloseCommentDialog} sx={{
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
            label="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Previous Comments:
            </Typography>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Chip
                  key={uniqueID()}
                  label={comment}
                  variant="outlined"
                  sx={{
                    margin: "4px",
                    backgroundColor: "#f5f5f5",
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={handleCloseCommentDialog}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddComment}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
