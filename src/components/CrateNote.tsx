import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Note } from '../types/Note';
import Notiflix from 'notiflix';

// Mutation untuk menambahkan catatan
const CREATE_NOTE = gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(createNoteInput: $input) {
      id
      title
      content
      createdAt
    }
  }
`;

// Query untuk mengambil daftar catatan
const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      title
      content
      createdAt
    }
  }
`;

export const CreateNote: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [createNote] = useMutation<{ createNote: Note }>(CREATE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }], // Memanggil ulang GET_NOTES setelah berhasil menambahkan catatan
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      try {
        Notiflix.Loading.hourglass();
        Notiflix.Loading.remove(1700);
        await createNote({ variables: { input: { title, content } } });
        Notiflix.Notify.success(`Note with title "${title}" is created!`);
        setTitle('');
        setContent('');
      } catch (err) {
        Notiflix.Loading.hourglass();
        Notiflix.Loading.remove(1923);
        Notiflix.Notify.failure('Failed to create note. Please try again.');
        console.error(err);
      }
    } else {
      Notiflix.Notify.warning('Title and content cannot be empty!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-full mx-auto">
      <div className="mb-5">
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Title:
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-50 max-w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter title"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Content:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter content"
          required
        />
      </div>
      <div className='p-3 flex flex-row-reverse w-full max-w-full'>

        <button
          type="submit"
          className="my-4 mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Note
        </button>
      </div>
    </form>
  );
};
