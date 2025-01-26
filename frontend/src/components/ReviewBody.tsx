import { useState } from "react";
import { Dialog,DialogTitle,DialogContent,Typography,TextField,Button,IconButton,Box, CircularProgress } from "@mui/material";
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
import VersePart from "./VersePart";
import DisplayTags from "./DisplayTags";
import CommentBox from "./CommentBox";
import { Comment } from "../interfaces/Comment";
import { insertComment } from "../services/Comments/insertComment.service";
import { getAllComments } from "../services/Comments/getAllComments.service";

const StyledReplyTwoToneIcon = styled(ReplyTwoToneIcon)({
  transform: "scale(-1, 1)"
});

export default function ReviewBody({ verses, showTags, selectedKeywords, selectedLanguage, searchMethod }: ReviewBodyProps) {

  const Chapter: number = verses.ayat[0].Chapter as number;
  const Verse: number = verses.ayat[0].Verse as number;

  const { userRole, user } = useAuth();
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleOpenCommentDialog = async () => {
    setOpenCommentDialog(true);
    setIsLoading(true);
    const response = await getAllComments(Chapter, Verse);
    if (response.success) {
      setComments(response.data);
      setIsLoading(false);
    }
  };

  const handleCloseCommentDialog = () => {
    setComments(() => []);
    setOpenCommentDialog(false);
    setNewComment("");
  };

  const handleAddComment = async () => {
    setIsLoading(true);
    if (newComment.trim()) {
      const response = await insertComment(Chapter, Verse, newComment);
      if (response.success) {
        const newCommentObj: Comment = {
          id: response.insertedCommentId,
          ayaNo: Verse,
          suraNo: Chapter,
          commentText: newComment,
          email: user?.email || '',
          userId: user?.id || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setComments((prevComments) => [...prevComments, newCommentObj]);
        setNewComment("");
        setIsLoading(false);
      }
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
            sx={{
              color: "primary.main",
              cursor: "pointer",
              transition: 'all ease 0.1s',
              "&:hover": {
                color: "primary.dark",
                transform: "scale(1.1)",
              },
            }}
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
              color: "primary.dark",
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
                transform: "scale(1.1)",
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

      <DisplayTags showTags={showTags} tagz={verses.tags || []} Chapter={Chapter} Verse={Verse}/>

      { /* comment dialog */}
      <Dialog
  open={openCommentDialog}
  onClose={handleCloseCommentDialog}
  maxWidth="sm"
  fullWidth
  fullScreen={window.innerWidth <= 600} // Enable fullscreen for small screens
>
  <DialogTitle
    sx={{
      display: "flex",
      alignItems: "center",
      padding: "8px 16px", // Reduce padding for better fit
    }}
  >
    <Typography
      variant="h6"
      component="div"
      sx={{ flexGrow: 1, fontSize: "1rem" }} // Smaller font size
    >
      Comment Section ({Chapter}:{Verse})
    </Typography>
    <IconButton
      onClick={handleCloseCommentDialog}
      sx={{
        color: "white",
        backgroundColor: "#FF6B6B",
        width: "40px", // Adjust size for mobile
        height: "40px",
        "&:hover": {
          backgroundColor: "darkred",
        },
        borderRadius: "8px",
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  </DialogTitle>
  <DialogContent
    dividers
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "80vh",
      padding: "8px", // Reduce padding for compactness
    }}
  >
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        marginBottom: 1,
        padding: "8px", // Add slight padding for spacing
      }}
    >
      <CommentBox
        comments={comments}
        setComments={setComments}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Stack elements on small screens
        gap: 1,
        borderTop: "1px solid #ccc",
        paddingTop: 1,
      }}
    >
      <TextField
        margin="dense"
        label="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        fullWidth
        variant="outlined"
        multiline
        minRows={1}
        maxRows={4}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddComment();
            setNewComment('');
          }
        }}
        sx={{
          fontSize: "0.9rem", // Adjust font size
        }}
      />
      <Button
        onClick={handleAddComment}
        variant="contained"
        color="primary"
        disabled={isLoading}
        startIcon={
          isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SaveIcon />
          )
        }
        sx={{
          fontSize: "0.9rem", // Adjust font size
          padding: "6px 12px", // Reduce padding
        }}
      >
        Add Comment
      </Button>
    </Box>
  </DialogContent>
</Dialog>

    </Box>
  );
}
