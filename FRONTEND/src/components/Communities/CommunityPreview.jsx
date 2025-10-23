import { Badge, Card, Col } from "react-bootstrap";

function CommunityPreview({community, chosenCommunity}){

  return(
    
      <Card className={`shadow-sm ${community._id === chosenCommunity ? 'selected shadow-lg' : ''}`} style={{backgroundColor: community.style.backgroundColor}}>
      <Card.Img variant="top" src={community.cover} style={{ height: '10em', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title style={{color: community.style.titleColor}}>{community.name}</Card.Title>
        <Card.Text>
          {community.topic.map((t, idx) => (
            <Badge key={idx} pill bg="undefined" style={{backgroundColor: community.style.secondaryColor, color:community.style.titleColor}}>
              {t}
            </Badge>
          ))}
        </Card.Text>
      </Card.Body>
    </Card>

  )
}

export default CommunityPreview;