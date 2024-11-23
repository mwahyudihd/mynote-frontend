// postcss.config.js
module.exports = {
    // Menentukan plugins yang digunakan oleh PostCSS
  plugins: {
    // Plugin Tailwind CSS untuk mengaktifkan kelas-kelas yang dibutuhkan
    tailwindcss: {
      // Opsi tambahan untuk Tailwind CSS, bisa ditambahkan sesuai kebutuhan
      config: './tailwind.config.js',  // Menentukan file konfigurasi tailwind.js, jika menggunakan file kustom
    },
    
    // Plugin Autoprefixer untuk memastikan CSS kompatibel dengan banyak browser
    autoprefixer: {
      overrideBrowserslist: ['last 2 versions', '> 1%'], // Menentukan browser yang didukung
    },
  },
};
  