import { Col, Row } from "react-bootstrap";
import PostPreview from "../PostPreview";

function UserPosts({ posts = [] }) {
  return (
    <>
      {posts ? (
        <Row>
          {posts.map((p) => (
            <Col sm={4} key={p._id}>
              <PostPreview  post={p} />
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
