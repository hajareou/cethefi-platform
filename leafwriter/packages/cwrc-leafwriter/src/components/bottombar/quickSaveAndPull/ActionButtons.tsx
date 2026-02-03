// src/components/bottombar/quickSaveAndPull/ActionButtons.tsx

import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next'; // 假设你需要国际化
import { useActions, useAppState } from '../../../overmind';
import useEditorReaction from '../hooks/useEditorReaction';

// 定义接口：父组件需要传给我什么？需要传两个点击事件函数。
interface ActionButtonsProps {
  onSave: () => void;
  onPull: () => void;
}

// 提取静态样式：Morandi 风格 (深蓝灰)，符合你的审美
const buttonStyle = {
  backgroundColor: '#546e7a', // Blue Grey 600
  color: '#fff',
  textTransform: 'none',
  boxShadow: 1,
  minWidth: '80px', // 给个最小宽度好看一点
  '&:hover': {
    backgroundColor: '#455a64', // Blue Grey 700
  },
};

export const ActionButtons = ({ onSave, onPull }: ActionButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: 2 }}> {/* gap: 2 确保两个按钮之间有空隙 */}
      <Button
        variant="contained"
        size="small"
        onClick={onSave}
        sx={buttonStyle}
      >
        {/* 这里可以用 t('Save') */}
        Save
      </Button>

      <Button
        variant="contained"
        size="small"
        onClick={onPull}
        sx={buttonStyle}
      >
        {/* 这里可以用 t('Pull') */}
        Pull
      </Button>
    </Box>
  );
};