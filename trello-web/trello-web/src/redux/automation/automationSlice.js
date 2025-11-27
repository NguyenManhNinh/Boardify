import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  rules: JSON.parse(localStorage.getItem('automation_rules')) || [
    {
      id: 'checklist_done_move',
      enabled: false,
      type: 'CHECKLIST_DONE_MOVE',
      targetColumnId: null,
      description: 'Khi checklist hoàn thành 100%, tự động chuyển thẻ sang cột "Đã xong"'
    },
    {
      id: 'high_priority_set_due',
      enabled: false,
      type: 'HIGH_PRIORITY_SET_DUE',
      description: 'Khi gắn nhãn "Ưu tiên cao", tự động đặt hạn chót là 3 ngày sau'
    }
  ]
}

export const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    toggleRule: (state, action) => {
      const rule = state.rules.find(r => r.id === action.payload)
      if (rule) {
        rule.enabled = !rule.enabled
        localStorage.setItem('automation_rules', JSON.stringify(state.rules))
      }
    },
    updateRuleTarget: (state, action) => {
      const { ruleId, targetColumnId } = action.payload
      const rule = state.rules.find(r => r.id === ruleId)
      if (rule) {
        rule.targetColumnId = targetColumnId
        localStorage.setItem('automation_rules', JSON.stringify(state.rules))
      }
    }
  }
})

export const { toggleRule, updateRuleTarget } = automationSlice.actions

export const selectAutomationRules = (state) => state.automation.rules

export default automationSlice.reducer
