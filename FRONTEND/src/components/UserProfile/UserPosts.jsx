import { Col, Row } from "react-bootstrap";
import PostPreview from "../Helpers/PostPreview";
import { Link } from "react-router-dom";

function UserPosts({ posts = [] }) {

  return (
    <>
      {posts ? (
        <Row>
          {posts.map((p) => (
            <Col sm={6} md={4} key={p._id}>
              <Link
                to={`/communities/${p.inCommunity?._id}/posts/${p._id}`}
              >
                <PostPreview post={p} />
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <p> No posts yet </p>
      )}
    </>
  );
}
export default UserPosts;
