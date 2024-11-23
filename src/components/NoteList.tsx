import Notiflix from 'notiflix';
import React, { useState } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // Tambahkan properti createdAt untuk sorting
}

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void; // Tambahkan callback untuk menghapus catatan
}

export const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete }) => {
  const handleEdit = (note: Note) => {
    Notiflix.Loading.hourglass();
    Notiflix.Loading.remove(1923);
    onEdit(note); // Panggil callback untuk mengedit
  };

  const handleDelete = (id: string) => {
    Notiflix.Confirm.show(
      'Remove the note.',
      'Do you really want to delete this note?',
      'Yes',
      'No',
      function okCb() {
        onDelete(id); // Panggil fungsi onDelete jika "Yes"
      },
      function cancelCb() {
        // Jika "No", tidak ada yang terjadi
        Notiflix.Report.success('Info', 'your note remains safe.', 'Ok',{
          width: '320px',
          borderRadius: '8px',
          backgroundColor: '#252525',
          success: {
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
        backgroundColor: '#252525',
        messageColor: '#ffff',
        borderRadius: '8px',
        okButtonBackground: '#FF2626',
        cancelButtonColor: '#ffff',
        cancelButtonBackground: '#5C3CFF',
        cssAnimation: true,
        cssAnimationDuration: 400,
        cssAnimationStyle: 'zoom',
      },
    );
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id); // Toggle dropdown
  };

  // Urutkan notes berdasarkan createdAt (terbaru dulu)
  const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <h2 className='text-center font-extrabold text-2xl'>All Notes :</h2>
      {sortedNotes.length === 0 && (
        <h5 className="mb-2 text-center my-5 text-3xl font-bold text-gray-900 dark:text-white">No notes available</h5>
      )}
      <ul>
        {sortedNotes.map((note) => (
          <li
            key={note.id}
            className="w-full my-3 max-w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            {/* Dropdown Button */}
            <div className="relative flex justify-end px-4 pt-4">
              <button
                onClick={() => toggleDropdown(note.id)}
                className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5 absolute top-0 right-0"
                type="button"
              >
                <span className="sr-only">Open dropdown</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 3"
                >
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {openDropdown === note.id && (
                <div className="absolute right-0 top-6 z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                  <ul className="py-2" aria-labelledby={`dropdownButton-${note.id}`}>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        onClick={() => handleEdit(note)}
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        onClick={() => handleDelete(note.id)}
                      >
                        Delete
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        onClick={() =>
                          Notiflix.Report.info(
                            `${note.title} - ${new Date(note.createdAt).toLocaleString()}`,
                            `${note.content}`,
                            "Ok",
                            {
                              width: "360px",
                              titleFontSize: "15px",
                              messageFontSize: "24px",
                              svgSize: "50px",
                              backgroundColor: '#252525',
                              info: {
                                titleColor: '#72e1d1',
                                messageColor: '#ffff',
                                buttonBackground: '#1D4ED8'
                              },
                              cssAnimation: true,
                              cssAnimationDuration: 400,
                              cssAnimationStyle: "zoom",
                            }
                          )
                        }
                      >
                        Detail
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center pb-10">
              <h3 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">{note.title}</h3>
              <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">{note.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
