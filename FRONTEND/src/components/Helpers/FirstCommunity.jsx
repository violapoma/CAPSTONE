import { useEffect, useState } from "react";
import MyLoader from "./MyLoader";
import { Button, Col, Container, Row } from "react-bootstrap";
import CommunityPreview from "../Communities/CommunityPreview";
import axiosInstance from "../../../data/axios";
import { useNavigate } from "react-router-dom";

function FirstCommunity(){

  const [communities, setCommunities] = useState([]);
  const [chosenCommunity, setChosenCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectLoading, setSelectLoading] = useState(false);

  const navigate = useNavigate();

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/communities/approved");
      if (!Array.isArray(res.data)) {
        throw new Error("Expected an array from backend");
      }
      setCommunities(res.data);
      console.log("communityList:", res.data);
      console.log("communities: ", communities);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);


  useEffect(() => {
    console.log("chosen community", chosenCommunity);
  }, [chosenCommunity]);

  const handleSelection = async()=>{
    setSelectLoading(true); 
    try{
      const res = await axiosInstance.patch(`/communities/${chosenCommunity}/join`); 
      console.log(res.data); 
      navigate(`/communities/${chosenCommunity}`)
    } catch(err){
      console.log(err);
    } finally{
      setSelectLoading(false); 
    }
  }; 

  if (loading) {
    return (
      <MyLoader />
    );
  }

  if (!communities.length) {
    return <p className="text-center my-4">No communities available</p>;
  }

  return (
    <Container className="w-75 mx-auto ">
     <h3 className="text-center">Choose your first community </h3>
      <Row className="my-5 justify-content-center">
        {communities.map((comm) => (
          <Col
            sm={6}
            className="hovering"
            onClick={() => setChosenCommunity(comm._id)}
          >
            <CommunityPreview key={comm._id} community={comm} />
          </Col>
        ))}
       
      </Row>
      <Button variant="outline-secondary" as={Col} sm={2} onClick={handleSelection}> Done </Button>

    </Container>
  );
}

export default FirstCommunity;