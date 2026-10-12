
const fs = require('fs');
const path = require('path');

const file = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-image-picker',
  'android',
  'src',
  'main',
  'java',
  'com',
  'imagepicker',
  'ImagePickerModuleImpl.java',
);

if (!fs.existsSync(file)) {
  console.error('[Choose Image] File ImagePickerModuleImpl.java tidak ditemukan.');
  process.exit(1);
}

const original = fs.readFileSync(file, 'utf8');

const updated = original.replace(
  /MediaStore\.ACTION_PICK_IMAGES/g,
  'Intent.ACTION_GET_CONTENT',
);

if (updated === original) {
  if (original.includes('Intent.ACTION_GET_CONTENT')) {
    console.log('[Choose Image] Perubahan sudah diterapkan.');
    process.exit(0);
  }

  console.error('[Choose Image] Kode sumber tidak sesuai; file tidak diubah.');
  process.exit(1);
}

fs.writeFileSync(file, updated, 'utf8');
console.log('[Choose Image] Perubahan berhasil diterapkan.');
