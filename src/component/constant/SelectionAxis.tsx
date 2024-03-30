import React from 'react';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/system';

interface Axis {
    name: string;
    value: string;
}
interface SelectAxisProps {
    axisSelection?: Axis[] | undefined;
    selectedXAxis?: Axis | null;
    handleXAxisChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
}

const SelectAxis: React.FC<SelectAxisProps> = ({
    axisSelection,
    selectedXAxis,
    handleXAxisChange
}) => {
    const theme = useTheme()
    return (
        <Box mr={1}>
            <Select
                size="small"
                sx={{
                    borderRadius: "12px",
                    height: '25px',
                    width: '120px',
                    fontFamily: theme.components.typography.fontFamily[10],
                    color: theme.palette.text.primary
                }}
                value={selectedXAxis?.value}
                onChange={handleXAxisChange}
            >
                {axisSelection.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                            backgroundColor: theme.palette.background.screen,
                            color: theme.palette.text.primary,
                            fontFamily: theme.components.typography.fontFamily[10],
                            "&:hover": {
                                backgroundColor: theme.palette.background.active,
                            },
                            "&.Mui-selected": {
                                backgroundColor: theme.palette.background.active,
                            },
                            "&.Mui-selected-hover": {
                                backgroundColor: theme.palette.background.active,
                            },
                            marginY: -1
                        }}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

export default SelectAxis;
