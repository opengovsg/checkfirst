import { User as UserModel } from '../server/database/models/User'

export type User = Pick<UserModel, 'id' | 'email'>
export type CollaboratorUser = Pick<UserModel, 'id' | 'email'> & {
  UserToChecker: {
    isOwner: boolean
  }
}

export default User
