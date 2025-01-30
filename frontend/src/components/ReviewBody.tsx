import { Typography, Box } from "@mui/material";
import ReplyTwoToneIcon from "@mui/icons-material/ReplyTwoTone";
import { styled } from "@mui/material/styles";
import { ReviewBodyProps } from "../interfaces/ReviewBody";
import InsertCommentTwoToneIcon from "@mui/icons-material/InsertCommentTwoTone";
import { USER } from "../utils/UserRoles";
import { useAuth } from "../context/Auth/useAuth";
import { openNewTab } from "../utils/functions/openNewTab";
import VersePart from "./VersePart";
import DisplayTags from "./DisplayTags";
import CommentDialog from "./CommentDialog";
import { useState } from "react";

const StyledReplyTwoToneIcon = styled(ReplyTwoToneIcon)({
  transform: "scale(-1, 1)"
});

export default function ReviewBody({ verses, showTags, selectedKeywords, selectedLanguage, searchMethod }: ReviewBodyProps) {
  
  const { userRole } = useAuth();

  const Chapter: number = verses.ayat[0].Chapter as number;
  const Verse: number = verses.ayat[0].Verse as number;

  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const handleOpenCommentDialog = () => {
    setOpenCommentDialog(true);
  }
  
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

      <DisplayTags showTags={showTags} tagz={verses.tags || []} Chapter={Chapter} Verse={Verse} searchMethod={searchMethod}/>

      {
        openCommentDialog &&
        <CommentDialog Chapter={Chapter} Verse={Verse} openCommentDialog={openCommentDialog} setOpenCommentDialog={setOpenCommentDialog}/>
      }
      
    </Box>
  );
}
