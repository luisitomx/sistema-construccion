import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects($skip: Int, $take: Int) {
    projects(skip: $skip, take: $take) {
      id
      name
      description
      location
      status
      totalArea
      budget
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      location
      status
      totalArea
      budget
      startDate
      endDate
      createdAt
      updatedAt
      spaces {
        id
        name
        category
        requiredArea
        realArea
        spaceTypeId
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      location
      status
      totalArea
      budget
      startDate
      endDate
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      description
      location
      status
      totalArea
      budget
      startDate
      endDate
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const GET_PROJECT_STATS = gql`
  query GetProjectStats {
    projectStats {
      total
      active
      completed
      draft
    }
  }
`;
