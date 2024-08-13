/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const publishMsgFromEB = /* GraphQL */ `
  mutation PublishMsgFromEB($msg: String!) {
    publishMsgFromEB(msg: $msg) {
      msg
      __typename
    }
  }
`;
export const createDevice = /* GraphQL */ `
  mutation CreateDevice(
    $input: CreateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    createDevice(input: $input, condition: $condition) {
      id
      name
      trackerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDevice = /* GraphQL */ `
  mutation UpdateDevice(
    $input: UpdateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    updateDevice(input: $input, condition: $condition) {
      id
      name
      trackerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDevice = /* GraphQL */ `
  mutation DeleteDevice(
    $input: DeleteDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    deleteDevice(input: $input, condition: $condition) {
      id
      name
      trackerName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createUserTable = /* GraphQL */ `
  mutation CreateUserTable(
    $input: CreateUserTableInput!
    $condition: ModelUserTableConditionInput
  ) {
    createUserTable(input: $input, condition: $condition) {
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
export const updateUserTable = /* GraphQL */ `
  mutation UpdateUserTable(
    $input: UpdateUserTableInput!
    $condition: ModelUserTableConditionInput
  ) {
    updateUserTable(input: $input, condition: $condition) {
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
export const deleteUserTable = /* GraphQL */ `
  mutation DeleteUserTable(
    $input: DeleteUserTableInput!
    $condition: ModelUserTableConditionInput
  ) {
    deleteUserTable(input: $input, condition: $condition) {
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
export const createVendorTable = /* GraphQL */ `
  mutation CreateVendorTable(
    $input: CreateVendorTableInput!
    $condition: ModelVendorTableConditionInput
  ) {
    createVendorTable(input: $input, condition: $condition) {
      deviceId
      vendorName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateVendorTable = /* GraphQL */ `
  mutation UpdateVendorTable(
    $input: UpdateVendorTableInput!
    $condition: ModelVendorTableConditionInput
  ) {
    updateVendorTable(input: $input, condition: $condition) {
      deviceId
      vendorName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteVendorTable = /* GraphQL */ `
  mutation DeleteVendorTable(
    $input: DeleteVendorTableInput!
    $condition: ModelVendorTableConditionInput
  ) {
    deleteVendorTable(input: $input, condition: $condition) {
      deviceId
      vendorName
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
