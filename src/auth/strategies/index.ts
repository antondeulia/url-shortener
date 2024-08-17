import { JwtAccessStrategy } from './jwt-access.strategy'
import { LocalStrategy } from './local.strategy'

export const STRATEGIES = [JwtAccessStrategy, LocalStrategy]
