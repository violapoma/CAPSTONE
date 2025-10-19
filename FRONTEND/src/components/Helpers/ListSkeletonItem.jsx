import { ListGroup } from "react-bootstrap";

function ListSkeletonItem() {
  return (
    <ListGroup.Item className="listing d-flex align-items-center">
      
      <div 
        className="placeholder-glow me-3" 
        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
      >
          <span className="placeholder w-100 h-100 rounded-circle bg-secondary"></span>
      </div>

      <div style={{ flexGrow: 1 }}>
        <p className="placeholder-glow mb-0 d-flex flex-column gap-2">
          <span className="placeholder col-8 rounded-pill bg-secondary"></span>
          <span className="placeholder col-5 rounded-pill bg-secondary"></span>
        </p>
      </div>

    </ListGroup.Item>
  );
}

export default ListSkeletonItem;