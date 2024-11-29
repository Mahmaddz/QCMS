import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ImportContactsTwoToneIcon from '@mui/icons-material/ImportContactsTwoTone';
import { userBasedRoutes } from '../utils/functions/UserBasedRoutes';
import { PageRoute } from '../interfaces/PageRoute';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth/useAuth';
import { USER } from '../utils/UserRoles';
import PersonIcon from '@mui/icons-material/Person';
import { Divider, ListItemIcon } from '@mui/material';
import { Lock, Logout } from '@mui/icons-material';

function Header() {
    const navigate = useNavigate();
    const { userRole, setUserRole, user } = useAuth();

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [pages, setPage] = useState<PageRoute[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userRole !== undefined) {
            setPage(userBasedRoutes(userRole));
            setLoading(false);
        }
    }, [userRole]);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page: string) => {
        setAnchorElNav(null);
        navigate(page);
    };

    const handleCloseUserMenu = (setting: string) => {
        setAnchorElUser(null);
        if (setting === 'Logout') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userRole');
            setUserRole(USER.PUBLIC);
            navigate('/');
        } else {
            switch (setting) {
                case 'Login':
                    navigate('/login');
                    break;
                case 'Register':
                    navigate('/register');
                    break;
                default:
                    console.log('something else route');
                    break;
            }
        }
    };

    if (loading) {
        return null;
    }

    return (
        <Box>
            <AppBar position="fixed">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <ImportContactsTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            QCMS
                        </Typography>

                        {userRole === USER.ADMIN && (
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={() => setAnchorElNav(null)}
                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                    {pages.map((page) => (
                                        <MenuItem key={page.path} onClick={() => handleCloseNavMenu(page.path)}>
                                            <Typography textAlign="center">{page.displayName}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        )}
                        <ImportContactsTwoToneIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            QCMS
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {userRole === USER.ADMIN &&
                                pages.map((page) => (
                                    <Button
                                        key={page.path}
                                        onClick={() => handleCloseNavMenu(page.path)}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page.displayName}
                                    </Button>
                                ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            {userRole !== USER.PUBLIC ? (
                                <>
                                    <Tooltip title="Profile">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <PersonIcon sx={{ mr: 1, color: 'white', padding: 1 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorElUser}
                                        open={Boolean(anchorElUser)}
                                        onClose={() => setAnchorElUser(null)}
                                        PaperProps={{
                                            elevation: 4,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.15))',
                                                width: '300px',
                                                mt: 1.5,
                                                borderRadius: '8px',
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <Box sx={{ px: 2, py: 1 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    Email:
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                    sx={{
                                                        maxWidth: '180px',
                                                        whiteSpace: 'normal',
                                                        wordWrap: 'break-word',
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    {user?.email}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    Role:
                                                </Typography>
                                                <Typography variant="body2" color="gray">
                                                    {user?.role.roleName}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        <NavLink to="/reset-password" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <Lock fontSize="small" />
                                                </ListItemIcon>
                                                Reset Password
                                            </MenuItem>
                                        </NavLink>

                                        <MenuItem onClick={() => handleCloseUserMenu('Logout')}>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: { xs: 0, sm: 2 } }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            paddingX: 3,
                                            paddingY: 1,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                borderColor: 'white',
                                            },
                                        }}
                                        onClick={() => navigate('/login')}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            color: 'primary.main',
                                            backgroundColor: '#CCCCFF',
                                            paddingX: 3,
                                            paddingY: 1,
                                            transition: 'all 0.3s ease', // Smooth transition
                                            '&:hover': {
                                                color: '#FFFFFF', // Changing text color on hover
                                                backgroundColor: '#9999CC', // Darker shade for hover background
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Adds shadow on hover
                                            },
                                        }}
                                        onClick={() => navigate('/register')}
                                    >
                                        Register
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            
            <Box sx={{ height: '64px' }} /> 
        </Box>
    );
}

export default Header;
