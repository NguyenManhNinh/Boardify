import { Box, Typography, Button, Stack } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LabelIcon from '@mui/icons-material/Label';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useState } from 'react';

import LabelPicker from '../LabelPicker';
import MemberPicker from '../MemberPicker';
import AddChecklistPopover from '../AddChecklistPopover';
import DueDatePicker from '../DueDatePicker';
import AttachmentUploader from '../AttachmentUploader';

import CoverSelector from '../CoverSelector';

const SidebarButton = ({ icon, children, active, ...props }) => (
  <Button
    fullWidth
    size="small"
    startIcon={icon}
    sx={{
      justifyContent: 'flex-start',
      textTransform: 'none',
      borderRadius: '3px', // Trello-like slightly rounded
      bgcolor: active ? 'primary.light' : (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : 'grey.100'),
      color: active ? 'primary.dark' : (theme) => (theme.palette.mode === 'dark' ? '#b6c2cf' : 'text.primary'),
      fontWeight: 500,
      fontSize: '14px',
      height: '32px',
      boxShadow: 'none',
      mb: 1,
      '& .MuiButton-startIcon': {
        color: active ? 'primary.dark' : (theme) => (theme.palette.mode === 'dark' ? '#b6c2cf' : 'text.secondary'),
        marginRight: 1.5
      },
      '&:hover': {
        bgcolor: active ? 'primary.light' : 'grey.200',
        boxShadow: 'none'
      },
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Button>
);

function CardSidebarSection({
  card,
  onUpdate,
  onToggleAttachment,
  showAttachmentUploader,
  onSetCover,
  onRemoveCover,
  onUploadAndSetCover
}) {
  const [labelAnchorEl, setLabelAnchorEl] = useState(null);
  const [memberAnchorEl, setMemberAnchorEl] = useState(null);
  const [checklistAnchorEl, setChecklistAnchorEl] = useState(null);
  const [dueDateAnchorEl, setDueDateAnchorEl] = useState(null);

  const handleAddLabel = (newLabel) => {
    const currentLabels = card.labels || [];
    const newLabels = [...currentLabels, newLabel];
    onUpdate({ labels: newLabels });
  };

  const handleAddMember = (userId) => {
    const currentMembers = card.memberIds || [];
    if (!currentMembers.includes(userId)) {
      onUpdate({ memberIds: [...currentMembers, userId] });
    }
  };

  const handleAddChecklist = (title) => {
    const newChecklist = { title, items: [] };
    const currentChecklists = card.checklists || [];
    onUpdate({ checklists: [...currentChecklists, newChecklist] });
  };

  const handleSaveDueDate = (newDate) => {
    onUpdate({ dueDate: newDate });
  };

  const hasChecklist = card?.checklists?.length > 0;
  const hasDueDate = !!card?.dueDate;
  const hasAttachments = card?.attachments?.length > 0;

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        p: 2.5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 24
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          fontSize: '12px',
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        Thêm vào thẻ
      </Typography>
      <Stack spacing={1.25}>
        {/* Cover Selector Button */}
        <CoverSelector
          card={card}
          onSetCover={onSetCover}
          onRemoveCover={onRemoveCover}
          onUploadAndSetCover={onUploadAndSetCover}
          variant="sidebar"
          sx={{ mb: 1.25 }} 
        />

        <SidebarButton
          icon={<PersonOutlineIcon />}
          onClick={(e) => setMemberAnchorEl(e.currentTarget)}
          aria-label="Thêm thành viên vào thẻ"
        >
          Thành viên
        </SidebarButton>
        <MemberPicker
          anchorEl={memberAnchorEl}
          onClose={() => setMemberAnchorEl(null)}
          onAddMember={handleAddMember}
          currentMembers={card?.memberIds || []}
        />

        <SidebarButton
          icon={<LabelIcon />}
          onClick={(e) => setLabelAnchorEl(e.currentTarget)}
          aria-label="Thêm nhãn vào thẻ"
        >
          Nhãn
        </SidebarButton>
        <LabelPicker
          anchorEl={labelAnchorEl}
          onClose={() => setLabelAnchorEl(null)}
          onAddLabel={handleAddLabel}
        />

        <SidebarButton
          icon={<CheckBoxIcon />}
          onClick={(e) => setChecklistAnchorEl(e.currentTarget)}
          active={hasChecklist}
          aria-label="Thêm checklist vào thẻ"
        >
          Checklist
        </SidebarButton>
        <AddChecklistPopover
          anchorEl={checklistAnchorEl}
          onClose={() => setChecklistAnchorEl(null)}
          onAdd={handleAddChecklist}
        />

        <SidebarButton
          icon={<AccessTimeIcon />}
          onClick={(e) => setDueDateAnchorEl(e.currentTarget)}
          active={hasDueDate}
          aria-label="Thêm ngày hết hạn vào thẻ"
        >
          Ngày hết hạn
        </SidebarButton>
        <DueDatePicker
          anchorEl={dueDateAnchorEl}
          onClose={() => setDueDateAnchorEl(null)}
          onSave={handleSaveDueDate}
          initialDate={card?.dueDate}
        />

        <SidebarButton
          icon={<AttachFileIcon />}
          onClick={onToggleAttachment}
          active={showAttachmentUploader || hasAttachments}
          aria-label="Đính kèm file vào thẻ"
        >
          Đính kèm
        </SidebarButton>
      </Stack>
    </Box>
  );
}

export default CardSidebarSection;
