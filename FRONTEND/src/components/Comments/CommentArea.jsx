import { Accordion, Alert, Col, Container, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../data/axios";
import { useParams } from "react-router-dom";
import SingleComment from "./SingleComment";
import AddComment from "./AddComment";
import MyLoader from "../Helpers/MyLoader";
import { communityCSSVars } from "../../utils/communityCssVars";

function CommentArea() {
  const { postId, commId } = useParams(); //id post

  const containerRef = useRef(null); //scroll automatico per accordion open

  const [isLoading, setIsLoading] = useState(true);
  const [commentList, setCommentList] = useState([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [scrollCommentId, setScrollCommentId] = useState(null); //per tornare al commento editato
  const [consoleMsg, setConsoleMsg] = useState(""); //messaggio di errore per l'utente

  const [communityStyle, setCommunityStyle] = useState(null); 
  const [commentToEdit, setCommentToEdit] = useState({}); //statelifting per edit
  const [parentComment, setParentComment] = useState({}); //parent for reply
  const [successDel, setSuccessDel] = useState(false);

  const fetchComments = async () => {
    const comments = await axiosInstance.get(`/posts/${postId}/comments`);
    console.log("comments.data",comments.data);
    setCommentList(comments.data);
    setIsLoading(false);
    if (comments.data.length === 0) {
      console.log("no comments for this post");
      setConsoleMsg("Be the first person to comment this post! 🎉");
      return;
    }
  };

  const fetchCommunity = async() => {
    try{
      const comm = await axiosInstance.get(`/communities/${commId}`);
      setCommunityStyle(comm?.data?.style);
      console.log('communityStyle:', comm.data.style);
    } catch (err){
      console.log(err.message); 
    }
  };

  useEffect(() => {
    fetchComments();
    fetchCommunity();
  }, [postId, successDel]);

  return (
    <Container className="w-75 m-auto px-0">
      {consoleMsg && (
        <Alert variant="secondary" className="fs-3">
          {consoleMsg}
        </Alert>
      )}
      <Accordion
        className="mb-3 communityAccordion"
        style={communityStyle ? { ...communityCSSVars(communityStyle) } : {}}
        activeKey={isAccordionOpen ? "0" : null}
        onSelect={(key) => setIsAccordionOpen(key === "0")}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add comment</Accordion.Header>
          <Accordion.Body>
            <AddComment
              commentToEdit={commentToEdit}
              setCommentToEdit={setCommentToEdit}
              parentComment={parentComment}
              setParentComment={setParentComment}
              isAccordionOpen={isAccordionOpen}
              setIsAccordionOpen={setIsAccordionOpen}
              containerRef={containerRef} //passa ref per scroll
              refreshComments={fetchComments} //aggiorna lista dopo submit
              setScrollCommentId={setScrollCommentId} //per focus sul commento edit/add
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Row>
        {isLoading && commentList.length > 0 ? (
          <MyLoader />
        ) : (
          commentList.length > 0 &&
          commentList.map((comment) => (
            <Col sm={12} key={comment._id}>
              <SingleComment
                comment={comment}
                postId={postId}
                setIsAccordionOpen={setIsAccordionOpen}
                setCommentToEdit={setCommentToEdit}
                setParentComment={setParentComment}
                setSuccessDel={setSuccessDel}
                successDel={successDel}
                scrollToThis={scrollCommentId === comment._id}
                communityStyle={communityStyle}
              />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
export default CommentArea;