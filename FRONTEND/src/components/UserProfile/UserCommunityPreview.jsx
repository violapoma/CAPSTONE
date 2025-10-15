import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function UserCommunityPreview({ communities }) {
  return (
    <>
      {communities.moderatorOf ? (
        <Row>
          {communities.moderatorOf
            ?.filter((c) => !c.active)
            .map((c) => {
              console.log("comm", c.cover, c.name, c.active);
              return (
                <Link to={`/communities/${c._id}`}>
                  <Col sm={12} key={c._id} className="fs-3">
                    <img
                      src={c.cover}
                      alt="cover prw"
                      className="profilePicList me-3"
                    />
                    {c.name}
                  </Col>
                </Link>
              );
            })}
        </Row>
      ) : (
        <p> No communities yet </p>
      )}
    </>
  );
}

export default UserCommunityPreview;
