import { getReviews } from '../api';
import ReviewList from './ReviewList';
import { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState('createdAt');
  const sortedItems = items.sort((a, b) => b[order] - a[order]);

  const [offset, setOffset] = useState(0);
  const LIMIT = 6;
  const [hasNext, setHasNext] = useState(false);

  //  정렬
  const handleNewestClick = () => setOrder('createdAt');
  const handleBestClcick = () => setOrder('rating');

  //  삭제
  const handleDelete = id => {
    const nextItems = items.filter(item => item.id !== id);
    setItems(nextItems);
  };

  //  페이지네이션
  const handleLoad = async options => {
    const { reviews, paging } = await getReviews(options);
    if (options.offest === 0) {
      setItems(reviews);
    } else {
      setItems([...items, ...reviews]);
    }
    setOffset(options.offset + reviews.length);
    setHasNext(paging.hasNext);
  };

  //  더 불러오기
  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  //  화면 렌더링
  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]);

  return (
    <div>
      <div>
        <button onClick={handleNewestClick}>최신순</button>
        <button onClick={handleBestClcick}>베스트순</button>
      </div>
      <ReviewList items={sortedItems} onDelete={handleDelete} />
      {hasNext && <button onClick={handleLoadMore}>더보기</button>}
    </div>
  );
}

export default App;
