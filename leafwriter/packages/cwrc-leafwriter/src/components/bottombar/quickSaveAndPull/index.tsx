// src/components/bottombar/quickSaveAndPull/index.tsx

import { Box } from '@mui/material';
import { ActionButtons } from './ActionButtons';
// import { useQuickSaveAndPull } from '../../../hooks/quickSaveAndPull'; // Assume you will use this Hook later

const QuickSaveAndPull = () => {
  // 1. Logic layer: Later, get real logic through Hook
  // const { saveDocument, pullDocument } = useQuickSaveAndPull(); 

  const handleSave = () => {
    console.log('Save Clicked');
    alert('Save function triggered!');
    // saveDocument();
  };

  const handlePull = () => {
    console.log('Pull Clicked');
    alert('Pull function triggered!');
    // pullDocument();
  };

  return (
    // 2. Layout layer key point:
    // Use Box as the container.
    // ml: 'auto' (Margin Left Auto) is the Flexbox magic property.
    // It pushes this container to the right side of the parent, using the remaining space.
    <Box 
      sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      ml: 'auto',       // Key: Automatically take up remaining space on the left and push to the right
      mr: 2             // Leave some margin on the right, don't stick to the edge of the screen
      }}
    >
      <ActionButtons onSave={handleSave} onPull={handlePull} />
    </Box>
  );
};

export default QuickSaveAndPull;