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

// MULTER file and text upload
// Create new 
router.post('/create', upload.single('image'), async (req, res) => {

    const { firstName, lastName, phone, email, title } = req.body;
    const filename = req.file ? req.file.filename : null;

    // Validate inputs
    // best practice would be to display a message instead of taxing the server
    if (!firstName || !lastName || !phone || !email){

        // TODO : delete uploaded files
        res.status(400).send('Required fields must have a value');
        return;
    }

    // TODO : validate proper email, proper phone number, only .jpg/ .png/, file size limit (5 MB)

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
    
    // capture the inputs

    // validate the id

    // validate required fields

    // find the contact by id (if not found return 404)

    // store filename in a variable

    // if file was uploaded, save the filename, if not save the old filename (have to delete old image too)

    // update the database record with prisma (using either old or new filename)


    if(req.file){
        console.log("File uploaded ", + req.file.filename);
    }
})

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    // verify id is a number

    // find the contact by id (if not return 404)

    // delete the record with prisma

    // delete the file (if contact has one)

    res.send('delete record ' + id);
})

export default router;

  