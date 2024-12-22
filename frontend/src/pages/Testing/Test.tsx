import { Box, Tooltip, Typography } from '@mui/material'
import uniqueID from '../../utils/helper/UniqueID';

const Test = () => {

    const array = ["My", "name", "is", "Nofil"];

    return (
        <>
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 4,
                }}
            >
                {
                    array.map(a => (
                        <Tooltip title={a} arrow>
                            <Typography key={uniqueID()} onClick={()=>console.log(a)} variant='h1'>
                                {a}
                            </Typography>
                        </Tooltip>
                    ))
                }
            </Box>
        </>
    )
}

export default Test