import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerMessage = {
  readonly msg: string;
}

type LazyMessage = {
  readonly msg: string;
}

export declare type Message = LazyLoading extends LazyLoadingDisabled ? EagerMessage : LazyMessage

export declare const Message: (new (init: ModelInit<Message>) => Message)

type EagerGeoFence = {
  readonly name: string;
  readonly lat: number;
  readonly long: number;
  readonly radius: number;
}

type LazyGeoFence = {
  readonly name: string;
  readonly lat: number;
  readonly long: number;
  readonly radius: number;
}

export declare type GeoFence = LazyLoading extends LazyLoadingDisabled ? EagerGeoFence : LazyGeoFence

export declare const GeoFence: (new (init: ModelInit<GeoFence>) => GeoFence)

type EagerVendorMarker = {
  readonly key?: number | null;
  readonly title?: string | null;
  readonly description?: string | null;
}

type LazyVendorMarker = {
  readonly key?: number | null;
  readonly title?: string | null;
  readonly description?: string | null;
}

export declare type VendorMarker = LazyLoading extends LazyLoadingDisabled ? EagerVendorMarker : LazyVendorMarker

export declare const VendorMarker: (new (init: ModelInit<VendorMarker>) => VendorMarker)

type EagerDevice = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Device, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly trackerName: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyDevice = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Device, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly trackerName: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Device = LazyLoading extends LazyLoadingDisabled ? EagerDevice : LazyDevice

export declare const Device: (new (init: ModelInit<Device>) => Device) & {
  copyOf(source: Device, mutator: (draft: MutableModel<Device>) => MutableModel<Device> | void): Device;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userName: string;
  readonly email?: string | null;
  readonly geofence?: GeoFence | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userName: string;
  readonly email?: string | null;
  readonly geofence?: GeoFence | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerVendor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Vendor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly deviceId: string;
  readonly vendorName: string;
  readonly vendorMarker?: VendorMarker | null;
  readonly trackerName: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyVendor = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Vendor, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly deviceId: string;
  readonly vendorName: string;
  readonly vendorMarker?: VendorMarker | null;
  readonly trackerName: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Vendor = LazyLoading extends LazyLoadingDisabled ? EagerVendor : LazyVendor

export declare const Vendor: (new (init: ModelInit<Vendor>) => Vendor) & {
  copyOf(source: Vendor, mutator: (draft: MutableModel<Vendor>) => MutableModel<Vendor> | void): Vendor;
}