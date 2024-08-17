import { JwtAccessGuard } from './jwt-access.guard'
import { LocalGuard } from './local.guard'

export const GUARDS = [JwtAccessGuard, LocalGuard]
