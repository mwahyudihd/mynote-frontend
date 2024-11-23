import React, { useState } from 'react';
import { ApolloClientProvider } from './ApolloClient'; // Pastikan ini sudah terkonfigurasi
import { gql, useQuery, useMutation } from '@apollo/client';
import { CreateNote } from './components/CrateNote';
import { NoteList } from "./components/NoteList";
import UpdateNoteForm from './components/UpdateNoteForm';
import { DELETE_NOTE } from "./graphql/mutations";
import Notiflix from "notiflix";

// Query untuk mengambil daftar notes
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

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface GetNotesData {
  notes: Note[];
}

const App: React.FC = () => {
  const { loading, error, data } = useQuery<GetNotesData>(GET_NOTES);  // Menambahkan tipe data di sini
  const [selectedNote, setSelectedNote] = useState<null | Note>(null);

  // Gunakan mutation untuk menghapus catatan
  const [deleteNote] = useMutation(DELETE_NOTE, {
    // Optimistic UI Update: menghapus catatan secara langsung di frontend setelah menghapus di backend
    update(cache, { data: { removeNote } }) {
      const existingNotes = cache.readQuery<GetNotesData>({ query: GET_NOTES });
      
      if (existingNotes?.notes) {
        const updatedNotes = existingNotes.notes.filter((note) => note.id !== removeNote.id);
        Notiflix.Loading.hourglass();
        Notiflix.Loading.remove(1923);
        cache.writeQuery({
          query: GET_NOTES,
          data: { notes: updatedNotes },
        });
        Notiflix.Notify.success('Note has been successfully deleted.')
      }
    },
    onError(error) {
      console.error('Error occurred while deleting note:', error);
      Notiflix.Notify.failure(`Failed to delete note: ${error.message}`);
    },
  });
  

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote({ variables: { id } });
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ApolloClientProvider>
      <div className='max-w-full p-6 bg-white border text-white border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700'>
        <h1 className='text-center font-semibold text-3xl'>Our Notes</h1>
        {/* Form untuk membuat catatan baru */}

        {/* Menampilkan list catatan */}
        {!selectedNote ? (
          <>
            <CreateNote />
            <NoteList notes={data?.notes || []} onEdit={setSelectedNote} onDelete={handleDeleteNote} />
          </>
        ) : (
          // Form untuk mengupdate catatan
          <UpdateNoteForm
            id={selectedNote.id}
            initialTitle={selectedNote.title}
            initialContent={selectedNote.content}
            onUpdateFinished={() => setSelectedNote(null)} // Reset ke daftar catatan
            onCancelUpdate={() => setSelectedNote(null)}
          />
        )}
      </div>
    </ApolloClientProvider>
  );
};

export default App;
