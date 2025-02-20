import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import CommentBox from "./CommentBox";
import { Save as SaveIcon } from "@mui/icons-material";
import { insertComment } from "../services/Comments/insertComment.service";
import { getAllComments } from "../services/Comments/getAllComments.service";
import { useAuth } from '../context/Auth/useAuth';
import { Comment, COMMENT_TYPES, CommentType } from '../interfaces/Comment';
import uniqueID from '../utils/helper/UniqueID';
import Toaster from '../utils/helper/Toaster';

const CommentDialog = ({ Chapter, Verse, setOpenCommentDialog, openCommentDialog, tagId }:{ Chapter: number, Verse: number, openCommentDialog: boolean, setOpenCommentDialog: React.Dispatch<React.SetStateAction<boolean>>, tagId: number }) => {

    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<{ text: string; type: CommentType } | null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setOpenCommentDialog(true);
            setIsLoading(true);
            const response = await getAllComments(Chapter, Verse, tagId);
            if (response.success) {
                setComments(response.data);
                setIsLoading(false);
            }
        })()
    }, [Chapter, Verse, setOpenCommentDialog, tagId])
    
    const handleCloseCommentDialog = () => {
        setComments(() => []);
        setOpenCommentDialog(false);
        setNewComment(null);
    };

    const handleAddComment = async () => {
        if (newComment?.text.trim() && newComment.type) {
            setIsLoading(true);
            const response = await insertComment(Chapter, Verse, newComment?.text, newComment.type, tagId);
            if (response.success) {
                const newCommentObj: Comment = {
                    id: response.insertedCommentId,
                    ayaNo: Verse,
                    suraNo: Chapter,
                    commentText: newComment?.text,
                    commentType: newComment.type,
                    username: user?.username || '',
                    userId: user?.id || 0,
                    tagId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                setComments((prevComments) => [...prevComments, newCommentObj]);
                setNewComment(null);
                setIsLoading(false);
            }
            else {
                setIsLoading(false);
            }
        }
        else {
            Toaster('Empty Comment Fields Are Not Allowed', 'error');
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
                        tagId={tagId}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        borderTop: "1px solid #ccc",
                        paddingTop: 2,
                        paddingX: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 1.5,
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            margin="dense"
                            label="Add a comment"
                            value={newComment?.text || ''}
                            name="text"
                            onChange={(e) =>
                                setNewComment((prev) => ({
                                    ...(prev ?? { text: '', type: CommentType.SUGGESTION }),
                                    text: e.target.value,
                                }))
                            }
                            fullWidth
                            variant="outlined"
                            multiline
                            minRows={1}
                            maxRows={4}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleAddComment();
                                }
                            }}
                            sx={{
                                fontSize: "0.9rem",
                                flex: 1,
                                borderRadius: "8px",
                                backgroundColor: "#fff",
                                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                            }}
                        />
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                labelId={uniqueID()}
                                id="Type"
                                name="type"
                                value={newComment?.type || ''}
                                label="Type"
                                onChange={(e) =>
                                    setNewComment((prev) => ({
                                        ...(prev ?? { text: '', type: 'SUGGESTION' }),
                                        type: e.target.value as CommentType
                                    }))
                                }
                                sx={{
                                    borderRadius: "8px",
                                    backgroundColor: "#fff",
                                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                                }}
                            >
                                {COMMENT_TYPES.map((item) => (
                                    <MenuItem key={uniqueID()} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
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
                            padding: "8px 16px",
                            textTransform: "none",
                            fontWeight: "bold",
                            borderRadius: "6px",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                backgroundColor: "#0056b3",
                                transform: "scale(1.02)",
                            },
                            "&:disabled": {
                                backgroundColor: "#ccc",
                                cursor: "not-allowed",
                            },
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