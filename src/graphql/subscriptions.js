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
export const onCreateUserTable = /* GraphQL */ `
  subscription OnCreateUserTable(
    $filter: ModelSubscriptionUserTableFilterInput
  ) {
    onCreateUserTable(filter: $filter) {
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
export const onUpdateUserTable = /* GraphQL */ `
  subscription OnUpdateUserTable(
    $filter: ModelSubscriptionUserTableFilterInput
  ) {
    onUpdateUserTable(filter: $filter) {
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
export const onDeleteUserTable = /* GraphQL */ `
  subscription OnDeleteUserTable(
    $filter: ModelSubscriptionUserTableFilterInput
  ) {
    onDeleteUserTable(filter: $filter) {
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
export const onCreateVendorTable = /* GraphQL */ `
  subscription OnCreateVendorTable(
    $filter: ModelSubscriptionVendorTableFilterInput
  ) {
    onCreateVendorTable(filter: $filter) {
      deviceId
      vendorName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateVendorTable = /* GraphQL */ `
  subscription OnUpdateVendorTable(
    $filter: ModelSubscriptionVendorTableFilterInput
  ) {
    onUpdateVendorTable(filter: $filter) {
      deviceId
      vendorName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteVendorTable = /* GraphQL */ `
  subscription OnDeleteVendorTable(
    $filter: ModelSubscriptionVendorTableFilterInput
  ) {
    onDeleteVendorTable(filter: $filter) {
      deviceId
      vendorName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
