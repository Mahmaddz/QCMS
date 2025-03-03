import { Typography, Box } from "@mui/material";
import ReplyTwoToneIcon from "@mui/icons-material/ReplyTwoTone";
import { styled } from "@mui/material/styles";
import { ReviewBodyProps } from "../interfaces/ReviewBody";
import { openNewTab } from "../utils/functions/openNewTab";
import VersePart from "./VersePart";
import DisplayTags from "./DisplayTags";

const StyledReplyTwoToneIcon = styled(ReplyTwoToneIcon)({
  transform: "scale(-1, 1)"
});

export default function ReviewBody({ verses, showTags, selectedKeywords, selectedLanguage, searchMethod, verseNumber, isSelectedAya }: ReviewBodyProps) {

  const Chapter: number = verses.ayat[0].Chapter as number;
  const Verse: number = verses.ayat[0].Verse as number;

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
        backgroundColor: isSelectedAya ? "lightgray" : "#ffffff",
        width: { xs: "90%", sm: "75%" },
        marginBottom: 2,
        ...(verseNumber && {
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
          },
        })
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: { xs: 2, sm: 4 },
          gap: { xs: 1, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
        }}
      >
        {/* {userRole !== USER.PUBLIC && (
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
        )} */}

        <Typography
          variant="body2"
          sx={{
            flexShrink: 0,
            fontWeight: "bold",
            color: "gray",
            maxWidth: { sm: 120 },
            marginBottom: { xs: 1, sm: 0 },
            marginTop: { xs: 1, sm: 0 },
            ...(verseNumber && {
              borderRadius: "50%",
              backgroundColor: "#1976d2",
              padding: 2,
              color: "white",
              height: { sm: 5, xs: 2 },
              width: { sm: 5, xs: 2 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            })
          }}
        >
          {verses.suraName || verseNumber}
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
          }}
          onClick={() => !verseNumber && handleShowCompleteSurah(verses?.suraName || "")}
        >
          {
            !verseNumber &&
            <>
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
                  color: verseNumber ? 'white' : "gray",
                  textWrap: 'nowrap',
                  fontSize: { sm: "15px", xs: "10px" },
                }}
              >
                Jump To Verse
              </Typography>
            </>
          }
        </Box>
      </Box>

      <DisplayTags showTags={showTags} tagz={verses.tags || []} Chapter={Chapter} Verse={Verse} searchMethod={searchMethod}/>
      
    </Box>
  );
}
