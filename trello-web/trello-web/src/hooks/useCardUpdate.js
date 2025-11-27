// src/hooks/useCardUpdate.js
import { useCallback } from 'react';
import { debounce } from 'lodash';
import { updateCardApi } from '~/apis';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentActiveCard, selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice';

/**
 * Hook to update a card's fields with real‑time debounce.
 * @param {string} cardId - ID of the card to update.
 * @param {function} updateCardInBoard - Optional callback to update board state.
 * @returns {function} updateFields - function accepting partial update object.
 */
export const useCardUpdate = (cardId, updateCardInBoard) => {
  const dispatch = useDispatch();
  const currentCard = useSelector(selectCurrentActiveCard);

  const sendUpdate = async (fields) => {
    try {
      const updated = await updateCardApi(cardId, fields);
      // update redux state so UI reflects latest data
      dispatch(updateCurrentActiveCard(updated));
      // Also update board state if callback provided
      if (updateCardInBoard) {
        updateCardInBoard(cardId, fields);
      }
    } catch (err) {
      console.error('Failed to update card', err);
    }
  };

  // debounce to avoid flooding server, 800ms delay
  const updateCardDebounced = useCallback(
    debounce((fields) => {
      sendUpdate(fields);
    }, 800),
    [cardId, updateCardInBoard]
  );

  const updateCardInstant = async (fields) => {
    // Optimistic update
    const optimisticCard = { ...currentCard, ...fields };
    dispatch(updateCurrentActiveCard(optimisticCard));

    // Also update board state immediately for responsiveness
    if (updateCardInBoard) {
      updateCardInBoard(cardId, fields);
    }

    try {
      const updated = await updateCardApi(cardId, fields);
      // Update with server response to ensure consistency
      dispatch(updateCurrentActiveCard(updated));
    } catch (err) {
      console.error('Failed to update card', err);
      // Revert to previous state on error
      dispatch(updateCurrentActiveCard(currentCard));
    }
  };

  return { updateCard: updateCardDebounced, updateCardInstant };
};
