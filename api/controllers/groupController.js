import { 
  createGroup, 
  getAllGroups, 
  getGroupById, 
  getAcceptedMembers,
  requestToJoin,
  getPendingRequests,
  acceptRequest,
  removeGroupMember,
  deleteGroup 
} from '../models/groupModel.js'

const postGroup = async (req, res, next) => {
  try {
    const { name } = req.body
    const userId = req.user.id 

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' })
    }

    const newGroup = await createGroup(name, userId)
    res.status(201).json(newGroup)
  } catch (error) {
    next(error)
  }
}

const getGroups = async (req, res, next) => {
  try {
    const groups = await getAllGroups()
    res.json(groups)
  } catch (error) {
    next(error)
  }
}

const getSingleGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const group = await getGroupById(groupId)
    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }
    res.json(group)
  } catch (error) {
    next(error)
  }
}

const removeGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const userId = req.user.id

    const deleted = await deleteGroup(groupId, userId)
    if (!deleted) {
      return res.status(403).json({ error: 'Only the group owner can delete the group' })
    }

    res.json({ message: 'Group deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const getGroupMembers = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const members = await getAcceptedMembers(groupId)
    res.json(members)
  } catch (error) {
    next(error)
  }
}

const joinGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const userId = req.user.id

    const group = await getGroupById(groupId)
    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    const newRequest = await requestToJoin(groupId, userId)
    res.status(201).json(newRequest)
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'You have already requested or joined this group.' })
    }
    next(error)
  }
}

const getRequests = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const userId = req.user.id

    const group = await getGroupById(groupId)
    if (!group || group.owner_id !== userId) {
      return res.status(403).json({ error: 'Only the group owner can view requests.' })
    }

    const requests = await getPendingRequests(groupId)
    res.json(requests)
  } catch (error) {
    next(error)
  }
}

const acceptJoinRequest = async (req, res, next) => {
  try {
    const { id: groupId, userId } = req.params
    const ownerId = req.user.id

    const group = await getGroupById(groupId)
    if (!group || group.owner_id !== ownerId) {
      return res.status(403).json({ error: 'Only the group owner can accept requests.' })
    }

    const updated = await acceptRequest(groupId, userId)
    if (!updated) {
      return res.status(404).json({ error: 'Pending request not found.' })
    }

    res.json({ message: 'Request accepted successfully.' })
  } catch (error) {
    next(error)
  }
}

const rejectJoinRequest = async (req, res, next) => {
  try {
    const { id: groupId, userId } = req.params
    const ownerId = req.user.id

    const group = await getGroupById(groupId)
    if (!group || group.owner_id !== ownerId) {
      return res.status(403).json({ error: 'Only the group owner can reject requests.' })
    }

    await removeGroupMember(groupId, userId)
    res.json({ message: 'Request rejected successfully.' })
  } catch (error) {
    next(error)
  }
}

const removeMember = async (req, res, next) => {
  try {
    const { id: groupId, userId } = req.params
    const currentUserId = req.user.id

    const group = await getGroupById(groupId)
    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    const isOwner = group.owner_id === currentUserId
    const isSelf = currentUserId === parseInt(userId)

    if (!isOwner && !isSelf) {
      return res.status(403).json({ error: 'Unauthorized to remove this member.' })
    }

    if (group.owner_id === parseInt(userId)) {
      return res.status(400).json({ error: 'Group owner cannot be removed.' })
    }

    await removeGroupMember(groupId, userId)
    res.json({ message: 'Member removed successfully.' })
  } catch (error) {
    next(error)
  }
}

export {
  postGroup,
  getGroups,
  getSingleGroup,
  removeGroup,
  getGroupMembers,
  joinGroup,
  getRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  removeMember
}