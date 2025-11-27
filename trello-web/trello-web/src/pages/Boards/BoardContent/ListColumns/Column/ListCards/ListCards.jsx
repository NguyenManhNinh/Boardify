import { Box } from '@mui/material'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function ListCards({ cards, columnTitle }) {
  const validCards = cards?.filter(card => card && card._id) || [];

  return (
    <SortableContext items={validCards.map(c => c._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
        p: '0 5px 5px 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) => `calc(
        ${theme.trello.boardContentHeight} -
        ${theme.spacing(5)} -
        ${theme.trello.columnHeaderHeight} -
        ${theme.trello.columnFooterHeight}
        )`,
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#cde0da',
          borderRadius: '8px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#bfc2cf',
        },
      }}>
        {validCards.map(card => (
          <Card key={card._id} card={card} columnTitle={columnTitle} />
        ))}
      </Box>
    </SortableContext>
  )
}
export default ListCards
