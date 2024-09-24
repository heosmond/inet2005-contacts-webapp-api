import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
    


const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/'); // save uploaded files in `public/images` folder
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop(); // get file extension
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext; // generate unique filename - current timestamp + random number between 0 and 1000.
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage: storage });
    
//NEW PRISMA OBJECT
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
    

// Get all contacts
router.get('/all', async (req, res) => {
    const contacts = await prisma.contact.findMany();
    res.json(contacts);
});

// Get a contact by id
router.get('/get/:id', async (req, res) => {
    const id = req.params.id;

    //to-do verify id is a number
    if (isNaN(id)){
        res.send('Provide a valid number.').status(400);
        return;
    }

    const contact = await prisma.contact.findUnique({
        where: {
            id: parseInt(id),
        },
    });
});

//MULTER file and text upload
router.post('/create', upload.single('image'), async (req, res) => {

    const { firstName, lastName, phone, email, title } = req.body;
    const filename = req.file ? req.file.filename : null;

    const contact = await prisma.contact.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            title: title,
            phone: phone,
            email: email,
            filename: filename
        }
    });

    res.json(contact);

});

router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    
    if(req.file){
        console.log("File uploaded ", + req.file.filename);
    }
})

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    res.send('delete record ' + id);
})

export default router;

  