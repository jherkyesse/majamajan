import { useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';

function Majan({ children, index, id, pickMajan, picked }) {
  function pickMajanFnc() {
    pickMajan(id);
  }
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          role="presentation"
          className={`majan ${picked ? 'active' : ''}`}
          data-text={children}
          onClick={pickMajanFnc}
        />
      )}
    </Draggable>
  );
}

export default Majan;
