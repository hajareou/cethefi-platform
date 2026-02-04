// src/components/bottombar/quickSaveAndPull/index.tsx

import { Box } from '@mui/material';
import { ActionButtons } from './ActionButtons';

const QuickSave = () => {
  // 1. Logic layer: 
  // Future implementation: const { saveDocument } = useQuickSave(); 

  const handleSave = () => {
    console.log('Save Clicked');
    alert('Save function triggered!');
  };

  return (
    // 2. Layout layer key point:
    // ml: 'auto' (Margin Left Auto) pushes this container to the far right 
    // of the Flexbox parent by consuming all available space.
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        ml: 'auto', 
        mr: 2 
      }}
    >
      <ActionButtons onSave={handleSave} />
    </Box>
  );
};

export default QuickSave;