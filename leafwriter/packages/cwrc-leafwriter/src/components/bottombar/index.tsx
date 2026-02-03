import { Box, Link, Paper, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import pck from '../../../package.json';
import { useAppState } from '../../overmind';
import { ValdidationErrors } from './ValdidationErrors';
import AnnotationMode from './annotationMode';
import EditorMode from './editorMode';
import { Schema } from './schema';

// import new component -- save and pull
import QuickSaveAndPull from './quickSaveAndPull';

export const BottomBar = () => {
  const { isReadonly } = useAppState().editor;
  const { validationErrors } = useAppState().validator;
  const { t } = useTranslation();
  const version = pck.version;

  return (
    <Paper
      elevation={0}
      square
      sx={[
        {
          width: '100%',
          backgroundColor: '#f5f5f5',
        },
        (theme) =>
          theme.applyStyles('dark', {
            backgroundColor: theme.vars.palette.background.paper,
          }),
      ]}
    >
      <Stack direction="row" alignItems="center" spacing={2} px={2}>
        {!isReadonly && (
          <>
            <EditorMode />
            <AnnotationMode />
            {/* <QuickSaveAndPull /> */}
            <Schema />
          </>
        )}

        {validationErrors > 0 && !isReadonly && <ValdidationErrors />}

        {/* --- 改动 2: 放置新组件 --- */}
        {/* 逻辑：只在非只读模式下显示，放在黄色感叹号后面，Spacer(Box flexGrow=1) 前面 */}
        {!isReadonly && <QuickSaveAndPull />}

        {/* 这个 Box 会自动撑开中间的空间，把上面的组件推到左边，下面的 Links 推到右边 */}

        <Box flexGrow={1} />

        <Link
          color="textSecondary"
          variant="caption"
          href="https://gitlab.com/calincs/cwrc/leaf-writer/leaf-writer/-/issues/new?issuable_template=Bug%20Report"
          target="_blank"
        >
          {t('LW.Bugs')} / {t('LW.Requests')}
        </Link>

        <Link
          color="textSecondary"
          variant="caption"
          href={pck.homepage}
          rel="noopener"
          target="_blank"
          title="Repository"
        >
          {`LEAF-Writer ${version}`}
        </Link>
        <Link
          color="textSecondary"
          variant="caption"
          href="https://www.tiny.cloud"
          target="_blank"
          rel="noopener"
          title={t('LW.Powered by').toString()}
        >
          {t('LW.Powered by')} Tiny
        </Link>
      </Stack>
    </Paper>
  );
};
