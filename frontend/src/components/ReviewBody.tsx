import { useState } from "react";
import { Dialog,DialogTitle,DialogContent,DialogActions,Typography,TextField,Button,IconButton,Box,Chip } from "@mui/material";
import {
  Save as SaveIcon,
} from "@mui/icons-material";
import ReplyTwoToneIcon from "@mui/icons-material/ReplyTwoTone";
import { styled } from "@mui/material/styles";
import { ReviewBodyProps } from "../interfaces/ReviewBody";
import InsertCommentTwoToneIcon from "@mui/icons-material/InsertCommentTwoTone";
import { USER } from "../utils/UserRoles";
import { useAuth } from "../context/Auth/useAuth";
import CloseIcon from "@mui/icons-material/Close";
import { openNewTab } from "../utils/functions/openNewTab";
import uniqueID from "../utils/helper/UniqueID";
import VersePart from "./VersePart";
import DisplayTags from "./DisplayTags";

const StyledReplyTwoToneIcon = styled(ReplyTwoToneIcon)({
  transform: "scale(-1, 1)"
});

export default function ReviewBody({ verses, showTags, selectedKeywords, selectedLanguage, searchMethod }: ReviewBodyProps) {

  const { userRole } = useAuth();
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

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

      <DisplayTags showTags={showTags} tagz={verses.tags || []} />

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
