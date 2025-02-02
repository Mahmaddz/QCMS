import {
    Paper,
    Typography,
    Box,
    IconButton,
    Button,
    TextField,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    useMediaQuery,
    Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { Comment } from "../interfaces/Comment";
import { useAuth } from "../context/Auth/useAuth";
import { removeComment } from "../services/Comments/deleteComment.service";
import { modifyComment } from "../services/Comments/updateComment.service";
import { USER } from "../utils/UserRoles";

const CommentBox = ({ comments = [], setComments, isLoading, setIsLoading, tagId }: { comments: Comment[]; setComments: React.Dispatch<React.SetStateAction<Comment[]>>; setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; isLoading: boolean; tagId: number}) => {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [editText, setEditText] = useState<string>("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const handleDeleteClick = (comment: Comment) => {
        setSelectedComment(comment);
        setDeleteDialogOpen(true);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedComment(null);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        if (selectedComment) {
            const response = await removeComment(selectedComment.id as number);
            if (response.success) {
                setComments((prev) =>
                    prev.filter((comment) => comment.id !== selectedComment.id)
                );
                setIsLoading(false);
                setDeleteDialogOpen(false);
                setSelectedComment(null);
            }
            else {
                setIsLoading(false);
                setDeleteDialogOpen(false);
                setSelectedComment(null);
            }
        }
    };

    const onEdit = (comment: Comment) => {
        setSelectedComment(comment);
        setEditText(comment.commentText);
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        if (selectedComment) {
            const response = await modifyComment(selectedComment.id as number, selectedComment.suraNo as number, selectedComment.ayaNo as number, editText, tagId);
            if (response.success) {
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === selectedComment.id
                        ? { ...comment, commentText: editText }
                        : comment
                    )
                );
                setSelectedComment(null);
                setEditText("");
            }
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedComment(null);
        setEditText("");
    };

    const getPostedDate = (createdAt: string, updatedAt: string | undefined) => {
        const laterDate = new Date(createdAt) > new Date(updatedAt || '') ? createdAt : updatedAt;
        const [date, time] = laterDate?.split('T') || createdAt.split('T');
        return `${date} ${time.slice(0,8)}`;
    }

    return (
        <React.Fragment>
            <Paper
                sx={{
                    padding: isMobile ? "20px" : "40px",
                    borderRadius: "15px",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fafafa",
                    width: isMobile ? "95%" : "80%",
                    margin: "0 auto",
                }}
            >
            {
                isLoading ? (
                    [...Array(3)].map((_, index) => (
                        <Box key={index} sx={{ marginBottom: 4 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: isMobile ? "column" : "row",
                                    alignItems: isMobile ? "flex-start" : "center",
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width={120} height={24} />
                                    <Skeleton variant="rectangular" width="100%" height={60} sx={{ marginTop: 1 }} />
                                    <Skeleton variant="text" width={80} height={18} sx={{ marginTop: 1 }} />
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Skeleton variant="circular" width={30} height={30} />
                                    <Skeleton variant="circular" width={30} height={30} />
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                        </Box>
                    ))
                ) : (
                    comments.length === 0 ? (
                        <Typography variant="h4" textAlign={'center'} fontStyle={'italic'}>
                            No Comments Found
                        </Typography>
                    ) : (
                        comments?.map((comment, index) => (
                            <Box key={index} sx={{ marginBottom: 4 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isMobile ? "column" : "row",
                                        alignItems: isMobile ? "flex-start" : "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "#444",
                                            }}
                                        >
                                            {comment.username}
                                        </Typography>
                                        {selectedComment?.id === comment.id && editText ? (
                                            <Box sx={{ marginTop: "8px" }}>
                                                <TextField
                                                    fullWidth
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ marginBottom: "8px" }}
                                                    multiline
                                                    minRows={1}
                                                    maxRows={5}
                                                />
                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={handleUpdate}
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={handleCancel}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: "#555",
                                                        marginTop: "8px",
                                                    }}
                                                >
                                                    {comment.commentText}
                                                </Typography>
                                                {
                                                    comment.createdAt &&
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "gray",
                                                            marginTop: "10px",
                                                            display: "block",
                                                        }}
                                                    >
                                                        posted at {getPostedDate(comment.createdAt, comment.updatedAt)}
                                                    </Typography>
                                                }
                                            </>
                                        )}
                                        </Box>
                                        {
                                            <Box sx={{ display: "flex", gap: 1 }}>
                                                {
                                                    user?.id === comment.userId && selectedComment?.id !== comment.id &&
                                                    <>
                                                        <IconButton
                                                            onClick={() => onEdit(comment)}
                                                            sx={{
                                                                color: "#FFB74D",
                                                                "&:hover": {
                                                                    color: "#FF9800",
                                                                },
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleDeleteClick(comment)}
                                                            sx={{
                                                                color: "#FF6B6B",
                                                                "&:hover": {
                                                                    color: "#D32F2F",
                                                                },
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </>
                                                }
                                                {
                                                    user?.id === comment.userId || user?.roleID === USER.ADMIN &&
                                                    <IconButton
                                                        onClick={() => handleDeleteClick(comment)}
                                                        sx={{
                                                            color: "#FF6B6B",
                                                            "&:hover": {
                                                                color: "#D32F2F",
                                                            },
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            </Box>
                                        }
                                    </Box>
                                <Divider sx={{ my: 2 }} />
                            </Box>
                        ))
                    )
                )
            }
            </Paper>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                aria-labelledby="delete-confirmation-dialog"
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancelDelete}
                        variant="outlined"
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <DeleteIcon />
                            )
                        }
                        disabled={isLoading}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default CommentBox;