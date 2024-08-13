/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onPublishMsgFromEb = /* GraphQL */ `
  subscription OnPublishMsgFromEb {
    onPublishMsgFromEb {
      msg
      __typename
    }
  }
`;
export const onCreateDevice = /* GraphQL */ `
  subscription OnCreateDevice($filter: ModelSubscriptionDeviceFilterInput) {
    onCreateDevice(filter: $filter) {
      id
      name
      trackerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateDevice = /* GraphQL */ `
  subscription OnUpdateDevice($filter: ModelSubscriptionDeviceFilterInput) {
    onUpdateDevice(filter: $filter) {
      id
      name
      trackerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteDevice = /* GraphQL */ `
  subscription OnDeleteDevice($filter: ModelSubscriptionDeviceFilterInput) {
    onDeleteDevice(filter: $filter) {
      id
      name
      trackerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      userName
      email
      geofence {
        id
        name
        lat
        long
        radius
        __typename
      }
      myVendors
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      userName
      email
      geofence {
        id
        name
        lat
        long
        radius
        __typename
      }
      myVendors
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      userName
      email
      geofence {
        id
        name
        lat
        long
        radius
        __typename
      }
      myVendors
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateVendor = /* GraphQL */ `
  subscription OnCreateVendor($filter: ModelSubscriptionVendorFilterInput) {
    onCreateVendor(filter: $filter) {
      deviceId
      vendorName
      vendorMarker {
        key
        title
        description
        __typename
      }
      trackerName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateVendor = /* GraphQL */ `
  subscription OnUpdateVendor($filter: ModelSubscriptionVendorFilterInput) {
    onUpdateVendor(filter: $filter) {
      deviceId
      vendorName
      vendorMarker {
        key
        title
        description
        __typename
      }
      trackerName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteVendor = /* GraphQL */ `
  subscription OnDeleteVendor($filter: ModelSubscriptionVendorFilterInput) {
    onDeleteVendor(filter: $filter) {
      deviceId
      vendorName
      vendorMarker {
        key
        title
        description
        __typename
      }
      trackerName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
