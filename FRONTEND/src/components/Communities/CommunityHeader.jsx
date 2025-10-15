import { useState } from "react";
import { Badge, Button, Col, Image, Row } from "react-bootstrap";
import { communityCSSVars } from "../../utils/communityCssVars";

function CommunityHeader({ community, amIMember, amIModerator }) {
  const [showMembers, setShowMembers] = useState(false);
  console.log('amIModerator in header', amIModerator);

  return (
    <>
      {community && (
        <Row className="mw-80 mx-auto position-relative">
          <Col sm={12} className="p-0">
            <Image src={community.cover} fluid className="w-100 h-400" />
          </Col>
          <Col
            sm={12}
            className="position-absolute w-100 d-flex justify-content-between align-items-end community-banner"
            style={{...communityCSSVars(community.style)}}
          >
            <div>
              <h1>{community.name}</h1>
              <p>{community.members?.length || 0} members</p>
              <div>
                {community.topic?.map((t, idx) => (
                  <Badge
                    key={idx}
                    pill
                    style={{
                      marginRight: "5px",
                      fontSize: "1em",
                      fontWeight: "semibold",
                      "--badge-color": community.style?.secondaryColor,
                      "--text-color": community.style?.titleColor,
                    }}
                    className="topic-badge"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="d-flex gap-3 align-items-center">
              <Button variant="outline-secondary" className="rounded-2">
                {amIMember ? (
                  <i className="bi bi-dash-square me-2"></i>
                ) : (
                  <i className="bi bi-plus-square me-2"></i>
                )}
                {amIMember ? "Leave" : "Join"}
              </Button>

              {amIModerator && (
                <Button variant="outline-secondary" className="rounded-2">
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit
                </Button>
              )}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}

export default CommunityHeader;
