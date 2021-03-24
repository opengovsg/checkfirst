import Checker from './checker.d'

export interface Template extends Omit<Checker, 'id'> {
  id: number
}

export default Template
