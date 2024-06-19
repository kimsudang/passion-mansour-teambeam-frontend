import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "@/app/_styles/Board.scss";

const SkeletonBoard = () => {
  return (
    <SkeletonTheme baseColor='#d5d5d5' highlightColor='#e1e1e1'>
      {Array.from({ length: 8 }, (_, i) => i).map((n, i) => {
        return (
          <div className='board-item' key={i}>
            <div className='board-left' style={{ width: "100%" }}>
              <h3>
                <Skeleton width={140} height={20} borderRadius={5} />
              </h3>
              <p>
                <Skeleton height={15} />
              </p>
              <span>
                <Skeleton width={80} height={10} />
              </span>
            </div>
            <div className='board-right'></div>
          </div>
        );
      })}
    </SkeletonTheme>
  );
};

export default SkeletonBoard;
