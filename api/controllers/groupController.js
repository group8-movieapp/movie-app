import { 
  createGroup, 
  getAllGroups, 
  getGroupById, 
  isGroupMember, 
  deleteGroup 
} from '../models/groupModel.js'

// 1. Uuden ryhmän luominen
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

// 2. Kaikkien ryhmien haku (näkyy kaikille)
const getGroups = async (req, res, next) => {
  try {
    const groups = await getAllGroups()
    res.json(groups)
  } catch (error) {
    next(error)
  }
}

// 3. Yksittäisen ryhmän sisällön haku (vain jäsenille)
const getSingleGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const userId = req.user.id

    const group = await getGroupById(groupId)
    if (!group) {
      return res.status(404).json({ error: 'Group not found' })
    }

    // Tarkistetaan vaatimus: vain ryhmän jäsenet pääsevät katsomaan sisältöä
    const isMember = await isGroupMember(groupId, userId)
    if (!isMember) {
      return res.status(403).json({ error: 'Access denied: You are not a member of this group' })
    }

    res.json(group)
  } catch (error) {
    next(error)
  }
}

// 4. Ryhmän poistaminen (vain omistaja)
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

export {
  postGroup,
  getGroups,
  getSingleGroup,
  removeGroup
}

//Tämä tiedosto sisältää ryhmien hallintaan liittyvät kontrollerit. Tekee funktiot ryhmien luomiseen, 
// hakemiseen, jäsenyyden tarkistamiseen ja ryhmän poistamiseen.