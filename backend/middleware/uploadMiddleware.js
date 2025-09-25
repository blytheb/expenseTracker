import multer from 'multer';

//configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // specify the file name
    }
});

//file filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
    }
};

//initialize multer with storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // limit file size to 5MB
});

export default upload; 