// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Device, User, Vendor, Message, GeoFence, VendorMarker } = initSchema(schema);

export {
  Device,
  User,
  Vendor,
  Message,
  GeoFence,
  VendorMarker
};