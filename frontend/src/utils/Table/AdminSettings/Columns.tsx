import { GridColDef } from '@mui/x-data-grid';
import { Button, MenuItem, Select, Stack, useMediaQuery, SelectChangeEvent } from '@mui/material';
import { ASColumnsParams } from '../../../interfaces/table/AS_Columns';
import { Roles } from '../../../interfaces/service/GetRoles';
import { useState } from 'react';

export const AS_Columns = ({ changeUserRole, roles }: ASColumnsParams): GridColDef[] => [
    { field: 'id', headerName: 'ID', flex: 0.5, headerAlign: "center" },
    { field: 'email', headerName: 'Email', flex: 1, headerAlign: "center" },
    { field: 'role', headerName: 'Role', flex: 0.5, headerAlign: "center" },
    {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        headerAlign: "center",
        renderCell: (params) => (
            <ActionButtons
                id={params.row.id}
                singleRow={params.row}
                roles={roles}
                changeUserRole={changeUserRole}
            />
        ),
        disableColumnMenu: true,
        sortable: false
    }
];

interface ActionButtonsProps {
    id: string;
    singleRow?: {
        id: number;
        email: string;
        role: string;
    };
    roles: Roles[] | undefined;
    changeUserRole: (userId: number, newRole: string | number) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
const ActionButtons = ({ id, singleRow, roles, changeUserRole }: ActionButtonsProps) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [selectedRole, setSelectedRole] = useState<string>(singleRow?.role || "");

    const handleChangeRoleSubmit = () => {
        if (selectedRole) {
            const rol = roles?.filter(r => r.roleName === selectedRole)[0].id;
            if (rol)
                changeUserRole(parseInt(id), rol);
        }
    };

    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        console.log(singleRow);
        setSelectedRole(event.target.value);
    };

    return (
        <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 1 : 2}
            alignItems="center"
            justifyContent="center"
            sx={{
                padding: isMobile ? '8px 0' : '8px 16px',
                borderRadius: 2,
                backgroundColor: '#f7f7f7',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Select
                value={selectedRole || ""}
                onChange={handleRoleChange}
                size="small"
                fullWidth={isMobile}
                sx={{
                    minWidth: isMobile ? '100%' : '150px',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    '& .MuiSelect-select': {
                        padding: '8px 12px',
                    },
                }}
            >
                {roles?.map((role) => (
                    <MenuItem key={role.id} value={role.roleName}>
                        {role.roleName}
                    </MenuItem>
                ))}
            </Select>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleChangeRoleSubmit}
                fullWidth={isMobile}
                sx={{
                    padding: '6px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#007bff',
                    '&:hover': {
                        backgroundColor: '#0056b3',
                    },
                }}
            >
                Change Role
            </Button>
        </Stack>
    );
};

export default AS_Columns;
