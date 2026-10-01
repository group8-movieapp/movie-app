import express from 'express'
import { 
  postGroup, 
  getGroups, 
  getSingleGroup, 
  removeGroup,
  joinGroup,
  getRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  getGroupMembers,
  removeMember
} from '../controllers/groupController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getGroups)
router.post('/', auth, postGroup)
router.get('/:id', auth, getSingleGroup)
router.delete('/:id', auth, removeGroup)

// Jäsenet ja liittymispyynnöt
router.get('/:id/members', auth, getGroupMembers)
router.post('/:id/join', auth, joinGroup)
router.get('/:id/requests', auth, getRequests)
router.post('/:id/requests/:userId/accept', auth, acceptJoinRequest)
router.delete('/:id/requests/:userId', auth, rejectJoinRequest)

// Jäsenen poisto / ryhmästä poistuminen
router.delete('/:id/members/:userId', auth, removeMember)

export default router