// src/components/bottombar/quickSaveAndPull/ActionButtons.tsx

import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Define Interface: What does the parent component need to pass?
interface ActionButtonsProps {
  onSave: () => void;
}

// Static Styles: Morandi style (Deep Blue Grey)
const buttonStyle = {
  backgroundColor: '#546e7a', // Blue Grey 600
  color: '#fff',
  textTransform: 'none',
  boxShadow: 1,
  minWidth: '80px', // Minimum width for better aesthetics
  '&:hover': {
    backgroundColor: '#455a64', // Blue Grey 700
  },
};

export const ActionButtons = ({ onSave }: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="contained"
        size="small"
        onClick={onSave}
        sx={buttonStyle}
      >
        {/* You can use t('Save') for internationalization */}
        {t('Save')}
      </Button>
    </Box>
  );
};