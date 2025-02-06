import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultipleSelectProps {
  label: string;
  options: readonly string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

function getStyles(name: string, selectedValue: string, theme: Theme) {
  return {
    fontWeight: selectedValue === name
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect({ label, options, selectedValue, onChange }: MultipleSelectProps) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value },
    } = event;
    onChange(value as string);
  };

  return (
    <FormControl sx={{ m: 1, width: 300, color: 'white' }}>
      <InputLabel id={`multiple-select-${label}-label`} sx={{ color: 'white' }}>{label}</InputLabel>
      <Select
        labelId={`multiple-select-${label}-label`}
        id={`multiple-select-${label}`}
        value={selectedValue}
        onChange={handleChange}
        input={<OutlinedInput label={label} sx={{ color: 'white' }} />}
        MenuProps={MenuProps}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
          '& .MuiSelect-icon': {
            color: 'white',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            style={getStyles(option, selectedValue, theme)}
            sx={{ color: 'black' }} // Change the color of the menu items
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}