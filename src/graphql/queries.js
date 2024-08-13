/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!) {
    getDevice(id: $id) {
      id
      name
      trackerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listDevices = /* GraphQL */ `
  query ListDevices(
    $filter: ModelDeviceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDevices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        trackerName
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserTable = /* GraphQL */ `
  query GetUserTable($id: ID!) {
    getUserTable(id: $id) {
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
export const listUserTables = /* GraphQL */ `
  query ListUserTables(
    $filter: ModelUserTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userName
        email
        myVendors
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVendorTable = /* GraphQL */ `
  query GetVendorTable($id: ID!) {
    getVendorTable(id: $id) {
      deviceId
      vendorName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listVendorTables = /* GraphQL */ `
  query ListVendorTables(
    $filter: ModelVendorTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVendorTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        deviceId
        vendorName
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
