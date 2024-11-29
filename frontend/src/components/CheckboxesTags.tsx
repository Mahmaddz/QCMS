import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface CheckboxesTagsProps {
  options: string[];
  currentValue: string[];
  onChange: (selected: string[]) => void;
}

const CheckboxesTags: React.FC<CheckboxesTagsProps> = ({ options, currentValue, onChange }) => {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={options}
      value={currentValue}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      sx={{
        borderColor: 'primary.main',
        color: 'primary.main',
        fontSize: '14px',
        padding: '6px 12px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: 500,
        minWidth: { md: 400, xs: 300 },
        marginLeft: { xs: 3 },
        '& .MuiChip-deleteIcon': {
          color: 'primary.main',
          '&:hover': {
            color: 'primary.dark',
          },
        },
        '@mui/material': {
          '@media (max-width:600px)': {
            fontSize: '12px',
            padding: '4px 8px',
          },
        },
      }}
      onChange={(_event, value) => {
        onChange(value as string[]);
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li
            key={key}
            {...optionProps}
            style={{
              backgroundColor: selected ? '#CCCCFF' : 'white',
              color: selected ? '#000080' : '#333',
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = '#E6E6FF';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = selected ? '#CCCCFF' : 'white';
            }}
          >
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="KeyWords"
          placeholder=""
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
            },
            '@media (max-width:600px)': {
              fontSize: '12px',
            },
          }}
        />
      )}
    />
  );
};

export default CheckboxesTags;
