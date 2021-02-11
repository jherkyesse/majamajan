import { useCallback, useState, useMemo } from 'react';
import { useKeyPressEvent } from 'react-use';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import AllMajanList from '../../constants/allMajanList';

const majanMap = {
  oneLine: '一條',
  twoLine: '二條',
  threeLine: '三條',
  fourLine: '四條',
  fiveLine: '五條',
  sixLine: '六條',
  sevenLine: '七條',
  eightLine: '八條',
  nineLine: '九條',
  oneTube: '一筒',
  twoTube: '二筒',
  threeTube: '三筒',
  fourTube: '四筒',
  fiveTube: '五筒',
  sixTube: '六筒',
  sevenTube: '七筒',
  eightTube: '八筒',
  nineTube: '九筒',
  oneMillion: '一萬',
  twoMillion: '二萬',
  threeMillion: '三萬',
  fourMillion: '四萬',
  fiveMillion: '五萬',
  sixMillion: '六萬',
  sevenMillion: '七萬',
  eightMillion: '八萬',
  nineMillion: '九萬',
  east: '東',
  west: '西',
  north: '北',
  south: '南',
  center: '中',
  board: '白板',
  fa: '發',
};

function Table({
  db,
  username,
  majanKey,
  majanCoordinateList,
  majanDataMap,
  leftMajanList,
}) {
  const majanList = majanDataMap[username]?.majanData?.majanList;
  const order = majanCoordinateList.length % 4;
  const myOrder = useMemo(() => +majanDataMap[username]?.majanData?.order, [
    username,
  ]);
  const [pickedMajanKey, setPickedMajanKey] = useState();
  const [prevPickedMajanKey, setPrevPickedMajanKey] = useState();
  function onEnter() {
    if (!pickedMajanKey) return;
    if (order !== myOrder) return;
    const pushMajanIndex = majanList.findIndex(
      ({ id }) => id === pickedMajanKey
    );
    majanCoordinateList.push({
      key: majanList[pushMajanIndex]?.key,
      owner: username,
      x: ~~(Math.random() * 580),
      y: ~~(Math.random() * 580),
    });
    db.ref(`${majanKey}/__majanCoordinateList__`).set([...majanCoordinateList]);
    majanList.splice(pushMajanIndex, 1);
    db.ref(`${majanKey}/__userList__/${username}/majanData/majanList`).set([
      ...majanList,
    ]);
    const nextUsername = Object.keys(majanDataMap).find(
      (username) =>
        majanDataMap[username]?.majanData?.order === (myOrder + 1) % 4
    );
    const nextUserMajanList = majanDataMap[nextUsername]?.majanData?.majanList;
    nextUserMajanList.push(leftMajanList.shift());
    db.ref(`${majanKey}/__userList__/${nextUsername}/majanData/majanList`).set([
      ...nextUserMajanList,
    ]);
    db.ref(`${majanKey}/__leftMajanList__`).set([...leftMajanList]);
  }
  function onArrowUp() {
    if (pickedMajanKey) return;
    setPickedMajanKey(prevPickedMajanKey || majanList[0]?.id);
  }
  function onArrowDown() {
    if (!pickedMajanKey) return;
    setPrevPickedMajanKey(pickedMajanKey);
    setPickedMajanKey(null);
  }
  function onArrowLeft() {
    if (!pickedMajanKey) {
      setPickedMajanKey(majanList[majanList.length - 1]?.id);
      return;
    }
    const isFirst = pickedMajanKey === majanList[0]?.id;
    setPickedMajanKey(
      isFirst
        ? majanList[majanList.length - 1]?.id
        : majanList[
            majanList.findIndex((majan) => majan?.id === pickedMajanKey) - 1
          ]?.id
    );
  }
  function onArrowRight() {
    if (!pickedMajanKey) {
      setPickedMajanKey(majanList[0]?.id);
      return;
    }
    const isLast = pickedMajanKey === majanList[majanList.length - 1]?.id;
    setPickedMajanKey(
      isLast
        ? majanList[0]?.id
        : majanList[
            majanList.findIndex((majan) => majan?.id === pickedMajanKey) + 1
          ]?.id
    );
  }
  useKeyPressEvent('ArrowUp', onArrowUp);
  useKeyPressEvent('ArrowDown', onArrowDown);
  useKeyPressEvent('ArrowLeft', onArrowLeft);
  useKeyPressEvent('ArrowRight', onArrowRight);
  useKeyPressEvent('Enter', onEnter);
  function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  function onDragEnd(result) {
    if (!result.destination) return;
    const prevMajanList = reorder(
      majanList,
      result.source.index,
      result.destination.index
    );
    // setMajanList(prevMajanList);
    db.ref(`${majanKey}/__userList__/${username}/majanData/majanList`).set(
      prevMajanList
    );
  }
  function pickMajan(prevPickedMajanKey) {
    setPickedMajanKey(
      prevPickedMajanKey !== pickedMajanKey ? prevPickedMajanKey : null
    );
  }
  function shuffle() {
    const userList = Object.keys(majanDataMap) || [];
    if (userList.length !== 4) return;
    let tmp;
    let current;
    let top = 136;
    const allMajanList = [...AllMajanList];
    if (top)
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = allMajanList[current];
        allMajanList[current] = allMajanList[top];
        allMajanList[top] = tmp;
      }
    userList.forEach((user) => {
      db.ref(`${majanKey}/__userList__/${user}/majanData/majanList`).set([
        ...allMajanList.splice(0, username === user ? 17 : 16),
      ]);
    });
    db.ref(`${majanKey}/__leftMajanList__`).set([...allMajanList]);
  }
  function sort() {
    majanList.sort((a, b) => {
      const prev = majanMap[a.key].split('').reverse().join('');
      const next = majanMap[b.key].split('').reverse().join('');
      return prev.localeCompare(next);
    });
    db.ref(`${majanKey}/__userList__/${username}/majanData/majanList`).set([
      ...majanList,
    ]);
  }
  return (
    <>
      <div className="container">
        <div className="table" data-order={order - myOrder}>
          <div className="other">
            {majanCoordinateList.map((majanCoordinate, index) => (
              <div
                key={index}
                className="majan"
                // onMouseDown={(e) => {
                //   if (String(majanCoordinate.order) !== String(myOrder)) return;
                //   let x = e.clientX;
                //   let y = e.clientY;
                // }}
                style={{
                  position: 'absolute',
                  left: majanCoordinate.x,
                  top: majanCoordinate.y,
                }}
              >
                {majanMap[majanCoordinate.key]}
              </div>
            ))}
          </div>
          <div className="my">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {majanList.map(({ id, key }, index) => (
                      <Draggable draggableId={id} index={index} key={id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            role="presentation"
                            className={`majan ${
                              pickedMajanKey === id ? 'active' : ''
                            }`}
                            data-text={majanMap[key]}
                            onClick={() => pickMajan(id)}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
      <button type="button" onClick={shuffle}>
        發牌
      </button>
      <button type="button" onClick={sort}>
        自動整牌
      </button>
      {order === myOrder && '你的回合'}
    </>
  );
}

Table.propTypes = {
  db: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  majanKey: PropTypes.string.isRequired,
  majanCoordinateList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  majanDataMap: PropTypes.shape(),
  leftMajanList: PropTypes.arrayOf(PropTypes.shape()),
};

Table.defaultProps = {
  majanDataMap: {},
  leftMajanList: [],
};

export default Table;
