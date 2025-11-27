// src/components/Modal/ActiveCard/ActiveCardModal.jsx
import { useState, forwardRef } from 'react';
import { useCardUpdate } from '~/hooks/useCardUpdate';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  Grid,
  Box,
  Divider,
  Zoom,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  selectIsShowModal,
  selectCurrentActiveCard,
  hideCardDetailModal,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice';
import { uploadCardAttachment, deleteCardAttachment, setCardCover, removeCardCover } from '~/apis';
import { useAuth } from '~/customHooks/useAuthContext';
import CoverSelector from './CoverSelector';
import Checklist from './Checklist';
import AttachmentList from './AttachmentList';
import AttachmentUploader from './AttachmentUploader';

// Import new sections
import CardHeaderSection from './CardSections/CardHeaderSection';
import CardDescriptionSection from './CardSections/CardDescriptionSection';
import CardSidebarSection from './CardSections/CardSidebarSection';
import CardActivitySection from './CardSections/CardActivitySection';

const ZoomTransition = forwardRef(function ZoomTransition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

import { selectAutomationRules } from '~/redux/automation/automationSlice';

// ... (previous imports)

function ActiveCardModal({ updateCardInBoard, onAutoMoveCard }) {
  const dispatch = useDispatch();
  const isShowModal = useSelector(selectIsShowModal);
  const currentActiveCard = useSelector(selectCurrentActiveCard);
  const automationRules = useSelector(selectAutomationRules);
  const { token } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showAttachmentUploader, setShowAttachmentUploader] = useState(false);

  const { updateCardInstant } = useCardUpdate(currentActiveCard?._id, updateCardInBoard);

  const handleCloseModal = () => {
    dispatch(hideCardDetailModal());
  };

  const handleUploadAttachment = async (file) => {
    try {
      const response = await uploadCardAttachment(token, currentActiveCard._id, file);
      const newAttachment = response.file;
      const newAttachments = [newAttachment, ...(currentActiveCard.attachments || [])];

      dispatch(updateCurrentActiveCard({ ...currentActiveCard, attachments: newAttachments }));

      if (updateCardInBoard) {
        updateCardInBoard(currentActiveCard._id, { attachments: newAttachments });
      }

      setShowAttachmentUploader(false);
    } catch (error) {
      console.error('Error uploading attachment:', error);
    }
  };

  const handleDeleteAttachment = async (attachmentUrl) => {
    try {
      await deleteCardAttachment(token, currentActiveCard._id, attachmentUrl);

      const newAttachments = (currentActiveCard.attachments || []).filter(url => url !== attachmentUrl);

      dispatch(updateCurrentActiveCard({ ...currentActiveCard, attachments: newAttachments }));

      if (updateCardInBoard) {
        updateCardInBoard(currentActiveCard._id, { attachments: newAttachments });
      }
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };

  const handleUpdateChecklist = (updatedChecklist, index) => {
    const currentChecklists = [...(currentActiveCard.checklists || [])];
    currentChecklists[index] = updatedChecklist;
    updateCardInstant({ checklists: currentChecklists });

    // Automation: Check if checklist is 100% done
    const isChecklistDone = updatedChecklist.items.every(item => item.isChecked);
    if (isChecklistDone) {
      const moveRule = automationRules.find(r => r.type === 'CHECKLIST_DONE_MOVE' && r.enabled);
      if (moveRule && moveRule.targetColumnId && onAutoMoveCard) {
        onAutoMoveCard(currentActiveCard._id, moveRule.targetColumnId);
      }
    }
  };

  const handleDeleteChecklist = (index) => {
    const currentChecklists = (currentActiveCard.checklists || []).filter((_, i) => i !== index);
    updateCardInstant({ checklists: currentChecklists });
  };

  const handleSetCover = async (coverData) => {
    try {
      await setCardCover(token, currentActiveCard._id, coverData);
      // Update Redux state directly (no API call needed, already done above)
      dispatch(updateCurrentActiveCard({ ...currentActiveCard, cover: coverData }));
      // Also update board state
      if (updateCardInBoard) {
        updateCardInBoard(currentActiveCard._id, { cover: coverData });
      }
    } catch (error) {
      console.error('Error setting cover:', error);
    }
  };

  const handleRemoveCover = async () => {
    try {
      await removeCardCover(token, currentActiveCard._id);
      // Update Redux state directly (no API call needed, already done above)
      dispatch(updateCurrentActiveCard({ ...currentActiveCard, cover: null }));
      // Also update board state
      if (updateCardInBoard) {
        updateCardInBoard(currentActiveCard._id, { cover: null });
      }
    } catch (error) {
      console.error('Error removing cover:', error);
    }
  };

  const handleUploadAndSetCover = async (file) => {
    try {
      const response = await uploadCardAttachment(token, currentActiveCard._id, file);
      const coverData = {
        type: 'image',
        url: response.file.url,
        thumbnailUrl: response.file.url,
        attachmentId: null,
        color: null
      };
      await handleSetCover(coverData);
    } catch (error) {
      console.error('Error uploading cover:', error);
    }
  };

  const handleToggleDone = (isDone) => {
    updateCardInstant({ isDone });
  };

  if (!currentActiveCard) return null;

  return (
    <Dialog
      open={isShowModal}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      scroll="body"
      TransitionComponent={ZoomTransition}
      aria-labelledby="card-title-header"
      aria-describedby="card-description-section"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          border: 'none',
          minHeight: isMobile ? '100%' : '600px',
          maxWidth: '960px !important',
          overflowY: isMobile ? 'auto' : 'hidden'
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: isMobile ? 'flex-end' : 'flex-start',
          pt: isMobile ? 0 : 8,
          pb: isMobile ? 0 : 8
        },
        backdropFilter: 'blur(4px)',
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0,0,0,0.4)'
        }
      }}
    >
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Grid container spacing={3} alignItems="flex-start">
          {/* Left Column: Main Content */}
          <Grid item xs={12} md={9}>
            <Box sx={{ maxWidth: 720, mx: 'auto' }}>
              {/* Card Cover */}
              {currentActiveCard?.cover && (
                <Box
                  sx={{
                    position: 'relative',
                    width: 'calc(100% + 48px)',
                    marginLeft: '-24px',
                    marginTop: '-24px',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                    mb: 4,
                    aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    bgcolor: '#1a1a1a',
                    '&:hover .cover-controls': {
                      opacity: 1
                    }
                  }}
                >
                  {/* Cover Image */}
                  <Box
                    component="img"
                    src={currentActiveCard.cover.thumbnailUrl || currentActiveCard.cover.url || currentActiveCard.cover}
                    alt="Card cover"
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'block',
                      objectFit: 'contain', // Always use 'contain' in modal to show full image
                      objectPosition: 'center',
                      transition: 'all 0.25s ease-out',
                      '&:hover': {
                        filter: 'brightness(1.05)'
                      }
                    }}
                  />

                  {/* Play Icon Overlay for Videos */}
                  {currentActiveCard.cover.type === 'video' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        pointerEvents: 'none',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.85)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderLeft: '16px solid #fff',
                          borderTop: '10px solid transparent',
                          borderBottom: '10px solid transparent',
                          ml: '4px'
                        }}
                      />
                    </Box>
                  )}

                  {/* Floating Controls */}
                  <Box
                    className="cover-controls"
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <CoverSelector
                      card={currentActiveCard}
                      onSetCover={handleSetCover}
                      onRemoveCover={handleRemoveCover}
                      onUploadAndSetCover={handleUploadAndSetCover}
                      variant="floating"
                    />
                  </Box>
                </Box>
              )}

              {/* Header Section */}
              <CardHeaderSection
                card={currentActiveCard}
                onUpdateTitle={(newTitle) => updateCardInstant({ title: newTitle })}
                onClose={handleCloseModal}
                columnTitle={currentActiveCard?.columnTitle}
                boardTitle={currentActiveCard?.boardTitle}
                onToggleDone={handleToggleDone}
              />

              {/* Description Section */}
              <CardDescriptionSection
                description={currentActiveCard.description}
                onUpdateDescription={(newDesc) => updateCardInstant({ description: newDesc })}
              />

              {/* Checklists */}
              {currentActiveCard?.checklists?.map((checklist, index) => (
                <Checklist
                  key={index}
                  checklist={checklist}
                  onUpdate={(updatedChecklist) => handleUpdateChecklist(updatedChecklist, index)}
                  onDelete={() => handleDeleteChecklist(index)}
                />
              ))}

              {/* Attachments Section */}
              <AttachmentList
                attachments={currentActiveCard?.attachments || []}
                onDelete={handleDeleteAttachment}
              />

              {showAttachmentUploader && (
                <Box sx={{ mb: 2 }}>
                  <AttachmentUploader
                    onUpload={handleUploadAttachment}
                  />
                </Box>
              )}

              <Divider sx={{ my: 4 }} />

              {/* Activity Section */}
              <CardActivitySection
                card={currentActiveCard}
                onUpdate={updateCardInstant}
              />
            </Box>
          </Grid>

          {/* Right Column: Sidebar */}
          <Grid item xs={12} md={3} sx={{ mt: { xs: 3, md: 0 } }}>
            <CardSidebarSection
              card={currentActiveCard}
              onUpdate={updateCardInstant}
              onToggleAttachment={() => setShowAttachmentUploader(!showAttachmentUploader)}
              showAttachmentUploader={showAttachmentUploader}
              onSetCover={handleSetCover}
              onRemoveCover={handleRemoveCover}
              onUploadAndSetCover={handleUploadAndSetCover}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog >
  );
}

export default ActiveCardModal;
