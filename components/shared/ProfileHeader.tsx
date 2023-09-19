
interface Props {
  accountId: string; authUserId: string; name: string; username: string; imgUrl: string; bio: string;
}

const ProfileHeader = ({ accountId, authUserId, name, username, imgUrl, bio}: Props) => {
  return (
    <div>ProfileHeader</div>
  )
}

export default ProfileHeader