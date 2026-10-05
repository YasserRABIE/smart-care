import config from '@payload-config'
import { getPayload } from 'payload'

/** Payload's Local API. Only `lib/data` should import this. */
export const getPayloadClient = () => getPayload({ config })
