import React, { useState } from "react";
import { Dialog,DialogTitle,DialogContent,DialogActions,Typography,TextField,Button,IconButton,Box,Chip, Tooltip, Skeleton } from "@mui/material";
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

const StyledReplyTwoToneIcon = styled(ReplyTwoToneIcon)({
  transform: "scale(-1, 1)"
});

export default function ReviewBody({ verses, tags: initialTags, showTags, isLoading }: ReviewBodyProps) {

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
    const data = {
      sura: suraNo,
      aya: ayaNo,
    }
    openNewTab('/ayat-reference', data);
  };

  const handleShowResultAgainstTerm = (term: string) => {
    const data = {
      search: term
    }
    openNewTab('/', data);
  }

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
          {isLoading ? <Skeleton width={100} /> : verses.suraName}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 1,
              width: '100%',
            }}
          >
            {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="text"
                  width={50}
                  height={40}
                  sx={{ margin: '4px' }}
                />
              ))
            : verses.ayat.map((verse) => (
                <Tooltip 
                  title={
                    <>
                      <Typography
                        sx={{
                          fontSize: "3",
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      >
                        <b>POS Tag:</b> {verse.PoS_tags}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "3",
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      >
                        <b>Stem Pattern:</b> {verse.Stem_pattern}
                      </Typography>
                    </>
                  }
                  placement="top" 
                  arrow 
                  key={verse.word}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 500,
                      color: 'text.primary',
                      fontSize: { xs: '1.8rem', sm: '2.125rem' },
                      cursor: 'pointer',
                      textAlign: 'center',
                      direction: 'rtl',
                      '&:hover': {
                        color: 'secondary.main',
                      },
                      '&:active': {
                        color: 'primary.main',
                      },
                    }}
                    onClick={() => handleShowResultAgainstTerm(verse.word)}
                  >
                    {verse.word}
                  </Typography>
                </Tooltip>
              ))}
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontStyle: "italic",
              color: "text.secondary",
              marginTop: "4px",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              maxWidth: { sm: 900 },
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                }}
              >
                <Skeleton width={400} />
              </Box>
            ) : (
              verses.ayat.map((w) => w.wordUndiacritizedNoHamza).join(" ")
            )}
          </Typography>

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
            handleShowCompleteSurah(verses.suraName);
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

        {showTags ? (
          tags && tags?.length > 0 ? (
            tags.map((tag, index) => (
              <Box
                key={index}
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
                  label={
                    "type" in tag && "ar" in tag && "en" in tag
                      ? `Type: ${tag.type}   Ar: ${tag.ar}   En: ${tag.en}`
                      : null
                  }
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
        ) : (
          isLoading && Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} sx={{ width: "150px", height: "40px" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{
                  borderRadius: "16px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
              />
            </Box>
          ))
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
