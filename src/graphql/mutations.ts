import { gql } from '@apollo/client';

export const UPDATE_NOTE = gql`
  mutation UpdateNote($updateNoteInput: UpdateNoteInput!) {
    updateNote(updateNoteInput: $updateNoteInput) {
      id
      title
      content
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: String!) {
    removeNote(id: $id) {
      id
    }
  }
`;
