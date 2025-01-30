import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import CommentBox from "./CommentBox";
import { Save as SaveIcon } from "@mui/icons-material";
import { insertComment } from "../services/Comments/insertComment.service";
import { getAllComments } from "../services/Comments/getAllComments.service";
import { useAuth } from '../context/Auth/useAuth';
import { Comment } from '../interfaces/Comment';

const CommentDialog = ({ Chapter, Verse, setOpenCommentDialog, openCommentDialog }:{ Chapter: number, Verse: number, openCommentDialog: boolean, setOpenCommentDialog: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setOpenCommentDialog(true);
            setIsLoading(true);
            const response = await getAllComments(Chapter, Verse);
            if (response.success) {
                setComments(response.data);
                setIsLoading(false);
            }   
        })()
    }, [Chapter, Verse, setOpenCommentDialog])
    
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
                    username: user?.username || '',
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

    return (
        <Dialog
            open={openCommentDialog}
            onClose={handleCloseCommentDialog}
            maxWidth="sm"
            fullWidth
            fullScreen={window.innerWidth <= 600}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, fontSize: "1rem" }}
                >
                    Comment Section ({Chapter}:{Verse})
                </Typography>
                <IconButton
                    onClick={handleCloseCommentDialog}
                    sx={{
                        color: "white",
                        backgroundColor: "#FF6B6B",
                        width: "40px",
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
                    padding: "8px",
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        marginBottom: 1,
                        padding: "8px",
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
                        flexDirection: "column",
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
                            fontSize: "0.9rem",
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
                            fontSize: "0.9rem",
                            padding: "6px 12px",
                        }}
                    >
                        Add Comment
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog