// src/components/bottombar/quickSaveAndPull/index.tsx

import { Box } from '@mui/material';
import { ActionButtons } from './ActionButtons';

import { useActions } from '../../../overmind';

const QuickSave = () => {
  const { triggerSaveAs } = useActions().editor;

  const handleSave = () => {
    triggerSaveAs();
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