import { Badge, Card, Col } from "react-bootstrap";

function CommunityPreview({community}){

  return(
    
      <Card className="shadow-sm" style={{backgroundColor: community.style.backgroundColor}}>
      <Card.Img variant="top" src={community.cover} />
      <Card.Body>
        <Card.Title style={{color: community.style.titleColor}}>{community.name}</Card.Title>
        <Card.Text>
          {community.topic.map((t, idx) => (
            <Badge key={idx} pill style={{backgroundColor: `${community.style.secondaryColor}+!important` }}>
              {t}
            </Badge>
          ))}
        </Card.Text>
      </Card.Body>
    </Card>

  )
}

export default CommunityPreview;