import React, { useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Typography,TextField,Button,IconButton,Box,Chip} from "@mui/material";
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

const StyledReplyTwoToneIcon = styled(ReplyTwoToneIcon)({
  transform: "scale(-1, 1)"
});

export default function ReviewBody({ surah, aya1, aya2, tags: initialTags, showTags }: ReviewBodyProps) {

  const { userRole } = useAuth();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddTagModal, setOpenAddTagModal] = useState(false);
  const [openEditTagModal, setOpenEditTagModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const [tagFields, setTagFields] = useState<Tag>({ ar: "", en: "", type: "" });
  const [tags, setTags] = useState(initialTags);
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
      setComments([...comments, newComment]); // Add new comment to the list
      setNewComment(""); // Clear the input field
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTagFields((prev) => ({ ...prev, [name]: value }));
    console.log(selectedTag);
  };

  const handleDeleteTag = (tagToDelete: Tag) => {
    setTags(tags?.filter((tag) => tag !== tagToDelete));
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
    // const [, suraArabicName, suraEngName] = ayatReference.split(" - ").map(val => val.trim());
    const path = '/ayat-reference';
    const queryParams = `?sura=${suraNo}&aya=${ayaNo}`;
    window.open(`${window.location.origin}${path}${queryParams}`, '_blank');
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
      {/* Heading Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: { xs: 2, sm: 4 },
          gap: { xs: 1, sm: 2 },
          borderBottom: "1px solid #E0E0E0",
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" }
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
          {surah}
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            paddingRight: 9,
            textAlign: { xs: "center", sm: "center" },
            marginLeft: { sm: 2, xs: 6 },
            marginRight: { sm: 2 },
          }}
        >
          {/* <Marker mark={toFilterAyat}> */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: "500",
                color: "text.primary",
                fontSize: { xs: "1.8rem", sm: "2.125rem" },
                maxWidth: { sm: 900 }
              }}
            >
              {aya1}
            </Typography>
          {/* </Marker> */}
          {/* <Marker mark={filterAyat(aya2, toFilterAyat)}> */}
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "text.secondary",
                marginTop: "4px",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                maxWidth: { sm: 900 }
              }}
            >
              {aya2}
            </Typography>
          {/* </Marker> */}
        </Box>

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
          onClick={() => {
            // console.log(surah, aya1, aya2);
            handleShowCompleteSurah(surah);
          }}
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

      {/* Body Section */}
      <Box 
        sx={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          marginTop: "20px",
          paddingBottom: "10px",
          gap: "20px"
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
              marginLeft: 5,
            }}
            onClick={handleOpenAddTagModal}
          />
        )}

        {/* Existing tag display */}
        {showTags && tags?.map((tag, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              display: "flex",
              marginLeft: { xs: 4, sm: 0 }
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
                    cursor: "pointer"
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
                    cursor: "pointer"
                  }}
                  onClick={() => {  setSelectedTag(tag as Tag) ;handleOpenDeleteModal() }}
                />
              </>
            )}

            <Chip
              label={
                'type' in tag && 'ar' in tag && 'en' in tag
                  ? `Type: ${tag.type}   Ar: ${tag.ar}   En: ${tag.en}`
                  : null
              }
              variant="outlined"
              sx={{
                borderRadius: "16px",
                backgroundColor: "#f5f5f5"
              }}
            />
          </Box>
        ))}
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
          <TextField
            margin="dense"
            label="Type"
            name="type"
            value={tagFields.type}
            onChange={handleFieldChange}
            fullWidth
            variant="outlined"
          />
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
          <TextField
            margin="dense"
            label="Type"
            name="type"
            value={tagFields.type}
            onChange={handleFieldChange}
            fullWidth
            variant="outlined"
          />
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
              comments.map((comment, index) => (
                <Chip
                  key={index}
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
