function CommunityNewMember({ community, isMember, isModerator }) {
  console.log("[commNewMember]: isMember", isMember);

  return (
    <>

      <div className="notMemberInfo join-pulse">
        Hit join to see <i>{community?.name}</i>'s content!
        
      </div>
    </>
  );
}

export default CommunityNewMember;
