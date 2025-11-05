import { gql } from '@apollo/client';

export const GET_SPACES = gql`
  query GetSpaces($projectId: ID, $skip: Int, $take: Int) {
    spaces(projectId: $projectId, skip: $skip, take: $take) {
      id
      name
      description
      category
      requiredArea
      realArea
      quantity
      priority
      spaceTypeId
      projectId
      createdAt
      updatedAt
    }
  }
`;

export const GET_SPACE = gql`
  query GetSpace($id: ID!) {
    space(id: $id) {
      id
      name
      description
      category
      requiredArea
      realArea
      quantity
      priority
      spaceTypeId
      projectId
      createdAt
      updatedAt
      project {
        id
        name
      }
      spaceType {
        id
        name
        category
        defaultArea
      }
    }
  }
`;

export const CREATE_SPACE = gql`
  mutation CreateSpace($input: CreateSpaceInput!) {
    createSpace(input: $input) {
      id
      name
      description
      category
      requiredArea
      realArea
      quantity
      priority
      spaceTypeId
      projectId
    }
  }
`;

export const UPDATE_SPACE = gql`
  mutation UpdateSpace($id: ID!, $input: UpdateSpaceInput!) {
    updateSpace(id: $id, input: $input) {
      id
      name
      description
      category
      requiredArea
      realArea
      quantity
      priority
      spaceTypeId
      projectId
    }
  }
`;

export const DELETE_SPACE = gql`
  mutation DeleteSpace($id: ID!) {
    deleteSpace(id: $id)
  }
`;

export const GET_SPACE_TYPES = gql`
  query GetSpaceTypes($category: String) {
    spaceTypes(category: $category) {
      id
      name
      category
      defaultArea
      description
    }
  }
`;
