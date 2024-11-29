import React, { useEffect, useState } from 'react'
import Header from '../layout/Header';
import Heading from '../components/Heading';
import FileUploader from '../components/FileUploader';
import MatTable from '../components/MatTable';
// import { AS_Rows } from '../utils/Table/AdminSettings/Rows';
import { AS_Columns } from '../utils/Table/AdminSettings/Columns';
import { Box } from '@mui/material';
import { getUsers } from '../services/Users/getUsers.service';
import { getRoleName } from '../utils/functions/getRoleName';
import { useAuth } from '../context/Auth/useAuth';
import { Roles } from '../interfaces/service/GetRoles';
import { getRoles } from '../services/Users/getRoles.service';
import { changeUserRole } from '../services/Users/changeRole.service';

interface AdminGotUsers {
    id: number, 
    email: string,
    role: string | number,
}

const AdminSettings: React.FC = () => {

    const [userRows, setUserRows] = useState<AdminGotUsers[]>();
    const [roles, setRoles] = useState<Roles[]>();
    const {user} = useAuth();

    const handleChangeUserRole = async (userId: number, newRole: string | number) => {
        const response = await changeUserRole(userId, newRole);
        if (response.success) {
            const newRoleNm = roles?.filter(r => r.id === newRole)[0].roleName;
            if (newRoleNm)
                setUserRows(prevRows => 
                    prevRows?.map(user => user.id === userId ? { ...user, role: newRoleNm } : user)
                );
        }
    }

    useEffect(() => {
        
        (async () => {
            // =================================
            // ALL USERS DATA 
            // =================================
            const userResponse = await getUsers();
            setUserRows(
                userResponse.users
                    ?.filter(usr => usr.email !== user?.email)
                    ?.map(usr => ({
                        email: usr.email,
                        id: usr.id,
                        role: usr.role?.roleName ?? getRoleName(usr.roleID || 2) ?? "",
                    })) || []
            );

            // =================================
            // ALL USERS ROLES 
            // =================================
            const rolesResponse = await getRoles();
            setRoles(rolesResponse?.data?.map(r => ({
                ...r,
                // roleName: r.id===3 ? `${r.roleName} (Block to Login)` : r.roleName
            })));
        })()

    }, [])

    return (
        <React.Fragment>
            <Header/>
            <Heading data='Admin Settings'/>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                width: { sm: "100%", xs: "100%" },
                justifyContent: 'center',
            }}>
                <MatTable rowz={userRows} columnz={AS_Columns({ changeUserRole: handleChangeUserRole, roles: roles })} widthIn={100} />
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' }, // Change direction based on screen size
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: { xs: 0, md: 5 },
                    width: '70%',
                }}>
                    <FileUploader title='Verses Upload' />
                    <FileUploader title='Tags Upload' />
                </Box>
            </Box>            
        </React.Fragment>
    )
}

export default AdminSettings;
