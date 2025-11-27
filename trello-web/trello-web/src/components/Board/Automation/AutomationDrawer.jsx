import {
  Drawer, Box, Typography, List, ListItem, ListItemText,
  Switch, Divider, Select, MenuItem, FormControl, InputLabel, Chip
} from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import { useSelector, useDispatch } from 'react-redux'
import { selectAutomationRules, toggleRule, updateRuleTarget } from '~/redux/automation/automationSlice'

function AutomationDrawer({ open, onClose, boardColumns }) {
  const dispatch = useDispatch()
  const rules = useSelector(selectAutomationRules)

  const handleToggle = (ruleId) => {
    dispatch(toggleRule(ruleId))
  }

  const handleTargetChange = (ruleId, targetColumnId) => {
    dispatch(updateRuleTarget({ ruleId, targetColumnId }))
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 350 } }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BoltIcon color="warning" />
        <Typography variant="h6" fontWeight="bold">Tự động hóa</Typography>
        <Chip label="Beta" size="small" color="primary" variant="outlined" sx={{ ml: 'auto', height: 20, fontSize: '0.7rem' }} />
      </Box>
      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Các quy tắc tự động giúp bạn tiết kiệm thời gian quản lý bảng.
        </Typography>

        <List>
          {rules.map((rule) => (
            <Box key={rule.id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {rule.type === 'CHECKLIST_DONE_MOVE' ? 'Checklist hoàn thành' : 'Gắn nhãn ưu tiên'}
                </Typography>
                <Switch
                  checked={rule.enabled}
                  onChange={() => handleToggle(rule.id)}
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                {rule.description}
              </Typography>

              {rule.type === 'CHECKLIST_DONE_MOVE' && rule.enabled && (
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <InputLabel>Chuyển sang cột</InputLabel>
                  <Select
                    value={rule.targetColumnId || ''}
                    label="Chuyển sang cột"
                    onChange={(e) => handleTargetChange(rule.id, e.target.value)}
                  >
                    {boardColumns?.map(col => (
                      <MenuItem key={col._id} value={col._id}>{col.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default AutomationDrawer
