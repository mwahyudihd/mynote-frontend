import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_NOTE } from '../graphql/mutations';
import Notiflix from 'notiflix';

interface UpdateNoteFormProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  onUpdateFinished: () => void; // Tambahkan callback untuk pemberitahuan sukses
  onCancelUpdate: () => void;
}

const UpdateNoteForm: React.FC<UpdateNoteFormProps> = ({
  id,
  initialTitle,
  initialContent,
  onUpdateFinished, // Terima callback
  onCancelUpdate,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const [updateNote, { loading }] = useMutation(UPDATE_NOTE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await updateNote({
        variables: {
          updateNoteInput: {
            id,
            title,
            content,
          },
        },
      });

      // setelah data diperbarui maka tampilan popup akan muncul
      Notiflix.Notify.success(`Note updated successfully! Note updated: ${data.updateNote.title}`);
      Notiflix.Loading.hourglass();
      Notiflix.Loading.remove(1923);
      onUpdateFinished(); // Panggil callback setelah sukses
    } catch (err) {
      Notiflix.Notify.failure('Sorry, something is wrong #500');
      console.error('Error updating note:', err);
    }
  };

  const handleCancel = () => {
    Notiflix.Confirm.show(
      'Cenceled Edit.',
      'Are you sure you want to cancel? Unsaved changes will be lost.',
      'Yes',
      'No',
      function okCb() {
        Notiflix.Loading.hourglass();
        Notiflix.Loading.remove(1923);
        onCancelUpdate();
      },
      function cancelCb() {
        Notiflix.Report.info('Info', 'You can continue to edit.', 'Ok',{
          width: '320px',
          borderRadius: '8px',
          backgroundColor: '#252525',
          info: {
            messageColor: '#ffff',
            titleColor: '#72e1d1',
            buttonBackground: '#1D4ED8'
          },
          cssAnimation: true,
          cssAnimationDuration: 400,
          cssAnimationStyle: 'zoom',
        });
      },
      {
        width: '320px',
        borderRadius: '8px',
        backgroundColor: '#252525',
        messageColor: '#ffff',
        titleColor: '#72e1d1',
        cancelButtonBackground: '#1D4ED8',
        okButtonBackground: '#FF2626',
        cssAnimation: true,
        cssAnimationDuration: 400,
        cssAnimationStyle: 'zoom',
      },
    );
  };

  return (
    <div>
      <h2 className='text-center my-2 text-xl font-extralight'>Edit Note</h2>
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
            {loading ? 'Updating...' : 'Update Note'}
          </button>
        </div>
      </form>
      <button
        onClick={handleCancel}
        className="my-4 dark:text-white text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        style={{ marginTop: '10px' }}
      >
        Kembali
      </button>
    </div>
  );
};

export default UpdateNoteForm;
